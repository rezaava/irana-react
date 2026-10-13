import React from "react";

import {
    FaSearch,
    FaFilter,
    FaTh,
    FaBars,
} from "react-icons/fa";

import InfiniteScroll from "react-infinite-scroll-component";

import FilterModal from "./FilterModalComponent";
import RequestRecords from "./RequestRecordsComponent";
import AuthCheck from "./AuthCheckComponent";
import Loader from "./LoaderComponent";

const API_URL =
    "https://iranaserviceapp.ir/test/api";

class RequestsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab:
                localStorage.getItem("requests_active_tab") ||
                "waiting",
            search: "",
            viewMode:
                localStorage.getItem("requests_view_mode") ||
                "card",

            isFilterOpen: false,

            province: "",
            startDate: "",
            endDate: "",

            records: [],

            loading: true,
            loadingMore: false,

            authenticated: false,

            page: 1,
            hasMore: true,
        };

        this.searchRequest = 0;
    }

    componentDidMount() {
        const isAuthenticated = AuthCheck();

        if (!isAuthenticated) {
            return;
        }

        this.setState(
            {
                authenticated: true,
            },
            () => {
                this.getRequests(1, true);
            }
        );
    }

    // =========================================================
    // پیدا کردن pagination از پاسخ API
    // =========================================================

    getPagination = (data) => {
        /*
         * حالت‌های مختلف احتمالی API
         *
         * data.data
         * data.requests
         * data.list
         */

        if (
            data &&
            data.data &&
            !Array.isArray(data.data) &&
            typeof data.data === "object"
        ) {
            if (
                Array.isArray(data.data.data) ||
                data.data.next_page_url !== undefined
            ) {
                return data.data;
            }
        }

        if (
            data &&
            data.requests &&
            !Array.isArray(data.requests) &&
            typeof data.requests === "object"
        ) {
            if (
                Array.isArray(data.requests.data) ||
                data.requests.next_page_url !== undefined
            ) {
                return data.requests;
            }
        }

        if (
            data &&
            data.list &&
            !Array.isArray(data.list) &&
            typeof data.list === "object"
        ) {
            if (
                Array.isArray(data.list.data) ||
                data.list.next_page_url !== undefined
            ) {
                return data.list;
            }
        }

        return null;
    };

    // =========================================================
    // پیدا کردن آرایه درخواست‌ها
    // =========================================================

    getRequestsArray = (data) => {
        /*
         * اگر pagination باشد
         */

        const pagination =
            this.getPagination(data);

        if (
            pagination &&
            Array.isArray(pagination.data)
        ) {
            return pagination.data;
        }

        /*
         * آرایه مستقیم
         */

        if (Array.isArray(data)) {
            return data;
        }

        if (
            data &&
            Array.isArray(data.requests)
        ) {
            return data.requests;
        }

        if (
            data &&
            Array.isArray(data.data)
        ) {
            return data.data;
        }

        if (
            data &&
            Array.isArray(data.list)
        ) {
            return data.list;
        }

        return [];
    };

    // =========================================================
    // دریافت درخواست‌ها
    // =========================================================

    getRequests = async (
        page = 1,
        firstLoad = false
    ) => {
        const token =
            localStorage.getItem("token");

        if (
            !firstLoad &&
            this.state.loadingMore
        ) {
            return false;
        }

        if (
            !firstLoad &&
            !this.state.hasMore
        ) {
            return false;
        }

        if (!firstLoad) {
            this.setState({
                loadingMore: true,
            });
        }

        try {
            const response = await fetch(
                `${API_URL}/list?page=${page}`,
                {
                    method: "GET",

                    headers: {
                        Accept:
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    "خطا در دریافت درخواست‌ها"
                );
            }

            const data =
                await response.json();

            console.log(
                "REQUESTS API:",
                data
            );

            const requests =
                this.getRequestsArray(
                    data
                );

            const pagination =
                this.getPagination(
                    data
                );

            /*
             * اگر pagination داشته باشیم
             */

            let hasMore = false;

            if (pagination) {
                hasMore =
                    pagination.next_page_url !==
                    null &&
                    pagination.next_page_url !==
                    undefined;
            }

            /*
             * اگر pagination نبود،
             * یعنی API آرایه کامل داده است.
             */

            const newRecords =
                requests.map(
                    (request) => {
                        const customer =
                            request.user ||
                            request.customer ||
                            request.user_model ||
                            request.customer_model ||
                            {};

                        const repairman =
                            request.repairman_model ||
                            request.repairman ||
                            request.technician ||
                            {};

                        const customerName =
                            request.customerName ||
                            request.customer_name ||
                            request.name ||
                            `${customer.name || ""} ${customer.family || ""
                                }`.trim();

                        const technicianName =
                            request.technician_name ||
                            request.repairman_name ||
                            request.repairmanName ||
                            `${repairman.name || ""} ${repairman.family || ""
                                }`.trim();

                        return {
                            id:
                                request.id,

                            customerName:
                                customerName ||
                                "---",

                            deviceType:
                                request.deviceType ||
                                request.device_type ||
                                request.type ||
                                request.device ||
                                request.device_name ||
                                "---",

                            deviceBrand:
                                request.deviceBrand ||
                                request.device_brand ||
                                request.brand ||
                                request.brand_name ||
                                "---",

                            technician:
                                technicianName ||
                                "---",

                            problem:
                                request.problem ||
                                request.device_problem ||
                                request.description ||
                                request.issue ||
                                "---",

                            date:
                                request.time ||
                                request.date ||
                                request.created_at ||
                                "---",

                            status:
                                request.status_name ||
                                request.status_text ||
                                request.state_name ||
                                request.status ||
                                "waiting",

                            province:
                                request.state ??
                                request.province ??
                                "",

                            city:
                                request.city ??
                                "",

                            original:
                                request,
                        };
                    }
                );

            console.log(
                "NEW RECORDS:",
                newRecords
            );

            await new Promise(
                (resolve) => {
                    this.setState(
                        (prevState) => {
                            const records =
                                page === 1
                                    ? newRecords
                                    : [
                                        ...prevState.records,
                                        ...newRecords,
                                    ];

                            return {
                                records,

                                page:
                                    page + 1,

                                hasMore,

                                loading:
                                    false,

                                loadingMore:
                                    false,
                            };
                        },
                        resolve
                    );
                }
            );

            return hasMore;
        } catch (error) {
            console.error(
                "GET REQUESTS ERROR:",
                error
            );

            this.setState({
                loading: false,
                loadingMore: false,
                hasMore: false,
            });

            return false;
        }
    };

    // =========================================================
    // دریافت تمام صفحات برای سرچ
    // =========================================================

    loadAllPagesForSearch =
        async (requestId) => {
            while (
                this.state.hasMore &&
                requestId ===
                this.searchRequest
            ) {
                const nextPage =
                    this.state.page;

                const hasMore =
                    await this.getRequests(
                        nextPage,
                        false
                    );

                if (!hasMore) {
                    break;
                }
            }
        };

    // =========================================================
    // Infinite Scroll
    // =========================================================

    fetchMoreData = async () => {
        const {
            page,
            hasMore,
            loadingMore,
            search,
        } = this.state;

        if (
            !hasMore ||
            loadingMore
        ) {
            return;
        }

        /*
         * اگر سرچ فعال باشد،
         * خودش تمام صفحات را می‌گیرد.
         */

        if (search.trim()) {
            return;
        }

        await this.getRequests(
            page,
            false
        );
    };

    // =========================================================
    // Search
    // =========================================================

    handleSearchChange = (e) => {
        const value =
            e.target.value;

        this.searchRequest += 1;

        const requestId =
            this.searchRequest;

        this.setState(
            {
                search: value,
            },
            async () => {
                /*
                 * ابتدا روی اطلاعات موجود
                 * سرچ کن.
                 */

                if (
                    !value.trim()
                ) {
                    return;
                }

                /*
                 * تمام صفحات را بگیر
                 */

                await this.loadAllPagesForSearch(
                    requestId
                );
            }
        );
    };

    // =========================================================
    // Tabs
    // =========================================================
    handleTabChange = (tab) => {
        localStorage.setItem(
            "requests_active_tab",
            tab
        );

        this.setState({
            activeTab: tab,
        });
    };
    // =========================================================
    // View Mode
    // =========================================================

    handleViewModeChange = (mode) => {
        localStorage.setItem(
            "requests_view_mode",
            mode
        );

        this.setState({
            viewMode: mode,
        });
    };

    // =========================================================
    // Filter
    // =========================================================

    handleOpenFilter = () => {
        this.setState({
            isFilterOpen: true,
        });
    };

    handleCloseFilter = () => {
        this.setState({
            isFilterOpen: false,
        });
    };

    // =========================================================
    // Province
    // =========================================================

    handleProvinceChange = (e) => {
        this.setState({
            province:
                e.target.value,
        });
    };

    // =========================================================
    // تاریخ شروع
    // =========================================================

    handleStartDateChange = (
        date
    ) => {
        if (!date) {
            this.setState({
                startDate: "",
            });

            return;
        }

        console.log(
            "START SHAMSI:",
            date.format(
                "YYYY-MM-DD"
            )
        );

        const javascriptDate =
            date.toDate();

        const gregorianDate =
            `${javascriptDate.getFullYear()}-${String(
                javascriptDate.getMonth() + 1
            ).padStart(2, "0")}-${String(
                javascriptDate.getDate()
            ).padStart(2, "0")}`;

        console.log(
            "START GREGORIAN:",
            gregorianDate
        );

        this.setState({
            startDate: date,
        });
    };

    // =========================================================
    // تاریخ پایان
    // =========================================================

    handleEndDateChange = (
        date
    ) => {
        if (!date) {
            this.setState({
                endDate: "",
            });

            return;
        }

        console.log(
            "END SHAMSI:",
            date.format(
                "YYYY-MM-DD"
            )
        );

        const javascriptDate =
            date.toDate();

        const gregorianDate =
            `${javascriptDate.getFullYear()}-${String(
                javascriptDate.getMonth() + 1
            ).padStart(2, "0")}-${String(
                javascriptDate.getDate()
            ).padStart(2, "0")}`;

        console.log(
            "END GREGORIAN:",
            gregorianDate
        );

        this.setState({
            endDate: date,
        });
    };

    // =========================================================
    // تبدیل تاریخ به میلادی
    // =========================================================

    getGregorianDate = (
        date
    ) => {
        if (!date) {
            return "";
        }

        try {
            if (
                typeof date.toDate ===
                "function"
            ) {
                const javascriptDate =
                    date.toDate();

                return `${javascriptDate.getFullYear()}-${String(
                    javascriptDate.getMonth() + 1
                ).padStart(2, "0")}-${String(
                    javascriptDate.getDate()
                ).padStart(2, "0")}`;
            }

            const value =
                String(date).trim();

            if (
                /^\d{4}-\d{2}-\d{2}$/.test(
                    value
                )
            ) {
                return value;
            }

            return "";
        } catch (error) {
            console.error(
                "GET GREGORIAN DATE ERROR:",
                error
            );

            return "";
        }
    };

    // =========================================================
    // Apply Filter
    // =========================================================

    handleApplyFilter = () => {
        const {
            province,
            startDate,
            endDate,
        } = this.state;

        const start =
            this.getGregorianDate(
                startDate
            );

        const end =
            this.getGregorianDate(
                endDate
            );

        console.log(
            "APPLIED FILTER:",
            {
                province,
                startDate:
                    start,
                endDate: end,
            }
        );

        this.setState({
            isFilterOpen: false,
        });
    };

    // =========================================================
    // تبدیل تاریخ API
    // =========================================================

    normalizeDate = (
        date
    ) => {
        if (!date) {
            return "";
        }

        let value =
            String(date).trim();

        if (!value) {
            return "";
        }

        if (
            value.includes("T")
        ) {
            value =
                value.split("T")[0];
        }

        value =
            value.replace(
                /\//g,
                "-"
            );

        if (
            /^\d{4}-\d{2}-\d{2}$/.test(
                value
            )
        ) {
            return value;
        }

        return "";
    };

    // =========================================================
    // Filter Records
    // =========================================================

    getFilteredRequests =
        () => {
            const {
                records,
                activeTab,
                search,
                province,
                startDate,
                endDate,
            } = this.state;

            const safeRecords =
                Array.isArray(
                    records
                )
                    ? records
                    : [];

            const searchText =
                search
                    .trim()
                    .toLowerCase();

            const selectedStartDate =
                this.getGregorianDate(
                    startDate
                );

            const selectedEndDate =
                this.getGregorianDate(
                    endDate
                );

            return safeRecords.filter(
                (record) => {
                    // =========================================
                    // وضعیت
                    // =========================================

                    let matchesTab =
                        true;

                    const status =
                        String(
                            record.status ||
                            ""
                        ).toLowerCase();

                    if (
                        activeTab ===
                        "waiting"
                    ) {
                        matchesTab =
                            status ===
                            "waiting" ||
                            status === "0" ||
                            status ===
                            "pending" ||
                            status ===
                            "pending_confirmation";
                    }

                    if (
                        activeTab ===
                        "confirmed"
                    ) {
                        matchesTab =
                            status ===
                            "confirmed" ||
                            status === "1";
                    }

                    if (!matchesTab) {
                        return false;
                    }

                    // =========================================
                    // Search
                    // =========================================

                    if (searchText) {
                        const searchableText =
                            [
                                record.customerName,
                                record.deviceType,
                                record.deviceBrand,
                                record.technician,
                                record.problem,
                                record.province,
                                record.city,
                            ]
                                .map(
                                    (
                                        item
                                    ) =>
                                        String(
                                            item ||
                                            ""
                                        ).toLowerCase()
                                )
                                .join(
                                    " "
                                );

                        if (
                            !searchableText.includes(
                                searchText
                            )
                        ) {
                            return false;
                        }
                    }

                    // =========================================
                    // استان
                    // =========================================

                    if (province) {
                        if (
                            String(
                                record.province
                            ) !==
                            String(
                                province
                            )
                        ) {
                            return false;
                        }
                    }

                    // =========================================
                    // تاریخ
                    // =========================================

                    const requestDate =
                        this.normalizeDate(
                            record.date
                        );

                    if (
                        selectedStartDate
                    ) {
                        if (
                            !requestDate
                        ) {
                            return false;
                        }

                        if (
                            requestDate <
                            selectedStartDate
                        ) {
                            return false;
                        }
                    }

                    if (
                        selectedEndDate
                    ) {
                        if (
                            !requestDate
                        ) {
                            return false;
                        }

                        if (
                            requestDate >
                            selectedEndDate
                        ) {
                            return false;
                        }
                    }

                    return true;
                }
            );
        };

    // =========================================================
    // Render
    // =========================================================

    render() {
        const {
            authenticated,
            loading,
            activeTab,
            search,
            viewMode,
            isFilterOpen,
            province,
            startDate,
            endDate,
            records,
            hasMore,
            loadingMore,
        } = this.state;

        if (!authenticated) {
            return <Loader />;
        }

        const filteredResult =
            this.getFilteredRequests();

        const filteredRequests =
            Array.isArray(
                filteredResult
            )
                ? filteredResult
                : [];

        return (
            <div className="container">

                {/* =================================================
                    Sticky Header
                ================================================= */}

                <div
                    className="sticky-top bg-light"
                    style={{
                        zIndex: 1020,
                        paddingLeft: "12px",
                        paddingRight: "12px",
                        paddingTop: "12px",
                        paddingBottom: "8px",
                        
                    }}
                >

                    {/* Search */}

                    <div
                        className="position-relative mb-3"
                        style={{
                            animation:
                                "fadeSlideDown .45s ease",
                                marginLeft: "35px",

                        }}
                    >
                        <FaSearch
                            className="position-absolute text-secondary"
                            style={{
                                left: "16px",
                                top: "50%",
                                transform:
                                    "translateY(-50%)",
                                zIndex: 2,
                            }}
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={
                                this.handleSearchChange
                            }
                            placeholder="جستجو..."
                            className="form-control border rounded-pill shadow-none"

                            style={{
                                height: "58px",
                                paddingRight:
                                    "20px",
                                paddingLeft:
                                    "48px",
                                fontSize:
                                    "15px",
                            }}
                        />
                    </div>

                    {/* Tabs */}

                    <div
                        className="d-flex p-1 mb-3 rounded-pill"
                        style={{
                            background:
                                "#f5f2ff",
                            border:
                                "1px solid #eee9ff",
                        }}
                    >

                        <button
                            type="button"
                            onClick={() =>
                                this.handleTabChange(
                                    "waiting"
                                )
                            }
                            className="btn flex-grow-1 rounded-pill"
                            style={{
                                height:
                                    "52px",

                                background:
                                    activeTab ===
                                        "waiting"
                                        ? "#ffffff"
                                        : "transparent",

                                color:
                                    activeTab ===
                                        "waiting"
                                        ? "#5540a8"
                                        : "#aaa",

                                border:
                                    activeTab ===
                                        "waiting"
                                        ? "1px solid #7158c9"
                                        : "1px solid transparent",

                                transition:
                                    "all .3s cubic-bezier(.22,1,.36,1)",
                            }}
                        >
                            منتظر تایید تعمیرکار
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                this.handleTabChange(
                                    "confirmed"
                                )
                            }
                            className="btn flex-grow-1 rounded-pill"
                            style={{
                                height:
                                    "52px",

                                background:
                                    activeTab ===
                                        "confirmed"
                                        ? "#ffffff"
                                        : "transparent",

                                color:
                                    activeTab ===
                                        "confirmed"
                                        ? "#5540a8"
                                        : "#aaa",

                                border:
                                    activeTab ===
                                        "confirmed"
                                        ? "1px solid #7158c9"
                                        : "1px solid transparent",

                                transition:
                                    "all .3s cubic-bezier(.22,1,.36,1)",
                            }}
                        >
                            تایید شده
                        </button>

                    </div>

                    {/* Toolbar */}

                    <div className="d-flex align-items-center justify-content-between mb-2">

                        <button
                            type="button"
                            onClick={
                                this.handleOpenFilter
                            }
                            className="btn bg-white border rounded-4 d-flex align-items-center gap-3 px-4"
                            style={{
                                height:
                                    "58px",
                                color:
                                    "#777",
                            }}
                        >
                            <span>
                                فیلتر
                            </span>

                            <FaFilter
                                size={20}
                            />
                        </button>

                        <div className="d-flex gap-2">

                            {/* List */}

                            <button
                                type="button"
                                onClick={() =>
                                    this.handleViewModeChange(
                                        "list"
                                    )
                                }
                                className="btn bg-white border rounded-4 d-flex align-items-center justify-content-center"
                                style={{
                                    width:
                                        "58px",
                                    height:
                                        "58px",

                                    color:
                                        viewMode ===
                                            "list"
                                            ? "#4d3ba3"
                                            : "#888",

                                    boxShadow:
                                        viewMode ===
                                            "list"
                                            ? "0 4px 14px rgba(80,60,160,.08)"
                                            : "none",
                                }}
                            >
                                <FaBars
                                    size={23}
                                />
                            </button>

                            {/* Card */}

                            <button
                                type="button"
                                onClick={() =>
                                    this.handleViewModeChange(
                                        "card"
                                    )
                                }
                                className="btn bg-white border rounded-4 d-flex align-items-center justify-content-center"
                                style={{
                                    width:
                                        "58px",
                                    height:
                                        "58px",

                                    color:
                                        viewMode ===
                                            "card"
                                            ? "#4d3ba3"
                                            : "#888",

                                    boxShadow:
                                        viewMode ===
                                            "card"
                                            ? "0 4px 14px rgba(80,60,160,.08)"
                                            : "none",
                                }}
                            >
                                <FaTh
                                    size={23}
                                />
                            </button>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    Records
                ================================================= */}

                {loading ? (
                    <div className="py-5">
                        <Loader />
                    </div>
                ) : (

                    <InfiniteScroll
                        dataLength={
                            records.length
                        }
                        next={
                            this.fetchMoreData
                        }
                        hasMore={
                            hasMore
                        }
                        scrollThreshold="200px"
                        loader={
                            loadingMore ? (
                                <div className="text-center py-4">
                                    <span className="text-muted">
                                        در حال دریافت درخواست‌ها...
                                    </span>
                                </div>
                            ) : null
                        }
                        endMessage={
                            !hasMore &&
                                records.length >
                                0 ? (
                                <div className="text-center text-muted py-4">
                                    تمام درخواست‌ها نمایش داده شدند
                                </div>
                            ) : null
                        }
                    >

                        <RequestRecords
                            records={
                                Array.isArray(
                                    filteredRequests
                                )
                                    ? filteredRequests
                                    : []
                            }
                            viewMode={
                                viewMode ||
                                "card"
                            }
                        />

                    </InfiniteScroll>

                )}

                {/* =================================================
                    Filter
                ================================================= */}

                <FilterModal
                    isOpen={
                        isFilterOpen
                    }
                    onClose={
                        this.handleCloseFilter
                    }
                    onApply={
                        this.handleApplyFilter
                    }
                    province={
                        province
                    }
                    startDate={
                        startDate
                    }
                    endDate={
                        endDate
                    }
                    onProvinceChange={
                        this.handleProvinceChange
                    }
                    onStartDateChange={
                        this.handleStartDateChange
                    }
                    onEndDateChange={
                        this.handleEndDateChange
                    }
                />

                <style>
                    {`
                        @keyframes fadeSlideDown {
                            from {
                                opacity: 0;
                                transform: translateY(-10px);
                            }

                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                    `}
                </style>

            </div>
        );
    }
}

export default RequestsPage;