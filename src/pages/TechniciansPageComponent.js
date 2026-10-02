import React from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";

import TechnicianItem from "./TechnicianItemComponent";
import FilterSheet from "./FilterSheetComponent";
import AuthCheck from "./AuthCheckComponent";
import Loader from "./LoaderComponent";

const API_URL = "https://iranaserviceapp.ir/test/api";

class TechniciansPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userList: [],
      displayedUsers: [],

      searchTerm: "",

      isFilterOpen: false,
      filterProvince: "",
      filterCity: "",
      filterSpecialty: "",

      loading: true,
      actionLoading: false,

      authenticated: false,

      page: 1,
      hasMore: true,
      loadingMore: false,
    };

    this.searchRequest = 0;
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
        this.getUsers(1, true);
      }
    );
  }

  // =====================================================
  // دریافت یک صفحه کاربران
  // =====================================================

  getUsers = async (page = 1, firstLoad = false) => {
    const token = localStorage.getItem("token");

    if (!firstLoad && this.state.loadingMore) {
      return false;
    }

    if (!firstLoad && !this.state.hasMore) {
      return false;
    }

    if (!firstLoad) {
      this.setState({
        loadingMore: true,
      });
    }

    try {
      const response = await fetch(
        `${API_URL}/users?page=${page}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("USERS API:", data);

      if (String(data.status) !== "1") {
        this.setState({
          userList: [],
          displayedUsers: [],
          loading: false,
          loadingMore: false,
          hasMore: false,
        });

        return false;
      }

      const pagination = data.user;

      const newUsers =
        pagination &&
        Array.isArray(pagination.data)
          ? pagination.data
          : [];

      const nextPageUrl =
        pagination
          ? pagination.next_page_url
          : null;

      const hasMore =
        nextPageUrl !== null &&
        nextPageUrl !== undefined;

      await new Promise((resolve) => {
        this.setState(
          (prevState) => {
            const users =
              page === 1
                ? newUsers
                : [
                    ...prevState.userList,
                    ...newUsers,
                  ];

            return {
              userList: users,
              page: page + 1,
              hasMore,

              loading: false,
              loadingMore: false,
            };
          },
          resolve
        );
      });

      this.applyAllFilters();

      return hasMore;
    } catch (error) {
      console.error(
        "GET USERS ERROR:",
        error
      );

      this.setState({
        loading: false,
        loadingMore: false,
        hasMore: false,
      });

      return false;
    }
  };

  // =====================================================
  // دریافت تمام صفحات برای سرچ
  // =====================================================

  loadAllPagesForSearch = async (requestId) => {
    while (
      this.state.hasMore &&
      requestId === this.searchRequest
    ) {
      const nextPage = this.state.page;

      const hasMore =
        await this.getUsers(
          nextPage,
          false
        );

      if (!hasMore) {
        break;
      }
    }
  };

  // =====================================================
  // صفحه بعد Infinite Scroll
  // =====================================================

  fetchMoreData = async () => {
    const {
      page,
      hasMore,
      loadingMore,
      searchTerm,
    } = this.state;

    if (!hasMore || loadingMore) {
      return;
    }

    /*
     * اگر سرچ فعال باشد، خودش تمام صفحات
     * را دریافت می‌کند.
     */
    if (searchTerm.trim()) {
      return;
    }

    await this.getUsers(
      page,
      false
    );
  };

  // =====================================================
  // سرچ
  // =====================================================

  handleSearchChange = (e) => {
    const value = e.target.value;

    this.searchRequest += 1;

    const requestId =
      this.searchRequest;

    this.setState(
      {
        searchTerm: value,
      },
      async () => {
        this.applyAllFilters();

        /*
         * اگر سرچ خالی است،
         * فقط لیست فعلی نمایش داده شود.
         */
        if (!value.trim()) {
          return;
        }

        /*
         * تمام صفحات را می‌گیریم تا سرچ
         * روی کل کاربران انجام شود.
         */
        await this.loadAllPagesForSearch(
          requestId
        );

        /*
         * بعد از اتمام دریافت صفحات،
         * دوباره فیلتر می‌کنیم.
         */
        if (
          requestId ===
          this.searchRequest
        ) {
          this.applyAllFilters();
        }
      }
    );
  };

  // =====================================================
  // باز کردن فیلتر
  // =====================================================

  openFilter = () => {
    this.setState({
      isFilterOpen: true,
    });
  };

  // =====================================================
  // بستن فیلتر
  // =====================================================

  closeFilter = () => {
    this.setState({
      isFilterOpen: false,
    });
  };

  // =====================================================
  // اعمال فیلتر
  // =====================================================

  applyFilter = () => {
    this.applyAllFilters();

    this.setState({
      isFilterOpen: false,
    });
  };

  // =====================================================
  // تبدیل specials به آرایه
  // =====================================================

  getUserSpecials = (user) => {
    if (!user || !user.specials) {
      return [];
    }

    if (Array.isArray(user.specials)) {
      return user.specials;
    }

    if (typeof user.specials === "string") {
      try {
        const parsed = JSON.parse(
          user.specials
        );

        if (Array.isArray(parsed)) {
          return parsed;
        }

        return [parsed];
      } catch (error) {
        return [];
      }
    }

    return [];
  };

  // =====================================================
  // بررسی تخصص
  // =====================================================

  userHasSpecialty = (
    user,
    specialty
  ) => {
    if (!specialty) {
      return true;
    }

    const specials =
      this.getUserSpecials(user);

    return specials.some((item) => {
      if (
        item === null ||
        item === undefined
      ) {
        return false;
      }

      if (
        typeof item === "string" ||
        typeof item === "number"
      ) {
        return (
          String(item) ===
          String(specialty)
        );
      }

      if (typeof item === "object") {
        return (
          String(item.id) ===
            String(specialty) ||
          String(item.special_id) ===
            String(specialty) ||
          String(item.value) ===
            String(specialty)
        );
      }

      return false;
    });
  };

  // =====================================================
  // اعمال تمام فیلترها
  // =====================================================

  applyAllFilters = () => {
    const {
      userList,
      searchTerm,
      filterProvince,
      filterCity,
      filterSpecialty,
    } = this.state;

    const search =
      searchTerm
        .trim()
        .toLowerCase();

    const result =
      userList.filter((user) => {
        // =========================================
        // سرچ
        // =========================================

        if (search) {
          const name = user.name
            ? String(user.name)
                .toLowerCase()
            : "";

          const family = user.family
            ? String(user.family)
                .toLowerCase()
            : "";

          const fullName =
            `${name} ${family}`.trim();

          if (
            !fullName.includes(search)
          ) {
            return false;
          }
        }

        // =========================================
        // استان
        // =========================================

        if (filterProvince) {
          if (
            String(user.state) !==
            String(filterProvince)
          ) {
            return false;
          }
        }

        // =========================================
        // شهر
        // =========================================

        if (filterCity) {
          if (
            String(user.city) !==
            String(filterCity)
          ) {
            return false;
          }
        }

        // =========================================
        // تخصص
        // =========================================

        if (filterSpecialty) {
          if (
            !this.userHasSpecialty(
              user,
              filterSpecialty
            )
          ) {
            return false;
          }
        }

        return true;
      });

    this.setState({
      displayedUsers: result,
    });
  };

  // =====================================================
  // حذف کاربر
  // =====================================================

  handleDelete = (id) => {
    const token =
      localStorage.getItem("token");

    this.setState({
      actionLoading: true,
    });

    fetch(`${API_URL}/delete`, {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) =>
        response.json()
      )
      .then((data) => {
        console.log(
          "DELETE USER:",
          data
        );

        if (String(data.status) === "1") {
          this.setState(
            (prevState) => {
              const newUserList =
                prevState.userList.filter(
                  (user) =>
                    Number(user.id) !==
                    Number(id)
                );

              return {
                userList: newUserList,
                actionLoading: false,
              };
            },
            () => {
              this.applyAllFilters();
            }
          );
        } else {
          this.setState({
            actionLoading: false,
          });
        }
      })
      .catch((error) => {
        console.error(
          "DELETE USER ERROR:",
          error
        );

        this.setState({
          actionLoading: false,
        });
      });
  };

  // =====================================================
  // تغییر وضعیت
  // =====================================================

  handleToggleStatus = (id) => {
    const token =
      localStorage.getItem("token");

    this.setState({
      actionLoading: true,
    });

    fetch(`${API_URL}/active`, {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) =>
        response.json()
      )
      .then((data) => {
        console.log(
          "ACTIVE USER:",
          data
        );

        if (String(data.status) === "1") {
          this.getUsersWithActionLoader();
        } else {
          this.setState({
            actionLoading: false,
          });
        }
      })
      .catch((error) => {
        console.error(
          "ACTIVE USER ERROR:",
          error
        );

        this.setState({
          actionLoading: false,
        });
      });
  };

  // =====================================================
  // دریافت مجدد بعد از تغییر وضعیت
  // =====================================================

  getUsersWithActionLoader =
    async () => {
      const token =
        localStorage.getItem(
          "token"
        );

      try {
        this.setState({
          loadingMore: false,
        });

        const response = await fetch(
          `${API_URL}/users?page=1`,
          {
            method: "GET",

            headers: {
              Accept:
                "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        console.log(
          "USERS API AFTER ACTION:",
          data
        );

        if (
          String(data.status) !==
          "1"
        ) {
          this.setState({
            userList: [],
            displayedUsers: [],
            loading: false,
            actionLoading: false,
            page: 1,
            hasMore: false,
          });

          return;
        }

        const pagination =
          data.user;

        const users =
          pagination &&
          Array.isArray(
            pagination.data
          )
            ? pagination.data
            : [];

        const hasMore =
          pagination &&
          pagination.next_page_url !==
            null;

        this.setState(
          {
            userList: users,
            displayedUsers: users,

            page: 2,

            hasMore,

            loading: false,
            actionLoading: false,
          },
          async () => {
            this.applyAllFilters();

            /*
             * اگر سرچ فعال باشد، دوباره تمام
             * صفحات را دریافت کن.
             */
            if (
              this.state.searchTerm.trim()
            ) {
              this.searchRequest += 1;

              const requestId =
                this.searchRequest;

              await this.loadAllPagesForSearch(
                requestId
              );

              if (
                requestId ===
                this.searchRequest
              ) {
                this.applyAllFilters();
              }
            }
          }
        );
      } catch (error) {
        console.error(
          "GET USERS AFTER ACTION ERROR:",
          error
        );

        this.setState({
          loading: false,
          actionLoading: false,
        });
      }
    };

  // =====================================================
  // جزئیات
  // =====================================================

  handleDetails = (id) => {
    console.log(
      "جزئیات تعمیرکار:",
      id
    );
  };

  // =====================================================
  // Render
  // =====================================================

  render() {
    const {
      authenticated,
      loading,
      actionLoading,
      displayedUsers,
      searchTerm,
      isFilterOpen,
      filterProvince,
      filterCity,
      filterSpecialty,
      hasMore,
      loadingMore,
      userList,
    } = this.state;

    if (!authenticated) {
      return null;
    }

    if (loading) {
      return <Loader />;
    }

    return (
      <div dir="rtl">

        {/* =========================================
            لودر عملیات
        ========================================= */}

        {actionLoading && <Loader />}

        {/* =========================================
            سرچ و فیلتر
        ========================================= */}

        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            paddingBottom: "4px",
          }}
        >
          <div className="container px-3 pt-4 bg-light">

            {/* سرچ */}

            <div
              className="d-flex align-items-center gap-2 border rounded-pill px-3 py-2 mb-3 bg-white"
            >
              <input
                type="text"
                placeholder="جستجو..."
                value={searchTerm}
                onChange={
                  this.handleSearchChange
                }
                className="form-control border-0 shadow-none text-end p-0"
                disabled={actionLoading}
              />

              <FaSearch
                className="text-secondary"
                size={16}
              />
            </div>

            {/* فیلتر */}

            <div className="d-flex justify-content-end mb-3">
              <button
                type="button"
                onClick={this.openFilter}
                className="btn btn-light border rounded-pill d-flex align-items-center gap-2 px-3 py-2"
                disabled={actionLoading}
              >
                <span>
                  فیلتر
                </span>

                <FaFilter
                  className="text-secondary"
                  size={14}
                />
              </button>
            </div>

            {/* عنوان */}

            <div className="bg-gray text-center rounded-3 py-3 mb-1">
              <span className="text-primary fw-semibold">
                تعمیرکاران
              </span>
            </div>

          </div>
        </div>

        {/* =========================================
            لیست
        ========================================= */}

        <div className="container px-3">

          <InfiniteScroll
            dataLength={
              userList.length
            }
            next={
              this.fetchMoreData
            }
            hasMore={hasMore}
            scrollThreshold="200px"
            loader={
              loadingMore ? (
                <div className="text-center py-4">
                  <span className="text-muted">
                    در حال دریافت تعمیرکاران...
                  </span>
                </div>
              ) : null
            }
            endMessage={
              !hasMore &&
              userList.length > 0 ? (
                <div className="text-center text-muted py-4">
                  تمام تعمیرکاران نمایش داده شدند
                </div>
              ) : null
            }
          >
            {displayedUsers.map(
              (user) => (
                <TechnicianItem
                  key={user.id}
                  technician={user}
                  onDelete={
                    this.handleDelete
                  }
                  onToggleStatus={
                    this.handleToggleStatus
                  }
                  onDetails={
                    this.handleDetails
                  }
                />
              )
            )}
          </InfiniteScroll>

          {/* =========================================
              نتیجه سرچ
          ========================================= */}

          {displayedUsers.length ===
            0 &&
            !loadingMore && (
              <div className="text-center text-muted py-5">
                {searchTerm.trim()
                  ? "موردی یافت نشد"
                  : "تعمیرکاری وجود ندارد"}
              </div>
            )}

        </div>

        {/* =========================================
            Filter Sheet
        ========================================= */}

        <FilterSheet
          isOpen={isFilterOpen}
          onClose={this.closeFilter}
          onApply={this.applyFilter}
          province={
            filterProvince
          }
          city={filterCity}
          specialty={
            filterSpecialty
          }
          onProvinceChange={(e) =>
            this.setState({
              filterProvince:
                e.target.value,
              filterCity: "",
            })
          }
          onCityChange={(e) =>
            this.setState({
              filterCity:
                e.target.value,
            })
          }
          onSpecialtyChange={(e) =>
            this.setState({
              filterSpecialty:
                e.target.value,
            })
          }
        />

      </div>
    );
  }
}

export default TechniciansPage;