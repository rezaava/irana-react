import React from "react";
import "./../css/form.css";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaImage,
  FaTag,
  FaQuestionCircle,
  FaClock,
  FaLink,
} from "react-icons/fa";

class CustomerRequestForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fullName: "",
      mobile: "",
      landline: "",
      province: "",
      address: "",
      deviceType: "",
      deviceBrand: "",
      deviceIssue: "",
      visitTime: "",
      description: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(field) {
    return (e) => {
      this.setState({
        [field]: e.target.value,
      });
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    console.log(this.state);
  }

  render() {
    const {
      fullName,
      mobile,
      landline,
      province,
      address,
      deviceType,
      deviceBrand,
      deviceIssue,
      visitTime,
      description,
    } = this.state;

    return (
      <div className="container pt-3"
      >
        <div
          className="mx-auto"
          style={{ maxWidth: "480px" }}
        >

          {/* عنوان */}
          <h6 className="text-center fw-bold text-dark mb-4">
            اطلاعات مشتری را با دقت ثبت کنید
          </h6>

          <form onSubmit={this.handleSubmit}>

            {/* نام کامل */}
            <div className="custom-input mb-3">
              <div className="custom-icon">
                <FaUser />
              </div>

              <input
                type="text"
                placeholder="نام کامل"
                value={fullName}
                onChange={this.handleChange("fullName")}
              />
            </div>

            {/* شماره موبایل */}
            <div className="custom-input mb-3">
              <div className="custom-icon">
                <FaPhone />
              </div>

              <input
                type="tel"
                inputMode="numeric"
                placeholder="شماره موبایل"
                value={mobile}
                onChange={this.handleChange("mobile")}
              />
            </div>

            {/* تلفن ثابت */}
            <div className="custom-input mb-3">
              <div className="custom-icon">
                <FaPhone />
              </div>

              <input
                type="tel"
                inputMode="numeric"
                placeholder="تلفن ثابت"
                value={landline}
                onChange={this.handleChange("landline")}
              />
            </div>

            {/* استان */}
            <div className="custom-input mb-3">
              <div className="custom-icon">
                <FaMapMarkerAlt />
              </div>

              <select
                value={province}
                onChange={this.handleChange("province")}
              >
                <option value="" disabled>
                  استان
                </option>

                <option value="tehran">تهران</option>
                <option value="isfahan">اصفهان</option>
                <option value="fars">فارس</option>
                <option value="khorasan-razavi">
                  خراسان رضوی
                </option>
                <option value="alborz">البرز</option>
              </select>
            </div>

            {/* آدرس */}
            <div className="custom-input mb-3">
              <div className="custom-icon">
                <FaMapMarkerAlt />
              </div>

              <input
                type="text"
                placeholder="آدرس"
                value={address}
                onChange={this.handleChange("address")}
              />
            </div>

            {/* نوع دستگاه */}
            <div className="custom-input mb-3">
              <div className="custom-icon">
                <FaImage />
              </div>

              <select
                value={deviceType}
                onChange={this.handleChange("deviceType")}
              >
                <option value="" disabled>
                  نوع دستگاه
                </option>

                <option value="washer">
                  ماشین لباسشویی
                </option>

                <option value="fridge">
                  یخچال
                </option>

                <option value="ac">
                  کولر گازی
                </option>

                <option value="tv">
                  تلویزیون
                </option>
              </select>
            </div>

            {/* برند دستگاه */}
            <div className="custom-input mb-3">
              <div className="custom-icon">
                <FaTag />
              </div>

              <select
                value={deviceBrand}
                onChange={this.handleChange("deviceBrand")}
              >
                <option value="" disabled>
                  برند دستگاه
                </option>

                <option value="samsung">
                  سامسونگ
                </option>

                <option value="lg">
                  ال‌جی
                </option>

                <option value="snowa">
                  اسنوا
                </option>

                <option value="pakshoma">
                  پاکشوما
                </option>
              </select>
            </div>

            {/* ایراد دستگاه */}
            <div className="custom-input mb-3">
              <div className="custom-icon">
                <FaQuestionCircle />
              </div>

              <input
                type="text"
                placeholder="ایراد دستگاه"
                value={deviceIssue}
                onChange={this.handleChange("deviceIssue")}
              />
            </div>

            {/* زمان مراجعه */}
            <div className="custom-input mb-3">
              <div className="custom-icon">
                <FaClock />
              </div>

              <input
                type="text"
                placeholder="زمان مراجعه"
                value={visitTime}
                onChange={this.handleChange("visitTime")}
              />
            </div>

            {/* توضیحات */}
            <div className="custom-input mb-3">
              <div className="custom-icon">
                <FaLink />
              </div>

              <input
                type="text"
                placeholder="توضیحات"
                value={description}
                onChange={this.handleChange("description")}
              />
            </div>

            {/* دکمه */}
            <button
              type="submit"
              className="btn btn-sub w-100 fw-bold py-2 rounded-4">
                <small>

              ثبت درخواست
                </small>
            </button>

          </form>
        </div>
      </div>
    );
  }
}

export default CustomerRequestForm;