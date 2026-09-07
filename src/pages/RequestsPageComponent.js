import React from "react";
import {
  FaSearch,
  FaFilter,
  FaTh,
  FaBars,
} from "react-icons/fa";

import FilterModal from "./FilterModalComponent";
import RequestRecords from "./RequestRecordsComponent";
import AuthCheck from "./AuthCheckComponent";
import Loader from "./LoaderComponent";

const API_URL = "https://iranaserviceapp.ir/test/api";

class RequestsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: "waiting",
      search: "",
      viewMode: "card",
      isFilterOpen: false,
      province: "",
      startDate: "",
      endDate: "",
      records: [],
      loading: true,
      authenticated: false,
    };
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
        this.getRequests();
      }
    );
  }

  // =========================================================
  // دریافت درخواست‌ها از API
  // =========================================================

  getRequests = () => {
    const token = localStorage.getItem("token");

    this.setState({
      loading: true,
    });

    fetch(`${API_URL}/list`, {
      method: "GET",

      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("خطا در دریافت درخواست‌ها");
        }

        return response.json();
      })

      .then((data) => {
        console.log("REQUESTS API:", data);

        /*
         * API ممکن است اطلاعات را داخل یکی از این‌ها برگرداند:
         *
         * data.requests
         * data.data
         * data.list
         */

        let requests = [];

        if (Array.isArray(data.requests)) {
          requests = data.requests;
        } else if (Array.isArray(data.data)) {
          requests = data.data;
        } else if (Array.isArray(data.list)) {
          requests = data.list;
        }

        /*
         * تبدیل اطلاعات API به ساختار مورد نیاز RequestRecords
         */

        const records = requests.map((request) => {
          const customer =
            request.user ||
            request.customer ||
            request.user_model ||
            request.customer_model ||
            {};

          const technician =
            request.repairman ||
            request.technician ||
            request.repairman_model ||
            request.technician_model ||
            {};

          return {
            id: request.id,

            customerName:
              request.customerName ||
              request.customer_name ||
              request.name ||
              (
                `${customer.name || ""} ${
                  customer.family || ""
                }`
              ).trim() ||
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
              request.technician_name ||
              request.repairman_name ||
              (
                `${technician.name || ""} ${
                  technician.family || ""
                }`
              ).trim() ||
              "---",

            problem:
              request.problem ||
              request.device_problem ||
              request.description ||
              request.issue ||
              "---",

            date:
              request.date ||
              request.created_at ||
              "---",

            /*
             * وضعیت را تا جای ممکن از API می‌گیریم.
             */
            status:
              request.status_name ||
              request.status_text ||
              request.state_name ||
              request.status ||
              "waiting",

            /*
             * اطلاعات اصلی API را هم نگه می‌داریم
             * اگر بعداً در جزئیات لازم شد.
             */
            original: request,
          };
        });

        console.log("NORMALIZED RECORDS:", records);

        this.setState({
          records: records,
          loading: false,
        });
      })

      .catch((error) => {
        console.error("GET REQUESTS ERROR:", error);

        this.setState({
          records: [],
          loading: false,
        });
      });
  };

  // =========================================================
  // Search
  // =========================================================

  handleSearchChange = (e) => {
    this.setState({
      search: e.target.value,
    });
  };

  // =========================================================
  // Tabs
  // =========================================================

  handleTabChange = (tab) => {
    this.setState({
      activeTab: tab,
    });
  };

  // =========================================================
  // View Mode
  // =========================================================

  handleViewModeChange = (mode) => {
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

  handleProvinceChange = (e) => {
    this.setState({
      province: e.target.value,
    });
  };

  handleStartDateChange = (e) => {
    this.setState({
      startDate: e.target.value,
    });
  };

  handleEndDateChange = (e) => {
    this.setState({
      endDate: e.target.value,
    });
  };

  handleApplyFilter = () => {
    const {
      province,
      startDate,
      endDate,
    } = this.state;

    console.log("FILTER:", {
      province,
      startDate,
      endDate,
    });

    /*
     * فعلاً فیلتر در سمت React انجام می‌شود.
     * اگر API فیلتر داشته باشد می‌توان همین قسمت را
     * به API متصل کرد.
     */

    this.setState({
      isFilterOpen: false,
    });
  };

  // =========================================================
  // Filter Records
  // =========================================================

  getFilteredRequests = () => {
    const {
      records,
      activeTab,
      search,
    } = this.state;

    const searchText = search
      .trim()
      .toLowerCase();

    return records.filter((record) => {
      /*
       * اگر API وضعیت را عددی ارسال کرده باشد
       * آن را هم مدیریت می‌کنیم.
       */

      let matchesTab = true;

      if (activeTab === "waiting") {
        matchesTab =
          record.status === "waiting" ||
          record.status === 0 ||
          record.status === "0" ||
          record.status === "pending" ||
          record.status === "pending_confirmation";
      }

      if (activeTab === "confirmed") {
        matchesTab =
          record.status === "confirmed" ||
          record.status === 1 ||
          record.status === "1";
      }

      const matchesSearch =
        !searchText ||
        String(record.customerName)
          .toLowerCase()
          .includes(searchText) ||
        String(record.deviceType)
          .toLowerCase()
          .includes(searchText) ||
        String(record.deviceBrand)
          .toLowerCase()
          .includes(searchText) ||
        String(record.technician)
          .toLowerCase()
          .includes(searchText) ||
        String(record.problem)
          .toLowerCase()
          .includes(searchText);

      return matchesTab && matchesSearch;
    });
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
    } = this.state;

    if (!authenticated) {
      return <Loader />;
    }

    const filteredRequests =
      this.getFilteredRequests();

    return (
      <div className="container">

        {/* ================= Search ================= */}

        <div
          className="position-relative mb-3"
          style={{
            animation:
              "fadeSlideDown .45s ease",
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
              paddingRight: "20px",
              paddingLeft: "48px",
              fontSize: "15px",
            }}
          />
        </div>

        {/* ================= Tabs ================= */}

        <div
          className="d-flex p-1 mb-4 rounded-pill"
          style={{
            background: "#f5f2ff",
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
              height: "52px",

              background:
                activeTab === "waiting"
                  ? "#ffffff"
                  : "transparent",

              color:
                activeTab === "waiting"
                  ? "#5540a8"
                  : "#aaa",

              border:
                activeTab === "waiting"
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
              height: "52px",

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

        {/* ================= Toolbar ================= */}

        <div className="d-flex align-items-center justify-content-between mb-2">

          {/* Filter */}

          <button
            type="button"
            onClick={
              this.handleOpenFilter
            }
            className="btn bg-white border rounded-4 d-flex align-items-center gap-3 px-4"
            style={{
              height: "58px",
              color: "#777",
              transition:
                "all .25s ease",
            }}
          >
            <span>فیلتر</span>

            <FaFilter size={20} />
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
                width: "58px",
                height: "58px",

                color:
                  viewMode === "list"
                    ? "#4d3ba3"
                    : "#888",

                boxShadow:
                  viewMode === "list"
                    ? "0 4px 14px rgba(80,60,160,.08)"
                    : "none",

                transition:
                  "all .25s ease",
              }}
            >
              <FaBars size={23} />
            </button>

            {/* Grid */}

            <button
              type="button"
              onClick={() =>
                this.handleViewModeChange(
                  "card"
                )
              }
              className="btn bg-white border rounded-4 d-flex align-items-center justify-content-center"
              style={{
                width: "58px",
                height: "58px",

                color:
                  viewMode === "card"
                    ? "#4d3ba3"
                    : "#888",

                boxShadow:
                  viewMode === "card"
                    ? "0 4px 14px rgba(80,60,160,.08)"
                    : "none",

                transition:
                  "all .25s ease",
              }}
            >
              <FaTh size={23} />
            </button>
          </div>
        </div>

        {/* ================= Loading ================= */}

        {loading ? (
          <div className="py-5">
            <Loader />
          </div>
        ) : (
          <RequestRecords
            records={filteredRequests}
            viewMode={viewMode}
          />
        )}

        {/* ================= Filter ================= */}

        <FilterModal
          isOpen={isFilterOpen}
          onClose={
            this.handleCloseFilter
          }
          onApply={
            this.handleApplyFilter
          }
          province={province}
          startDate={startDate}
          endDate={endDate}
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
