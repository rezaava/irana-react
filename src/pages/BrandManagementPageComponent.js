import React from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import GenericTable from "./GenericTableComponent";

// داده‌ی نمونه — در پروژه‌ی واقعی از API می‌آید
const SAMPLE_BRANDS = [
  { id: 1, name: "سامسونگ_SAMSUNG" },
  { id: 2, name: "الجی_LG" },
  { id: 3, name: "جنرال الکتریک_GE" },
  { id: 4, name: "دوو_DAEWOO" },
  { id: 5, name: "اسنوا_SNOWA" },
  { id: 6, name: "بوش_BOSCH" },
  { id: 7, name: "وستینگ هوس_WESTINGHOUSE" },
  { id: 8, name: "مابه_MABE" },
  { id: 9, name: "بکو_BEKO" },
  { id: 10, name: "بلومبرگ_BLOOMBERG" },
  { id: 11, name: "آرچلیک_ARCHELIK" },
  { id: 12, name: "کنوود_KENWOOD" },
  { id: 13, name: "آاگ_AEG" },
  { id: 14, name: "آمانا_Amana" },
  { id: 15, name: "امرسان_Emersun" },
  { id: 16, name: "فریجیدر_Frigidaire" },
  { id: 17, name: "ایرانی ها_Irani" },
];

// صفحه‌ی مدیریت برند دستگاه
// دکمه‌ی + و دکمه‌ی ویرایش هر دو Link هستن و روت رو عوض می‌کنن
// (/brands/add و /brands/:id/edit)
class BrandManagementPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { brands: SAMPLE_BRANDS };
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(id) {
    // TODO: قبل از حذف از state، باید API حذف صدا زده بشه
    // مثال:
    // await api.deleteBrand(id);
    this.setState((prev) => ({
      brands: prev.brands.filter((b) => b.id !== id),
    }));
  }

  render() {
    const { brands } = this.state;

    const columns = [
      { key: "name", label: "نام", headerClassName: "text-dark" },
      {
        key: "edit",
        label: "ویرایش",
        width: "0.6fr",
        headerClassName: "text-primary",
        render: (row) => (
          <Link
            to={`/brands/${row.id}/edit`}
            className="btn btn-light border-0 p-1 d-inline-flex"
          >
            <FaEdit className="text-secondary" size={18} />
          </Link>
        ),
      },
      {
        key: "delete",
        label: "حذف",
        width: "0.6fr",
        headerClassName: "text-primary",
        render: (row) => (
          <button
            type="button"
            onClick={() => this.handleDelete(row.id)}
            className="btn btn-light border-0 p-1"
          >
            <FaTrashAlt style={{ color: "#f08a72" }} size={17} />
          </button>
        ),
      },
    ];

    return (
      <div>
        <div className="container px-3 pt-4 pb-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h1 className="fs-6 fw-semibold text-dark m-0">مدیریت برند دستگاه</h1>
            <Link
              to="/brands/add"
              className="btn btn-light rounded-circle border p-2 d-flex align-items-center justify-content-center"
              style={{ width: 40, height: 40, transition: "background-color 0.15s ease" }}
            >
              <FaPlus size={16} />
            </Link>
          </div>

          <GenericTable columns={columns} rows={brands} />
        </div>
      </div>
    );
  }
}

export default BrandManagementPage;