import React from "react";
import { FaTag, FaChevronLeft } from "react-icons/fa";
import NameEntityForm from "./NameEntityFormComponent";
import withRouter from "./withRouter";

// داده‌ی نمونه — در پروژه‌ی واقعی این‌جا با id از API خونده می‌شه
const SAMPLE_BRANDS = {
  1: "سامسونگ_SAMSUNG",
  2: "الجی_LG",
  3: "جنرال الکتریک_GE",
};

// صفحه‌ی مستقل «ویرایش برند دستگاه» — روی مسیر /brands/:id/edit می‌شینه
class BrandEditPage extends React.Component {
  constructor(props) {
    super(props);
    const { id } = props.params;
    this.state = { initialName: SAMPLE_BRANDS[id] || "" };
    this.handleBack = this.handleBack.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleBack() {
    this.props.navigate("/brands");
  }

  handleUpdate(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const { id } = this.props.params;

    // TODO: اینجا باید API ویرایش برند صدا زده بشه
    // مثال:
    // await api.updateBrand(id, { name: trimmed });

    console.log("برند ویرایش شد:", id, trimmed);

    this.props.navigate("/brands");
  }

  render() {
    const { initialName } = this.state;

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
          title="ویرایش برند دستگاه"
          fieldLabel="نام"
          icon={<FaTag className="text-secondary" size={18} />}
          initialValue={initialName}
          submitLabel="ذخیره تغییرات"
          onSubmit={this.handleUpdate}
        />
      </div>
    );
  }
}

export default withRouter(BrandEditPage);