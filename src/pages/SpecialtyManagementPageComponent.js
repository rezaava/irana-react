import React from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import GenericTable from "./GenericTableComponent";
import AuthCheck from "./AuthCheckComponent";
import Loader from "./LoaderComponent";

const API_URL = "https://iranaserviceapp.ir/test/api";

class SpecialtyManagementPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      specialties: [],
      loading: true,
      authenticated: false,
    };
  }

  componentDidMount() {
    if (!AuthCheck()) {
      return;
    }

    this.setState({
      authenticated: true,
    });

    this.getSpecialties();
  }

  getSpecialties = () => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/specials`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("SPECIALS:", data);

        this.setState({
          specialties: data.specials || data.specialties || [],
          loading: false,
        });
      })
      .catch((error) => {
        console.error("GET SPECIALTIES ERROR:", error);

        this.setState({
          loading: false,
        });
      });
  };

  handleDelete = (id) => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/special-delete`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("DELETE SPECIAL:", data);

        this.getSpecialties();
      })
      .catch((error) => {
        console.error("DELETE SPECIAL ERROR:", error);
      });
  };

  render() {
    if (!this.state.authenticated) {
      return null;
    }

    const { specialties, loading } = this.state;

    const columns = [
      {
        key: "name",
        label: "عنوان",
        headerClassName: "text-dark",
      },

      {
        key: "edit",
        label: "ویرایش",
        width: "0.6fr",
        headerClassName: "text-primary",

        render: (row) => (
          <Link
            to={`/specialties/${row.id}/edit`}
            state={{ name: row.name }}
            className="btn btn-light border-0 p-1 d-inline-flex"
          >
            <FaEdit
              className="text-secondary"
              size={18}
            />
          </Link>
        ),
      },

      {
        key: "delete",
        label: "حذف",
        width: "0.6fr",
        headerClassName: "text-primary",

        render: (row) => (
          <button
            type="button"
            onClick={() => this.handleDelete(row.id)}
            className="btn btn-light border-0 p-1"
          >
            <FaTrashAlt
              style={{ color: "#f08a72" }}
              size={17}
            />
          </button>
        ),
      },
    ];

    return (
      <div>
        <div className="container px-3 pt-4 pb-5">

          <div className="d-flex align-items-center justify-content-between mb-4">
            <h1 className="fs-6 fw-semibold text-dark m-0">
              مدیریت تخصص ها
            </h1>

            <Link
              to="/specialties/add"
              className="btn btn-light rounded-circle border p-2 d-flex align-items-center justify-content-center"
              style={{
                width: 40,
                height: 40,
                transition: "background-color 0.15s ease",
              }}
            >
              <FaPlus size={16} />
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <GenericTable
              columns={columns}
              rows={specialties}
            />
          )}

        </div>
      </div>
    );
  }
}

export default SpecialtyManagementPage;