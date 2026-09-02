import React from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import GenericTable from "./GenericTableComponent";

// داده‌ی نمونه — در پروژه‌ی واقعی از API می‌آید
const SAMPLE_SPECIALTIES = [
  { id: 1, title: "تعمیرکار یخچال و ساید" },
  { id: 2, title: "تعمیرکار لباسشویی" },
  { id: 3, title: "تعمیرکار ظرفشویی" },
  { id: 4, title: "تعمیرکار کولر گازی" },
  { id: 5, title: "تعمیرکار مایکروفر و مایکروویو" },
  { id: 6, title: "تعمیر کار جاروبرقی" },
  { id: 7, title: "تعمیرکار یخچال های صنعتی" },
];

// صفحه‌ی مدیریت تخصص‌ها
// دکمه‌ی + و دکمه‌ی ویرایش هر دو Link هستن و روت رو عوض می‌کنن
// (/specialties/add و /specialties/:id/edit)
class SpecialtyManagementPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { specialties: SAMPLE_SPECIALTIES };
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(id) {
    // TODO: قبل از حذف از state، باید API حذف صدا زده بشه
    this.setState((prev) => ({
      specialties: prev.specialties.filter((s) => s.id !== id),
    }));
  }

  render() {
    const { specialties } = this.state;

    const columns = [
      { key: "title", label: "عنوان", headerClassName: "text-dark" },
      {
        key: "edit",
        label: "ویرایش",
        width: "0.6fr",
        headerClassName: "text-primary",
        render: (row) => (
          <Link
            to={`/specialties/${row.id}/edit`}
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
            <h1 className="fs-6 fw-semibold text-dark m-0">مدیریت تخصص ها</h1>
            <Link
              to="/specialties/add"
              className="btn btn-light rounded-circle border p-2 d-flex align-items-center justify-content-center"
              style={{ width: 40, height: 40, transition: "background-color 0.15s ease" }}
            >
              <FaPlus size={16} />
            </Link>
          </div>

          <GenericTable columns={columns} rows={specialties} />
        </div>
      </div>
    );
  }
}

export default SpecialtyManagementPage;