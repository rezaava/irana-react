import React from "react";
import { FaThLarge, FaChevronLeft } from "react-icons/fa";
import NameEntityForm from "./NameEntityFormComponent";
import withRouter from "./withRouter";

// داده‌ی نمونه — در پروژه‌ی واقعی این‌جا با id از API خونده می‌شه
const SAMPLE_SPECIALTIES = {
  1: "تعمیرکار یخچال و ساید",
  2: "تعمیرکار لباسشویی",
  3: "تعمیرکار ظرفشویی",
};

// صفحه‌ی مستقل «ویرایش تخصص» — روی مسیر /specialties/:id/edit می‌شینه
class SpecialtyEditPage extends React.Component {
  constructor(props) {
    super(props);
    const { id } = props.params;
    this.state = { initialTitle: SAMPLE_SPECIALTIES[id] || "" };
    this.handleBack = this.handleBack.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleBack() {
    this.props.navigate("/specialties");
  }

  handleUpdate(title) {
    const trimmed = title.trim();
    if (!trimmed) return;
    const { id } = this.props.params;

    // TODO: اینجا باید API ویرایش تخصص صدا زده بشه
    // مثال:
    // await api.updateSpecialty(id, { title: trimmed });

    console.log("تخصص ویرایش شد:", id, trimmed);

    this.props.navigate("/specialties");
  }

  render() {
    const { initialTitle } = this.state;

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
          title="ویرایش تخصص"
          fieldLabel="عنوان"
          icon={<FaThLarge className="text-secondary" size={18} />}
          initialValue={initialTitle}
          submitLabel="ذخیره تغییرات"
          onSubmit={this.handleUpdate}
        />
      </div>
    );
  }
}

export default withRouter(SpecialtyEditPage);