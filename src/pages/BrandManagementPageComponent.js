import React from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import GenericTable from "./GenericTableComponent";
import AuthCheck from "./AuthCheckComponent";
import Loader from "./LoaderComponent";


const API_URL = "https://iranaserviceapp.ir/test/api";

class BrandManagementPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      brands: [],
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

    this.getBrands();
  }

  getBrands = () => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/list-type`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("LIST BRAND:", data);

        this.setState({
          brands: data.brands || [],
          loading: false,
        });
      })
      .catch((error) => {
        console.error("GET BRANDS ERROR:", error);

        this.setState({
          loading: false,
        });
      });
  };

  handleDelete = (id) => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/delete-brand`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        brand_id: id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("DELETE BRAND:", data);

        this.getBrands();
      })
      .catch((error) => {
        console.error("DELETE BRAND ERROR:", error);
      });
  };

  render() {
    if (!this.state.authenticated) {
      return null;
    }

    const { brands, loading } = this.state;

    const columns = [
      {
        key: "name",
        label: "نام",
        headerClassName: "text-dark",
      },

      {
        key: "edit",
        label: "ویرایش",
        width: "0.6fr",
        headerClassName: "text-primary",

        render: (row) => (
          <Link
            to={`/brands/${row.id}/edit`}
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
              مدیریت برند دستگاه
            </h1>

            <Link
              to="/brands/add"
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

{loading ? <Loader /> : <GenericTable columns={columns} rows={brands} />}

        </div>
      </div>
    );
  }
}

export default BrandManagementPage;