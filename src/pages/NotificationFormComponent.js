import React from "react";
import { FaShieldAlt, FaFolderOpen } from "react-icons/fa";

// فرم مشترک اطلاعیه — هم برای افزودن هم برای ویرایش استفاده می‌شود
// props:
//   title: عنوان بالای فرم، مثلاً "اطلاعیه جدید" یا "ویرایش اطلاعیه"
//   initialValues: { title, text, imagePreview }
//   submitLabel: متن دکمه (پیش‌فرض "ثبت")
//   onSubmit({ title, text, imageFile }): وقتی فرم ساب‌میت می‌شود صدا زده می‌شود
class NotificationForm extends React.Component {
  constructor(props) {
    super(props);
    const initial = props.initialValues || {};
    this.state = {
      title: initial.title || "",
      text: initial.text || "",
      imageFile: null,
      imagePreview: initial.imagePreview || "",
    };
    this.fileInputRef = React.createRef();

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleChooseFileClick = this.handleChooseFileClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleTextChange(e) {
    this.setState({ text: e.target.value });
  }

  handleChooseFileClick() {
    if (this.fileInputRef.current) {
      this.fileInputRef.current.click();
    }
  }

  handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ imageFile: file, imagePreview: reader.result });
    };
    reader.readAsDataURL(file);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { title, text, imageFile, imagePreview } = this.state;
    const { onSubmit } = this.props;

    if (onSubmit) {
      onSubmit({ title, text, imageFile, imagePreview });
    } else {
      console.log("ثبت اطلاعیه:", { title, text, imageFile });
    }
  }

  render() {
    const { title: formTitle = "اطلاعیه جدید", submitLabel = "ثبت" } = this.props;
    const { title, text, imagePreview } = this.state;

    return (
      <div>
        <div className="container px-3 pt-4 pb-5">
          <h1 className="fs-6 fw-semibold text-dark text-center mb-4">{formTitle}</h1>

          <form onSubmit={this.handleSubmit}>
            {/* عنوان */}
            <div className="d-flex align-items-center justify-content-between gap-2 border rounded-3 px-3 py-3 mb-3 bg-white">
              <input
                type="text"
                placeholder="عنوان"
                value={title}
                onChange={this.handleTitleChange}
                className="form-control border-0 shadow-none text-end p-0"
              />
              <FaShieldAlt className="text-secondary" size={18} />
            </div>

            {/* متن */}
            <div className="d-flex align-items-center justify-content-between gap-2 border rounded-3 px-3 py-3 mb-3 bg-white">
              <input
                type="text"
                placeholder="متن"
                value={text}
                onChange={this.handleTextChange}
                className="form-control border-0 shadow-none text-end p-0"
              />
              <FaShieldAlt className="text-secondary" size={18} />
            </div>

            {/* تصویر */}
            <div className="border rounded-4 p-3 mb-4">
              <div className="text-muted small text-end mb-3">تصویر</div>

              <div className="d-flex align-items-start justify-content-between gap-3">
                <div
                  className="rounded-3 bg-light flex-shrink-0"
                  style={{
                    width: "56%",
                    aspectRatio: "16 / 10",
                    backgroundImage: imagePreview ? `url(${imagePreview})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                <button
                  type="button"
                  onClick={this.handleChooseFileClick}
                  className="btn btn-outline-primary rounded-pill d-flex align-items-center gap-2 px-3 py-2"
                  style={{ transition: "background-color 0.15s ease" }}
                >
                  <span>انتخاب فایل</span>
                  <FaFolderOpen size={16} />
                </button>

                <input
                  ref={this.fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={this.handleFileChange}
                  className="d-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 rounded-3 py-3"
              style={{ transition: "opacity 0.15s ease" }}
            >
              {submitLabel}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default NotificationForm;