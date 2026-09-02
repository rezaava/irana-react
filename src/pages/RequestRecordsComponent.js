import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

class RequestRecords extends React.Component {
  renderList = () => {
    const { records } = this.props;

    if (!records.length) {
      return this.renderEmpty();
    }

    return (
      <div
        className="bg-white rounded-4 overflow-hidden"
        style={{
          border: "1px solid #f2f2f2",
          animation:
            "recordsFade .4s ease",
        }}
      >
        {/* Header */}
        <div
          className="d-grid text-center py-4"
          style={{
            gridTemplateColumns:
              "1.2fr 1.2fr 1.2fr 1.2fr",
            background: "#f5f5f5",
            color: "#4e3c9b",
            fontSize: "14px",
          }}
        >
          <div>نام مشتری</div>
          <div>نوع دستگاه</div>
          <div>ایراد دستگاه</div>
          <div>برند دستگاه</div>
        </div>

        {records.map((record, index) => (
          <Link
            key={record.id}
            to={`/request-details/${record.id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
            }}
          >
            <div
              className="d-grid text-center align-items-center"
              style={{
                gridTemplateColumns: "1.2fr 1.2fr 1.2fr 1.2fr",
                minHeight: "78px",
                borderBottom:
                  index !== records.length - 1
                    ? "1px solid #f4f4f4"
                    : "none",
                fontSize: "14px",
                transition: "background .25s ease",
              }}
            >
              <div>{record.customerName}</div>
              <div>{record.deviceType}</div>
              <div>{record.deviceBrand}</div>
              <div>{record.technician}</div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  renderCard = (record, index) => {
    return (
      <div
        key={record.id}
        className="bg-white rounded-4 p-3"
        style={{
          border: "1px solid #eeeeee",
          boxShadow:
            "0 2px 6px rgba(0,0,0,.08)",
          animation:
            `cardFade .4s ease ${index * 0.06}s both`,
          transition:
            "transform .25s ease, box-shadow .25s ease",
        }}
      >
        {/* Customer / technician */}
        <div
          className="d-flex justify-content-between align-items-center mb-3"
        >
          <div>
            <strong
              style={{
                fontSize: "15px",
              }}
            >
              تعمیرکار
            </strong>
          </div>

          <div
            style={{
              fontSize: "14px",
            }}
          >
            {record.technician}
          </div>
        </div>

        {/* Device type */}
        <div
          className="d-flex justify-content-between align-items-center mb-3"
        >
          <strong
            style={{
              fontSize: "14px",
            }}
          >
            نوع دستگاه
          </strong>

          <span
            style={{
              fontSize: "14px",
            }}
          >
            {record.deviceType}
          </span>
        </div>

        {/* Problem */}
        <div
          className="d-flex justify-content-between align-items-center mb-3"
        >
          <strong
            style={{
              fontSize: "14px",
            }}
          >
            ایراد دستگاه
          </strong>

          <span
            style={{
              fontSize: "14px",
            }}
          >
            {record.deviceBrand}
          </span>
        </div>
        <Link
          type="button"
          className="btn w-100 rounded-pill"
          style={{
            height: "50px",
            color: "#6389c8",
            border:
              "1px solid #6389c8",
            background: "#fff",
            transition:
              "all .25s ease",
          }}
          to={`/request-details/1`}
          >
            دیدن جزئیات
        </Link>
      </div>
    );
  };

  renderCards = () => {
    const { records } = this.props;

    if (!records.length) {
      return this.renderEmpty();
    }

    return (
      <div
        className="row g-3"
        style={{
          animation:
            "recordsFade .4s ease",
        }}
      >
        {records.map((record, index) => (
          <div
            key={record.id}
            className="col-6"
          >
            {this.renderCard(
              record,
              index
            )}
          </div>
        ))}
      </div>
    );
  };

  renderEmpty = () => {
    return (
      <div
        className="text-center py-5 text-secondary"
        style={{
          animation:
            "recordsFade .35s ease",
        }}
      >
        موردی برای نمایش وجود ندارد.
      </div>
    );
  };

  render() {
    const { viewMode } = this.props;

    return (
      <div className="mt-2">
        {viewMode === "list"
          ? this.renderList()
          : this.renderCards()}

        <style>
          {`
            @keyframes recordsFade {
              from {
                opacity: 0;
                transform: translateY(8px);
              }

              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes cardFade {
              from {
                opacity: 0;
                transform: translateY(12px);
              }

              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
      </div>
    );
  }
}

export default RequestRecords;