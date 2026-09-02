import React from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import GenericTable from "./GenericTableComponent";

// داده‌ی نمونه — در پروژه‌ی واقعی از API می‌آید
const SAMPLE_DEVICE_TYPES = [
  { id: 1, name: "ساید" },
  { id: 2, name: "یخچال فریزر" },
  { id: 3, name: "دوقلو" },
  { id: 4, name: "فرنچ" },
  { id: 5, name: "لباسشویی" },
  { id: 6, name: "ظرفشویی" },
  { id: 7, name: "کولر گازی" },
  { id: 8, name: "مایکروویو" },
  { id: 9, name: "یخچال و فریزر صنعتی" },
];

// صفحه‌ی مدیریت نوع دستگاه
// دکمه‌ی + و دکمه‌ی ویرایش هر دو Link هستن و روت رو عوض می‌کنن
// (/device-types/add و /device-types/:id/edit)
class DeviceTypeManagementPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { deviceTypes: SAMPLE_DEVICE_TYPES };
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(id) {
    // TODO: قبل از حذف از state، باید API حذف صدا زده بشه
    this.setState((prev) => ({
      deviceTypes: prev.deviceTypes.filter((d) => d.id !== id),
    }));
  }

  render() {
    const { deviceTypes } = this.state;

    const columns = [
      { key: "name", label: "نام", headerClassName: "text-dark" },
      {
        key: "edit",
        label: "ویرایش",
        width: "0.6fr",
        headerClassName: "text-primary",
        render: (row) => (
          <Link
            to={`/device-types/${row.id}/edit`}
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
            <h1 className="fs-6 fw-semibold text-dark m-0">مدیریت نوع دستگاه</h1>
            <Link
              to="/device-types/add"
              className="btn btn-light rounded-circle border p-2 d-flex align-items-center justify-content-center"
              style={{ width: 40, height: 40, transition: "background-color 0.15s ease" }}
            >
              <FaPlus size={16} />
            </Link>
          </div>

          <GenericTable columns={columns} rows={deviceTypes} />
        </div>
      </div>
    );
  }
}

export default DeviceTypeManagementPage;