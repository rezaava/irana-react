import React from "react";
import {
  FaClone,
  FaUserCog,
  FaUserEdit,
  FaPhoneAlt,
  FaPhone,
  FaSearch,
  FaMapMarkerAlt,
  FaMicrochip,
  FaTag,
  FaQuestionCircle,
  FaClock,
  FaSyncAlt,
  FaCoins,
  FaBoxOpen,
  FaFileInvoice,
  FaExclamationCircle,
  FaChevronLeft,
  FaCommentDots,
  FaCheckCircle,
  FaTimesCircle,
  FaRedo,
  FaPlayCircle,
  FaTrashAlt,
} from "react-icons/fa";
import InfoField from "./InfoFieldComponenet";
import withRouter from "./withRouter";
import AuthCheck from "./AuthCheckComponent";
import Loader from "./LoaderComponent";
import { Link } from "react-router-dom";

const API_URL = "https://iranaserviceapp.ir/test/api";
const CLEAR_IMAGE_URL = "https://iranaserviceapp.ir/test/files/clear";
const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

function toPersianDigits(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

function formatDate(dateString) {
  if (!dateString) {
    return "—";
  }

  const parts = String(dateString).split("/");

  if (parts.length !== 3) {
    return dateString;
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (year < 1700) {
    return `${toPersianDigits(year)}/${toPersianDigits(
      String(month).padStart(2, "0")
    )}/${toPersianDigits(String(day).padStart(2, "0"))}`;
  }

  try {
    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch (error) {
    console.error("DATE FORMAT ERROR:", error);
    return dateString;
  }
}

function getRequestStatus(request, clear) {
  const status = Number(request.status);
  const end = Number(request.end);
  const cleared = Number(request.cleared);
  const deleted = Number(request.deleted);

  if (deleted === 1 || (status === 4 && end === 2)) {
    return {
      type: "admin_deleted",
      text: "حذف توسط ادمین",
      className: "text-danger fw-semibold",
      icon: <FaTrashAlt />,
    };
  }

  if (status === 4) {
    return {
      type: "canceled",
      text: "کنسل توسط تعمیرکار",
      className: "text-danger fw-semibold",
      icon: <FaTimesCircle />,
    };
  }

  if (status === -1) {
    return {
      type: "canceled",
      text: "کنسل توسط تعمیرکار",
      className: "text-danger fw-semibold",
      icon: <FaTimesCircle />,
    };
  }

  if (status === 1 && end === 2) {
    return {
      type: "reactivated",
      text: "مجدد فعالسازی شده",
      className: "text-dark fw-semibold",
      icon: <FaRedo />,
    };
  }

  if (status === 1 && end === 1 && cleared === 1) {
    return {
      type: "settled",
      text: "تسویه شده",
      className: "text-primary fw-semibold",
      icon: <FaCheckCircle />,
    };
  }

  if (status === 1 && end === 1 && cleared === 0 && !clear) {
    return {
      type: "waiting_payment",
      text: "تمام شده و منتظر پرداخت",
      className: "text-success fw-semibold",
      icon: <FaCoins />,
    };
  }

  if (status === 1 && end === 1 && cleared === 0 && clear) {
    return {
      type: "waiting_approval",
      text: "تسویه ثبت شده و منتظر تأیید",
      className: "text-warning fw-semibold",
      icon: <FaCoins />,
    };
  }

  if (status === 1 && end === 0) {
    return {
      type: "running",
      text: "درحال اجرا",
      className: "text-warning fw-semibold",
      icon: <FaPlayCircle />,
    };
  }

  return {
    type: "unknown",
    text: "وضعیت نامشخص",
    className: "text-muted fw-semibold",
    icon: <FaExclamationCircle />,
  };
}

class RequestDetailPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      request: null,
      clear: null,
      loading: true,
      authenticated: false,
      error: "",
      showDeleteModal: false,
      deleteConfirmText: "",
      deleteLoading: false,
      deleteError: "",
      showConfirmModal: false,
      confirmText: "",
      confirmLoading: false,
      showReceiptImage: false,
    };

    this.handleBack = this.handleBack.bind(this);
    this.handleChat = this.handleChat.bind(this);
  }

  componentDidMount() {
    if (!AuthCheck()) {
      return;
    }

    this.setState(
      {
        authenticated: true,
      },
      () => {
        this.getRequestDetail();
      }
    );
  }

  openDeleteModal = () => {
    this.setState({
      showDeleteModal: true,
      deleteConfirmText: "",
      deleteError: "",
    });
  };

  closeDeleteModal = () => {
    if (this.state.deleteLoading) {
      return;
    }

    this.setState({
      showDeleteModal: false,
      deleteConfirmText: "",
      deleteError: "",
    });
  };

  handleDeleteRequest = async () => {
    const { request, deleteConfirmText } = this.state;

    if (!request?.id || deleteConfirmText.trim() !== "حذف") {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      this.setState({
        deleteError: "لطفاً دوباره وارد حساب کاربری شوید.",
      });
      return;
    }

    this.setState({
      deleteLoading: true,
      deleteError: "",
    });

    try {
      const response = await fetch(
        `${API_URL}/delete-request?id=${encodeURIComponent(request.id)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || String(data.status) !== "1") {
        throw new Error(data.message || "حذف درخواست ناموفق بود.");
      }

      this.setState((prevState) => ({
        request: {
          ...prevState.request,
          status: -1,
        },
        showDeleteModal: false,
        deleteConfirmText: "",
        deleteLoading: false,
        deleteError: "",
      }));
    } catch (error) {
      console.error("DELETE REQUEST ERROR:", error);

      this.setState({
        deleteLoading: false,
        deleteError: error.message || "خطا در حذف درخواست.",
      });
    }
  };

  getRequestDetail = async () => {
    const { id } = this.props.params;
    const token = localStorage.getItem("token");

    if (!id) {
      this.setState({
        loading: false,
        error: "شناسه درخواست پیدا نشد.",
      });
      return;
    }

    if (!token) {
      this.setState({
        loading: false,
        error: "توکن ورود پیدا نشد.",
      });
      return;
    }

    const url = `${API_URL}/detail?id=${encodeURIComponent(id)}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (String(data.status) !== "1") {
        this.setState({
          request: null,
          clear: null,
          loading: false,
          error: data.message || "اطلاعات درخواست پیدا نشد.",
        });
        return;
      }

      const request = data.request || null;
      const clear = data.clear || null;

      if (!request) {
        this.setState({
          request: null,
          clear: null,
          loading: false,
          error: "درخواست پیدا نشد.",
        });
        return;
      }

      this.setState({
        request,
        clear,
        loading: false,
        error: "",
      });
    } catch (error) {
      console.error("GET REQUEST DETAIL ERROR:", error);

      this.setState({
        request: null,
        clear: null,
        loading: false,
        error: "خطا در دریافت اطلاعات درخواست.",
      });
    }
  };

  handleBack() {
    this.props.navigate(-1);
  }

  handleChat() {
    console.log("رفتن به گفتگو");
  }

  handleCopyRequestCode = async () => {
    const { request } = this.state;

    if (!request?.code) {
      return;
    }

    try {
      await navigator.clipboard.writeText(String(request.code));
    } catch (error) {
      console.error("COPY REQUEST CODE ERROR:", error);
    }
  };

  openConfirmModal = () => {
    this.setState({
      showConfirmModal: true,
      confirmText: "",
    });
  };

  closeConfirmModal = () => {
    if (this.state.confirmLoading) {
      return;
    }

    this.setState({
      showConfirmModal: false,
      confirmText: "",
    });
  };

  handleConfirm = async () => {
    const { request, confirmText } = this.state;

    if (!request?.id || !confirmText.trim()) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    this.setState({
      confirmLoading: true,
    });

    try {
      const response = await fetch(`${API_URL}/clear-request`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: request.id,
          desc: confirmText.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || String(data.status) !== "1") {
        throw new Error(data.message || "تأیید انجام نشد.");
      }

      this.setState({
        showConfirmModal: false,
        confirmText: "",
        confirmLoading: false,
        request: {
          ...this.state.request,
          cleared: 1,
        },
      });
    } catch (error) {
      console.error("CONFIRM REQUEST ERROR:", error);

      this.setState({
        confirmLoading: false,
      });

      alert(error.message || "خطا در تأیید تسویه.");
    }
  };

  renderActionButton(content, title, onClick, className = "") {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title}
        className={`btn btn-light border rounded-3 d-flex align-items-center justify-content-center ${className}`}
        style={{
          width: 34,
          height: 34,
          padding: 0,
          position: "absolute",
          left: 12,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
        }}
      >
        {content}
      </button>
    );
  }

  render() {
    const {
      authenticated,
      request,
      clear,
      loading,
      error,
      showConfirmModal,
      confirmText,
      confirmLoading,
      showReceiptImage,
    } = this.state;

    if (!authenticated) {
      return null;
    }

    if (loading) {
      return <Loader />;
    }

    if (error) {
      return (
        <div dir="rtl" className="container px-3 py-5">
          <div className="text-center text-danger">{error}</div>
        </div>
      );
    }

    if (!request) {
      return (
        <div dir="rtl" className="container px-3 py-5">
          <div className="text-center text-muted">
            درخواست پیدا نشد.
          </div>
        </div>
      );
    }

    const technician = request.repairman_model;

    const technicianName = technician
      ? `${technician.name || ""} ${technician.family || ""}`.trim()
      : "—";

    const requestStatus = getRequestStatus(request, clear);
    const totalReceived = Number(request.sum || 0);
    const suppliesCost = Number(request.abzar || 0);
    const totalFee = totalReceived - suppliesCost;
    const commissionPercent = 50;
    const commissionAmount = Number(totalFee / 2 || 0);

    const receiptImage =
      request.file1 && request.file1 !== ""
        ? `${CLEAR_IMAGE_URL}/${request.file1}`
        : null;

    const relatedRequests = Array.isArray(request.siblings)
      ? request.siblings
      : [];

    const canConfirm =
      Number(request.status) === 1 &&
      Number(request.end) === 1 &&
      Number(request.cleared) === 0 &&
      !!clear;

    return (
      <div dir="rtl">
        <div className="container px-3 pt-4 pb-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <button
              type="button"
              onClick={this.handleBack}
              className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{
                width: 36,
                height: 36,
              }}
            >
              <FaChevronLeft size={14} />
            </button>

            <div className="d-flex align-items-center gap-2">
              {Number(request.status) !== -1 &&
                Number(request.deleted) !== 1 && (
                  <button
                    type="button"
                    onClick={this.openDeleteModal}
                    title="حذف درخواست"
                    className="btn btn-light border border-danger rounded-3 p-3 d-flex align-items-center justify-content-center text-danger"
                    style={{
                      width: 44,
                      height: 44,
                    }}
                  >
                    <FaTrashAlt size={16} />
                  </button>
                )}

              <Link
                to="/form"
                state={{
                  editRequest: request,
                }}
                title="ویرایش درخواست"
                className="btn btn-primary border-0 ms-5 rounded-3 p-3 d-flex align-items-center justify-content-center text-white text-decoration-none"
                style={{
                  width: 44,
                  height: 44,
                }}
              >
                <FaUserEdit size={16} />
              </Link>
            </div>
          </div>

          <div className="position-relative" style={{ direction: "rtl" }}>
            <InfoField
              icon={<FaClone size={18} />}
              label="شماره درخواست"
              value={request.code || "—"}
            />

            {request.code &&
              this.renderActionButton(
                <FaClone size={14} />,
                "کپی شماره درخواست",
                this.handleCopyRequestCode,
                "text-primary"
              )}
          </div>

          <div className="position-relative" style={{ direction: "rtl" }}>
            <InfoField
              icon={<FaUserCog size={18} />}
              label="نام تعمیرکار"
              value={technicianName}
            />

            {technician?.id && (
              <Link
                to={`/PersonalInfoPage/${technician.id}`}
                title="مشاهده پروفایل تعمیرکار"
                className="btn btn-light border rounded-3 d-flex align-items-center justify-content-center text-primary text-decoration-none"
                style={{
                  width: 34,
                  height: 34,
                  padding: 0,
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                }}
              >
                <span
                  className="position-relative d-flex align-items-center justify-content-center"
                  style={{
                    width: 20,
                    height: 20,
                  }}
                >
                  <FaUserCog size={14} />
                  <FaSearch
                    size={7}
                    className="position-absolute bg-white rounded-circle"
                    style={{
                      right: -2,
                      bottom: -1,
                    }}
                  />
                </span>
              </Link>
            )}
          </div>

          <InfoField
            icon={<FaUserEdit size={18} />}
            label="نام مشتری"
            value={request.name || "—"}
          />

          <div className="position-relative" style={{ direction: "rtl" }}>
            <InfoField
              icon={<FaPhoneAlt size={18} />}
              label="شماره تماس"
              value={request.mobile || "—"}
            />

            {request.mobile && (
              <a
                href={`tel:${request.mobile}`}
                title="تماس با مشتری"
                className="btn btn-light border rounded-3 d-flex align-items-center justify-content-center text-success text-decoration-none"
                style={{
                  width: 34,
                  height: 34,
                  padding: 0,
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                }}
              >
                <FaPhone size={14} />
              </a>
            )}
          </div>

          <InfoField
            icon={<FaPhone size={18} />}
            label="تلفن ثابت"
            value={request.mobile2 || "—"}
          />

          <InfoField
            icon={<FaMapMarkerAlt size={18} />}
            label="استان"
            value={request.state_model?.name || "—"}
          />

          <InfoField
            icon={<FaMapMarkerAlt size={18} />}
            label="آدرس"
            value={request.address || "—"}
          />

          <InfoField
            icon={<FaMicrochip size={18} />}
            label="نوع دستگاه"
            value={request.device_type || "—"}
          />

          <InfoField
            icon={<FaTag size={18} />}
            label="برند دستگاه"
            value={request.device_brand || "—"}
          />

          <InfoField
            icon={<FaQuestionCircle size={18} />}
            label="ایراد دستگاه"
            value={request.problem || "—"}
          />

          <InfoField
            icon={<FaClock size={18} />}
            label="زمان مراجعه"
            value={formatDate(request.time)}
          />

          <InfoField
            icon={<FaSyncAlt size={18} />}
            label="توضیحات"
            value={request.description || "—"}
          />

          <InfoField icon={requestStatus.icon} label="وضعیت">
            <span className={requestStatus.className}>
              {requestStatus.text}
            </span>
          </InfoField>

          {request.end_description && (
            <InfoField
              icon={<FaExclamationCircle size={18} />}
              label="توضیحات وضعیت"
              value={request.end_description}
            />
          )}

          {clear && (
            <>
              <InfoField
                icon={<FaCoins size={18} />}
                label="کل دریافتی"
              >
                <span className="fw-semibold">
                  {totalReceived.toLocaleString("fa-IR")} تومان
                </span>
              </InfoField>

              <InfoField
                icon={<FaCoins size={18} />}
                label="هزینه لوازم مصرفی"
              >
                <span className="fw-semibold">
                  {suppliesCost.toLocaleString("fa-IR")} تومان
                </span>
              </InfoField>

              <InfoField
                icon={<FaBoxOpen size={18} />}
                label="لوازم مصرفی"
                value={request.abzar_details || "—"}
              />

              <InfoField
                icon={<FaFileInvoice size={18} />}
                label="کل اجرت"
              >
                <span className="fw-semibold">
                  {totalFee.toLocaleString("fa-IR")} تومان
                </span>
              </InfoField>

              <InfoField
                icon={<FaFileInvoice size={18} />}
                label={`پورسانت (%${commissionPercent})`}
              >
                <span className="fw-semibold">
                  {commissionAmount.toLocaleString("fa-IR")} تومان
                </span>
              </InfoField>

              {receiptImage && (
                <div className="d-flex align-items-center justify-content-between gap-3 border rounded-4 px-3 py-3 mb-3 bg-white">
                  <span className="text-muted">فیش واریزی:</span>

                  <img
                    src={receiptImage}
                    alt="فیش واریزی"
                    className="rounded-3 border"
                    onClick={() =>
                      this.setState({
                        showReceiptImage: true,
                      })
                    }
                    style={{
                      width: 140,
                      height: 110,
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                  />
                </div>
              )}

              <InfoField
                icon={<FaExclamationCircle size={18} />}
                label="توضیحات تایید تسویه"
                value={clear.description || clear.desc || "—"}
              />

              {canConfirm && (
                <button
                  type="button"
                  onClick={this.openConfirmModal}
                  className="btn btn-success w-100 rounded-3 py-3 mt-2 d-flex align-items-center justify-content-center gap-2"
                >
                  <FaCheckCircle />
                  تایید تسویه
                </button>
              )}
            </>
          )}

          <h2 className="fs-6 fw-semibold text-dark mt-4 mb-3 text-end">
            درخواست‌های مرتبط:
          </h2>

          {relatedRequests.length === 0 ? (
            <div className="text-center text-muted py-4">
              هنوز موردی برای نمایش وجود ندارد.
            </div>
          ) : (
            <div>
              {relatedRequests.map((related) => (
                <Link
                  key={related.id}
                  to={`/request-details/${related.id}`}
                  className="text-decoration-none text-dark"
                >
                  <div className="border rounded-3 p-3 mb-2 text-end">
                    {related.code || related.id}
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Link
            to="/form"
            state={{
              relatedRequest: request,
            }}
            className="btn btn-primary w-100 rounded-3 py-3 mt-2 text-white text-decoration-none"
          >
            افزودن درخواست مرتبط
          </Link>
        </div>

        {showReceiptImage && receiptImage && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            onClick={() =>
              this.setState({
                showReceiptImage: false,
              })
            }
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.95)",
              zIndex: 10000,
            }}
          >
            <div className="modal-dialog modal-fullscreen m-0">
              <div className="modal-content bg-dark border-0 rounded-0">
                <div className="modal-header border-0 justify-content-end">
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    aria-label="بستن"
                    onClick={() =>
                      this.setState({
                        showReceiptImage: false,
                      })
                    }
                  />
                </div>

                <div className="modal-body d-flex align-items-center justify-content-center p-2">
                  <img
                    src={receiptImage}
                    alt="فیش واریزی"
                    className="img-fluid"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {showConfirmModal && (
          <div
            onClick={this.closeConfirmModal}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.45)",
              zIndex: 9999,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              dir="rtl"
              style={{
                width: "100%",
                maxWidth: 450,
                background: "#fff",
                borderRadius: "22px 22px 0 0",
                padding: "18px",
                boxSizing: "border-box",
                boxShadow: "0 -5px 30px rgba(0,0,0,0.15)",
              }}
            >
              <div
                style={{
                  width: 45,
                  height: 5,
                  background: "#ddd",
                  borderRadius: 10,
                  margin: "0 auto 20px",
                }}
              />

              <h5 className="fw-semibold mb-3 text-end">
                تایید تسویه
              </h5>

              <input
                type="text"
                value={confirmText}
                onChange={(e) =>
                  this.setState({
                    confirmText: e.target.value,
                  })
                }
                placeholder="متن تایید را وارد کنید"
                className="form-control rounded-3 py-3"
                disabled={confirmLoading}
                autoFocus
              />

              <button
                type="button"
                onClick={this.handleConfirm}
                disabled={confirmLoading || !confirmText.trim()}
                className="btn btn-success w-100 rounded-3 py-3 mt-3"
              >
                {confirmLoading ? "در حال ثبت..." : "ثبت"}
              </button>

              <button
                type="button"
                onClick={this.closeConfirmModal}
                disabled={confirmLoading}
                className="btn btn-light border w-100 rounded-3 py-3 mt-2"
              >
                انصراف
              </button>
            </div>
          </div>
        )}

        {this.state.showDeleteModal && (
          <div
            onClick={this.closeDeleteModal}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 10001,
              background: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(5px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              dir="rtl"
              style={{
                width: "100%",
                maxWidth: 390,
                background: "#fff",
                borderRadius: 24,
                padding: 24,
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                textAlign: "center",
                animation: "deleteModalEnter 0.2s ease-out",
              }}
            >
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 22,
                  background: "#fff1f2",
                  color: "#dc3545",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                }}
              >
                <FaTrashAlt size={27} />
              </div>

              <h5 className="fw-bold mb-3 text-danger">
                حذف درخواست
              </h5>

              <p
                className="text-muted mb-3"
                style={{
                  fontSize: 14,
                  lineHeight: 2,
                }}
              >
                برای تأیید حذف درخواست شماره{" "}
                <strong className="text-dark">
                  {request.code || request.id}
                </strong>
                ، کلمه «حذف» را وارد کنید.
              </p>

              <input
                type="text"
                value={this.state.deleteConfirmText}
                onChange={(e) =>
                  this.setState({
                    deleteConfirmText: e.target.value,
                    deleteError: "",
                  })
                }
                placeholder="برای تأیید، بنویسید حذف"
                className="form-control rounded-3 py-3 mb-3 text-center"
                disabled={this.state.deleteLoading}
                autoComplete="off"
                autoFocus
              />

              {this.state.deleteError && (
                <div className="alert alert-danger rounded-3 text-end py-2">
                  {this.state.deleteError}
                </div>
              )}

              <button
                type="button"
                onClick={this.handleDeleteRequest}
                disabled={
                  this.state.deleteLoading ||
                  this.state.deleteConfirmText.trim() !== "حذف"
                }
                className="btn btn-danger w-100 rounded-3 py-3 fw-semibold"
              >
                {this.state.deleteLoading ? (
                  "در حال حذف..."
                ) : (
                  <>
                    <FaTrashAlt className="ms-2" />
                    حذف نهایی درخواست
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={this.closeDeleteModal}
                disabled={this.state.deleteLoading}
                className="btn btn-light border w-100 rounded-3 py-3 mt-2"
              >
                انصراف
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(RequestDetailPage);