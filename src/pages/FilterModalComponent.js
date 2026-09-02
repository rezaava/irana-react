import React from "react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";

class FilterModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      animateIn: false,
    };
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.setState({
        animateIn: true,
      });
    });
  }

  renderField = ({
    icon,
    type = "text",
    value,
    onChange,
    placeholder,
    children,
  }) => {
    return (
      <div
        className="d-flex align-items-center gap-2 border rounded-3 px-3 mb-3 bg-white"
        style={{
          height: "58px",
          transition:
            "border-color .25s ease, box-shadow .25s ease",
        }}
      >
        {type === "select" ? (
          <select
            value={value}
            onChange={onChange}
            className="form-select border-0 bg-transparent shadow-none text-end flex-grow-1"
            style={{
              fontSize: "14px",
            }}
          >
            {children}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="form-control border-0 bg-transparent shadow-none text-end flex-grow-1"
            style={{
              fontSize: "14px",
            }}
          />
        )}

        {icon}
      </div>
    );
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

    const { animateIn } = this.state;

    if (!isOpen) {
      return null;
    }

    return (
      <div dir="rtl">
        {/* Overlay */}
        <div
          onClick={onClose}
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: "rgba(0, 0, 0, .45)",
            zIndex: 1040,
            opacity: animateIn ? 1 : 0,
            transition:
              "opacity .35s ease",
          }}
        />

        {/* Bottom Sheet */}
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
          {/* Header */}
          <div className="d-flex justify-content-start mb-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "38px",
                height: "38px",
                transition:
                  "transform .2s ease, background .2s ease",
              }}
            >
              <FaTimes size={15} />
            </button>
          </div>

          {/* استان */}
          {this.renderField({
            type: "select",
            value: province,
            onChange: onProvinceChange,
            icon: (
              <FaMapMarkerAlt
                size={17}
                className="text-secondary"
              />
            ),
            children: (
              <>
                <option value="">
                  استان
                </option>

                <option value="tehran">
                  تهران
                </option>

                <option value="isfahan">
                  اصفهان
                </option>

                <option value="yazd">
                  یزد
                </option>

                <option value="fars">
                  فارس
                </option>

                <option value="kerman">
                  کرمان
                </option>

                <option value="mazandaran">
                  مازندران
                </option>
              </>
            ),
          })}

          {/* تاریخ شروع */}
          {this.renderField({
            type: "date",
            value: startDate,
            onChange: onStartDateChange,
            icon: (
              <FaCalendarAlt
                size={17}
                className="text-secondary"
              />
            ),
          })}

          {/* تاریخ انتهایی */}
          {this.renderField({
            type: "date",
            value: endDate,
            onChange: onEndDateChange,
            icon: (
              <FaCalendarAlt
                size={17}
                className="text-secondary"
              />
            ),
          })}

          {/* Apply */}
          <button
            type="button"
            onClick={onApply}
            className="btn btn-primary w-100 rounded-3 mt-2"
            style={{
              height: "56px",
              border: "none",
              background: "#5d4ab3",
              transition:
                "transform .2s ease, box-shadow .2s ease",
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