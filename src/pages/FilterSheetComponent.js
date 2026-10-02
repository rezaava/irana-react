import React from "react";
import {
  FaMapMarkerAlt,
  FaTh,
  FaTimes,
} from "react-icons/fa";

const API_URL = "https://iranaserviceapp.ir/test/api";

function SelectField({
  icon,
  placeholder,
  value,
  onChange,
  options,
  disabled,
}) {
  return (
    <div className="d-flex align-items-center justify-content-between gap-2 border rounded-3 px-3 py-3 mb-3 bg-white">

      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="form-select border-0 bg-transparent text-end shadow-none flex-grow-1"
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
          >
            {opt.label}
          </option>
        ))}
      </select>

      {icon}

    </div>
  );
}

class FilterSheet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      animateIn: false,

      provinces: [],
      cities: [],
      specialties: [],

      loadingProvinces: false,
      loadingCities: false,
      loadingSpecialties: false,
    };
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.setState({
        animateIn: true,
      });
    });

    this.getProvinces();
    this.getSpecialties();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.province !==
      this.props.province
    ) {
      if (this.props.province) {
        this.getCities(
          this.props.province
        );
      } else {
        this.setState({
          cities: [],
        });
      }
    }
  }

  // =====================================================
  // استان‌ها
  // =====================================================

  getProvinces = () => {
    this.setState({
      loadingProvinces: true,
    });

    fetch(`${API_URL}/cities`, {
      method: "GET",

      headers: {
        Accept:
          "application/json",
      },
    })
      .then((response) =>
        response.json()
      )
      .then((data) => {
        console.log(
          "PROVINCES API:",
          data
        );

        let provinces = [];

        if (
          Array.isArray(
            data.states
          )
        ) {
          provinces =
            data.states;
        } else if (
          Array.isArray(
            data.provinces
          )
        ) {
          provinces =
            data.provinces;
        } else if (
          Array.isArray(
            data.data
          )
        ) {
          provinces =
            data.data;
        }

        this.setState({
          provinces,
          loadingProvinces: false,
        });
      })
      .catch((error) => {
        console.error(
          "GET PROVINCES ERROR:",
          error
        );

        this.setState({
          provinces: [],
          loadingProvinces: false,
        });
      });
  };

  // =====================================================
  // شهرها
  // =====================================================

  getCities = (provinceId) => {
    if (!provinceId) {
      this.setState({
        cities: [],
      });

      return;
    }

    this.setState({
      loadingCities: true,
    });

    fetch(
      `${API_URL}/cities?id=${encodeURIComponent(
        provinceId
      )}`,
      {
        method: "GET",

        headers: {
          Accept:
            "application/json",
        },
      }
    )
      .then((response) =>
        response.json()
      )
      .then((data) => {
        console.log(
          "CITIES API:",
          data
        );

        let cities = [];

        if (
          Array.isArray(
            data.cities
          )
        ) {
          cities =
            data.cities;
        } else if (
          Array.isArray(
            data.city
          )
        ) {
          cities =
            data.city;
        } else if (
          Array.isArray(
            data.data
          )
        ) {
          cities =
            data.data;
        }

        this.setState({
          cities,
          loadingCities: false,
        });
      })
      .catch((error) => {
        console.error(
          "GET CITIES ERROR:",
          error
        );

        this.setState({
          cities: [],
          loadingCities: false,
        });
      });
  };

  // =====================================================
  // تخصص‌ها
  // =====================================================

  getSpecialties = () => {
    const token =
      localStorage.getItem(
        "token"
      );

    this.setState({
      loadingSpecialties: true,
    });

    fetch(
      `${API_URL}/specials`,
      {
        method: "GET",

        headers: {
          Accept:
            "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) =>
        response.json()
      )
      .then((data) => {
        console.log(
          "SPECIALS API:",
          data
        );

        let specialties = [];

        if (
          Array.isArray(
            data.specials
          )
        ) {
          specialties =
            data.specials;
        } else if (
          Array.isArray(
            data.special
          )
        ) {
          specialties =
            data.special;
        } else if (
          Array.isArray(
            data.data
          )
        ) {
          specialties =
            data.data;
        }

        this.setState({
          specialties,
          loadingSpecialties: false,
        });
      })
      .catch((error) => {
        console.error(
          "GET SPECIALS ERROR:",
          error
        );

        this.setState({
          specialties: [],
          loadingSpecialties: false,
        });
      });
  };

  // =====================================================
  // Render
  // =====================================================

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

    const {
      animateIn,
      provinces,
      cities,
      specialties,
      loadingProvinces,
      loadingCities,
      loadingSpecialties,
    } = this.state;

    if (!isOpen) {
      return null;
    }

    // =====================================================
    // استان‌ها
    // =====================================================

    const provinceOptions =
      provinces.map((item) => ({
        value: item.id,
        label:
          item.name ||
          item.title ||
          item.text ||
          "",
      }));

    // =====================================================
    // شهرها
    // =====================================================

    const cityOptions =
      cities.map((item) => ({
        value: item.id,
        label:
          item.name ||
          item.title ||
          item.text ||
          "",
      }));

    // =====================================================
    // تخصص‌ها
    // =====================================================

    const specialtyOptions =
      specialties.map((item) => ({
        value:
          item.id ||
          item.special_id ||
          item.value,

        label:
          item.name ||
          item.title ||
          item.text ||
          "",
      }));

    return (
      <div dir="rtl">

        {/* =========================================
            Overlay
        ========================================= */}

        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background:
              "rgba(0,0,0,0.5)",
            zIndex: 1040,
            opacity: animateIn
              ? 1
              : 0,
            transition:
              "opacity 0.3s ease",
          }}
          onClick={onClose}
        />

        {/* =========================================
            Filter Sheet
        ========================================= */}

        <div
          className="position-fixed bottom-0 start-0 w-100 bg-white rounded-top-4 px-3 pt-3 pb-4"
          style={{
            zIndex: 1050,
            maxWidth: 480,
            margin: "0 auto",
            right: 0,

            transform: animateIn
              ? "translateY(0)"
              : "translateY(100%)",

            transition:
              "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",

            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >

          {/* بستن */}

          <div className="d-flex justify-content-start mb-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{
                width: 36,
                height: 36,
              }}
            >
              <FaTimes size={14} />
            </button>
          </div>

          {/* استان */}

          <SelectField
            placeholder={
              loadingProvinces
                ? "در حال دریافت استان‌ها..."
                : "استان"
            }
            value={province}
            onChange={
              onProvinceChange
            }
            disabled={
              loadingProvinces
            }
            icon={
              <FaMapMarkerAlt
                className="text-secondary"
                size={16}
              />
            }
            options={
              provinceOptions
            }
          />

          {/* شهر */}

          <SelectField
            placeholder={
              !province
                ? "ابتدا استان را انتخاب کنید"
                : loadingCities
                ? "در حال دریافت شهرها..."
                : "شهر"
            }
            value={city}
            onChange={
              onCityChange
            }
            disabled={
              !province ||
              loadingCities
            }
            icon={
              <FaMapMarkerAlt
                className="text-secondary"
                size={16}
              />
            }
            options={
              cityOptions
            }
          />

          {/* تخصص */}

          <SelectField
            placeholder={
              loadingSpecialties
                ? "در حال دریافت تخصص‌ها..."
                : "تخصص"
            }
            value={specialty}
            onChange={
              onSpecialtyChange
            }
            disabled={
              loadingSpecialties
            }
            icon={
              <FaTh
                className="text-secondary"
                size={16}
              />
            }
            options={
              specialtyOptions
            }
          />

          {/* اعمال */}

          <button
            type="button"
            onClick={onApply}
            className="btn btn-primary w-100 rounded-3 py-3 mt-2"
          >
            اعمال فیلتر
          </button>

        </div>
      </div>
    );
  }
}

export default FilterSheet;