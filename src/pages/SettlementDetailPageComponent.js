import React from "react";
import { FaChevronLeft, FaUserEdit, FaTag, FaPercentage } from "react-icons/fa";
import InfoField from "./InfoFieldComponenet";

// داده‌ی نمونه — در پروژه‌ی واقعی از API بر اساس id مسیر می‌آید
const SAMPLE_SETTLEMENT = {
  technicianName: "پارسا پورحبیبی",
  requestCode: "1405050008",
  commissionTotal: "6,500,000",
  receiptImage: "https://placehold.co/500x420/1a1a1a/ffffff?text=فیش+واریزی",
};

// صفحه‌ی جزئیات درخواست تسویه — ساده، از InfoField مشترک استفاده می‌کند
class SettlementDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { settlement: SAMPLE_SETTLEMENT };
    this.handleBack = this.handleBack.bind(this);
  }

  handleBack() {
    // مسیر بازگشت بعداً وصل می‌شود
    console.log("بازگشت به لیست درخواست های تسویه");
  }

  render() {
    const { settlement } = this.state;

    return (
      <div>
        <div className="container px-3 pt-4 pb-5">
          {/* هدر */}
          <div className="d-flex justify-content-end mb-4">
            <button
              type="button"
              onClick={this.handleBack}
              className="btn btn-light rounded-circle border p-2 d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36, transition: "background-color 0.15s ease" }}
            >
              <FaChevronLeft size={14} />
            </button>
          </div>

          <InfoField icon={<FaUserEdit size={18} />} label="نام تعمیرکار" value={settlement.technicianName} />
          <InfoField icon={<FaTag size={18} />} label="کد درخواست" value={settlement.requestCode} />

          <InfoField icon={<FaPercentage size={18} />} label="جمع فاکتور ها (فقط پورسانت)">
            <span className="fw-semibold">{settlement.commissionTotal} تومان</span>
          </InfoField>

          {/* فیش واریزی */}
          <div className="d-flex align-items-start justify-content-between gap-3 border rounded-4 px-3 py-3 mb-3 bg-white">
            <span className="text-muted">فیش واریزی:</span>
            <img
              src={settlement.receiptImage}
              alt="فیش واریزی"
              className="rounded-3 border"
              style={{ width: 200, height: 168, objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SettlementDetailPage;