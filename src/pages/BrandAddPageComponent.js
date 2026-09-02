import React from "react";
import { FaTag, FaChevronLeft } from "react-icons/fa";
import withRouter from "./withRouter";
import NameEntityForm from "./NameEntityFormComponent";

// صفحه‌ی مستقل «افزودن برند دستگاه» — روی مسیر /brands/add می‌شینه
class BrandAddPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleBack() {
    this.props.navigate("/brands");
  }

  handleCreate(name) {
    const trimmed = name.trim();
    if (!trimmed) return;

    // TODO: اینجا باید API ایجاد برند صدا زده بشه
    // مثال:
    // await api.createBrand({ name: trimmed });

    console.log("برند ثبت شد:", trimmed);

    // بعد از ثبت موفق برمی‌گردیم به صفحه‌ی لیست
    this.props.navigate("/brands");
  }

  render() {
    return (
      <div>
        <button
          type="button"
          onClick={this.handleBack}
          className="btn btn-light rounded-circle border p-2 d-flex align-items-center justify-content-center position-absolute"
          style={{ width: 36, height: 36, top: 16, right: 16, zIndex: 1 }}
        >
          <FaChevronLeft size={14} />
        </button>

        <NameEntityForm
          title="افزودن برند دستگاه"
          fieldLabel="نام"
          icon={<FaTag className="text-secondary" size={18} />}
          submitLabel="ثبت"
          onSubmit={this.handleCreate}
        />
      </div>
    );
  }
}

export default BrandAddPage;