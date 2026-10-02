import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

// =========================================================
// تبدیل اعداد به فارسی
// =========================================================

function toPersianDigits(value) {
    if (value === null || value === undefined) {
        return "";
    }

    const digits = "۰۱۲۳۴۵۶۷۸۹";

    return String(value).replace(
        /\d/g,
        (digit) => digits[Number(digit)]
    );
}

// =========================================================
// نام ماه شمسی
// =========================================================

function getPersianMonthName(month) {
    const months = [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند",
    ];

    return months[month - 1] || "";
}

// =========================================================
// تبدیل تاریخ به نام ماه
// =========================================================

function getMonthLabel(dateString) {
    if (!dateString) {
        return "";
    }

    let value = String(dateString).trim();

    if (!value) {
        return "";
    }

    if (value.includes("T")) {
        value = value.split("T")[0];
    }

    value = value.replace(/\//g, "-");

    const parts = value.split("-");

    if (parts.length !== 3) {
        return "";
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    if (!year || !month || !day) {
        return "";
    }

    try {
        if (year < 1700) {
            return `${toPersianDigits(year)} ${getPersianMonthName(month)}`;
        }

        const date = new Date(
            year,
            month - 1,
            day
        );

        return new Intl.DateTimeFormat(
            "fa-IR-u-ca-persian",
            {
                year: "numeric",
                month: "long",
            }
        ).format(date);
    } catch (error) {
        console.error("MONTH FORMAT ERROR:", error);
        return "";
    }
}

class RequestRecords extends React.Component {
    // =========================================================
    // استایل متن یک خطه با ...
    // =========================================================

    textStyle = {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        minWidth: 0,
    };

    // =========================================================
    // تاریخ رکورد
    // =========================================================

    getRecordDate = (record) => {
        if (!record) {
            return "";
        }

        return (
            record.date ||
            record.original?.time ||
            record.original?.date ||
            record.original?.created_at ||
            ""
        );
    };

    // =========================================================
    // وضعیت واقعی رکورد
    // =========================================================

    getRecordStatus = (record) => {
        const request = record?.original || record || {};

        const status = Number(request.status);
        const end = Number(request.end);
        const cleared = Number(request.cleared);
        const deleted = Number(request.deleted);

        if (deleted === 1) {
            return {
                color: "#dc3545",
                text: "حذف شده توسط ادمین",
            };
        }

        if (status === 4) {
            return {
                color: "#000000",
                text: "فعال شده مجدد",
            };
        }

        if (status === -1) {
            return {
                color: "#dc3545",
                text: "رد شده",
            };
        }

        if (status === 3 || end === 2) {
            return {
                color: "#dc3545",
                text: "لغو شده",
            };
        }

        if (
            status === 2 ||
            (status === 1 && end === 1)
        ) {
            if (cleared === 1) {
                return {
                    color: "#0d6efd",
                    text: "تسویه شده",
                };
            }

            return {
                color: "#198754",
                text: "در انتظار پرداخت",
            };
        }

        if (
            status === 1 &&
            end === 0
        ) {
            return {
                color: "#ffc107",
                text: "در حال انجام",
            };
        }

        if (status === 0) {
            return {
                color: "#6c757d",
                text: "ایجاد شده",
            };
        }

        return {
            color: "#6c757d",
            text: "وضعیت نامشخص",
        };
    };

    // =========================================================
    // هدر ماه
    // =========================================================

    renderMonthHeader = (month) => {
        if (!month) {
            return null;
        }

        return (
            <div
                className="text-center small text-muted py-2 bg-light border-bottom"
                style={this.textStyle}
            >
                {month}
            </div>
        );
    };

    // =========================================================
    // Header List
    // =========================================================

    renderListHeader = () => {
        return (
            <div
                className="d-grid text-center align-items-center py-3"
                style={{
                    gridTemplateColumns:
                        "1.2fr 1.2fr 1.6fr 90px",
                    backgroundColor: "#f5f5f5",
                    color: "#4e3c9b",
                    fontSize: "14px",
                    minHeight: "68px",
                    borderBottom:
                        "1px solid #eeeeee",
                }}
            >
                <div style={this.textStyle}>
                    نام تعمیرکار
                </div>

                <div style={this.textStyle}>
                    نوع دستگاه
                </div>

                <div style={this.textStyle}>
                    ایراد دستگاه
                </div>

                <div style={this.textStyle}>
                    جزئیات
                </div>
            </div>
        );
    };

    // =========================================================
    // List
    // =========================================================

    renderList = () => {
        const records = Array.isArray(
            this.props.records
        )
            ? this.props.records
            : [];

        if (!records.length) {
            return this.renderEmpty();
        }

        let lastMonth = "";

        return (
            <div
                className="bg-white rounded-4 overflow-hidden"
                style={{
                    border:
                        "1px solid #f2f2f2",
                    animation:
                        "recordsFade .4s ease",
                }}
            >
                {this.renderListHeader()}

                <div>
                    {records.map(
                        (record, index) => {
                            const month =
                                getMonthLabel(
                                    this.getRecordDate(
                                        record
                                    )
                                );

                            const showMonth =
                                month &&
                                month !==
                                lastMonth;

                            lastMonth = month;

                            const recordStatus =
                                this.getRecordStatus(
                                    record
                                );

                            return (
                                <React.Fragment
                                    key={
                                        record.id ??
                                        index
                                    }
                                >
                                    {showMonth &&
                                        this.renderMonthHeader(
                                            month
                                        )}

                                    <div
                                        className="d-grid text-center align-items-center"
                                        style={{
                                            gridTemplateColumns:
                                                "1.2fr 1.2fr 1.6fr 90px",
                                            minHeight:
                                                "50px",
                                            borderBottom:
                                                index !==
                                                    records.length - 1
                                                    ? "1px solid #f4f4f4"
                                                    : "none",
                                            fontSize:
                                                "14px",
                                            transition:
                                                "background .25s ease",
                                        }}
                                    >
                                        {/* تعمیرکار */}

                                        <div
                                            style={{
                                                ...this.textStyle,
                                                padding:
                                                    "0 8px",
                                            }}
                                            title={
                                                record.technician ||
                                                ""
                                            }
                                        >
                                            {record.technician ||
                                                "-"}
                                        </div>

                                        {/* نوع دستگاه */}

                                        <div
                                            style={{
                                                ...this.textStyle,
                                                padding:
                                                    "0 8px",
                                            }}
                                            title={
                                                record.deviceType ||
                                                ""
                                            }
                                        >
                                            {record.deviceType ||
                                                "-"}
                                        </div>

                                        {/* ایراد */}

                                        <div
                                            style={{
                                                ...this.textStyle,
                                                padding:
                                                    "0 10px",
                                            }}
                                            title={
                                                record.problem ||
                                                ""
                                            }
                                        >
                                            {record.problem ||
                                                "-"}
                                        </div>

                                        {/* جزئیات + وضعیت */}

                                        <div
                                            className="d-flex align-items-center justify-content-center gap-2"
                                            style={{
                                                minWidth: 0,
                                            }}
                                        >
                                            <span
                                                title={
                                                    recordStatus.text
                                                }
                                                style={{
                                                    width: "18px",
                                                    height: "18px",
                                                    minWidth:
                                                        "18px",
                                                    borderRadius:
                                                        "50%",
                                                    backgroundColor:
                                                        recordStatus.color,
                                                    display:
                                                        "inline-block",
                                                }}
                                            />

                                            <Link
                                                to={`/request-details/${record.id}`}
                                                className="btn rounded-pill d-flex align-items-center justify-content-center text-decoration-none"
                                                style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    minWidth:
                                                        "30px",
                                                    color: "#6389c8",
                                                    border:
                                                        "1px solid #6389c8",
                                                    background:
                                                        "#fff",
                                                    padding: 0,
                                                }}
                                                title="جزئیات"
                                            >
                                                <FaArrowLeft
                                                    size={10}
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        }
                    )}
                </div>
            </div>
        );
    };

    // =========================================================
    // Card
    // =========================================================

    renderCard = (
        record,
        index
    ) => {
        if (!record) {
            return null;
        }

        return (
            <div
                key={
                    record.id ??
                    index
                }
                className="bg-white rounded-4 p-3 h-100"
                style={{
                    border:
                        "1px solid #eeeeee",
                    boxShadow:
                        "0 2px 6px rgba(0,0,0,.08)",
                    animation: `cardFade .4s ease ${index * 0.06
                        }s both`,
                    transition:
                        "transform .25s ease, box-shadow .25s ease",
                    minWidth: 0,
                }}
            >
                {/* تعمیرکار */}

                <div
                    className="d-flex justify-content-between align-items-center mb-3"
                    style={{
                        minWidth: 0,
                        gap: "10px",
                    }}
                >
                    <strong
                        className="fw-semibold"
                        style={{
                            fontSize: "14px",
                            flexShrink: 0,
                        }}
                    >
                        تعمیرکار
                    </strong>

                    <span
                        style={{
                            ...this.textStyle,
                            fontSize: "14px",
                            textAlign: "left",
                        }}
                        title={
                            record.technician ||
                            ""
                        }
                    >
                        {record.technician ||
                            "-"}
                    </span>
                </div>

                {/* نوع دستگاه */}

                <div
                    className="d-flex justify-content-between align-items-center mb-3"
                    style={{
                        minWidth: 0,
                        gap: "10px",
                    }}
                >
                    <strong
                        className="fw-semibold"
                        style={{
                            fontSize: "14px",
                            flexShrink: 0,
                        }}
                    >
                        نوع دستگاه
                    </strong>

                    <span
                        style={{
                            ...this.textStyle,
                            fontSize: "14px",
                            textAlign: "left",
                        }}
                        title={
                            record.deviceType ||
                            ""
                        }
                    >
                        {record.deviceType ||
                            "-"}
                    </span>
                </div>

                {/* ایراد */}

                <div
                    className="d-flex justify-content-between align-items-start mb-3"
                    style={{
                        gap: "15px",
                        minWidth: 0,
                    }}
                >
                    <strong
                        className="fw-semibold"
                        style={{
                            fontSize: "14px",
                            flexShrink: 0,
                        }}
                    >
                        ایراد دستگاه
                    </strong>

                    <span
                        className="text-end"
                        style={{
                            ...this.textStyle,
                            fontSize: "14px",
                        }}
                        title={
                            record.problem ||
                            ""
                        }
                    >
                        {record.problem ||
                            "-"}
                    </span>
                </div>

                {/* جزئیات */}

                <Link
                    to={`/request-details/${record.id}`}
                    className="btn w-100 rounded-pill d-flex align-items-center justify-content-center text-decoration-none"
                    style={{
                        height: "50px",
                        color: "#6389c8",
                        border:
                            "1px solid #6389c8",
                        background: "#fff",
                        transition:
                            "all .25s ease",
                    }}
                >
                    جزئیات
                </Link>
            </div>
        );
    };

    // =========================================================
    // Cards
    // =========================================================

    renderCards = () => {
        const records = Array.isArray(
            this.props.records
        )
            ? this.props.records
            : [];

        if (!records.length) {
            return this.renderEmpty();
        }

        return (
            <div
                className="row g-3"
            >
                {records.map(
                    (record, index) => (
                        <div
                            key={
                                record?.id ??
                                index
                            }
                            className="col-6"
                            style={{
                                minWidth: 0,
                            }}
                        >
                            {this.renderCard(
                                record,
                                index
                            )}
                        </div>
                    )
                )}
            </div>
        );
    };

    // =========================================================
    // Empty
    // =========================================================

    renderEmpty = () => {
        return (
            <div
                className="text-center py-5 text-secondary"
                style={{
                    animation:
                        "recordsFade .35s ease",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                موردی برای نمایش وجود ندارد.
            </div>
        );
    };

    // =========================================================
    // Render
    // =========================================================

    render() {
        const viewMode =
            this.props.viewMode ||
            "card";

        return (
            <div className="mt-2">
                {viewMode === "list"
                    ? this.renderList()
                    : this.renderCards()}
            </div>
        );
    }
}

export default RequestRecords;