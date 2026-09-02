import React from "react";
import "./../css/add.css";
import { FaShieldAlt } from "react-icons/fa";

// فرم عمومیِ افزودن/ویرایش موجودیت‌هایی که فقط یک «نام» می‌گیرند
class NameEntityForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.initialValue || "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const { onSubmit } = this.props;
    const { name } = this.state;

    // TODO: اتصال به API واقعی
    // if (this.props.entityId) {
    //   await api.updateEntity(this.props.entityId, { name });
    // } else {
    //   await api.createEntity({ name });
    // }

    if (onSubmit) {
      onSubmit(name);
    } else {
      console.log("ثبت مقدار:", name);
    }
  }

  render() {
    const {
      title = "افزودن مورد جدید",
      fieldLabel = "نام",
      icon,
      submitLabel = "ثبت",
    } = this.props;

    const { name } = this.state;

    return (
      <div
        className="min-vh-100 d-flex align-items-center"
      >
        <div className="container">
          <div className="row justify-content-center">
              
              <h1 className="fs-6 fw-semibold text-dark text-center mb-4">
                {title}
              </h1>

              <form onSubmit={this.handleSubmit}>
                <div className="d-flex align-items-center justify-content-between gap-2 border rounded-3 px-3 py-3 mb-4">
                  <input
                    type="text"
                    placeholder={fieldLabel}
                    value={name}
                    onChange={this.handleChange}
                    className="form-control border-0 shadow-none text-end p-0"
                  />

                  {icon || (
                    <FaShieldAlt
                      className="text-secondary"
                      size={18}
                    />
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-3 py-3"
                  style={{
                    transition: "opacity 0.15s ease",
                  }}
                >
                  {submitLabel}
                </button>
              </form>
          </div>
        </div>
      </div>
    );
  }
}

export default NameEntityForm;