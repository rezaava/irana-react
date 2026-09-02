import React from "react";
import { FaMapMarkerAlt, FaTh, FaTimes } from "react-icons/fa";

// یک ردیف سلکت با آیکون سمت راست — تابع ساده، نه کلاس
// (که باعث بشه دو تا کلاس تو یک فایل نداشته باشیم)
function SelectField({ icon, placeholder, value, onChange, options }) {
  return (
    <div className="d-flex align-items-center justify-content-between gap-2 border rounded-3 px-3 py-3 mb-3 bg-white">
      <select
        value={value}
        onChange={onChange}
        className="form-select border-0 bg-transparent text-end shadow-none flex-grow-1"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {icon}
    </div>
  );
}

// شیت پایین فیلتر — کامپوننت مستقل
// props:
//   isOpen: bool
//   onClose: fn
//   onApply: fn
//   province, city, specialty: مقادیر انتخاب‌شده
//   onProvinceChange, onCityChange, onSpecialtyChange: fn(e)
class FilterSheet extends React.Component {
  constructor(props) {
    super(props);
    // برای انیمیشنِ ورود نرم، یک تیک بعد از مونت شدن state رو تغییر می‌دیم
    this.state = { animateIn: false };
  }

  componentDidMount() {
    // فریم بعدی تا ترنزیشن CSS واقعاً اجرا بشه
    requestAnimationFrame(() => {
      this.setState({ animateIn: true });
    });
  }

  render() {
    const {
      isOpen,
      onClose,
      onApply,
      province,
      city,
      specialty,
      onProvinceChange,
      onCityChange,
      onSpecialtyChange,
    } = this.props;
    const { animateIn } = this.state;

    if (!isOpen) return null;

    return (
      <div dir="rtl">
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: "rgba(0,0,0,0.5)",
            zIndex: 1040,
            opacity: animateIn ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
          onClick={onClose}
        />
        <div
          className="position-fixed bottom-0 start-0 w-100 bg-white rounded-top-4 px-3 pt-3 pb-4"
          style={{
            zIndex: 1050,
            maxWidth: 480,
            margin: "0 auto",
            right: 0,
            transform: animateIn ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div className="d-flex justify-content-start mb-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36, transition: "background-color 0.15s ease" }}
            >
              <FaTimes size={14} />
            </button>
          </div>

          <SelectField
            placeholder="استان"
            value={province}
            onChange={onProvinceChange}
            icon={<FaMapMarkerAlt className="text-secondary" size={16} />}
            options={[
              { value: "tehran", label: "تهران" },
              { value: "isfahan", label: "اصفهان" },
              { value: "fars", label: "فارس" },
            ]}
          />

          <SelectField
            placeholder="شهر"
            value={city}
            onChange={onCityChange}
            icon={<FaMapMarkerAlt className="text-secondary" size={16} />}
            options={[
              { value: "tehran-city", label: "تهران" },
              { value: "karaj", label: "کرج" },
              { value: "shiraz", label: "شیراز" },
            ]}
          />

          <SelectField
            placeholder="تخصص"
            value={specialty}
            onChange={onSpecialtyChange}
            icon={<FaTh className="text-secondary" size={16} />}
            options={[
              { value: "washer", label: "ماشین لباسشویی" },
              { value: "fridge", label: "یخچال" },
              { value: "ac", label: "کولر گازی" },
            ]}
          />

          <button
            type="button"
            onClick={onApply}
            className="btn btn-primary w-100 rounded-3 py-3 mt-2"
            style={{ transition: "transform 0.15s ease, box-shadow 0.15s ease" }}
          >
            اعمال فیلتر
          </button>
        </div>
      </div>
    );
  }
}

export default FilterSheet;