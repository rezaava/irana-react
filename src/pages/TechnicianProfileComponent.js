import React from "react";
import { Link } from "react-router-dom";
import HistoryTableRow from "./HistoryTableRowComponent";
import Loader from "./LoaderComponent";
import withRouter from "./withRouter";
import "./../css/profie.css";

const API_URL = "https://iranaserviceapp.ir/test/api";
const IMAGE_URL = "https://iranaserviceapp.ir/test/files/user";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=کاربر&background=e9ecef&color=495057";

function toPersianDigits(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const digits = "۰۱۲۳۴۵۶۷۸۹";

  return String(value).replace(/\d/g, (digit) => digits[Number(digit)]);
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const parts = String(dateString).split("/");

  if (parts.length !== 3) {
    return dateString;
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (year < 1700) {
    return `${toPersianDigits(year)}/${toPersianDigits(
      String(month).padStart(2, "0")
    )}/${toPersianDigits(String(day).padStart(2, "0"))}`;
  }

  try {
    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch (error) {
    console.error("DATE FORMAT ERROR:", error);
    return dateString;
  }
}

function getMonthLabel(dateString) {
  if (!dateString) {
    return "";
  }

  const parts = String(dateString).split("/");

  if (parts.length !== 3) {
    return "";
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  try {
    if (year < 1700) {
      return `${toPersianDigits(year)}/${toPersianDigits(
        String(month).padStart(2, "0")
      )}`;
    }

    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "long",
    }).format(date);
  } catch (error) {
    console.error("MONTH FORMAT ERROR:", error);
    return "";
  }
}

function getRequestStatus(request) {
  const status = Number(request.status);
  const end = Number(request.end);
  const cleared = Number(request.cleared);
  const deleted = Number(request.deleted);

  // حذف توسط ادمین
  if (deleted === 1) {
    return {
      code: "admin_deleted",
      text: "حذف توسط ادمین",
      color: "#dc3545",
    };
  }

  // مجدد فعالسازی شده / Refresh
  if (status === 4) {
    return {
      code: "reactivated",
      text: "مجدد فعالسازی شده",
      color: "#000000",
    };
  }

  // رد شده
  if (status === -1) {
    return {
      code: "rejected",
      text: "رد شده",
      color: "#dc3545",
    };
  }

  // کنسل شده
  if (status === 3 || end === 2) {
    return {
      code: "canceled",
      text: "کنسل شده",
      color: "#dc3545",
    };
  }

  // پایان یافته و تسویه شده
  if (
    (status === 2 || (status === 1 && end === 1)) &&
    cleared === 1
  ) {
    return {
      code: "settled",
      text: "تسویه شده",
      color: "#0d6efd",
    };
  }

  // پایان یافته ولی هنوز پرداخت نشده
  if (
    (status === 2 || (status === 1 && end === 1)) &&
    cleared === 0
  ) {
    return {
      code: "waiting_payment",
      text: "تمام شده و منتظر پرداخت",
      color: "#198754",
    };
  }

  // قبول شده و در حال اجرا
  if (status === 1 && end === 0) {
    return {
      code: "running",
      text: "درحال اجرا",
      color: "#ffc107",
    };
  }

  // درخواست تازه ایجاد شده
  if (status === 0) {
    return {
      code: "created",
      text: "در انتظار بررسی",
      color: "#6c757d",
    };
  }

  return {
    code: "unknown",
    text: "نامشخص",
    color: "#6c757d",
  };
}

function getAvatar(repairman) {
  if (!repairman) {
    return DEFAULT_AVATAR;
  }

  if (repairman.image) {
    return `${IMAGE_URL}${repairman.image}`;
  }

  const fullName = `${repairman.name || ""} ${
    repairman.family || ""
  }`.trim();

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName || "کاربر"
  )}&background=e9ecef&color=495057`;
}

function calculateStats(requests) {
  const stats = {
    running: 0,
    settled: 0,
    canceledByTechnician: 0,
    adminDeleted: 0,
    waitingPayment: 0,
    reactivated: 0,
  };

  requests.forEach((request) => {
    const status = getRequestStatus(request);

    switch (status.code) {
      case "running":
        stats.running++;
        break;

      case "settled":
        stats.settled++;
        break;

      case "canceled":
        stats.canceledByTechnician++;
        break;

      case "admin_deleted":
        stats.adminDeleted++;
        break;

      case "waiting_payment":
        stats.waitingPayment++;
        break;

      case "reactivated":
        stats.reactivated++;
        break;

      default:
        break;
    }
  });

  return stats;
}

class TechnicianProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: null,

      stats: {
        running: 0,
        settled: 0,
        canceledByTechnician: 0,
        adminDeleted: 0,
        waitingPayment: 0,
        reactivated: 0,
      },

      history: [],

      loading: true,

      error: "",
    };
  }

  componentDidMount() {
    this.getUserHistory();
  }

  getUserHistory = async () => {
    const { id } = this.props.params;

    console.log("USER ID:", id);

    if (!id) {
      this.setState({
        loading: false,
        error: "شناسه تعمیرکار پیدا نشد.",
      });

      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      this.setState({
        loading: false,
        error: "توکن ورود پیدا نشد.",
      });

      return;
    }

    const url = `${API_URL}/user-history?id=${encodeURIComponent(id)}`;

    console.log("REQUEST URL:", url);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("HTTP STATUS:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      console.log("USER HISTORY RESPONSE:", data);

      if (String(data.status) !== "1") {
        this.setState({
          loading: false,
          error: data.message || "اطلاعاتی پیدا نشد.",
          profile: null,
          history: [],
        });

        return;
      }

      const requests = Array.isArray(data.requests)
        ? data.requests
        : [];

      console.log("REQUESTS COUNT:", requests.length);

      const repairman =
        requests.length > 0
          ? requests[0].repairman_model
          : null;

      const fullName = repairman
        ? `${repairman.name || ""} ${
            repairman.family || ""
          }`.trim()
        : "بدون نام";

      const profile = {
        id: repairman?.id || id,
        name: fullName || "بدون نام",
        confirmedRequests: requests.length,
        avatar: getAvatar(repairman),
      };

      const history = requests.map((request) => ({
        id: request.id,
        deviceType: request.device_type || "نامشخص",
        issue: request.problem || "بدون توضیحات",
        date: formatDate(request.time),
        status: getRequestStatus(request),
        originalData: request,
      }));

      const stats = calculateStats(requests);

      console.log("CALCULATED STATS:", stats);

      this.setState({
        profile,
        stats,
        history,
        loading: false,
        error: "",
      });
    } catch (error) {
      console.error("USER HISTORY ERROR:", error);

      this.setState({
        loading: false,
        profile: null,
        history: [],
        error: "خطا در دریافت اطلاعات تعمیرکار.",
      });
    }
  };

  renderHistory() {
    const { history } = this.state;

    let lastMonth = "";

    return history.map((record) => {
      const month = getMonthLabel(record.originalData.time);

      const showMonth = month && month !== lastMonth;

      lastMonth = month;

      return (
        <React.Fragment key={record.id}>
          {showMonth && (
            <div className="text-center small text-muted py-2 bg-light border-bottom">
              {month}
            </div>
          )}

          <Link
            to={`/request-details/${record.id}`}
            className="text-decoration-none text-dark d-block"
          >
            <HistoryTableRow record={record} />
          </Link>
        </React.Fragment>
      );
    });
  }

  render() {
    const {
      profile,
      stats,
      history,
      loading,
      error,
    } = this.state;

    if (loading) {
      return <Loader />;
    }

    if (error) {
      return (
        <div
          dir="rtl"
          className="container px-3 py-5"
        >
          <div className="text-center text-danger">
            {error}
          </div>
        </div>
      );
    }

    if (!profile) {
      return (
        <div
          dir="rtl"
          className="container px-3 py-5"
        >
          <div className="text-center text-muted">
            اطلاعات تعمیرکار پیدا نشد.
          </div>
        </div>
      );
    }

    return (
      <div dir="rtl">
        <div className="container px-3 pt-4 pb-5">
          <div className="d-flex align-items-center justify-content-between border rounded-4 p-3 mb-4">
            <div className="d-flex align-items-center gap-3 w-100">
              <img
                src={profile.avatar}
                alt={profile.name}
                width="56"
                height="56"
                className="rounded-circle"
                style={{ objectFit: "cover" }}
              />

              <div>
                <div className="fw-semibold text-dark">
                  {profile.name}
                </div>

                <div className="text-muted small">
                  {toPersianDigits(profile.confirmedRequests)} درخواست تایید شده
                </div>
              </div>

              <div className="d-flex flex-column gap-2 me-auto">
                <Link
                  to={`/PersonalInfoPage/${profile.id}`}
                  className="btn btn-primary rounded-pill btn-sm px-4 py-2"
                >
                  پروفایل
                </Link>

                <Link
                  to={`/chat/${profile.id}`}
                  className="btn btn-primary rounded-pill btn-sm px-4 py-2"
                >
                  گفتگو
                </Link>
              </div>
            </div>
          </div>

          <h2 className="text-center fs-6 fw-semibold text-dark mb-3">
            آمار
          </h2>

          <div className="border rounded-4 p-3 mb-4 d-flex flex-column gap-3">
            {stats.running > 0 && (
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted">
                  درحال اجرا
                </span>

                <span
                  className="fw-semibold"
                  style={{ color: "#ffc107" }}
                >
                  {toPersianDigits(stats.running)}
                </span>
              </div>
            )}

            {stats.settled > 0 && (
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted">
                  تسویه شده
                </span>

                <span
                  className="fw-semibold"
                  style={{ color: "#0d6efd" }}
                >
                  {toPersianDigits(stats.settled)}
                </span>
              </div>
            )}

            {stats.canceledByTechnician > 0 && (
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted">
                  کنسل توسط تعمیرکار
                </span>

                <span className="fw-semibold text-danger">
                  {toPersianDigits(stats.canceledByTechnician)}
                </span>
              </div>
            )}

            {stats.adminDeleted > 0 && (
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted">
                  حذف توسط ادمین
                </span>

                <span className="fw-semibold text-danger">
                  {toPersianDigits(stats.adminDeleted)}
                </span>
              </div>
            )}

            {stats.waitingPayment > 0 && (
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted">
                  تمام شده و منتظر پرداخت
                </span>

                <span
                  className="fw-semibold"
                  style={{ color: "#198754" }}
                >
                  {toPersianDigits(stats.waitingPayment)}
                </span>
              </div>
            )}

            {stats.reactivated > 0 && (
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted">
                  مجدد فعالسازی شده
                </span>

                <span className="fw-semibold text-dark">
                  {toPersianDigits(stats.reactivated)}
                </span>
              </div>
            )}

            {stats.running === 0 &&
              stats.settled === 0 &&
              stats.canceledByTechnician === 0 &&
              stats.adminDeleted === 0 &&
              stats.waitingPayment === 0 &&
              stats.reactivated === 0 && (
                <div className="text-center text-muted py-2">
                  آماری برای نمایش وجود ندارد.
                </div>
              )}
          </div>

          <h2 className="text-center fs-6 fw-semibold text-dark mb-3">
            سوابق
          </h2>

          <div className="border rounded-4 overflow-hidden">
            <div
              className="py-3 border-bottom table-header"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1.3fr 1fr 0.8fr",
                alignItems: "center",
              }}
            >
              <span className="text-center small">
                نوع دستگاه
              </span>

              <span className="text-center small">
                ایراد دستگاه
              </span>

              <span className="text-center small">
                زمان مراجعه
              </span>

              <span className="text-center small">
                جزئیات
              </span>
            </div>

            {history.length === 0 ? (
              <div className="text-center text-muted py-5">
                سابقه‌ای برای این تعمیرکار وجود ندارد.
              </div>
            ) : (
              this.renderHistory()
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(TechnicianProfilePage);