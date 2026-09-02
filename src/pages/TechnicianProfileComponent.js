import React from "react";
import HistoryTableRow from "./HistoryTableRowComponent";
import "./../css/profie.css";
import { Link } from "react-router-dom";

// داده‌ی نمونه — در پروژه‌ی واقعی از API می‌آید
const SAMPLE_PROFILE = {
  name: "علی عبداللهی",
  confirmedRequests: 304,
  avatar: "https://ui-avatars.com/api/?name=علی+عبداللهی&background=e9ecef&color=495057",
};

const SAMPLE_STATS = {
  settled: 236,
  canceledByTechnician: 61,
  reactivated: 7,
};

const SAMPLE_HISTORY = [
  { id: 1, deviceType: "ساید", issue: "یخچال گرم و لا...", date: "1405/05/28", status: "success" },
  { id: 2, deviceType: "ساید", issue: "یخچال گرم", date: "1405/05/27", status: "success" },
  { id: 3, deviceType: "یخچال فریزر", issue: "اروِر ۸", date: "1405/05/26", status: "canceled" },
  { id: 4, deviceType: "یخچال فریزر", issue: "لولا", date: "1405/05/25", status: "success" },
  { id: 5, deviceType: "یخچال فریزر", issue: "جفت گرم", date: "1405/05/25", status: "success" },
  { id: 6, deviceType: "یخچال فریزر", issue: "لولای درب شکس.", date: "1405/05/25", status: "canceled" },
  { id: 7, deviceType: "یخچال فریزر", issue: "جفت گرم", date: "1405/05/25", status: "success" },
  { id: 8, deviceType: "ساید", issue: "جفت گرم", date: "1405/05/25", status: "success" },
  { id: 9, deviceType: "ساید", issue: "فریزر گرم", date: "1405/05/24", status: "success" },
  { id: 10, deviceType: "دوقلو", issue: "فریزر گرم", date: "1405/05/09", status: "success" },
];

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const PERSIAN_MONTHS = [
  "",
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

function toPersianDigits(value) {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

function monthLabelFromDate(dateStr) {
  // فرمت ورودی: 1405/05/28
  const [year, month] = dateStr.split("/");
  const monthName = PERSIAN_MONTHS[Number(month)] || "";
  return `${monthName} ${toPersianDigits(year)}`;
}

// صفحه‌ی کامل پروفایل تعمیرکار + آمار + سوابق
class TechnicianProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: SAMPLE_PROFILE,
      stats: SAMPLE_STATS,
      history: SAMPLE_HISTORY,
    };

    this.handleProfileClick = this.handleProfileClick.bind(this);
    this.handleChatClick = this.handleChatClick.bind(this);
    this.handleRowDetails = this.handleRowDetails.bind(this);
  }

  handleProfileClick() {
    // مسیر پروفایل بعداً وصل می‌شود
    console.log("رفتن به پروفایل");
  }

  handleChatClick() {
    // مسیر گفتگو بعداً وصل می‌شود
    console.log("رفتن به گفتگو");
  }

  handleRowDetails(id) {
    // مسیر جزئیات سابقه بعداً وصل می‌شود
    console.log("جزئیات سابقه:", id);
  }

  render() {
    const { profile, stats, history } = this.state;

    // گروه‌بندی سوابق بر اساس ماه، مطابق ترتیب موجود در آرایه
    let lastMonthLabel = null;

    return (
      <div>
        <div className="container px-3 pt-4 pb-5">
          {/* کارت پروفایل */}
          <div className="d-flex align-items-center justify-content-between border rounded-4 p-3 mb-4">
            <div className="d-flex align-items-center gap-3 w-100">
              <img
                src={profile.avatar}
                alt={profile.name}
                width="56"
                height="56"
                className="rounded-circle"
              />

              <div>
                <div className="fw-semibold text-dark">{profile.name}</div>
                <div className="text-muted small">
                  {toPersianDigits(profile.confirmedRequests)} درخواست تایید شده
                </div>
              </div>

              {/* دکمه‌ها سمت چپ */}
              <div className="d-flex flex-column gap-2 me-auto">
                  <Link
                    to={`/PersonalInfoPage`}
                    className="btn btn-primary rounded-pill btn-sm px-4 py-2"
                    >
                    پروفایل
                  </Link>

                <button
                  type="button"
                  onClick={this.handleChatClick}
                  className="btn btn-outline-primary rounded-pill btn-sm px-4 py-2"
                >
                  گفتگو
                </button>
              </div>
            </div>
          </div>
          {/* آمار */}
          <h2 className="text-center fs-6 fw-semibold text-dark mb-3">آمار</h2>
          <div className="border rounded-4 p-3 mb-4 d-flex flex-column gap-3">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted">تسویه شده</span>
              <span className="fw-semibold" style={{ color: "#5b9bf0" }}>
                {toPersianDigits(stats.settled)}
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted">کنسل شده توسط تعمیرکار</span>
              <span className="fw-semibold text-danger">
                {toPersianDigits(stats.canceledByTechnician)}
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted">مجدد فعال‌سازی شده</span>
              <span className="fw-semibold text-dark">
                {toPersianDigits(stats.reactivated)}
              </span>
            </div>
          </div>

          {/* سوابق */}
          <h2 className="text-center fs-6 fw-semibold text-dark mb-3">سوابق</h2>

          <div className="border rounded-4 overflow-hidden">
            {/* سرستون جدول */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.3fr 1fr 0.8fr",
                alignItems: "center",
              }}
              className="py-3 border-bottom table-header"
            >
              <span className="text-center small">نوع دستگاه</span>
              <span className="text-center small">ایراد دستگاه</span>
              <span className="text-center small">زمان مراجعه</span>
              <span className="text-center small">جزئیات</span>
            </div>

            {history.map((record) => {
              const monthLabel = monthLabelFromDate(record.date);
              const showMonthSeparator = monthLabel !== lastMonthLabel;
              lastMonthLabel = monthLabel;

              return (
                <React.Fragment key={record.id}>
                  {showMonthSeparator && (
                    <div className="text-center small text-muted py-2 bg-light border-bottom">
                      {monthLabel}
                    </div>
                  )}
                  <Link
                    to={`/request-details/${record.id}`}
                    className="text-decoration-none text-dark d-block"
                  >
                    <HistoryTableRow
                      record={record}
                      onDetails={this.handleRowDetails}
                    />
                  </Link>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default TechnicianProfilePage;