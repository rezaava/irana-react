import React from "react";
import { FaMicrochip, FaChevronLeft } from "react-icons/fa";
import NameEntityForm from "./NameEntityFormComponent";
import withRouter from "./withRouter";

// داده‌ی نمونه — در پروژه‌ی واقعی این‌جا با id از API خونده می‌شه
const SAMPLE_DEVICE_TYPES = {
  1: "ساید",
  2: "یخچال فریزر",
  3: "دوقلو",
};

// صفحه‌ی مستقل «ویرایش نوع دستگاه» — روی مسیر /device-types/:id/edit می‌شینه
class DeviceTypeEditPage extends React.Component {
  constructor(props) {
    super(props);
    const { id } = props.params;
    this.state = { initialName: SAMPLE_DEVICE_TYPES[id] || "" };
    this.handleBack = this.handleBack.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleBack() {
    this.props.navigate("/device-types");
  }

  handleUpdate(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const { id } = this.props.params;

    // TODO: اینجا باید API ویرایش نوع دستگاه صدا زده بشه
    // مثال:
    // await api.updateDeviceType(id, { name: trimmed });

    console.log("نوع دستگاه ویرایش شد:", id, trimmed);

    this.props.navigate("/device-types");
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
          title="ویرایش نوع دستگاه"
          fieldLabel="نام"
          icon={<FaMicrochip className="text-secondary" size={18} />}
          initialValue={initialName}
          submitLabel="ذخیره تغییرات"
          onSubmit={this.handleUpdate}
        />
      </div>
    );
  }
}

export default withRouter(DeviceTypeEditPage);