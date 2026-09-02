import React from "react";
import "./../css/index.css";
import { FaRegBell } from "react-icons/fa";

class Home extends React.Component {
  render() {
    return (
      <main className="container pt-5">
        <div className="fixed-top-left">
          <FaRegBell size={24} color="#495057" />
        </div>

        {/* ===== شهرهای پر درخواست (جدول) ===== */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-4">
            <h4 className="h6 fw-bold text-center mb-2">شهرهای پر درخواست</h4>
            <div className="d-flex justify-content-end gap-2 mb-3 row">
              <select className="col form-select form-select-sm bg-light text-secondary border-0" style={{ width: "auto" }}>
                <option value="3">نمایش ۳ شهر</option>
                <option value="5">نمایش ۵ شهر</option>
                <option value="10">نمایش ۱۰ شهر</option>
              </select>
              <select className="col form-select form-select-sm bg-light text-secondary border-0" style={{ width: "auto" }}>
                <option value="week">یک هفته گذشته</option>
                <option value="month">یک ماه گذشته</option>
                <option value="year">یک سال گذشته</option>
              </select>
            </div>

            <div className="scrollable-table">
              <table className="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <td className="number-circle">1</td>
                    <td>تهران</td>
                  </tr>
                  <tr>
                    <td className="number-circle">2</td>
                    <td>قزوین</td>
                  </tr>
                  <tr>
                    <td className="number-circle">3</td>
                    <td className="text-muted">...</td>
                  </tr>
                  <tr>
                    <td className="number-circle">4</td>
                    <td>اصفهان</td>
                  </tr>
                  <tr>
                    <td className="number-circle">5</td>
                    <td>شیراز</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ===== فعال‌ترین تعمیرکاران (لیست با عکس) ===== */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h4 className="h6 fw-bold text-center mb-2">فعال ترین تعمیرکاران</h4>
            <div className="d-flex justify-content-end gap-2 mb-3 row">
              <select className="col form-select form-select-sm bg-light text-secondary border-0" style={{ width: "auto" }}>
                <option value="3">نمایش ۳ نفر</option>
                <option value="5">نمایش ۵ نفر</option>
                <option value="10">نمایش ۱۰ نفر</option>
              </select>
              <select className="col form-select form-select-sm bg-light text-secondary border-0" style={{ width: "auto" }}>
                <option value="week">یک هفته گذشته</option>
                <option value="month">یک ماه گذشته</option>
                <option value="year">یک سال گذشته</option>
              </select>
            </div>

            <div className="scrollable-list">
              <div className="d-flex flex-column gap-2">
                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
                  <img
                    src="https://ui-avatars.com/api/?name=علی+عبداللهی&background=e9ecef&color=495057&size=40&rounded=true"
                    alt="علی عبداللهی"
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                  <div>
                    <div className="fw-semibold">علی عبداللهی</div>
                    <div className="text-muted small">۸ درخواست انجام شده</div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
                  <img
                    src="https://ui-avatars.com/api/?name=مهرداد+نجفی&background=e9ecef&color=495057&size=40&rounded=true"
                    alt="مهرداد نجفی"
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                  <div>
                    <div className="fw-semibold">مهرداد نجفی</div>
                    <div className="text-muted small">۲ درخواست انجام شده</div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
                  <img
                    src="https://ui-avatars.com/api/?name=امیر+عبادی+لکلر&background=e9ecef&color=495057&size=40&rounded=true"
                    alt="امیر عبادی لکلر"
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                  <div>
                    <div className="fw-semibold">امیر عبادی لکلر</div>
                    <div className="text-muted small">۲ درخواست انجام شده</div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
                  <img
                    src="https://ui-avatars.com/api/?name=رضا+کریمی&background=e9ecef&color=495057&size=40&rounded=true"
                    alt="رضا کریمی"
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                  <div>
                    <div className="fw-semibold">رضا کریمی</div>
                    <div className="text-muted small">۵ درخواست انجام شده</div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
                  <img
                    src="https://ui-avatars.com/api/?name=سارا+محمدی&background=e9ecef&color=495057&size=40&rounded=true"
                    alt="سارا محمدی"
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                  <div>
                    <div className="fw-semibold">سارا محمدی</div>
                    <div className="text-muted small">۳ درخواست انجام شده</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default Home;