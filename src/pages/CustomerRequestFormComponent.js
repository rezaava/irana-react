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
  FaClone,
} from "react-icons/fa";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";

import Loader from "./LoaderComponent";
import withRouter from "./withRouter";

class CustomerRequestForm extends React.Component {
  constructor(props) {
    super(props);

    const location = props.location || {};

    const relatedRequest =
      location.state && location.state.relatedRequest
        ? location.state.relatedRequest
        : null;

    console.log(
      "RELATED REQUEST:",
      relatedRequest
    );

    this.state = {
      fullName: relatedRequest
        ? relatedRequest.name || ""
        : "",

      mobile: relatedRequest
        ? relatedRequest.mobile || ""
        : "",

      landline: relatedRequest
        ? relatedRequest.mobile2 || ""
        : "",

      province:
        relatedRequest &&
        relatedRequest.state_model
          ? relatedRequest.state_model.id ||
            relatedRequest.state ||
            ""
          : relatedRequest
          ? relatedRequest.state || ""
          : "",

      address: relatedRequest
        ? relatedRequest.address || ""
        : "",

      deviceType:
        relatedRequest &&
        relatedRequest.device_type_model
          ? relatedRequest.device_type_model.id ||
            relatedRequest.device_type ||
            ""
          : relatedRequest
          ? relatedRequest.device_type || ""
          : "",

      deviceBrand:
        relatedRequest &&
        relatedRequest.device_brand_model
          ? relatedRequest.device_brand_model.id ||
            relatedRequest.device_brand ||
            ""
          : relatedRequest
          ? relatedRequest.device_brand || ""
          : "",

      deviceIssue: relatedRequest
        ? relatedRequest.problem || ""
        : "",

      visitTime: "",

      visitTimeGregorian: relatedRequest
        ? relatedRequest.time || ""
        : "",

      description: relatedRequest
        ? relatedRequest.description || ""
        : "",

      parent: relatedRequest
        ? relatedRequest.id || ""
        : "",

      states: [],
      deviceTypes: [],
      deviceBrands: [],

      loadingData: true,
      submitting: false,
    };

    this.handleChange =
      this.handleChange.bind(this);

    this.handleSubmit =
      this.handleSubmit.bind(this);

    this.loadData =
      this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  getToken() {
    return localStorage.getItem("token");
  }

  async loadData() {
    try {
      this.setState({
        loadingData: true,
      });

      const token = this.getToken();

      const [statesResponse, typesResponse] =
        await Promise.all([
          fetch(
            "https://iranaserviceapp.ir/test/api/cities",
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                ...(token
                  ? {
                      Authorization: `Bearer ${token}`,
                    }
                  : {}),
              },
            }
          ),

          fetch(
            "https://iranaserviceapp.ir/test/api/list-type",
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                ...(token
                  ? {
                      Authorization: `Bearer ${token}`,
                    }
                  : {}),
              },
            }
          ),
        ]);

      const statesData =
        await statesResponse.json();

      const typesData =
        await typesResponse.json();

      this.setState({
        states: statesData.states || [],
        deviceTypes: typesData.types || [],
        deviceBrands: typesData.brands || [],
        loadingData: false,
      });
    } catch (error) {
      console.error(
        "Load data error:",
        error
      );

      this.setState({
        loadingData: false,
      });
    }
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
      visitTimeGregorian,
      description,
      parent,
      deviceTypes,
      deviceBrands,
    } = this.state;

    if (!visitTimeGregorian) {
      alert("لطفاً تاریخ مراجعه را انتخاب کنید.");
      return;
    }

    const token = this.getToken();

    let user = null;

    try {
      const savedUser =
        localStorage.getItem("user");

      if (savedUser) {
        user = JSON.parse(savedUser);
      }
    } catch (error) {
      console.error(
        "User parse error:",
        error
      );
    }

    const requestData = {
      name: fullName,
      mobile: mobile,
      mobile2: landline,
      state: province,

      device_brand:
        deviceBrands.find(
          (brand) =>
            String(brand.id) ===
            String(deviceBrand)
        )?.name || "",

      device_type:
        deviceTypes.find(
          (type) =>
            String(type.id) ===
            String(deviceType)
        )?.name || "",

      address: address,
      problem: deviceIssue,
      description: description,

      // تاریخ میلادی برای API
      time: visitTimeGregorian,

      parent: parent || null,
    };

    if (user && user.code) {
      requestData.code = user.code;
    }

    console.log(
      "JALALI VISIT TIME:",
      visitTime
    );

    console.log(
      "GREGORIAN VISIT TIME:",
      visitTimeGregorian
    );

    console.log(
      "DATA SENT TO API:",
      requestData
    );

    this.setState({
      submitting: true,
    });

    fetch(
      "https://iranaserviceapp.ir/test/api/create",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Accept: "application/json",

          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },

        body: JSON.stringify(
          requestData
        ),
      }
    )
      .then(async (response) => {
        const data =
          await response.json();

        console.log(
          "Create response:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.message ||
              "خطا در ثبت درخواست"
          );
        }

        return data;
      })

      .then((data) => {
        if (data.status === "1") {
          this.setState({
            fullName: "",
            mobile: "",
            landline: "",
            province: "",
            address: "",
            deviceType: "",
            deviceBrand: "",
            deviceIssue: "",
            visitTime: "",
            visitTimeGregorian: "",
            description: "",
            parent: "",
            submitting: false,
          });

          if (
            this.props.location &&
            this.props.location.state
          ) {
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
          }
        } else {
          this.setState({
            submitting: false,
          });
        }
      })

      .catch((error) => {
        console.error(
          "Create request error:",
          error
        );

        this.setState({
          submitting: false,
        });

        alert(
          error.message ||
            "ثبت درخواست با خطا مواجه شد."
        );
      });
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
      parent,
      states,
      deviceTypes,
      deviceBrands,
      loadingData,
      submitting,
    } = this.state;

    return (
      <>
        {submitting && <Loader />}

        <div className="container pt-3">
          <div
            className="mx-auto"
            style={{
              maxWidth: "480px",
            }}
          >
            <h6 className="text-center fw-bold text-dark mb-4">
              اطلاعات مشتری را با دقت ثبت کنید
            </h6>

            <form
              onSubmit={
                this.handleSubmit
              }
            >
              <div
                className="custom-input mb-3"
                hidden
              >
                <div className="custom-icon">
                  <FaClone />
                </div>

                <input
                  type="text"
                  placeholder="درخواست والد"
                  value={parent}
                  onChange={this.handleChange(
                    "parent"
                  )}
                  disabled={submitting}
                />
              </div>

              <div className="custom-input mb-3">
                <div className="custom-icon">
                  <FaUser />
                </div>

                <input
                  type="text"
                  placeholder="نام کامل"
                  value={fullName}
                  onChange={this.handleChange(
                    "fullName"
                  )}
                  disabled={submitting}
                />
              </div>

              <div className="custom-input mb-3">
                <div className="custom-icon">
                  <FaPhone />
                </div>

                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="شماره موبایل"
                  value={mobile}
                  onChange={this.handleChange(
                    "mobile"
                  )}
                  disabled={submitting}
                />
              </div>

              <div className="custom-input mb-3">
                <div className="custom-icon">
                  <FaPhone />
                </div>

                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="تلفن ثابت"
                  value={landline}
                  onChange={this.handleChange(
                    "landline"
                  )}
                  disabled={submitting}
                />
              </div>

              <div className="custom-input mb-3">
                <div className="custom-icon">
                  <FaMapMarkerAlt />
                </div>

                <select
                  value={province}
                  onChange={this.handleChange(
                    "province"
                  )}
                  disabled={
                    loadingData ||
                    submitting
                  }
                >
                  <option
                    value=""
                    disabled
                  >
                    استان
                  </option>

                  {states.map(
                    (state) => (
                      <option
                        key={state.id}
                        value={state.id}
                      >
                        {state.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="custom-input mb-3">
                <div className="custom-icon">
                  <FaMapMarkerAlt />
                </div>

                <input
                  type="text"
                  placeholder="آدرس"
                  value={address}
                  onChange={this.handleChange(
                    "address"
                  )}
                  disabled={submitting}
                />
              </div>

              <div className="custom-input mb-3">
                <div className="custom-icon">
                  <FaImage />
                </div>

                <select
                  value={deviceType}
                  onChange={this.handleChange(
                    "deviceType"
                  )}
                  disabled={
                    loadingData ||
                    submitting
                  }
                >
                  <option
                    value=""
                    disabled
                  >
                    نوع دستگاه
                  </option>

                  {deviceTypes.map(
                    (type) => (
                      <option
                        key={type.id}
                        value={type.id}
                      >
                        {type.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="custom-input mb-3">
                <div className="custom-icon">
                  <FaTag />
                </div>

                <select
                  value={deviceBrand}
                  onChange={this.handleChange(
                    "deviceBrand"
                  )}
                  disabled={
                    loadingData ||
                    submitting
                  }
                >
                  <option
                    value=""
                    disabled
                  >
                    برند دستگاه
                  </option>

                  {deviceBrands.map(
                    (brand) => (
                      <option
                        key={brand.id}
                        value={brand.id}
                      >
                        {brand.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="custom-input mb-3">
                <div className="custom-icon">
                  <FaQuestionCircle />
                </div>

                <input
                  type="text"
                  placeholder="ایراد دستگاه"
                  value={deviceIssue}
                  onChange={this.handleChange(
                    "deviceIssue"
                  )}
                  disabled={submitting}
                />
              </div>

              <div className="custom-input mb-3">
                <div className="custom-icon">
                  <FaClock />
                </div>

                <DatePicker
                  value={visitTime}
                  onChange={(date) => {
                    if (!date) {
                      this.setState({
                        visitTime: "",
                        visitTimeGregorian:
                          "",
                      });

                      return;
                    }

                    const jalaliDate =
                      date.format(
                        "YYYY/MM/DD"
                      );
const gregorianDate = date
  .convert(gregorian)
  .format("YYYY/MM/DD")
  .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
  .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
                    console.log(
                      "SELECTED JALALI DATE:",
                      jalaliDate
                    );

                    console.log(
                      "CONVERTED GREGORIAN DATE:",
                      gregorianDate
                    );

                    this.setState({
                      visitTime:
                        jalaliDate,

                      visitTimeGregorian:
                        gregorianDate,
                    });
                  }}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  placeholder="0000/00/00"
                  calendarPosition="top-right"
                  inputClass="custom-date-input"
                  disabled={submitting}
                />
              </div>

              <div className="custom-input mb-3">
                <div className="custom-icon">
                  <FaLink />
                </div>

                <input
                  type="text"
                  placeholder="توضیحات"
                  value={description}
                  onChange={this.handleChange(
                    "description"
                  )}
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                className="btn btn-sub w-100 fw-bold py-2 rounded-4"
                disabled={
                  loadingData ||
                  submitting
                }
              >
                <small>
                  {submitting
                    ? "در حال ثبت..."
                    : "ثبت درخواست"}
                </small>
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(
  CustomerRequestForm
);