import React from "react";
import {
  FaUserEdit,
  FaUserShield,
  FaCalendarAlt,
  FaIdCard,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaPhone,
  FaUsers,
  FaGraduationCap,
  FaBook,
  FaChevronLeft,
  FaChevronDown,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import InfoField from "./InfoFieldComponenet";
import Loader from "./LoaderComponent";
import withRouter from "./withRouter";

const API_URL = "https://iranaserviceapp.ir/test/api";

// این کامپوننت ۲ حالت داره:
//   ۱) حالت عادی (پیش‌فرض): پروفایل واقعی یک تعمیرکار رو از GET /profile?id= می‌گیره — دقیقاً همون کد قبلی
//   ۲) حالت pendingMode (وقتی prop pendingMode=true باشه): همون فیلدها رو نشون می‌ده
//      ولی داده رو از GET /changes?id= (جدول user2 یعنی درخواست‌های در انتظار تایید) می‌گیره
//      و پایین صفحه دو دکمه‌ی «تایید» و «رد» داره
class PersonalInfoPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      person: null,
      changeRecordId: null, // فقط تو pendingMode پر می‌شه: id خودِ رکورد user2، لازم برای change-accept
      allSpecials: [], // لیست کامل {id, name} تخصص‌ها — برای تبدیل آیدی‌های خام به اسم
      loading: true,
      error: false,
      selectedImage: null,
      deciding: false,
      decisionMessage: "",
    };

    this.handleBack = this.handleBack.bind(this);
    this.handleChat = this.handleChat.bind(this);
    this.handleApprove = this.handleApprove.bind(this);
    this.handleReject = this.handleReject.bind(this);
  }

  componentDidMount() {
    this.getSpecialsList();
    this.getProfile();
    const navOuter = document.querySelector(".nav-outer");
    if (navOuter) {
        navOuter.style.display = "none";
    }
  }

  // =========================================================
  // لیست کامل تخصص‌ها — برای تبدیل آیدی‌های خام specials به اسم واقعی
  // =========================================================

  getSpecialsList = () => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/specials`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("SPECIALS LIST API:", data);
        this.setState({
          allSpecials: Array.isArray(data.specials) ? data.specials : [],
        });
      })
      .catch((error) => {
        console.error("GET SPECIALS LIST ERROR:", error);
      });
  };

  // =========================================================
  // دریافت پروفایل — بسته به pendingMode از یه اندپوینت متفاوت می‌خونه
  // =========================================================

  getProfile = () => {
    const token = localStorage.getItem("token");
    const { id } = this.props.params;
    const isPending = !!this.props.pendingMode;

    this.setState({
      loading: true,
      error: false,
    });

    // حالت عادی: GET /profile?id=  |  حالت pending: GET /changes?id= (user2)
    const url = isPending
      ? `${API_URL}/changes?id=${id}`
      : `${API_URL}/profile?id=${id}`;

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("خطا در دریافت پروفایل");
        }

        return response.json();
      })
      .then((data) => {
        console.log("PROFILE API:", data);

        // تو حالت عادی جواب زیر کلید user میاد، تو pendingMode زیر کلید users (یه آبجکت تکی، نه آرایه)
        const person = isPending ? data.users : data.user;

        if (!person) {
          throw new Error("اطلاعات کاربر دریافت نشد");
        }

        this.setState({
          person,
          changeRecordId: isPending ? person.id : null,
          loading: false,
        });
      })
      .catch((error) => {
        console.error("GET PROFILE ERROR:", error);

        this.setState({
          person: null,
          loading: false,
          error: true,
        });
      });
  };

  // =========================================================
  // ساخت آدرس تصویر
  // =========================================================

  getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    return `https://iranaserviceapp.ir/test/files/user${image}`;
  };

  // =========================================================
  // باز کردن تصویر
  // =========================================================

  openImage = (image) => {
    if (!image) {
      return;
    }

    this.setState({
      selectedImage: image,
    });
  };

  // =========================================================
  // بستن تصویر
  // =========================================================

  closeImage = () => {
    this.setState({
      selectedImage: null,
    });
  };

  // =========================================================
  // وضعیت نظام وظیفه
  // =========================================================

  getMilitaryStatus = (value) => {
    if (String(value) === "1") {
      return "پایان خدمت";
    }

    if (String(value) === "2") {
      return "معاف";
    }

    if (String(value) === "3") {
      return "در حال خدمت";
    }

    if (String(value) === "0") {
      return "مشمول";
    }

    return value || "---";
  };

  // =========================================================
  // وضعیت تأهل
  // =========================================================

  getMarriedStatus = (value) => {
    if (String(value) === "1") {
      return "متاهل";
    }

    if (String(value) === "0") {
      return "مجرد";
    }

    return value || "---";
  };

  // =========================================================
  // تخصص‌ها — specials از سرور فقط یه آرایه‌ی آیدیه، مثلاً "[13,12]"
  // اینجا هر آیدی رو با allSpecials مچ می‌کنیم تا اسم واقعیش رو نشون بدیم
  // =========================================================

  getSpecialties = (specials) => {
    if (!specials) {
      return "---";
    }

    let ids = specials;

    try {
      if (typeof specials === "string") {
        ids = JSON.parse(specials);
      }
    } catch (error) {
      console.error("SPECIALTIES PARSE ERROR:", error);
      return "---";
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return "---";
    }

    const { allSpecials } = this.state;

    const names = ids
      .map((item) => {
        // اگه از قبل آبجکت کامل {id, name} بود (مثلاً تو فرم ثبت‌نام)
        if (item && typeof item === "object") {
          return item.name || "";
        }

        // حالت واقعی: item فقط یه آیدیه (عدد یا رشته)، باید تو allSpecials پیدا بشه
        const matched = allSpecials.find(
          (sp) => String(sp.id) === String(item)
        );

        return matched ? matched.name : "";
      })
      .filter(Boolean);

    return names.length > 0 ? names.join("، ") : "---";
  };

  // =========================================================
  // بازگشت
  // =========================================================

  handleBack() {
    if (this.props.navigate) {
      this.props.navigate(-1);
      return;
    }

    console.log("navigate وجود ندارد");
  }

  // =========================================================
  // گفتگو
  // =========================================================

  handleChat() {
    console.log("رفتن به گفتگو");
  }

  // =========================================================
  // تایید درخواست ویرایش — POST /change-accept/{id} با status=1
  // سمت سرور با status=1 اطلاعاتِ user2 رو می‌ریزه رو رکورد اصلی user
  // =========================================================

  handleApprove() {
    this.submitDecision(1, "درخواست تایید شد");
  }

  // =========================================================
  // رد درخواست — POST /change-accept/{id} با status=0
  // =========================================================

  handleReject() {
    this.submitDecision(0, "درخواست رد شد");
  }

  submitDecision = (statusValue, successMessage) => {
    const { changeRecordId } = this.state;
    const token = localStorage.getItem("token");

    if (!changeRecordId) {
      return;
    }

    this.setState({ deciding: true, decisionMessage: "" });

    fetch(`${API_URL}/change-accept/${changeRecordId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: statusValue }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("CHANGE ACCEPT API:", data);

        this.setState({
          deciding: false,
          decisionMessage: data.message || successMessage,
        });

        if (String(data.status) === "1") {
          this.handleBack();
        }
      })
      .catch((error) => {
        console.error("CHANGE ACCEPT ERROR:", error);
        this.setState({
          deciding: false,
          decisionMessage: "خطا در ثبت تصمیم",
        });
      });
  };

  // =========================================================
  // Render
  // =========================================================

  render() {
    const {
      person,
      loading,
      error,
      selectedImage,
      deciding,
      decisionMessage,
    } = this.state;

    const isPending = !!this.props.pendingMode;

    if (loading) {
      return <Loader />;
    }

    if (error || !person) {
      return (
        <div className="container px-3 pt-4" dir="rtl">
          <div className="alert alert-danger text-center">
            خطا در دریافت اطلاعات پروفایل
          </div>
        </div>
      );
    }

    const nationalCardImage = this.getImageUrl(person.national_image);
    const selfieImage = this.getImageUrl(person.image);
    const specialties = this.getSpecialties(person.specials);

    return (
      <div dir="rtl">
        <div className="container px-3 pt-4" style={{ paddingBottom: isPending ? 100 : 48 }}>
          {/* هدر */}
          <div className="d-flex align-items-center justify-content-between mb-3">
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

            <h1 className="fs-6 fw-semibold text-dark m-0">
              {isPending ? "درخواست ویرایش پروفایل" : "اطلاعات شخصی"}
            </h1>

            <span></span>
          </div>

          {/* اطلاعات شخصی */}

          <InfoField icon={<FaUserEdit size={18} />} label="نام" value={person.name || "---"} />

          <InfoField
            icon={<FaUserShield size={18} />}
            label="نام خانوادگی"
            value={person.family || "---"}
          />

          <InfoField
            icon={<FaCalendarAlt size={18} />}
            label="تاریخ تولد"
            value={person.birthdate || "---"}
          />

          <InfoField
            icon={<FaIdCard size={18} />}
            label="کد ملی"
            value={person.national_code || "---"}
          />

          <InfoField
            icon={<FaMapMarkerAlt size={18} />}
            label="محل تولد"
            value={person.birth_city || "---"}
          />

          {/* تصویر کارت ملی */}

          <div className="d-flex align-items-start justify-content-between gap-3 border rounded-4 px-3 py-3 mb-3 bg-white">
            <span className="text-muted">تصویر کارت ملی:</span>

            {nationalCardImage ? (
              <img
                src={nationalCardImage}
                alt="تصویر کارت ملی"
                className="rounded-3 border"
                onClick={() => this.openImage(nationalCardImage)}
                style={{
                  width: 160,
                  height: 110,
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            ) : (
              <span className="text-muted">ثبت نشده</span>
            )}
          </div>

          <InfoField
            icon={<FaShieldAlt size={18} />}
            label="وضعیت نظام وظیفه"
            value={this.getMilitaryStatus(person.sarbazi)}
          />

          {/* شماره تماس */}
          <div
            className="position-relative"
            style={{ direction: "rtl" }}
          >
            <InfoField
              icon={<FaPhone size={18} />}
              label="شماره تماس"
              value={person.mobile || "—"}
            />

            {person.mobile && (
              <a
                href={`tel:${person.mobile}`}
                title="شماره تماس"
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
            icon={<FaMapMarkerAlt size={18} />}
            label="آدرس"
            value={person.address || "---"}
          />

          <InfoField
            icon={<FaUsers size={18} />}
            label="وضعیت تاهل"
            value={this.getMarriedStatus(person.married)}
          />

          {/* سوابق تحصیلی */}

          <h2 className="fs-6 fw-semibold text-dark mt-4 mb-3 text-end">سوابق تحصیلی:</h2>

          <InfoField
            icon={<FaGraduationCap size={18} />}
            label="مدرک تحصیلی"
            value={person.degree || "---"}
          />

          <InfoField icon={<FaBook size={18} />} label="رشته تحصیلی" value={person.reshte || "---"} />

          {/* تصویر سلفی */}

          <div className="d-flex align-items-start justify-content-between gap-3 border rounded-4 px-3 py-3 mb-3 bg-white">
            <span className="text-muted">تصویر سلفی:</span>

            {selfieImage ? (
              <img
                src={selfieImage}
                alt="تصویر سلفی"
                className="rounded-3 border"
                onClick={() => this.openImage(selfieImage)}
                style={{
                  width: 160,
                  height: 140,
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            ) : (
              <span className="text-muted">ثبت نشده</span>
            )}
          </div>

          {/* تخصص‌ها */}

          <InfoField
            icon={<FaChevronDown className="text-secondary" size={12} />}
            label="تخصص‌ها"
            value={specialties}
          />

          {/* استان مورد نظر */}

          <h2 className="fs-6 fw-semibold text-dark mt-4 mb-3 text-end">استان مورد نظر:</h2>

          <InfoField
            icon={<FaMapMarkerAlt size={18} />}
            label="استان"
            value={person.state_model?.name || "---"}
          />

          <InfoField
            icon={<FaMapMarkerAlt size={18} />}
            label="شهر"
            value={person.city_model?.name || "---"}
          />

          {decisionMessage && (
            <div className="text-center text-muted small mb-3">{decisionMessage}</div>
          )}
        </div>

        {/* دکمه‌های تایید/رد — فقط تو pendingMode، ثابت پایین صفحه */}
        {isPending && (
          <div
            className="position-fixed bottom-0 start-0 w-100 px-3 pb-4 pt-2 bg-light d-flex gap-2"
            style={{ maxWidth: 450, margin: "0 auto", right: 0 }}
          >
            <button
              type="button"
              onClick={this.handleReject}
              disabled={deciding}
              className="btn btn-outline-danger flex-fill rounded-3 py-3 d-flex align-items-center justify-content-center gap-2"
            >
              <FaTimes size={14} />
              <span>رد</span>
            </button>

            <button
              type="button"
              onClick={this.handleApprove}
              disabled={deciding}
              className="btn btn-primary flex-fill rounded-3 py-3 d-flex align-items-center justify-content-center gap-2"
            >
              <FaCheck size={14} />
              <span>تایید</span>
            </button>
          </div>
        )}

        {/* =====================================================
            Modal نمایش تصویر
        ===================================================== */}

        {selectedImage && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            onClick={this.closeImage}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.9)",
            }}
          >
            <div className="modal-dialog modal-fullscreen m-0" role="document">
              <div
                className="modal-content bg-dark border-0 d-flex align-items-center justify-content-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                  aria-label="بستن"
                  onClick={this.closeImage}
                  style={{
                    zIndex: 10,
                    width: 35,
                    height: 35,
                  }}
                ></button>

                <img
                  src={selectedImage}
                  alt="تصویر بزرگ"
                  className="img-fluid"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100vh",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(PersonalInfoPage);