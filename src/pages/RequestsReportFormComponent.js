import React from "react";
import { FaRegClock, FaChevronDown, FaFileAlt } from "react-icons/fa";
import moment from "moment-jalaali";

const API_URL = "https://iranaserviceapp.ir/test/api";

const PERSIAN_MONTHS = [
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

class RequestsReportForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      year: "",
      month: "",
      outputFile: "excel",
      loading: false,
    };
  }

  handleYearChange = (e) => {
    this.setState({
      year: e.target.value,
    });
  };

  handleMonthChange = (e) => {
    this.setState({
      month: e.target.value,
    });
  };

  handleFileChange = (e) => {
    this.setState({
      outputFile: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { year, month, outputFile } = this.state;

    if (!year || !month) {
      alert("لطفاً سال و ماه را انتخاب کنید.");
      return;
    }

    if (outputFile !== "excel") {
      alert("در حال حاضر فقط خروجی Excel فعال است.");
      return;
    }

    if (!/^\d{4}$/.test(year)) {
      alert("لطفاً سال را به صورت صحیح وارد کنید.");
      return;
    }

    const jalaliYear = Number(year);
    const monthNumber = Number(month);

    if (jalaliYear < 1300 || jalaliYear > 1500) {
      alert("لطفاً سال شمسی معتبر وارد کنید.");
      return;
    }

    const paddedMonth = String(monthNumber).padStart(2, "0");

    /*
     * ==============================
     * تاریخ شروع
     * ==============================
     */

    const jalaliStart = `${year}/${paddedMonth}/01`;

    const start = moment(
      jalaliStart,
      "jYYYY/jMM/jDD"
    ).format("YYYY/MM/DD");

    /*
     * ==============================
     * تعیین آخرین روز ماه
     * ==============================
     */

    let lastDay;

    if (monthNumber <= 6) {
      lastDay = 31;
    } else if (monthNumber <= 11) {
      lastDay = 30;
    } else {
      lastDay = moment.jIsLeapYear(jalaliYear) ? 30 : 29;
    }

    /*
     * ==============================
     * تاریخ پایان
     * ==============================
     */

    const jalaliEnd = `${year}/${paddedMonth}/${lastDay}`;

    const end = moment(
      jalaliEnd,
      "jYYYY/jMM/jDD"
    ).format("YYYY/MM/DD");

    /*
     * ==============================
     * لاگ
     * ==============================
     */

    console.log("JALALI START:", jalaliStart);
    console.log("JALALI END:", jalaliEnd);

    console.log("MILADI START:", start);
    console.log("MILADI END:", `${end} 23:59:59`);

    /*
     * ==============================
     * درخواست API
     * ==============================
     */

    const token = localStorage.getItem("token");

    this.setState({
      loading: true,
    });

    const url = `${API_URL}/excel?start=${encodeURIComponent(
      start
    )}&end=${encodeURIComponent(`${end} 23:59:59`)}`;

    console.log("EXCEL URL:", url);

    fetch(url, {
      method: "GET",

      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();

          console.error("SERVER ERROR:", errorText);

          throw new Error("خطا در دریافت فایل گزارش");
        }

        return response.blob();
      })

      .then((blob) => {
        console.log("FILE TYPE:", blob.type);
        console.log("FILE SIZE:", blob.size);

        /*
         * اگر سرور به جای Excel، JSON یا HTML
         * برگرداند، فایل خراب دانلود نکنیم.
         */

        if (
          blob.type.includes("application/json") ||
          blob.type.includes("text/html")
        ) {
          throw new Error(
            "سرور فایل Excel معتبر برنگردانده است."
          );
        }

        /*
         * ساخت فایل موقت
         */

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = `requests-${year}-${paddedMonth}.xlsx`;

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

        this.setState({
          loading: false,
        });
      })

      .catch((error) => {
        console.error("EXCEL ERROR:", error);

        this.setState({
          loading: false,
        });

        alert(
          error.message ||
            "دریافت فایل گزارش با خطا مواجه شد."
        );
      });
  };

  render() {
    const {
      year,
      month,
      outputFile,
      loading,
    } = this.state;

    return (
      <div>
        <div className="container px-3 pt-4 pb-5">

          <h1 className="fs-6 fw-semibold text-dark text-center mb-4">
            گزارش درخواست ها
          </h1>

          <form onSubmit={this.handleSubmit}>

            {/* سال */}
            <div className="d-flex align-items-center justify-content-between gap-2 border rounded-3 px-3 py-3 mb-3 bg-white">

              <FaRegClock
                className="text-secondary"
                size={18}
              />

              <input
                type="tel"
                inputMode="numeric"
                maxLength={4}
                placeholder="سال (مثال 1405)"
                value={year}
                onChange={this.handleYearChange}
                className="form-control border-0 shadow-none text-end p-0"
              />

            </div>

            {/* ماه */}
            <div className="d-flex align-items-center justify-content-between gap-2 border rounded-3 px-3 py-3 mb-3 bg-white">

              <FaRegClock
                className="text-secondary"
                size={18}
              />

              <select
                value={month}
                onChange={this.handleMonthChange}
                className="form-select border-0 bg-transparent text-end shadow-none flex-grow-1"
              >
                <option value="">
                  ماه
                </option>

                {PERSIAN_MONTHS.map((m, idx) => (
                  <option
                    key={m}
                    value={idx + 1}
                  >
                    {m}
                  </option>
                ))}
              </select>

              <FaChevronDown
                className="text-secondary"
                size={12}
              />

            </div>

            {/* فایل خروجی */}
            <div className="d-flex align-items-center justify-content-between gap-2 border rounded-3 px-3 py-3 mb-4 bg-white">

              <FaFileAlt
                className="text-secondary"
                size={18}
              />

              <select
                value={outputFile}
                onChange={this.handleFileChange}
                className="form-select border-0 bg-transparent text-end shadow-none flex-grow-1"
              >
                <option value="">
                  انتخاب فایل خروجی...
                </option>

                <option value="excel">
                  Excel
                </option>

                <option value="pdf">
                  PDF
                </option>

                <option value="csv">
                  CSV
                </option>
              </select>

            </div>

            {/* دکمه */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 rounded-3 py-3"
              style={{
                transition: "opacity 0.15s ease",
              }}
            >
              {loading
                ? "در حال دریافت فایل..."
                : "دریافت گزارش"}
            </button>

          </form>
        </div>
      </div>
    );
  }
}

export default RequestsReportForm;
