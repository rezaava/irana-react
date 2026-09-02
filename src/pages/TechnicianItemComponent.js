import React from "react";
import {
  FaChevronDown,
  FaTrashAlt,
  FaCheckCircle,
  FaLock,
  FaThLarge,
} from "react-icons/fa";
import { Link } from "react-router-dom";

// TODO: این تابع بعداً باید به API واقعی وصل بشه
// مثال:
// async function updateTechnicianStatusApi(id, newStatus) {
//   const res = await fetch(`/api/technicians/${id}/status`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ status: newStatus }),
//   });
//   return res.json();
// }

// آیتم تکی لیست تعمیرکاران
// props:
//   technician: { id, name, status: 'blocked' | 'free', avatar }
//   onDelete(id)
//   onToggleStatus(id, currentStatus)  -> والد مسئول تغییر واقعی/فراخوانی API است
//   onDetails(id)
class TechnicianItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.toggleOpen = this.toggleOpen.bind(this);
    this.handleToggleStatus = this.handleToggleStatus.bind(this);
  }

  toggleOpen() {
    this.setState((prev) => ({ open: !prev.open }));
  }

  handleToggleStatus() {
    const { technician, onToggleStatus } = this.props;
    if (onToggleStatus) {
      onToggleStatus(technician.id, technician.status);
    }
  }

  render() {
    const { technician, onDelete, onDetails } = this.props;
    const { open } = this.state;
    const isBlocked = technician.status === "blocked";

    return (
      <div className="border-bottom" dir="rtl">
        <div
          className="d-flex align-items-center justify-content-between py-3 px-2"
          style={{ cursor: "pointer" }}
          onClick={this.toggleOpen}
        >
          <div className="d-flex align-items-center gap-3">
            <img
              src={technician.avatar}
              alt={technician.name}
              width="40"
              height="40"
              className="rounded-circle"
              style={{ objectFit: "cover" }}
            />
            <span className="fw-semibold text-dark">{technician.name}</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className={isBlocked ? "text-danger" : "text-success"}>
              {isBlocked ? "مسدود" : "آزاد"}
            </span>
            <FaChevronDown
              className="text-secondary"
              size={14}
              style={{
                transition: "transform 0.3s ease",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>
        </div>

        {/* اکشن‌ها با انیمیشن نرم باز و بسته می‌شوند */}
        <div
          style={{
            maxHeight: open ? 140 : 0,
            opacity: open ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.35s ease, opacity 0.25s ease",
          }}
        >
          <div className="d-flex gap-2 px-2 pb-3 pt-1">
            <button
              type="button"
              className="btn btn-light border rounded-3 flex-fill d-flex flex-column align-items-center py-3"
              style={{ transition: "transform 0.15s ease, box-shadow 0.15s ease" }}
              onClick={() => onDelete && onDelete(technician.id)}
            >
              <FaTrashAlt className="text-danger mb-1" size={18} />
              <span className="text-danger small">حذف</span>
            </button>

            <button
              type="button"
              className="btn btn-light border rounded-3 flex-fill d-flex flex-column align-items-center py-3"
              style={{ transition: "transform 0.15s ease, box-shadow 0.15s ease" }}
              onClick={this.handleToggleStatus}
            >
              {isBlocked ? (
                <>
                  <FaCheckCircle className="text-success mb-1" size={18} />
                  <span className="text-success small">آزاد</span>
                </>
              ) : (
                <>
                  <FaLock className="text-danger mb-1" size={18} />
                  <span className="text-danger small">مسدود</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="btn btn-light border rounded-3 flex-fill d-flex flex-column align-items-center py-3"
              style={{ transition: "transform 0.15s ease, box-shadow 0.15s ease" }}
              onClick={() => onDetails && onDetails(technician.id)}
            >
              <FaThLarge className="text-primary mb-1" size={18} />
              <Link to={`/profile`} className="text-decoration-none text-dark d-block">
                <span className="text-center small">
                  جزئیات
                </span>
              </Link>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default TechnicianItem;