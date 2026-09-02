import React from "react";
import { NavLink } from "react-router-dom";
import "./../css/nav.css";
import "./../css/all.css";

// ترتیب و مسیر هر آیتم مطابق روت‌های App.js
const navItems = [
  { id: "home", icon: "fa-house", label: "خانه", path: "/" },
  { id: "new-request", icon: "fa-circle-plus", label: "درخواست جدید", path: "/form" },
  { id: "technicians", icon: "fa-screwdriver-wrench", label: "تعمیرکاران", path: "/technician" },
  { id: "requests", icon: "fa-list-check", label: "درخواست ها", path: "/request" },
  { id: "settings", icon: "fa-gear", label: "تنظیمات", path: "/setting" },
];

const Navbar = () => {
  return (
    <div className="nav-outer">
      <nav className="dark-navbar" id="mainNavbar">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""} text-decoration-none`}
            data-icon={item.icon}
            data-label={item.label}
          >
            <div className="icon-circle">
              <i className={`fa-duotone fa-solid ${item.icon}`}></i>
            </div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Navbar;