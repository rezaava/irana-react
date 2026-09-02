import React from "react";
import { FaMicrochip, FaChevronLeft } from "react-icons/fa";
import withRouter from "./withRouter";
import NameEntityForm from "./NameEntityFormComponent";

// صفحه‌ی مستقل «افزودن نوع دستگاه» — روی مسیر /device-types/add می‌شینه
class DeviceTypeAddPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleBack() {
    this.props.navigate("/device-types");
  }

  handleCreate(name) {
    const trimmed = name.trim();
    if (!trimmed) return;

    // TODO: اینجا باید API ایجاد نوع دستگاه صدا زده بشه
    // مثال:
    // await api.createDeviceType({ name: trimmed });

    console.log("نوع دستگاه ثبت شد:", trimmed);

    // بعد از ثبت موفق برمی‌گردیم به صفحه‌ی لیست
    this.props.navigate("/device-types");
  }

  render() {
    return (
      <div >
        <button
          type="button"
          onClick={this.handleBack}
          className="btn rounded-circle border p-2 d-flex align-items-center justify-content-center position-absolute"
          style={{ width: 36, height: 36, top: 16, right: 16, zIndex: 1 }}
        >
          <FaChevronLeft size={14} />
        </button>

        <NameEntityForm
          title="افزودن نوع دستگاه"
          fieldLabel="نام"
          icon={<FaMicrochip className="text-secondary" size={18} />}
          submitLabel="ثبت"
          onSubmit={this.handleCreate}
        />
      </div>
    );
  }
}

export default withRouter(DeviceTypeAddPage);