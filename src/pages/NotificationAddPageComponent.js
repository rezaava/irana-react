import React from "react";
import NotificationForm from "./NotificationFormComponent";
import withRouter from "./withRouter";
import AuthCheck from "./AuthCheckComponent";

const API_URL = "https://iranaserviceapp.ir/test/api";

class NotificationAddPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,
    };

    this.handleCreate = this.handleCreate.bind(this);
  }

  componentDidMount() {
    if (!AuthCheck()) {
      return;
    }

    this.setState({
      authenticated: true,
    });
  }

  handleCreate({ title, text, imageFile }) {
    const trimmedTitle = title.trim();
    const trimmedText = text.trim();

    if (!trimmedTitle) return;

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("title", trimmedTitle);
    formData.append("text", trimmedText);

    if (imageFile) {
      formData.append("file", imageFile);
    }

    fetch(`${API_URL}/ano`, {
      method: "POST",

      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("SAVE ANO:", data);

        this.props.navigate("/notifications");
      })
      .catch((error) => {
        console.error("SAVE ANO ERROR:", error);
      });
  }

  render() {
    if (!this.state.authenticated) {
      return null;
    }

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