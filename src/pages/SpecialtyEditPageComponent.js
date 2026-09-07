import React from "react";
import { FaThLarge, FaChevronLeft } from "react-icons/fa";
import NameEntityForm from "./NameEntityFormComponent";
import withRouter from "./withRouter";
import AuthCheck from "./AuthCheckComponent";

const API_URL = "https://iranaserviceapp.ir/test/api";

class SpecialtyEditPage extends React.Component {
  constructor(props) {
    super(props);

    const { location } = props;

    this.state = {
      initialTitle: location?.state?.name || "",
      authenticated: false,
    };

    this.handleBack = this.handleBack.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    if (!AuthCheck()) {
      return;
    }

    this.setState({
      authenticated: true,
    });
  }

  handleBack() {
    this.props.navigate("/specialties");
  }

  handleUpdate(name) {
    const trimmed = name.trim();

    if (!trimmed) return;

    const { id } = this.props.params;
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/special`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        name: trimmed,
        id: id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("UPDATE SPECIAL:", data);

        this.props.navigate("/specialties");
      })
      .catch((error) => {
        console.error("UPDATE SPECIAL ERROR:", error);
      });
  }

  render() {
    if (!this.state.authenticated) {
      return null;
    }

    const { initialTitle } = this.state;

    return (
      <div>
        <button
          type="button"
          onClick={this.handleBack}
          className="btn btn-light rounded-circle border p-2 d-flex align-items-center justify-content-center position-absolute"
          style={{
            width: 36,
            height: 36,
            top: 16,
            right: 16,
            zIndex: 1,
          }}
        >
          <FaChevronLeft size={14} />
        </button>

        <NameEntityForm
          title="ویرایش تخصص"
          fieldLabel="عنوان"
          icon={
            <FaThLarge
              className="text-secondary"
              size={18}
            />
          }
          initialValue={initialTitle}
          submitLabel="ذخیره تغییرات"
          onSubmit={this.handleUpdate}
        />
      </div>
    );
  }
}

export default withRouter(SpecialtyEditPage);