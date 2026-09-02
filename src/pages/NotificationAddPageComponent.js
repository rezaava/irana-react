import React from "react";
import NotificationForm from "./NotificationFormComponent";
import withRouter from "./withRouter";

// صفحه‌ی مستقل «افزودن اطلاعیه» — روی مسیر /notifications/add می‌شینه
class NotificationAddPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleCreate({ title, text, imageFile }) {
    if (!title.trim()) return;

    // TODO: اینجا باید API ایجاد اطلاعیه صدا زده بشه (احتمالاً multipart/form-data برای تصویر)
    // مثال:
    // const formData = new FormData();
    // formData.append("title", title);
    // formData.append("text", text);
    // if (imageFile) formData.append("image", imageFile);
    // await api.createNotification(formData);

    console.log("اطلاعیه ثبت شد:", { title, text, imageFile });

    this.props.navigate("/notifications");
  }

  render() {
    return (
      <NotificationForm
        title="اطلاعیه جدید"
        submitLabel="ثبت"
        onSubmit={this.handleCreate}
      />
    );
  }
}

export default withRouter(NotificationAddPage);