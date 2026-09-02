import React, { Component } from 'react';
import { FaUser, FaCalendarAlt, FaIdCard, FaMapMarkerAlt, FaPhone, FaHome, FaHeart, FaGraduationCap, FaCheckCircle, FaCamera } from 'react-icons/fa';

// کامپوننت پایین صفحه
const FooterComponent = () => (
  <div className="text-center py-2 mt-3" style={{ backgroundColor: '#e9ecef', fontSize: '14px' }}>
    <p className="mb-0 text-muted">سامانه مدیریت اطلاعات پرسنلی</p>
  </div>
);

class PersonalInfoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        firstName: 'علی',
        lastName: 'عبداللهی',
        birthDate: '1362/08/13',
        nationalId: '4431883691',
        birthPlace: 'یزد',
        militaryStatus: 'پایان خدمت',
        phone: '09336407375',
        address: 'خیابان ابودر انتهای خیابان عاشری کوچه احمدی پلاک 11',
        maritalStatus: 'متاهل',
        education: 'دیپلم',
        fieldOfStudy: 'مکانیک',
        province: 'تهران',
        city: 'تهران'
      }
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log('فرم ارسال شد:', this.state.formData);
    alert('اطلاعات با موفقیت ثبت شد!');
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }));
  };

  render() {
    const { formData } = this.state;

    return (
      <div className="container-fluid py-3" dir="rtl" style={{ maxWidth: '900px' }}>
        <div className="card shadow-sm">
          {/* هدر - اطلاعات شخصی */}
          <div className="card-header bg-primary text-white py-2">
            <h5 className="mb-0">
              <FaUser className="me-2" />
              اطلاعات شخصی
            </h5>
          </div>

          <div className="card-body p-3">
            <form onSubmit={this.handleSubmit}>
              {/* ردیف اول: نام و نام خانوادگی */}
              <div className="row mb-2">
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    <FaUser className="me-1 text-primary" />
                    نام
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="firstName"
                    value={formData.firstName}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    <FaUser className="me-1 text-primary" />
                    نام خانوادگی
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="lastName"
                    value={formData.lastName}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              {/* ردیف دوم: تاریخ تولد و کد ملی */}
              <div className="row mb-2">
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    <FaCalendarAlt className="me-1 text-primary" />
                    تاریخ تولد
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    <FaIdCard className="me-1 text-primary" />
                    کد ملی
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              {/* ردیف سوم: محل تولد و وضعیت نظام وظیفه */}
              <div className="row mb-2">
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    <FaMapMarkerAlt className="me-1 text-primary" />
                    محل تولد
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    <FaCheckCircle className="me-1 text-success" />
                    وضعیت نظام وظیفه
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="militaryStatus"
                    value={formData.militaryStatus}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              {/* ردیف چهارم: شماره تماس و وضعیت تاهل */}
              <div className="row mb-2">
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    <FaPhone className="me-1 text-primary" />
                    شماره تماس
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="phone"
                    value={formData.phone}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    <FaHeart className="me-1 text-danger" />
                    وضعیت تاهل
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              {/* ردیف پنجم: آدرس */}
              <div className="row mb-2">
                <div className="col-12">
                  <label className="form-label fw-bold small">
                    <FaHome className="me-1 text-primary" />
                    آدرس
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="address"
                    value={formData.address}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              {/* ردیف ششم: سوابق تحصیلی */}
              <div className="row mb-2">
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    <FaGraduationCap className="me-1 text-primary" />
                    مدرک تحصیلی
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="education"
                    value={formData.education}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    <FaGraduationCap className="me-1 text-primary" />
                    رشته تحصیلی
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              {/* ردیف هفتم: تصویر سلفی */}
              <div className="row mb-2">
                <div className="col-12">
                  <label className="form-label fw-bold small">
                    <FaCamera className="me-1 text-primary" />
                    تصویر سلفی
                  </label>
                  <div className="border rounded p-2 text-center" style={{ backgroundColor: '#f8f9fa', minHeight: '60px', borderStyle: 'dashed' }}>
                    <p className="text-muted mb-0 small">
                      <FaCamera className="me-1" />
                      کلیک کنید یا تصویر را انتخاب کنید
                    </p>
                  </div>
                </div>
              </div>

              {/* ردیف هشتم: استان و شهر */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    <FaMapMarkerAlt className="me-1 text-primary" />
                    استان
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="province"
                    value={formData.province}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    <FaMapMarkerAlt className="me-1 text-primary" />
                    شهر
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="city"
                    value={formData.city}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              {/* دکمه ثبت */}
              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-sm">
                  ثبت اطلاعات
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* کامپوننت پایین صفحه */}
        <FooterComponent />
      </div>
    );
  }
}

export default PersonalInfoForm;