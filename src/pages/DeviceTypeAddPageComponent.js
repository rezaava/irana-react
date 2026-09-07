import React from "react";
import { FaMicrochip, FaChevronLeft } from "react-icons/fa";
import withRouter from "./withRouter";
import NameEntityForm from "./NameEntityFormComponent";
import AuthCheck from "./AuthCheckComponent";

const API_URL = "https://iranaserviceapp.ir/test/api";

class DeviceTypeAddPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,
    };

    this.handleBack = this.handleBack.bind(this);
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

  handleBack() {
    this.props.navigate("/device-types");
  }

  handleCreate(name) {
    const trimmed = name.trim();

    if (!trimmed) return;

    const token = localStorage.getItem("token");

    fetch(`${API_URL}/add-type`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        name: trimmed,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("ADD TYPE:", data);

        this.props.navigate("/device-types");
      })
      .catch((error) => {
        console.error("ADD TYPE ERROR:", error);
      });
  }

  render() {
    if (!this.state.authenticated) {
      return null;
    }

    return (
      <div>
        <button
          type="button"
          onClick={this.handleBack}
          className="btn rounded-circle border p-2 d-flex align-items-center justify-content-center position-absolute"
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
          title="افزودن نوع دستگاه"
          fieldLabel="نام"
          icon={
            <FaMicrochip
              className="text-secondary"
              size={18}
            />
          }
          submitLabel="ثبت"
          onSubmit={this.handleCreate}
        />
      </div>
    );
  }
}

export default withRouter(DeviceTypeAddPage);