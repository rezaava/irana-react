import React from "react";
import "./../css/form.css";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaTag,
  FaQuestionCircle,
  FaClock,
  FaClone,
  FaEdit,
} from "react-icons/fa";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";
import Loader from "./LoaderComponent";
import withRouter from "./withRouter";

const API_URL = "https://iranaserviceapp.ir/test/api";

const searchableSelectStyles = {
  container: (base) => ({
    ...base,
    width: "100%",
    minWidth: 0,
  }),
  control: (base, state) => ({
    ...base,
    minHeight: "45px",
    border: "none",
    borderRadius: "8px",
    boxShadow: "none",
    backgroundColor: "transparent",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "2px 8px",
    direction: "rtl",
  }),
  input: (base) => ({
    ...base,
    color: "inherit",
    direction: "rtl",
    textAlign: "right",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#6c757d",
    marginRight: 0,
    marginLeft: 0,
    whiteSpace: "nowrap",
  }),
  singleValue: (base) => ({
    ...base,
    marginRight: 0,
    marginLeft: 0,
    direction: "rtl",
    textAlign: "right",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    flexDirection: "row-reverse",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 1100,
    direction: "rtl",
    textAlign: "right",
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: "220px",
  }),
  option: (base, state) => ({
    ...base,
    textAlign: "right",
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? "#0d6efd"
      : state.isFocused
        ? "#e9ecef"
        : "#fff",
    color: state.isSelected ? "#fff" : "#212529",
  }),
};

class CustomerRequestForm extends React.Component {
  constructor(props) {
    super(props);

    const locationState = props.location?.state || {};
    const params = new URLSearchParams(window.location.search);
    const editRequest = locationState.editRequest || null;
    const relatedRequest = locationState.relatedRequest || null;
    const editId = editRequest?.id || params.get("edit") || null;
    const initialRequest = editRequest || relatedRequest;

    this.state = {
      editId,
      isEditMode: Boolean(editId),
      isRelatedMode: Boolean(relatedRequest),
      fullName: initialRequest?.name || "",
      mobile: initialRequest?.mobile || "",
      landline: initialRequest?.mobile2 || "",
      province:
        initialRequest?.state_model?.id || initialRequest?.state || "",
      address: initialRequest?.address || "",
      deviceType: "",
      deviceBrand: "",
      deviceIssue: initialRequest?.problem || "",
      visitTime: initialRequest?.time
        ? this.parseDate(initialRequest.time)
        : "",
      visitTimeGregorian: initialRequest?.time || "",
      description: initialRequest?.description || "",
      parent: relatedRequest?.id || "",
      states: [],
      deviceTypes: [],
      deviceBrands: [],
      loadingData: true,
      submitting: false,
      loadingEditRequest: Boolean(editId),
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  parseDate(dateString) {
    if (!dateString) return "";

    try {
      const normalizedDate = String(dateString).replace(/\//g, "-");
      const date = new Date(normalizedDate);

      if (Number.isNaN(date.getTime())) return "";

      return date;
    } catch (error) {
      console.error("PARSE DATE ERROR:", error);
      return "";
    }
  }

  async componentDidMount() {
    const lists = await this.loadData();

    if (this.state.isEditMode && this.state.editId) {
      await this.loadEditRequest(this.state.editId, lists);
    } else {
      const request = this.props.location?.state?.relatedRequest;

      if (request) {
        this.setState({
          deviceType: this.findOptionId(
            lists.deviceTypes,
            request.device_type_model?.id || request.device_type
          ),
          deviceBrand: this.findOptionId(
            lists.deviceBrands,
            request.device_brand_model?.id || request.device_brand
          ),
        });
      }
    }
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getHeaders() {
    const token = this.getToken();

    return {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  findOptionId(options, value) {
    if (value === null || value === undefined || value === "") return "";

    const normalizedValue = String(value).trim();

    const option = options.find(
      (item) =>
        String(item.id).trim() === normalizedValue ||
        String(item.name || "").trim() === normalizedValue
    );

    return option ? String(option.id) : "";
  }

  async loadData() {
    try {
      const [statesResponse, typesResponse] = await Promise.all([
        fetch(`${API_URL}/cities`, {
          method: "GET",
          headers: this.getHeaders(),
        }),
        fetch(`${API_URL}/list-type`, {
          method: "GET",
          headers: this.getHeaders(),
        }),
      ]);

      if (!statesResponse.ok || !typesResponse.ok) {
        throw new Error("خطا در دریافت اطلاعات فرم");
      }

      const statesData = await statesResponse.json();
      const typesData = await typesResponse.json();

      const lists = {
        states: statesData.states || [],
        deviceTypes: typesData.types || [],
        deviceBrands: typesData.brands || [],
      };

      this.setState({
        ...lists,
        loadingData: false,
      });

      return lists;
    } catch (error) {
      console.error("LOAD FORM DATA ERROR:", error);

      this.setState({
        loadingData: false,
      });

      alert("دریافت اطلاعات فرم با خطا مواجه شد.");

      return {
        states: [],
        deviceTypes: [],
        deviceBrands: [],
      };
    }
  }

  async loadEditRequest(id, lists) {
    try {
      const response = await fetch(
        `${API_URL}/edit/${encodeURIComponent(id)}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok || String(data.status) !== "1") {
        throw new Error(
          data.message || "دریافت اطلاعات درخواست ناموفق بود."
        );
      }

      const request = data.request;

      if (!request) {
        throw new Error("درخواست پیدا نشد.");
      }

      this.setState({
        editId: request.id,
        isEditMode: true,
        fullName: request.name || "",
        mobile: request.mobile || "",
        landline: request.mobile2 || "",
        province:
          request.state === null || request.state === undefined
            ? ""
            : String(request.state),
        address: request.address || "",
        deviceType: this.findOptionId(
          lists.deviceTypes,
          request.device_type_model?.id || request.device_type
        ),
        deviceBrand: this.findOptionId(
          lists.deviceBrands,
          request.device_brand_model?.id || request.device_brand
        ),
        deviceIssue: request.problem || "",
        description: request.description || "",
        visitTime: request.time ? this.parseDate(request.time) : "",
        visitTimeGregorian: request.time || "",
        loadingEditRequest: false,
      });
    } catch (error) {
      console.error("LOAD EDIT REQUEST ERROR:", error);

      this.setState({
        loadingEditRequest: false,
      });

      alert(
        error.message || "دریافت اطلاعات درخواست برای ویرایش ناموفق بود."
      );
    }
  }

  handleChange(field) {
    return (e) => {
      this.setState({
        [field]: e.target.value,
      });
    };
  }

  handleDateChange = (date) => {
    if (!date) {
      this.setState({
        visitTime: "",
        visitTimeGregorian: "",
      });

      return;
    }

    const gregorianDate = date.convert(gregorian).format("YYYY-MM-DD");

    this.setState({
      visitTime: date,
      visitTimeGregorian: gregorianDate,
    });
  };

  handleSelectChange = (field) => (option) => {
    this.setState({
      [field]: option ? option.value : "",
    });
  };

  async handleSubmit(e) {
    e.preventDefault();

    const {
      editId,
      isEditMode,
      fullName,
      mobile,
      landline,
      province,
      address,
      deviceType,
      deviceBrand,
      deviceIssue,
      visitTimeGregorian,
      description,
      parent,
      deviceTypes,
      deviceBrands,
    } = this.state;

    if (isEditMode && !editId) {
      alert("شناسه درخواست برای ویرایش پیدا نشد.");
      return;
    }
    if (!fullName.trim()) {
      alert("لطفاً نام کامل را وارد کنید.");
      return;
    }

    if (!mobile.trim()) {
      alert("لطفاً شماره موبایل را وارد کنید.");
      return;
    }

    if (!province) {
      alert("لطفاً استان را انتخاب کنید.");
      return;
    }

    if (!address.trim()) {
      alert("لطفاً آدرس را وارد کنید.");
      return;
    }

    if (!deviceType) {
      alert("لطفاً نوع دستگاه را انتخاب کنید.");
      return;
    }

    if (!deviceBrand) {
      alert("لطفاً برند دستگاه را انتخاب کنید.");
      return;
    }

    if (!deviceIssue.trim()) {
      alert("لطفاً ایراد دستگاه را وارد کنید.");
      return;
    }

    if (!isEditMode && !visitTimeGregorian) {
      alert("لطفاً تاریخ مراجعه را انتخاب کنید.");
      return;
    }

    const token = this.getToken();

    if (!token) {
      alert("لطفاً ابتدا وارد حساب کاربری شوید.");
      return;
    }

    const selectedType = deviceTypes.find(
      (type) => String(type.id) === String(deviceType)
    );

    const selectedBrand = deviceBrands.find(
      (brand) => String(brand.id) === String(deviceBrand)
    );

    const requestData = {
      name: fullName,
      mobile,
      mobile2: landline || null,
      state: province,
      device_brand: selectedBrand?.name || "",
      device_type: selectedType?.name || "",
      address,
      problem: deviceIssue,
      description: description || null,
    };

    let user = null;

    try {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        user = JSON.parse(savedUser);
      }
    } catch (error) {
      console.error("USER PARSE ERROR:", error);
    }

    if (!isEditMode) {
      requestData.time = visitTimeGregorian;
      requestData.parent = parent || null;

      if (user?.code) {
        requestData.code = user.code;
      }
    }

    this.setState({
      submitting: true,
    });

    try {
      const url = isEditMode
        ? `${API_URL}/edit-req/${encodeURIComponent(editId)}`
        : `${API_URL}/create`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          ...this.getHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok || String(data.status) !== "1") {
        throw new Error(
          data.message ||
          (isEditMode
            ? "ویرایش درخواست ناموفق بود."
            : "ثبت درخواست ناموفق بود.")
        );
      }

      if (isEditMode) {
        this.props.navigate(`/request-details/${editId}`);
        return;
      }

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
      });

      if (this.props.location?.state) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    } catch (error) {
      console.error("SUBMIT REQUEST ERROR:", error);

      alert(error.message || "عملیات با خطا مواجه شد.");
    } finally {
      this.setState({
        submitting: false,
      });
    }
  }

  render() {
    const {
      isEditMode,
      isRelatedMode,
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
      loadingEditRequest,
      submitting,
    } = this.state;

    const stateOptions = states.map((state) => ({
      value: String(state.id),
      label: state.name,
    }));

    const deviceTypeOptions = deviceTypes.map((type) => ({
      value: String(type.id),
      label: type.name,
    }));

    const deviceBrandOptions = deviceBrands.map((brand) => ({
      value: String(brand.id),
      label: brand.name,
    }));

    if (loadingData || loadingEditRequest) {
      return <Loader />;
    }

    return (
      <>
        {submitting && <Loader />}

        <div className="container pt-3" dir="rtl">
          <div className="mx-auto" style={{ maxWidth: "480px" }}>
            <h6 className="text-center fw-bold text-dark mb-4">
              {isEditMode ? (
                <>
                  <FaEdit className="ms-2" />
                  ویرایش درخواست
                </>
              ) : isRelatedMode ? (
                "ثبت درخواست مرتبط"
              ) : (
                "اطلاعات مشتری را با دقت ثبت کنید"
              )}
            </h6>

            <form onSubmit={this.handleSubmit}>
              {!isEditMode && (
                <div className="custom-input mb-3" hidden>
                  <div className="custom-icon">
                    <FaClone />
                  </div>

                  <input
                    type="text"
                    placeholder="درخواست والد"
                    value={parent}
                    onChange={this.handleChange("parent")}
                    disabled={submitting}
                  />
                </div>
              )}

              <div className="custom-input mb-3">
                <div className="custom-icon">
                  <FaUser />
                </div>

                <input
                  type="text"
                  placeholder="نام کامل"
                  value={fullName}
                  onChange={this.handleChange("fullName")}
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
                  onChange={this.handleChange("mobile")}
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
                  onChange={this.handleChange("landline")}
                  disabled={submitting}
                />
              </div>

              <div className="custom-input mb-3 searchable-select">
                <div className="custom-icon">
                  <FaMapMarkerAlt />
                </div>

                <Select
                  options={stateOptions}
                  value={
                    stateOptions.find(
                      (option) => option.value === String(province)
                    ) || null
                  }
                  onChange={this.handleSelectChange("province")}
                  placeholder="انتخاب استان"
                  noOptionsMessage={() => "موردی پیدا نشد"}
                  loadingMessage={() => "در حال بارگذاری..."}
                  isClearable
                  isSearchable
                  isDisabled={submitting}
                  classNamePrefix="react-select"
                  styles={searchableSelectStyles}
                  menuPlacement="auto"
                  menuPosition="fixed"
                />
              </div>

              <div className="custom-input mb-3">
                <div className="custom-icon">
                  <FaMapMarkerAlt />
                </div>

                <input
                  type="text"
                  placeholder="آدرس"
                  value={address}
                  onChange={this.handleChange("address")}
                  disabled={submitting}
                />
              </div>

              <div className="custom-input mb-3 searchable-select">
                <div className="custom-icon">
                  <FaTag />
                </div>

                <Select
                  options={deviceTypeOptions}
                  value={
                    deviceTypeOptions.find(
                      (option) => option.value === String(deviceType)
                    ) || null
                  }
                  onChange={this.handleSelectChange("deviceType")}
                  placeholder="انتخاب نوع دستگاه"
                  noOptionsMessage={() => "موردی پیدا نشد"}
                  loadingMessage={() => "در حال بارگذاری..."}
                  isClearable
                  isSearchable
                  isDisabled={submitting}
                  classNamePrefix="react-select"
                  styles={searchableSelectStyles}
                  menuPlacement="auto"
                  menuPosition="fixed"
                />
              </div>

              <div className="custom-input mb-3 searchable-select">
                <div className="custom-icon">
                  <FaTag />
                </div>

                <Select
                  options={deviceBrandOptions}
                  value={
                    deviceBrandOptions.find(
                      (option) => option.value === String(deviceBrand)
                    ) || null
                  }
                  onChange={this.handleSelectChange("deviceBrand")}
                  placeholder="انتخاب برند دستگاه"
                  noOptionsMessage={() => "موردی پیدا نشد"}
                  loadingMessage={() => "در حال بارگذاری..."}
                  isClearable
                  isSearchable
                  isDisabled={submitting}
                  classNamePrefix="react-select"
                  styles={searchableSelectStyles}
                  menuPlacement="auto"
                  menuPosition="fixed"
                />
              </div>

              <div className="custom-input mb-3">
                <div className="custom-icon">
                  <FaQuestionCircle />
                </div>

                <input
                  type="text"
                  placeholder="ایراد دستگاه"
                  value={deviceIssue}
                  onChange={this.handleChange("deviceIssue")}
                  disabled={submitting}
                />
              </div>

              {!isEditMode && (
                <div className="custom-input mb-3">
                  <div className="custom-icon">
                    <FaClock />
                  </div>

                  <DatePicker
                    value={visitTime}
                    onChange={this.handleDateChange}
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/MM/DD"
                    calendarPosition="top-right"
                    inputClass="form-control"
                    placeholder="زمان مراجعه"
                    disabled={submitting}
                  />
                </div>
              )}

              <div className="custom-input mb-3">
                <div className="custom-icon">
                  <FaQuestionCircle />
                </div>

                <input
                  type="text"
                  placeholder="توضیحات"
                  value={description}
                  onChange={this.handleChange("description")}
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 rounded-3 py-3 mt-2"
                disabled={submitting}
              >
                {submitting
                  ? "در حال ثبت..."
                  : isEditMode
                    ? "ذخیره تغییرات"
                    : isRelatedMode
                      ? "ثبت درخواست مرتبط"
                      : "ثبت درخواست"}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(CustomerRequestForm);