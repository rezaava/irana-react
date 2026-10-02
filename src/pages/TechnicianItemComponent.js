import React from "react";
import {
  FaChevronDown,
  FaTrashAlt,
  FaCheckCircle,
  FaLock,
  FaThLarge,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const IMAGE_URL = "https://iranaserviceapp.ir/test/files/user";

class TechnicianItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  toggleOpen = () => {
    this.setState((prevState) => ({
      open: !prevState.open,
    }));
  };

  handleToggleStatus = () => {
    const { technician, onToggleStatus } = this.props;

    if (onToggleStatus) {
      onToggleStatus(technician.id);
    }
  };

  render() {
    const {
      technician,
      onDelete,
    } = this.props;

    const { open } = this.state;

    const fullName = `${technician.name || ""} ${
      technician.family || ""
    }`.trim();

    /*
     * active = 1 => آزاد
     * active != 1 => مسدود
     */
    const isBlocked = Number(technician.active) !== 1;

    /*
     * اگر image خالی باشد آواتار تولید می‌کنیم
     */
    const avatar = technician.image
      ? `${IMAGE_URL}${technician.image}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          fullName
        )}&background=e9ecef&color=495057`;

    return (
      <div className="border-bottom" dir="rtl">

        {/* ================= Header ================= */}

        <div
          className="d-flex align-items-center justify-content-between py-3 px-2"
          style={{ cursor: "pointer" }}
          onClick={this.toggleOpen}
        >
          <div className="d-flex align-items-center gap-3">

            <img
              src={avatar}
              alt={fullName}
              width="40"
              loading="lazy"
              height="40"
              className="rounded-circle"
              style={{
                objectFit: "cover",
              }}
            />

            <span className="fw-semibold text-dark">
              {fullName || "بدون نام"}
            </span>

          </div>

          <div className="d-flex align-items-center gap-2">

            <span
              className={
                isBlocked
                  ? "text-danger"
                  : "text-success"
              }
            >
              {isBlocked ? "مسدود" : "آزاد"}
            </span>

            <FaChevronDown
              className="text-secondary"
              size={14}
              style={{
                transition: "transform 0.3s ease",
                transform: open
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
              }}
            />

          </div>
        </div>

        {/* ================= Actions ================= */}

        <div
          style={{
            maxHeight: open ? 140 : 0,
            opacity: open ? 1 : 0,
            overflow: "hidden",
            transition:
              "max-height 0.35s ease, opacity 0.25s ease",
          }}
        >
          <div className="d-flex gap-2 px-2 pb-3 pt-1">

            {/* ================= حذف ================= */}

            <button
              type="button"
              className="btn btn-light border rounded-3 flex-fill d-flex flex-column align-items-center py-3"
              onClick={(e) => {
                e.stopPropagation();

                if (onDelete) {
                  onDelete(technician.id);
                }
              }}
            >
              <FaTrashAlt
                className="text-danger mb-1"
                size={18}
              />

              <span className="text-danger small">
                حذف
              </span>
            </button>

            {/* ================= وضعیت ================= */}

            <button
              type="button"
              className="btn btn-light border rounded-3 flex-fill d-flex flex-column align-items-center py-3"
              onClick={(e) => {
                e.stopPropagation();

                this.handleToggleStatus();
              }}
            >
              {isBlocked ? (
                <>
                  <FaCheckCircle
                    className="text-success mb-1"
                    size={18}
                  />

                  <span className="text-success small">
                    آزاد
                  </span>
                </>
              ) : (
                <>
                  <FaLock
                    className="text-danger mb-1"
                    size={18}
                  />

                  <span className="text-danger small">
                    مسدود
                  </span>
                </>
              )}
            </button>

            {/* ================= جزئیات ================= */}

            <Link
              to={`/profile/${technician.id}`}
              className="btn btn-light border rounded-3 flex-fill d-flex flex-column align-items-center justify-content-center py-3 text-decoration-none"

            >
              <FaThLarge
                className="text-primary mb-1"
                size={18}
              />

              <span className="text-primary small">
                جزئیات
              </span>
            </Link>

          </div>
        </div>

      </div>
    );
  }
}

export default TechnicianItem;