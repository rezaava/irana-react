import React from "react";
import { Link } from "react-router-dom";
import "./../css/all.css"
import "./../css/setting.css";;

// آیتم‌های منو — ۵ تای اول به کامپوننت‌هایی که ساختیم وصل می‌شن،
// دو تای آخر («درخواست‌های ویرایش پروفایل» و «اطلاعیه‌ها») چون طرحی برایشان
// نداشتیم فقط مسیرشون آماده‌ست تا بعداً صفحه‌شون رو بسازیم.
const MENU_ITEMS = [
  { key: "brands", label: "مدیریت برند دستگاه", path: "/brands", icon: "fa-gear" },
  { key: "device-types", label: "مدیریت نوع دستگاه", path: "/device-types", icon: "fa-microchip" },
  { key: "settlements", label: "درخواست های تسویه", path: "/settlements", icon: "fa-money-check-pen" },
  { key: "profile-edit-requests", label: "درخواست های ویرایش پروفایل", path: "/profile-edit-requests", icon: "fa-user-pen" },
  { key: "notifications", label: "اطلاعیه ها", path: "/notifications", icon: "fa-bell" },
  { key: "reports", label: "گزارشات", path: "/reports", icon: "fa-display-chart-up" },
  { key: "specialties", label: "مدیریت تخصص ها", path: "/specialties", icon: "fa-paintbrush-pencil" },
];

// منوی «سایر» — ۷ دکمه که هرکدوم به مسیر مربوطه‌شون می‌رن
class SettingsMenu extends React.Component {
  render() {
    return (
      <div className="container">
        <div className=" px-3 pt-4 pb-5 d-flex flex-column gap-3">
          {MENU_ITEMS.map(({ key, label, path, icon }) => (
            <Link
              key={key}
              to={path}
              className="d-flex gap-3 border rounded-4 px-3 py-3 text-decoration-none"
              style={{ transition: "background-color 0.15s ease, transform 0.1s ease" }}
            >
              <i className={`fa-duotone icon-color fa-solid ${icon}`}></i>
              <span className="text-black fw-semibold">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }
}

export default SettingsMenu;