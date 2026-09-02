import React from "react";
import { FaSlidersH } from "react-icons/fa";

// یک ردیف از جدول سوابق
// props:
//   record: { id, deviceType, issue, date, status: 'success' | 'canceled' }
//   onDetails(id)
class HistoryTableRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleDetailsClick = this.handleDetailsClick.bind(this);
  }

  handleDetailsClick() {
    const { record, onDetails } = this.props;
    if (onDetails) onDetails(record.id);
  }

  render() {
    const { record } = this.props;
    const isCanceled = record.status === "canceled";

    return (
      <div
        className="history-grid py-3 border-bottom"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.3fr 1fr 0.8fr",
          alignItems: "center",
        }}
      >
        <span className="text-center small text-dark">{record.deviceType}</span>
        <span className="text-center small text-dark">{record.issue}</span>
        <span className="text-center small text-muted">{record.date}</span>

        <div
          className="d-flex align-items-center justify-content-center gap-2"
          style={{ cursor: "pointer" }}
          onClick={this.handleDetailsClick}
        >
          <span
            className="rounded-circle"
            style={{
              width: 16,
              height: 16,
              backgroundColor: isCanceled ? "#e05a5a" : "#5b9bf0",
              transition: "background-color 0.2s ease",
            }}
          />
          <FaSlidersH
            className="text-secondary"
            size={14}
            style={{ transform: "rotate(90deg)" }}
          />
        </div>
      </div>
    );
  }
}

export default HistoryTableRow;