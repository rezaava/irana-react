import React from "react";
import {
  FaUserEdit,
  FaUserShield,
  FaCalendarAlt,
  FaIdCard,
  FaMapMarkerAlt,
  FaFolderOpen,
  FaShieldAlt,
  FaPhone,
  FaImage,
  FaUsers,
  FaGraduationCap,
  FaBook,
  FaChevronLeft,
  FaChevronDown,
  FaCommentDots,
} from "react-icons/fa";
import InfoField from "./InfoFieldComponenet";

// داده‌ی نمونه — در پروژه‌ی واقعی از API می‌آید
const SAMPLE_PERSON = {
  firstName: "علی",
  lastName: "عبداللهی",
  birthDate: "1362/08/13",
  nationalCode: "4431883691",
  birthPlace: "یزد",
  nationalCardImage: "https://placehold.co/300x200?text=کارت+ملی",
  militaryStatus: "پایان خدمت",
  phone: "09336407375",
  address: "خیابان ابوذر انتهای خیابان عاشری کوچه احمدی پلاک 11",
  maritalStatus: "متاهل",
  educationDegree: "دیپلم",
  educationField: "مکانیک",
  selfieImage: "https://placehold.co/300x260?text=تصویر+سلفی",
  specialties: [],
  targetProvince: "تهران",
  targetCity: "تهران",
};

// صفحه‌ی اطلاعات شخصی
class PersonalInfoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      person: SAMPLE_PERSON,
      specialty: "",
    };
    this.handleBack = this.handleBack.bind(this);
    this.handleChat = this.handleChat.bind(this);
  }

  handleBack() {
    // مسیر بازگشت بعداً وصل می‌شود
    console.log("بازگشت به صفحه‌ی قبل");
  }

  handleChat() {
    // مسیر گفتگو بعداً وصل می‌شود
    console.log("رفتن به گفتگو");
  }

  render() {
    const { person, specialty } = this.state;

    return (
      <div>
        <div className="container px-3 pt-4 pb-5">
          {/* هدر */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <button
              type="button"
              onClick={this.handleBack}
              className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36 }}
            >
              <FaChevronLeft size={14} />
            </button>
            <h1 className="fs-6 fw-semibold text-dark m-0">اطلاعات شخصی</h1>
            <span></span>
          </div>

          <InfoField icon={<FaUserEdit size={18} />} label="نام" value={person.firstName} />
          <InfoField icon={<FaUserShield size={18} />} label="نام خانوادگی" value={person.lastName} />
          <InfoField icon={<FaCalendarAlt size={18} />} label="تاریخ تولد" value={person.birthDate} />
          <InfoField icon={<FaIdCard size={18} />} label="کد ملی" value={person.nationalCode} />
          <InfoField icon={<FaMapMarkerAlt size={18} />} label="محل تولد" value={person.birthPlace} />

          {/* تصویر کارت ملی */}
          <div className="d-flex align-items-start justify-content-between gap-3 border rounded-4 px-3 py-3 mb-3 bg-white">
            <span className="text-muted">تصویر کارت ملی:</span>
            <img
              src={person.nationalCardImage}
              alt="تصویر کارت ملی"
              className="rounded-3 border"
              style={{ width: 160, height: 110, objectFit: "cover" }}
            />
          </div>

          <InfoField icon={<FaShieldAlt size={18} />} label="وضعیت نظام وظیفه" value={person.militaryStatus} />
          <InfoField icon={<FaPhone size={18} />} label="شماره تماس" value={person.phone} />
          <InfoField icon={<FaImage size={18} />} label="آدرس" value={person.address} />
          <InfoField icon={<FaUsers size={18} />} label="وضعیت تاهل" value={person.maritalStatus} />

          {/* سوابق تحصیلی */}
          <h2 className="fs-6 fw-semibold text-dark mt-4 mb-3 text-end">سوابق تحصیلی:</h2>
          <InfoField icon={<FaGraduationCap size={18} />} label="مدرک تحصیلی" value={person.educationDegree} />
          <InfoField icon={<FaBook size={18} />} label="رشته تحصیلی" value={person.educationField} />

          {/* تصویر سلفی */}
          <div className="d-flex align-items-start justify-content-between gap-3 border rounded-4 px-3 py-3 mb-3 bg-white">
            <span className="text-muted">تصویر سلفی:</span>
            <img
              src={person.selfieImage}
              alt="تصویر سلفی"
              className="rounded-3 border"
              style={{ width: 160, height: 140, objectFit: "cover" }}
            />
          </div>

          <InfoField icon={<FaChevronDown className="text-secondary" size={12} />} label="تخصص‌ها" value={'یخچال و فریزر'} />

          {/* استان مورد نظر */}
          <h2 className="fs-6 fw-semibold text-dark mt-4 mb-3 text-end">استان مورد نظر:</h2>
          <InfoField icon={<FaMapMarkerAlt size={18} />} label="استان" value={person.targetProvince} />
          <InfoField icon={<FaImage size={18} />} label="شهر" value={person.targetCity} />
        </div>
      </div>
    );
  }
}

export default PersonalInfoPage;