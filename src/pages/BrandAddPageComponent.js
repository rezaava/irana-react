import React from "react";
import { FaTag, FaChevronLeft } from "react-icons/fa";
import NameEntityForm from "./NameEntityFormComponent";
import withRouter from "./withRouter";
import AuthCheck from "./AuthCheckComponent";

const API_URL = "https://iranaserviceapp.ir/test/api";

class BrandAddPage extends React.Component {
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
    this.props.navigate("/brands");
  }

  handleCreate(name) {
    const trimmed = name.trim();

    if (!trimmed) return;

    const token = localStorage.getItem("token");

    fetch(`${API_URL}/add-brand`, {
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
        console.log("ADD BRAND:", data);

        this.props.navigate("/brands");
      })
      .catch((error) => {
        console.error("ADD BRAND ERROR:", error);
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
          title="افزودن برند دستگاه"
          fieldLabel="نام"
          icon={<FaTag className="text-secondary" size={18} />}
          submitLabel="ثبت"
          onSubmit={this.handleCreate}
        />
      </div>
    );
  }
}

export default withRouter(BrandAddPage);