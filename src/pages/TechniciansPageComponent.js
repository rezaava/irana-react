import React from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import TechnicianItem from "./TechnicianItemComponent";
import FilterSheet from "./FilterSheetComponent";

// داده‌ی نمونه — در پروژه‌ی واقعی از API می‌آید
const SAMPLE_TECHNICIANS = [
  { id: 1, name: "وفا راسته", status: "blocked", avatar: "https://ui-avatars.com/api/?name=وفا+راسته&background=e9ecef&color=495057" },
  { id: 2, name: "سعید قربانی", status: "blocked", avatar: "https://ui-avatars.com/api/?name=سعید+قربانی&background=e9ecef&color=495057" },
  { id: 3, name: "میلاد دولتی", status: "blocked", avatar: "https://ui-avatars.com/api/?name=میلاد+دولتی&background=e9ecef&color=495057" },
  { id: 4, name: "علی فتوحی زاده", status: "blocked", avatar: "https://ui-avatars.com/api/?name=علی+فتوحی&background=e9ecef&color=495057" },
  { id: 5, name: "علی بوالحسنی", status: "blocked", avatar: "https://ui-avatars.com/api/?name=علی+بوالحسنی&background=e9ecef&color=495057" },
  { id: 6, name: "مهرداد پاکیزه", status: "free", avatar: "https://ui-avatars.com/api/?name=مهرداد+پاکیزه&background=e9ecef&color=495057" },
  { id: 7, name: "پارسا پورحبیبی", status: "free", avatar: "https://ui-avatars.com/api/?name=پارسا+پورحبیبی&background=e9ecef&color=495057" },
  { id: 8, name: "علی نصرتی", status: "blocked", avatar: "https://ui-avatars.com/api/?name=علی+نصرتی&background=e9ecef&color=495057" },
  { id: 9, name: "سعید اسلامی", status: "blocked", avatar: "https://ui-avatars.com/api/?name=سعید+اسلامی&background=e9ecef&color=495057" },
  { id: 10, name: "پوریا مولاخواه", status: "blocked", avatar: "https://ui-avatars.com/api/?name=پوریا+مولاخواه&background=e9ecef&color=495057" },
  { id: 11, name: "حسین سالمی راد", status: "blocked", avatar: "https://ui-avatars.com/api/?name=حسین+سالمی&background=e9ecef&color=495057" },
  { id: 12, name: "ابوالفضل کلانتری", status: "blocked", avatar: "https://ui-avatars.com/api/?name=ابوالفضل+کلانتری&background=e9ecef&color=495057" },
];

// صفحه‌ی کامل لیست تعمیرکاران
class TechniciansPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      technicians: SAMPLE_TECHNICIANS,
      searchTerm: "",
      isFilterOpen: false,
      filterProvince: "",
      filterCity: "",
      filterSpecialty: "",
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.openFilter = this.openFilter.bind(this);
    this.closeFilter = this.closeFilter.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleToggleStatus = this.handleToggleStatus.bind(this);
    this.handleDetails = this.handleDetails.bind(this);
  }

  handleSearchChange(e) {
    this.setState({ searchTerm: e.target.value });
  }

  openFilter() {
    this.setState({ isFilterOpen: true });
  }

  closeFilter() {
    this.setState({ isFilterOpen: false });
  }

  applyFilter() {
    // منطق واقعیِ فیلتر کردن روی این ۳ مقدار (filterProvince/filterCity/filterSpecialty) بعداً اضافه می‌شود
    this.closeFilter();
  }

  handleDelete(id) {
    // TODO: اینجا باید قبل از حذف از state، API حذف صدا زده بشه
    // مثال:
    // await api.deleteTechnician(id);
    this.setState((prev) => ({
      technicians: prev.technicians.filter((t) => t.id !== id),
    }));
  }

  handleToggleStatus(id, currentStatus) {
    const newStatus = currentStatus === "blocked" ? "free" : "blocked";

    // TODO: اینجا باید API صدا زده بشه و بعد از جواب موفق، state آپدیت بشه
    // مثال:
    // api.updateTechnicianStatus(id, newStatus).then(() => {
    //   this.setState((prev) => ({
    //     technicians: prev.technicians.map((t) =>
    //       t.id === id ? { ...t, status: newStatus } : t
    //     ),
    //   }));
    // });

    this.setState((prev) => ({
      technicians: prev.technicians.map((t) =>
        t.id === id ? { ...t, status: newStatus } : t
      ),
    }));
  }

  handleDetails(id) {
    // مسیر جزئیات بعداً وصل می‌شود
    console.log("جزئیات تعمیرکار:", id);
  }

  render() {
    const {
      technicians,
      searchTerm,
      isFilterOpen,
      filterProvince,
      filterCity,
      filterSpecialty,
    } = this.state;

    const filteredTechnicians = technicians.filter((t) =>
      t.name.includes(searchTerm.trim())
    );

    return (
      <div>
        <div className="container px-3 pt-3">
          {/* جستجو */}
          <div className="d-flex align-items-center gap-2 border rounded-pill px-3 py-2 mb-3 bg-white">
            <input
              type="text"
              placeholder="جستجو..."
              value={searchTerm}
              onChange={this.handleSearchChange}
              className="form-control border-0 shadow-none text-end p-0"
            />
            <FaSearch className="text-secondary" size={16} />
          </div>

          {/* دکمه فیلتر */}
          <div className="d-flex justify-content-end mb-3">
            <button
              type="button"
              onClick={this.openFilter}
              className="btn btn-light border rounded-pill d-flex align-items-center gap-2 px-3 py-2"
              style={{ transition: "background-color 0.15s ease" }}
            >
              <span>فیلتر</span>
              <FaFilter className="text-secondary" size={14} />
            </button>
          </div>

          {/* عنوان بخش */}
          <div className="bg-light text-center rounded-3 py-3 mb-1">
            <span className="text-primary fw-semibold">تعمیرکاران</span>
          </div>

          {/* لیست */}
          <div>
            {filteredTechnicians.map((tech) => (
              <TechnicianItem
                key={tech.id}
                technician={tech}
                onDelete={this.handleDelete}
                onToggleStatus={this.handleToggleStatus}
                onDetails={this.handleDetails}
              />
            ))}

            {filteredTechnicians.length === 0 && (
              <div className="text-center text-muted py-5">
                موردی یافت نشد
              </div>
            )}
          </div>
        </div>

        <FilterSheet
          isOpen={isFilterOpen}
          onClose={this.closeFilter}
          onApply={this.applyFilter}
          province={filterProvince}
          city={filterCity}
          specialty={filterSpecialty}
          onProvinceChange={(e) => this.setState({ filterProvince: e.target.value })}
          onCityChange={(e) => this.setState({ filterCity: e.target.value })}
          onSpecialtyChange={(e) => this.setState({ filterSpecialty: e.target.value })}
        />
      </div>
    );
  }
}

export default TechniciansPage;