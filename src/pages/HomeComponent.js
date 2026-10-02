import React from "react";
import "./../css/index.css";
import { FaRegBell } from "react-icons/fa";

import withRouter from "./withRouter";
import AuthCheck from "./AuthCheckComponent";
import Loader from "./LoaderComponent";

const API_URL = "https://iranaserviceapp.ir/test/api";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authChecking: true,
      authenticated: false,

      loading: true,

      // اطلاعات شهرها
      cities7: [],
      cities30: [],
      cities90: [],
      cities180: [],

      // اطلاعات کاربران / تعمیرکاران
      users7: [],
      users30: [],
      users90: [],
      users180: [],

      // تعداد نمایش
      cityLimit: 3,
      repairmanLimit: 3,

      // بازه انتخابی
      cityPeriod: "week",
      repairmanPeriod: "week",

      // تعداد تغییرات
      changes: 0,
    };
  }

  // =====================================================
  // شروع کامپوننت
  // =====================================================

  componentDidMount() {
    const isAuthenticated = AuthCheck();

    if (!isAuthenticated) {
      return;
    }

    this.setState(
      {
        authChecking: false,
        authenticated: true,
      },
      () => {
        this.getHome();
      }
    );
  }

  // =====================================================
  // دریافت اطلاعات Home
  // =====================================================

  getHome = () => {
    const token = localStorage.getItem("token");

    this.setState({
      loading: true,
    });

    fetch(`${API_URL}/home`, {
      method: "GET",

      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        console.log("========== HOME RESPONSE ==========");
        console.log(data);
        console.log("===================================");

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "خطا در دریافت اطلاعات صفحه اصلی"
          );
        }

        return data;
      })
      .then((data) => {
        if (data.status !== "1") {
          throw new Error(
            data.message ||
              "دریافت اطلاعات با خطا مواجه شد."
          );
        }

        this.setState({
          cities7: Array.isArray(data.cities7)
            ? data.cities7
            : [],

          cities30: Array.isArray(data.cities30)
            ? data.cities30
            : [],

          cities90: Array.isArray(data.cities90)
            ? data.cities90
            : [],

          cities180: Array.isArray(data.cities180)
            ? data.cities180
            : [],

          users7: Array.isArray(data.users7)
            ? data.users7
            : [],

          users30: Array.isArray(data.users30)
            ? data.users30
            : [],

          users90: Array.isArray(data.users90)
            ? data.users90
            : [],

          users180: Array.isArray(data.users180)
            ? data.users180
            : [],

          changes: Number(data.changes || 0),

          loading: false,
        });
      })
      .catch((error) => {
        console.error("HOME ERROR:", error);

        this.setState({
          loading: false,
        });
      });
  };

  // =====================================================
  // تغییر تعداد شهرها
  // =====================================================

  handleCityLimitChange = (e) => {
    this.setState({
      cityLimit: Number(e.target.value),
    });
  };

  // =====================================================
  // تغییر بازه شهرها
  // =====================================================

  handleCityPeriodChange = (e) => {
    this.setState({
      cityPeriod: e.target.value,
    });
  };

  // =====================================================
  // تغییر تعداد تعمیرکاران
  // =====================================================

  handleRepairmanLimitChange = (e) => {
    this.setState({
      repairmanLimit: Number(e.target.value),
    });
  };

  // =====================================================
  // تغییر بازه تعمیرکاران
  // =====================================================

  handleRepairmanPeriodChange = (e) => {
    this.setState({
      repairmanPeriod: e.target.value,
    });
  };

  // =====================================================
  // گرفتن آرایه شهرها بر اساس بازه
  // =====================================================

  getCitiesByPeriod = () => {
    const {
      cityPeriod,
      cities7,
      cities30,
      cities90,
      cities180,
    } = this.state;

    switch (cityPeriod) {
      case "week":
        return cities7;

      case "month":
        return cities30;

      case "90":
        return cities90;

      case "year":
        return cities180;

      default:
        return cities7;
    }
  };

  // =====================================================
  // گرفتن آرایه کاربران بر اساس بازه
  // =====================================================

  getUsersByPeriod = () => {
    const {
      repairmanPeriod,
      users7,
      users30,
      users90,
      users180,
    } = this.state;

    switch (repairmanPeriod) {
      case "week":
        return users7;

      case "month":
        return users30;

      case "90":
        return users90;

      case "year":
        return users180;

      default:
        return users7;
    }
  };

  // =====================================================
  // نام استان
  // =====================================================

  getStateName = (item) => {
    /*
     * طبق API:
     *
     * item.city_model
     *
     * اطلاعات استان داخل آن قرار دارد.
     */

    if (item.city_model) {
      return (
        item.city_model.name ||
        item.city_model.title ||
        "بدون نام"
      );
    }

    return (
      item.state_name ||
      item.city_name ||
      item.name ||
      item.title ||
      "بدون نام"
    );
  };

  // =====================================================
  // نام تعمیرکار
  // =====================================================

  getUserName = (user) => {
    const name = user.name || "";
    const family = user.family || "";

    const fullName =
      `${name} ${family}`.trim();

    return fullName || "بدون نام";
  };

  // =====================================================
  // عکس تعمیرکار
  // =====================================================

  getUserImage = (user) => {
    const image =
      user.img ||
      user.image ||
      user.avatar ||
      user.profile_image ||
      user.profpic;

    if (!image) {
      const name = this.getUserName(user);

      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=e9ecef&color=495057&size=40&rounded=true`;
    }

    if (
      String(image).startsWith("http://") ||
      String(image).startsWith("https://")
    ) {
      return image;
    }

    return `https://iranaserviceapp.ir/test/${String(
      image
    ).replace(/^\/+/, "")}`;
  };

  // =====================================================
  // تعداد درخواست کاربر
  // =====================================================

  getUserRequestCount = (user) => {
    const { repairmanPeriod } = this.state;

    if (repairmanPeriod === "week") {
      return Number(user.reqs7 || 0);
    }

    if (repairmanPeriod === "month") {
      return Number(user.reqs30 || 0);
    }

    if (repairmanPeriod === "90") {
      return Number(user.reqs90 || 0);
    }

    if (repairmanPeriod === "year") {
      return Number(user.reqs180 || 0);
    }

    return 0;
  };

  render() {
    // ===================================================
    // بررسی احراز هویت
    // ===================================================

    if (this.state.authChecking) {
      return <Loader />;
    }

    if (!this.state.authenticated) {
      return null;
    }

    const {
      cityLimit,
      cityPeriod,

      repairmanLimit,
      repairmanPeriod,

      loading,
    } = this.state;

    // ===================================================
    // اطلاعات شهرهای انتخاب‌شده
    // ===================================================

    const cities = this.getCitiesByPeriod();

    const displayedCities = cities.slice(
      0,
      cityLimit
    );

    // ===================================================
    // اطلاعات تعمیرکاران انتخاب‌شده
    // ===================================================

    const users = this.getUsersByPeriod();

    const displayedUsers = users.slice(
      0,
      repairmanLimit
    );

    return (
      <main className="container pt-5">

        {/* =================================================
            اعلان
        ================================================= */}

        <div className="fixed-top-left">
          <FaRegBell
            size={24}
            color="#495057"
          />
        </div>

        {/* =================================================
            شهرهای پر درخواست
        ================================================= */}

        <div className="card shadow-sm border-0 mb-4">

          <div className="card-body p-4 min-h-50">

            <h4 className="h6 fw-bold text-center mb-2">
              شهرهای پر درخواست
            </h4>

            {/* فیلترها */}

            <div className="d-flex justify-content-end gap-2 mb-3 row">

              {/* تعداد شهر */}

              <select
                value={cityLimit}
                onChange={
                  this.handleCityLimitChange
                }
                className="col form-select form-select-sm bg-light text-secondary border-0"
                style={{
                  width: "auto",
                }}
              >
                <option value="3">
                  نمایش ۳ شهر
                </option>

                <option value="5">
                  نمایش ۵ شهر
                </option>

                <option value="10">
                  نمایش ۱۰ شهر
                </option>
              </select>

              {/* بازه */}

              <select
                value={cityPeriod}
                onChange={
                  this.handleCityPeriodChange
                }
                className="col form-select form-select-sm bg-light text-secondary border-0"
                style={{
                  width: "auto",
                }}
              >
                <option value="week">
                  یک هفته گذشته
                </option>

                <option value="month">
                  یک ماه گذشته
                </option>

                <option value="90">
                  ۹۰ روز گذشته
                </option>

                <option value="year">
                  ۱۸۰ روز گذشته
                </option>
              </select>

            </div>

            {/* جدول */}

            <div className="scrollable-table">

              {loading ? (
                <div className="text-center text-muted py-4">
                  در حال دریافت اطلاعات...
                </div>
              ) : displayedCities.length === 0 ? (
                <div className="text-center text-muted py-4">
                  اطلاعاتی برای نمایش وجود ندارد.
                </div>
              ) : (
                <table className="table table-borderless mb-0">

                  <tbody>

                    {displayedCities.map(
                      (city, index) => (
                        <tr
                          key={
                            city.state ||
                            city.id ||
                            index
                          }
                        >


                          <td className="text-end">
                            <spam className="ms-3">
                              {index + 1}
                            </spam>
                            {this.getStateName(
                              city
                            )}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>
              )}

            </div>

          </div>

        </div>

        {/* =================================================
            فعال ترین تعمیرکاران
        ================================================= */}

        <div className="card shadow-sm border-0">

          <div className="card-body p-4 min-h-50">

            <h4 className="h6 fw-bold text-center mb-2">
              فعال ترین تعمیرکاران
            </h4>

            {/* فیلترها */}

            <div className="d-flex justify-content-end gap-2 mb-3 row">

              {/* تعداد */}

              <select
                value={repairmanLimit}
                onChange={
                  this.handleRepairmanLimitChange
                }
                className="col form-select form-select-sm bg-light text-secondary border-0"
                style={{
                  width: "auto",
                }}
              >
                <option value="3">
                  نمایش ۳ نفر
                </option>

                <option value="5">
                  نمایش ۵ نفر
                </option>

                <option value="10">
                  نمایش ۱۰ نفر
                </option>
              </select>

              {/* بازه */}

              <select
                value={repairmanPeriod}
                onChange={
                  this.handleRepairmanPeriodChange
                }
                className="col form-select form-select-sm bg-light text-secondary border-0"
                style={{
                  width: "auto",
                }}
              >
                <option value="week">
                  یک هفته گذشته
                </option>

                <option value="month">
                  یک ماه گذشته
                </option>

                <option value="90">
                  ۹۰ روز گذشته
                </option>

                <option value="year">
                  ۱۸۰ روز گذشته
                </option>
              </select>

            </div>

            {/* لیست تعمیرکاران */}

            <div className="scrollable-list">

              {loading ? (
                <div className="text-center text-muted py-4">
                  در حال دریافت اطلاعات...
                </div>
              ) : displayedUsers.length === 0 ? (
                <div className="text-center text-muted py-4">
                  اطلاعاتی برای نمایش وجود ندارد.
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">

                  {displayedUsers.map(
                    (user, index) => {

                      const name =
                        this.getUserName(user);

                      const requestCount =
                        this.getUserRequestCount(
                          user
                        );

                      return (
                        <div
                          key={
                            user.id ||
                            index
                          }
                          className="d-flex align-items-center gap-3 p-3 bg-light rounded-3"
                        >

                          <img
                            src={'https://iranaserviceapp.ir/test/files/user'+user.image}
                            alt={name}
                            className="rounded-circle"
                            width="40"
                            height="40"
                            style={{
                              objectFit: "cover",
                            }}
                          />

                          <div>

                            <div className="fw-semibold">
                              {name}
                            </div>

                            <div className="text-muted small">
                              {requestCount}{" "}
                              درخواست انجام شده
                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </div>

          </div>

        </div>

      </main>
    );
  }
}

export default withRouter(Home);