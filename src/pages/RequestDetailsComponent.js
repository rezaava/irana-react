import React from "react";
import {
  FaClone,
  FaUserCog,
  FaUserEdit,
  FaPhoneAlt,
  FaPhone,
  FaMapMarkerAlt,
  FaImage,
  FaMicrochip,
  FaTag,
  FaQuestionCircle,
  FaClock,
  FaSyncAlt,
  FaFileAlt,
  FaCoins,
  FaBoxOpen,
  FaFileInvoice,
  FaExclamationCircle,
  FaChevronLeft,
  FaCommentDots,
} from "react-icons/fa";
import InfoField from "./InfoFieldComponenet";

// داده‌ی نمونه — در پروژه‌ی واقعی از API بر اساس id مسیر می‌آید
const SAMPLE_REQUEST = {
  requestNumber: "1405050027",
  technicianName: "علی عبداللهی",
  customerName: "مفاخری",
  phone: "09121457004",
  landline: "---",
  province: "تهران",
  address: "شهریار بعدپل پادامک یاس‌اک اهورا",
  deviceType: "ساید",
  deviceBrand: "سامسونگ_SAMSUNG",
  deviceIssue: "یخچال گرم و لاستیک",
  visitTime: "1405/05/28",
  description: "",
  status: "تسویه شده",
  totalReceived: "28,000,000",
  suppliesCost: "4,000,000",
  suppliesUsed: "لاستیک درب، فیلترها، ترموفیوز، سنسور",
  totalFee: "24,000,000",
  commissionPercent: 50,
  commissionAmount: "12,000,000",
  receiptImage: "https://placehold.co/300x220?text=فیش+واریزی",
  settlementNote: "تایید است",
  relatedRequests: [],
};

// صفحه‌ی جزئیات درخواست
class RequestDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { request: SAMPLE_REQUEST };
    this.handleBack = this.handleBack.bind(this);
    this.handleChat = this.handleChat.bind(this);
    this.handleAddRelated = this.handleAddRelated.bind(this);
  }

  handleBack() {
    // مسیر بازگشت بعداً وصل می‌شود (مثلاً navigate(-1))
    console.log("بازگشت به صفحه‌ی قبل");
  }

  handleChat() {
    // مسیر گفتگو بعداً وصل می‌شود
    console.log("رفتن به گفتگو");
  }

  handleAddRelated() {
    // مسیر افزودن درخواست مرتبط بعداً وصل می‌شود
    console.log("افزودن درخواست مرتبط");
  }

  render() {
    const { request } = this.state;

    return (
      <div>
        <div className="container px-3 pt-4 pb-5">
          {/* هدر */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <button
              type="button"
              onClick={this.handleBack}
              className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36 }}
            >
              <FaChevronLeft size={14} />
            </button>

            <button
              type="button"
              onClick={this.handleChat}
              className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center text-danger"
              style={{ width: 36, height: 36 }}
            >
              <FaCommentDots size={16} />
            </button>
          </div>

          <InfoField icon={<FaClone size={18} />} label="شماره درخواست" value={request.requestNumber} />
          <InfoField icon={<FaUserCog size={18} />} label="نام تعمیرکار" value={request.technicianName} />
          <InfoField icon={<FaUserEdit size={18} />} label="نام مشتری" value={request.customerName} />
          <InfoField icon={<FaPhoneAlt size={18} />} label="شماره تماس" value={request.phone} />
          <InfoField icon={<FaPhone size={18} />} label="تلفن ثابت" value={request.landline} />
          <InfoField icon={<FaMapMarkerAlt size={18} />} label="استان" value={request.province} />
          <InfoField icon={<FaImage size={18} />} label="آدرس" value={request.address} />
          <InfoField icon={<FaMicrochip size={18} />} label="نوع دستگاه" value={request.deviceType} />
          <InfoField icon={<FaTag size={18} />} label="برند دستگاه" value={request.deviceBrand} />
          <InfoField icon={<FaQuestionCircle size={18} />} label="ایراد دستگاه" value={request.deviceIssue} />
          <InfoField icon={<FaClock size={18} />} label="زمان مراجعه" value={request.visitTime} />
          <InfoField icon={<FaSyncAlt size={18} />} label="توضیحات" value={request.description || "—"} />

          <InfoField icon={<FaFileAlt size={18} />} label="وضعیت">
            <span className="text-primary fw-semibold">{request.status}</span>
          </InfoField>

          <InfoField icon={<FaCoins size={18} />} label="کل دریافتی">
            <span className="fw-semibold">{request.totalReceived} تومان</span>
          </InfoField>

          <InfoField icon={<FaCoins size={18} />} label="هزینه لوازم مصرفی">
            <span className="fw-semibold">{request.suppliesCost} تومان</span>
          </InfoField>

          <InfoField icon={<FaBoxOpen size={18} />} label="لوازم مصرفی" value={request.suppliesUsed} />

          <InfoField icon={<FaFileInvoice size={18} />} label="کل اجرت">
            <span className="fw-semibold">{request.totalFee} تومان</span>
          </InfoField>

          <InfoField icon={<FaFileInvoice size={18} />} label={`پورسانت (%${request.commissionPercent})`}>
            <span className="fw-semibold">{request.commissionAmount} تومان</span>
          </InfoField>

          {/* فیش واریزی */}
          <div className="d-flex align-items-center justify-content-between gap-3 border rounded-4 px-3 py-3 mb-3 bg-white">
            <span className="text-muted">فیش واریزی:</span>
            <img
              src={request.receiptImage}
              alt="فیش واریزی"
              className="rounded-3 border"
              style={{ width: 140, height: 110, objectFit: "cover" }}
            />
          </div>

          <InfoField icon={<FaExclamationCircle size={18} />} label="توضیحات تایید تسویه" value={request.settlementNote} />

          {/* درخواست‌های مرتبط */}
          <h2 className="fs-6 fw-semibold text-dark mt-4 mb-3 text-end">درخواست‌های مرتبط:</h2>

          {request.relatedRequests.length === 0 ? (
            <div className="text-center text-muted py-4">
              هنوز موردی برای نمایش وجود ندارد.
            </div>
          ) : (
            <div>
              {request.relatedRequests.map((rel) => (
                <div key={rel.id} className="border rounded-3 p-3 mb-2 text-end">
                  {rel.title}
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={this.handleAddRelated}
            className="btn btn-primary w-100 rounded-3 py-3 mt-2"
            style={{ transition: "opacity 0.15s ease" }}
          >
            افزودن درخواست مرتبط
          </button>
        </div>
      </div>
    );
  }
}

export default RequestDetailPage;