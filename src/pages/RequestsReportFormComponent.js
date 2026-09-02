import React from "react";
import { FaRegClock, FaChevronDown, FaFileAlt } from "react-icons/fa";

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

// فرم دریافت گزارش درخواست‌ها
class RequestsReportForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: "",
      month: "",
      outputFile: "",
    };

    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleYearChange(e) {
    this.setState({ year: e.target.value });
  }

  handleMonthChange(e) {
    this.setState({ month: e.target.value });
  }

  handleFileChange(e) {
    this.setState({ outputFile: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    // TODO: اینجا باید درخواست به API برای دریافت گزارش ارسال بشه
    // مثال:
    // const { year, month, outputFile } = this.state;
    // api.getRequestsReport({ year, month, outputFile });
  }

  render() {
    const { year, month, outputFile } = this.state;

    return (
      <div>
        <div className="container px-3 pt-4 pb-5">
          <h1 className="fs-6 fw-semibold text-dark text-center mb-4">
            گزارش درخواست ها
          </h1>

          <form onSubmit={this.handleSubmit}>
            {/* سال */}
            <div className="d-flex align-items-center justify-content-between gap-2 border rounded-3 px-3 py-3 mb-3 bg-white">
              <FaRegClock className="text-secondary" size={18} />
              <input
                type="text"
                inputMode="numeric"
                placeholder="سال (مثال 1401)"
                value={year}
                onChange={this.handleYearChange}
                className="form-control border-0 shadow-none text-end p-0"
              />
            </div>

            {/* ماه */}
            <div className="d-flex align-items-center justify-content-between gap-2 border rounded-3 px-3 py-3 mb-3 bg-white">
              <FaRegClock className="text-secondary" size={18} />
              <select
                value={month}
                onChange={this.handleMonthChange}
                className="form-select border-0 bg-transparent text-end shadow-none flex-grow-1"
              >
                <option value="">ماه</option>
                {PERSIAN_MONTHS.map((m, idx) => (
                  <option key={m} value={idx + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <FaChevronDown className="text-secondary" size={12} />
            </div>

            {/* انتخاب فایل خروجی */}
            <div className="d-flex align-items-center justify-content-between gap-2 border rounded-3 px-3 py-3 mb-4 bg-white">
              <FaFileAlt className="text-secondary" size={18} />
              <select
                value={outputFile}
                onChange={this.handleFileChange}
                className="form-select border-0 bg-transparent text-end shadow-none flex-grow-1"
              >
                <option value="">انتخاب فایل خروجی...</option>
                <option value="excel">Excel</option>
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 rounded-3 py-3"
              style={{ transition: "opacity 0.15s ease" }}
            >
              دریافت گزارش
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default RequestsReportForm;