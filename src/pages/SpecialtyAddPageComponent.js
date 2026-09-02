import React from "react";
import { FaThLarge, FaChevronLeft } from "react-icons/fa";
import withRouter from "./withRouter";
import NameEntityForm from "./NameEntityFormComponent";

// صفحه‌ی مستقل «افزودن تخصص» — روی مسیر /specialties/add می‌شینه
class SpecialtyAddPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleBack() {
    this.props.navigate("/specialties");
  }

  handleCreate(title) {
    const trimmed = title.trim();
    if (!trimmed) return;

    // TODO: اینجا باید API ایجاد تخصص صدا زده بشه
    // مثال:
    // await api.createSpecialty({ title: trimmed });

    console.log("تخصص ثبت شد:", trimmed);

    // بعد از ثبت موفق برمی‌گردیم به صفحه‌ی لیست
    this.props.navigate("/specialties");
  }

  render() {
    return (
      <div>
        <button
          type="button"
          onClick={this.handleBack}
          className="btn rounded-circle border p-2 d-flex align-items-center justify-content-center position-absolute"
          style={{ width: 36, height: 36, top: 16, right: 16, zIndex: 1 }}
        >
          <FaChevronLeft size={14} />
        </button>

        <NameEntityForm
          title="افزودن تخصص"
          fieldLabel="عنوان"
          icon={<FaThLarge className="text-secondary" size={18} />}
          submitLabel="ثبت"
          onSubmit={this.handleCreate}
        />
      </div>
    );
  }
}

export default withRouter(SpecialtyAddPage);