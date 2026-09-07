import React from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaTrashAlt } from "react-icons/fa";

const API_URL = "https://iranaserviceapp.ir/test/api";

class NotificationCard extends React.Component {
  handleDelete = () => {
    const { notification, onDelete } = this.props;

    const token = localStorage.getItem("token");

    fetch(`${API_URL}/ano/del/${notification.id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("DELETE ANO:", data);

        // بعد از دریافت جواب API
        if (onDelete) {
          onDelete(notification.id);
        }
      })
      .catch((error) => {
        console.error("DELETE ANO ERROR:", error);
      });
  };

  render() {
    const {
      notification,
      detailsPathPrefix = "/notifications",
    } = this.props;

    return (
      <div
        className="border rounded-4 overflow-hidden bg-white mb-4"
        style={{ transition: "box-shadow 0.15s ease" }}
      >
        <img
          src={`https://iranaserviceapp.ir/test/${notification.file}`}
          alt={notification.title}
          className="w-100"
          style={{
            height: 240,
            objectFit: "cover",
          }}
        />

        <div className="p-3">

          <h3 className="fs-6 fw-semibold text-dark text-end mb-2">
            {notification.title}
          </h3>

          <p
            className="text-muted small text-end mb-3"
            style={{
              lineHeight: 1.9,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {notification.excerpt || notification.text}
          </p>

          <div className="d-flex align-items-center justify-content-between">

            <Link
              to={`${detailsPathPrefix}/${notification.id}`}
              className="d-flex align-items-center gap-1 text-decoration-none text-primary"
            >
              <FaChevronLeft size={12} />
              <span>دیدن جزئیات</span>
            </Link>

            <button
              type="button"
              onClick={this.handleDelete}
              className="btn btn-light border-0 p-1 d-inline-flex align-items-center justify-content-center"
              title="حذف اطلاعیه"
            >
              <FaTrashAlt
                style={{ color: "#f08a72" }}
                size={17}
              />
            </button>

          </div>
        </div>
      </div>
    );
  }
}

export default NotificationCard;