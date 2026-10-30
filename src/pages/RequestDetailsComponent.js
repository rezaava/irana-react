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
  FaCheckCircle,
  FaTimesCircle,
  FaRedo,
  FaPlayCircle,
  FaTrashAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaImage,
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
  if (value === null || value === undefined) return "";
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

function formatDate(dateString) {
  if (!dateString) return "—";

  const parts = String(dateString).split("/");

  if (parts.length !== 3) return dateString;

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (year < 1700) {
    return `${toPersianDigits(year)}/${toPersianDigits(
      String(month).padStart(2, "0")
    )}/${toPersianDigits(String(day).padStart(2, "0"))}`;
  }

  try {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(year, month - 1, day));
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

  if (status === 4 || status === -1) {
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

      reactivateLoading: false,

      showConfirmModal: false,
      confirmText: "",
      confirmLoading: false,

      showReceiptImage: false,
      showEditReceiptModal: false,
      receiptFile: null,
      receiptPreview: "",
      receiptLoading: false,
      receiptError: "",

      // ویرایش هزینه لوازم مصرفی
      showEditSuppliesModal: false,
      suppliesInput: "",
      suppliesLoading: false,
      suppliesError: "",
    };

    this.handleBack = this.handleBack.bind(this);
    this.handleChat = this.handleChat.bind(this);
  }

  componentDidMount() {
    if (!AuthCheck()) return;

    this.setState({ authenticated: true }, () => {
      this.getRequestDetail();
    });
  }

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

    try {
      const response = await fetch(
        `${API_URL}/detail?id=${encodeURIComponent(id)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

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

      if (!data.request) {
        this.setState({
          request: null,
          clear: null,
          loading: false,
          error: "درخواست پیدا نشد.",
        });
        return;
      }

      this.setState({
        request: data.request,
        clear: data.clear || null,
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

    if (!request?.code) return;

    try {
      await navigator.clipboard.writeText(String(request.code));
    } catch (error) {
      console.error("COPY REQUEST CODE ERROR:", error);
    }
  };

  // =========================
  // ویرایش هزینه لوازم مصرفی
  // =========================

  openEditSuppliesModal = () => {
    const { request } = this.state;

    this.setState({
      showEditSuppliesModal: true,
      suppliesInput: String(request?.abzar ?? 0),
      suppliesError: "",
    });
  };

  closeEditSuppliesModal = () => {
    if (this.state.suppliesLoading) return;

    this.setState({
      showEditSuppliesModal: false,
      suppliesInput: "",
      suppliesError: "",
    });
  };

  handleSuppliesInputChange = (event) => {
    const value = event.target.value;

    if (value !== "" && !/^\d+(\.\d*)?$/.test(value)) {
      return;
    }

    this.setState({
      suppliesInput: value,
      suppliesError: "",
    });
  };

  handleUpdateSupplies = async () => {
    const { request, suppliesInput } = this.state;

    if (!request?.id) return;

    if (suppliesInput.trim() === "") {
      this.setState({
        suppliesError: "هزینه لوازم مصرفی را وارد کنید.",
      });
      return;
    }

    const suppliesCost = Number(suppliesInput);
    const totalReceived = Number(request.sum || 0);

    if (!Number.isFinite(suppliesCost) || suppliesCost < 0) {
      this.setState({
        suppliesError: "مبلغ واردشده معتبر نیست.",
      });
      return;
    }

    if (suppliesCost > totalReceived) {
      this.setState({
        suppliesError: "هزینه لوازم مصرفی نمی‌تواند از کل دریافتی بیشتر باشد.",
      });
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      this.setState({
        suppliesError: "لطفاً دوباره وارد حساب کاربری شوید.",
      });
      return;
    }

    this.setState({
      suppliesLoading: true,
      suppliesError: "",
    });

    try {
      const response = await fetch(
        `${API_URL}/edit/${encodeURIComponent(request.id)}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            abzar: suppliesCost,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || String(data.status) !== "1") {
        const validationMessage = data.errors?.abzar?.[0];

        throw new Error(
          validationMessage ||
            data.message ||
            "ویرایش هزینه لوازم مصرفی ناموفق بود."
        );
      }

      this.setState({
        showEditSuppliesModal: false,
        suppliesLoading: false,
        suppliesInput: "",
        suppliesError: "",
      });

      await this.getRequestDetail();

      alert(data.message || "هزینه لوازم مصرفی با موفقیت ویرایش شد.");
    } catch (error) {
      console.error("UPDATE SUPPLIES ERROR:", error);

      this.setState({
        suppliesLoading: false,
        suppliesError: error.message || "خطا در ویرایش هزینه لوازم مصرفی.",
      });
    }
  };

  // =========================
  // حذف درخواست
  // =========================

  openDeleteModal = () => {
    this.setState({
      showDeleteModal: true,
      deleteConfirmText: "",
      deleteError: "",
    });
  };

  closeDeleteModal = () => {
    if (this.state.deleteLoading) return;

    this.setState({
      showDeleteModal: false,
      deleteConfirmText: "",
      deleteError: "",
    });
  };

  handleDeleteRequest = async () => {
    const { request, deleteConfirmText } = this.state;

    if (!request?.id || deleteConfirmText.trim() !== "حذف") return;

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

  // =========================
  // فعال‌سازی مجدد درخواست
  // =========================

  handleReactivateRequest = async () => {
    const { request, reactivateLoading } = this.state;

    if (!request?.id || reactivateLoading) return;

    if (!window.confirm("آیا از فعال‌سازی مجدد درخواست اطمینان دارید؟")) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("لطفاً دوباره وارد حساب کاربری شوید.");
      return;
    }

    this.setState({ reactivateLoading: true });

    try {
      const response = await fetch(
        `${API_URL}/refresh-request?id=${encodeURIComponent(request.id)}`,
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
        throw new Error(data.message || "فعال‌سازی مجدد درخواست ناموفق بود.");
      }

      await this.getRequestDetail();

      this.setState({ reactivateLoading: false });
      alert(data.message || "درخواست با موفقیت مجدداً فعال شد.");
    } catch (error) {
      console.error("REACTIVATE REQUEST ERROR:", error);
      this.setState({ reactivateLoading: false });
      alert(error.message || "خطا در فعال‌سازی مجدد درخواست.");
    }
  };

  // =========================
  // تأیید تسویه
  // =========================

  openConfirmModal = () => {
    this.setState({
      showConfirmModal: true,
      confirmText: "",
    });
  };

  closeConfirmModal = () => {
    if (this.state.confirmLoading) return;

    this.setState({
      showConfirmModal: false,
      confirmText: "",
    });
  };

  handleConfirm = async () => {
    const { request, confirmText } = this.state;

    if (!request?.id || !confirmText.trim()) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("لطفاً دوباره وارد حساب کاربری شوید.");
      return;
    }

    this.setState({ confirmLoading: true });

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

      this.setState((prevState) => ({
        showConfirmModal: false,
        confirmText: "",
        confirmLoading: false,
        request: {
          ...prevState.request,
          cleared: 1,
        },
      }));
    } catch (error) {
      console.error("CONFIRM REQUEST ERROR:", error);

      this.setState({ confirmLoading: false });
      alert(error.message || "خطا در تأیید تسویه.");
    }
  };

  // =========================
  // ویرایش عکس فیش تسویه
  // =========================

  openEditReceiptModal = () => {
    const { receiptImage } = this.getReceiptData();

    this.setState({
      showEditReceiptModal: true,
      receiptFile: null,
      receiptPreview: receiptImage || "",
      receiptError: "",
    });
  };

  closeEditReceiptModal = () => {
    if (this.state.receiptLoading) return;

    this.setState({
      showEditReceiptModal: false,
      receiptFile: null,
      receiptPreview: "",
      receiptError: "",
    });
  };

  handleReceiptFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      this.setState({
        receiptError: "لطفاً یک فایل تصویری انتخاب کنید.",
        receiptFile: null,
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.setState({
        receiptError: "حجم عکس نباید بیشتر از ۵ مگابایت باشد.",
        receiptFile: null,
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.setState({
        receiptFile: file,
        receiptPreview: reader.result,
        receiptError: "",
      });
    };

    reader.onerror = () => {
      this.setState({
        receiptError: "خواندن تصویر ناموفق بود.",
      });
    };

    reader.readAsDataURL(file);
  };

  handleUpdateReceiptImage = async () => {
    const { request, receiptFile } = this.state;

    if (!request?.id || !receiptFile) {
      this.setState({
        receiptError: "لطفاً عکس جدید را انتخاب کنید.",
      });
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      this.setState({
        receiptError: "لطفاً دوباره وارد حساب کاربری شوید.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("id", request.id);
    formData.append("file1", receiptFile);

    this.setState({
      receiptLoading: true,
      receiptError: "",
    });

    try {
      const response = await fetch(`${API_URL}/update-clear-image`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || String(data.status) !== "1") {
        const validationMessage = data.errors?.file1?.[0];

        throw new Error(
          validationMessage ||
            data.message ||
            "ویرایش عکس فیش ناموفق بود."
        );
      }

      this.setState((prevState) => ({
        clear: {
          ...prevState.clear,
          file1: data.file1,
        },
        request: {
          ...prevState.request,
          file1: data.file1,
        },
        showEditReceiptModal: false,
        receiptFile: null,
        receiptPreview: "",
        receiptLoading: false,
        receiptError: "",
      }));

      alert(data.message || "عکس فیش با موفقیت ویرایش شد.");
    } catch (error) {
      console.error("UPDATE RECEIPT IMAGE ERROR:", error);

      this.setState({
        receiptLoading: false,
        receiptError: error.message || "خطا در ویرایش عکس فیش.",
      });
    }
  };

  getReceiptData = () => {
    const { request, clear } = this.state;
    const file = clear?.file1 || request?.file1 || "";

    const receiptImage = file
      ? `${CLEAR_IMAGE_URL}/${String(file).replace(/^\/+/, "")}`
      : null;

    return { receiptImage };
  };

  renderActionButton(content, title, onClick, className = "") {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title}
        aria-label={title}
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
      showEditReceiptModal,
      receiptPreview,
      receiptLoading,
      receiptError,
      receiptFile,
      showEditSuppliesModal,
      suppliesInput,
      suppliesLoading,
      suppliesError,
    } = this.state;

    if (!authenticated) return null;

    if (loading) return <Loader />;

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
          <div className="text-center text-muted">درخواست پیدا نشد.</div>
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
    const commissionAmount = totalFee / 2;

    const previewSuppliesCost =
      suppliesInput.trim() === "" ? 0 : Number(suppliesInput);

    const previewTotalFee = totalReceived - previewSuppliesCost;
    const previewCommission = previewTotalFee / 2;

    const { receiptImage } = this.getReceiptData();

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
              style={{ width: 36, height: 36 }}
            >
              <FaChevronLeft size={14} />
            </button>

            <div className="d-flex align-items-center gap-2">
              {(Number(request.status) === -1 ||
                (Number(request.status) === 4 &&
                  Number(request.end) !== 2) ||
                (Number(request.status) === 1 &&
                  Number(request.end) === 2)) &&
                Number(request.deleted) !== 1 && (
                  <button
                    type="button"
                    onClick={this.handleReactivateRequest}
                    disabled={this.state.reactivateLoading}
                    title="فعال‌سازی مجدد درخواست"
                    className="btn btn-light border border-success rounded-3 p-3 d-flex align-items-center justify-content-center text-success"
                    style={{ width: 44, height: 44 }}
                  >
                    <FaRedo size={16} />
                  </button>
                )}

              {Number(request.status) !== -1 &&
                Number(request.deleted) !== 1 && (
                  <button
                    type="button"
                    onClick={this.openDeleteModal}
                    title="حذف درخواست"
                    className="btn btn-light border border-danger rounded-3 p-3 d-flex align-items-center justify-content-center text-danger"
                    style={{ width: 44, height: 44 }}
                  >
                    <FaTrashAlt size={16} />
                  </button>
                )}

              <Link
                to="/form"
                state={{ editRequest: request }}
                title="ویرایش درخواست"
                className="btn btn-primary border-0 ms-5 rounded-3 p-3 d-flex align-items-center justify-content-center text-white text-decoration-none"
                style={{ width: 44, height: 44 }}
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
                  style={{ width: 20, height: 20 }}
                >
                  <FaUserCog size={14} />
                  <FaSearch
                    size={7}
                    className="position-absolute bg-white rounded-circle"
                    style={{ right: -2, bottom: -1 }}
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

            {request.mobile &&
              this.renderActionButton(
                <FaPhone size={14} />,
                "تماس با مشتری",
                () => {
                  window.location.href = `tel:${request.mobile}`;
                },
                "text-success"
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
              <InfoField icon={<FaCoins size={18} />} label="کل دریافتی">
                <span className="fw-semibold">
                  {totalReceived.toLocaleString("fa-IR")} تومان
                </span>
              </InfoField>

              {/* هزینه لوازم مصرفی با امکان ویرایش */}
              <div className="border rounded-4 px-3 py-3 mb-3 bg-white">
                <div className="d-flex align-items-center justify-content-between gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <FaCoins size={18} className="text-muted" />
                    <span className="text-muted">هزینه لوازم مصرفی</span>
                  </div>

                  <button
                    type="button"
                    onClick={this.openEditSuppliesModal}
                    className="btn btn-outline-primary btn-sm rounded-3 d-flex align-items-center gap-2"
                  >
                    <FaEdit />
                    ویرایش هزینه
                  </button>
                </div>

                <div className="fw-semibold mt-2">
                  {suppliesCost.toLocaleString("fa-IR")} تومان
                </div>
              </div>

              <InfoField
                icon={<FaBoxOpen size={18} />}
                label="لوازم مصرفی"
                value={request.abzar_details || "—"}
              />

              <InfoField icon={<FaFileInvoice size={18} />} label="کل اجرت">
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
                <div className="border rounded-4 px-3 py-3 mb-3 bg-white">
                  <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                    <span className="text-muted">فیش واریزی:</span>

                    <button
                      type="button"
                      onClick={this.openEditReceiptModal}
                      className="btn btn-outline-primary btn-sm rounded-3 d-flex align-items-center gap-2"
                    >
                      <FaEdit />
                      ویرایش عکس
                    </button>
                  </div>

                  <div className="d-flex justify-content-center">
                    <img
                      src={receiptImage}
                      alt="فیش واریزی"
                      className="rounded-3 border"
                      onClick={() =>
                        this.setState({ showReceiptImage: true })
                      }
                      style={{
                        width: 180,
                        height: 130,
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                    />
                  </div>
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
            state={{ relatedRequest: request }}
            className="btn btn-primary w-100 rounded-3 py-3 mt-2 text-white text-decoration-none"
          >
            افزودن درخواست مرتبط
          </Link>
        </div>

        {/* مودال ویرایش هزینه لوازم مصرفی */}
        {showEditSuppliesModal && (
          <div
            onClick={this.closeEditSuppliesModal}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 10003,
              background: "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              dir="rtl"
              className="bg-white rounded-4 p-4"
              style={{
                width: "100%",
                maxWidth: 420,
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="fw-bold mb-0">ویرایش هزینه لوازم مصرفی</h5>

                <button
                  type="button"
                  onClick={this.closeEditSuppliesModal}
                  disabled={suppliesLoading}
                  className="btn btn-light rounded-circle"
                  style={{ width: 36, height: 36 }}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">
                  کل دریافتی
                </label>
                <div className="form-control bg-light rounded-3 py-3">
                  {totalReceived.toLocaleString("fa-IR")} تومان
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  هزینه لوازم مصرفی (تومان)
                </label>

                <input
                  type="text"
                  inputMode="decimal"
                  value={suppliesInput}
                  onChange={this.handleSuppliesInputChange}
                  placeholder="مبلغ هزینه لوازم را وارد کنید"
                  className="form-control rounded-3 py-3"
                  disabled={suppliesLoading}
                  autoFocus
                />
              </div>

              <div className="border rounded-3 p-3 mb-3 bg-light">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">کل اجرت:</span>
                  <strong>
                    {previewTotalFee.toLocaleString("fa-IR")} تومان
                  </strong>
                </div>

                <div className="d-flex justify-content-between">
                  <span className="text-muted">پورسانت ۵۰٪:</span>
                  <strong className="text-success">
                    {previewCommission.toLocaleString("fa-IR")} تومان
                  </strong>
                </div>
              </div>

              <div className="small text-muted mb-3">
                پورسانت پس از ذخیره، به‌صورت خودکار در سرور محاسبه می‌شود.
              </div>

              {suppliesError && (
                <div className="alert alert-danger rounded-3 py-2">
                  {suppliesError}
                </div>
              )}

              <button
                type="button"
                onClick={this.handleUpdateSupplies}
                disabled={suppliesLoading || suppliesInput.trim() === ""}
                className="btn btn-primary w-100 rounded-3 py-3"
              >
                {suppliesLoading ? (
                  "در حال ذخیره..."
                ) : (
                  <>
                    <FaSave className="ms-2" />
                    ذخیره هزینه
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={this.closeEditSuppliesModal}
                disabled={suppliesLoading}
                className="btn btn-light border w-100 rounded-3 py-3 mt-2"
              >
                انصراف
              </button>
            </div>
          </div>
        )}

        {/* نمایش تمام‌صفحه عکس */}
        {showReceiptImage && receiptImage && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            onClick={() => this.setState({ showReceiptImage: false })}
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
                      this.setState({ showReceiptImage: false })
                    }
                  />
                </div>

                <div className="modal-body d-flex align-items-center justify-content-center p-2">
                  <img
                    src={receiptImage}
                    alt="فیش واریزی"
                    className="img-fluid"
                    onClick={(event) => event.stopPropagation()}
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

        {/* مودال ویرایش عکس فیش */}
        {showEditReceiptModal && (
          <div
            onClick={this.closeEditReceiptModal}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 10002,
              background: "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              dir="rtl"
              className="bg-white rounded-4 p-4"
              style={{
                width: "100%",
                maxWidth: 420,
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="fw-bold mb-0">ویرایش عکس فیش</h5>

                <button
                  type="button"
                  onClick={this.closeEditReceiptModal}
                  disabled={receiptLoading}
                  className="btn btn-light rounded-circle"
                  style={{ width: 36, height: 36 }}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="text-center mb-3">
                {receiptPreview ? (
                  <img
                    src={receiptPreview}
                    alt="پیش‌نمایش فیش"
                    className="rounded-3 border"
                    style={{
                      width: "100%",
                      maxHeight: 280,
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div className="border rounded-3 p-5 text-muted">
                    <FaImage size={35} />
                    <div className="mt-2">تصویری انتخاب نشده است.</div>
                  </div>
                )}
              </div>

              <label
                htmlFor="receiptImageInput"
                className="btn btn-light border rounded-3 w-100 py-3 mb-3"
              >
                <FaImage className="ms-2" />
                انتخاب عکس جدید
              </label>

              <input
                id="receiptImageInput"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={this.handleReceiptFileChange}
                disabled={receiptLoading}
                className="d-none"
              />

              {receiptFile && (
                <div className="small text-muted mb-3 text-break">
                  فایل انتخاب‌شده: {receiptFile.name}
                </div>
              )}

              <div className="small text-muted mb-3">
                فرمت مجاز: JPG، PNG و WEBP؛ حداکثر حجم ۵ مگابایت.
              </div>

              {receiptError && (
                <div className="alert alert-danger rounded-3 py-2">
                  {receiptError}
                </div>
              )}

              <button
                type="button"
                onClick={this.handleUpdateReceiptImage}
                disabled={receiptLoading || !receiptFile}
                className="btn btn-primary w-100 rounded-3 py-3"
              >
                {receiptLoading ? (
                  "در حال ذخیره عکس..."
                ) : (
                  <>
                    <FaSave className="ms-2" />
                    ذخیره عکس جدید
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={this.closeEditReceiptModal}
                disabled={receiptLoading}
                className="btn btn-light border w-100 rounded-3 py-3 mt-2"
              >
                انصراف
              </button>
            </div>
          </div>
        )}

        {/* مودال تایید تسویه */}
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
              onClick={(event) => event.stopPropagation()}
              dir="rtl"
              style={{
                width: "100%",
                maxWidth: 450,
                background: "#fff",
                borderRadius: "22px 22px 0 0",
                padding: 18,
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

              <h5 className="fw-semibold mb-3 text-end">تایید تسویه</h5>

              <input
                type="text"
                value={confirmText}
                onChange={(event) =>
                  this.setState({ confirmText: event.target.value })
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

        {/* مودال حذف درخواست */}
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
              onClick={(event) => event.stopPropagation()}
              dir="rtl"
              style={{
                width: "100%",
                maxWidth: 390,
                background: "#fff",
                borderRadius: 24,
                padding: 24,
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                textAlign: "center",
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

              <h5 className="fw-bold mb-3 text-danger">حذف درخواست</h5>

              <p
                className="text-muted mb-3"
                style={{ fontSize: 14, lineHeight: 2 }}
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
                onChange={(event) =>
                  this.setState({
                    deleteConfirmText: event.target.value,
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