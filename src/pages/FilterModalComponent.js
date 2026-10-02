import React from "react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const API_URL = "https://iranaserviceapp.ir/test/api";

class FilterModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      animateIn: false,
      provinces: [],
      loadingProvinces: false,
    };
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.setState({
        animateIn: true,
      });
    });

    this.getProvinces();
  }

  getProvinces = () => {
    this.setState({
      loadingProvinces: true,
    });

    const token = localStorage.getItem("token");

    fetch(`${API_URL}/cities`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("خطا در دریافت استان‌ها");
        }

        return response.json();
      })
      .then((data) => {
        console.log("PROVINCES API:", data);

        let provinces = [];

        if (Array.isArray(data.states)) {
          provinces = data.states;
        } else if (Array.isArray(data.provinces)) {
          provinces = data.provinces;
        } else if (Array.isArray(data.data)) {
          provinces = data.data;
        }

        this.setState({
          provinces,
          loadingProvinces: false,
        });
      })
      .catch((error) => {
        console.error("GET PROVINCES ERROR:", error);

        this.setState({
          provinces: [],
          loadingProvinces: false,
        });
      });
  };

  render() {
    const {
      isOpen,
      onClose,
      onApply,
      province,
      startDate,
      endDate,
      onProvinceChange,
      onStartDateChange,
      onEndDateChange,
    } = this.props;

    const {
      animateIn,
      provinces,
      loadingProvinces,
    } = this.state;

    if (!isOpen) {
      return null;
    }

    return (
      <div dir="rtl">
        <div
          onClick={onClose}
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: "rgba(0, 0, 0, .45)",
            zIndex: 1040,
            opacity: animateIn ? 1 : 0,
            transition: "opacity .35s ease",
          }}
        />

        <div
          className="position-fixed bottom-0 bg-white rounded-top-4 px-3 pt-3 pb-4"
          style={{
            zIndex: 1050,
            width: "100%",
            maxWidth: "480px",
            left: "50%",
            transform: animateIn
              ? "translate(-50%, 0)"
              : "translate(-50%, 100%)",
            transition:
              "transform .4s cubic-bezier(.22,1,.36,1)",
            boxShadow:
              "0 -8px 30px rgba(0,0,0,.12)",
          }}
        >
          <div className="d-flex justify-content-start mb-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "38px",
                height: "38px",
              }}
            >
              <FaTimes size={15} />
            </button>
          </div>

          <div
            className="d-flex align-items-center gap-2 border rounded-3 px-3 mb-3 bg-white"
            style={{
              height: "58px",
            }}
          >
            <select
              value={province}
              onChange={onProvinceChange}
              disabled={loadingProvinces}
              className="form-select border-0 bg-transparent shadow-none text-end flex-grow-1"
              style={{
                fontSize: "14px",
              }}
            >
              <option value="">
                {loadingProvinces
                  ? "در حال دریافت استان‌ها..."
                  : "استان"}
              </option>

              {provinces.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>

            <FaMapMarkerAlt
              size={17}
              className="text-secondary"
            />
          </div>

          <div
            className="d-flex align-items-center gap-2 border rounded-3 px-3 mb-3 bg-white"
            style={{
              minHeight: "58px",
            }}
          >
            <DatePicker
              value={startDate || ""}
              onChange={onStartDateChange}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/MM/DD"
              calendarPosition="bottom-right"
              placeholder="از تاریخ"
              inputClass="form-control border-0 shadow-none bg-transparent text-end"
              style={{
                width: "100%",
                height: "42px",
                border: "none",
                boxShadow: "none",
                fontSize: "14px",
                textAlign: "right",
              }}
            />

            <FaCalendarAlt
              size={17}
              className="text-secondary"
            />
          </div>

          <div
            className="d-flex align-items-center gap-2 border rounded-3 px-3 mb-3 bg-white"
            style={{
              minHeight: "58px",
            }}
          >
            <DatePicker
              value={endDate || ""}
              onChange={onEndDateChange}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/MM/DD"
              calendarPosition="bottom-right"
              placeholder="تا تاریخ"
              inputClass="form-control border-0 shadow-none bg-transparent text-end"
              style={{
                width: "100%",
                height: "42px",
                border: "none",
                boxShadow: "none",
                fontSize: "14px",
                textAlign: "right",
              }}
            />

            <FaCalendarAlt
              size={17}
              className="text-secondary"
            />
          </div>

          <button
            type="button"
            onClick={onApply}
            className="btn btn-primary w-100 rounded-3 mt-2"
            style={{
              height: "56px",
              border: "none",
              background: "#5d4ab3",
            }}
          >
            اعمال فیلتر
          </button>
        </div>
      </div>
    );
  }
}

export default FilterModal;