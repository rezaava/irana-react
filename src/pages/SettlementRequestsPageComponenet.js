import React from "react";
import { FaSearch, FaSlidersH } from "react-icons/fa";
import GenericTable from "./GenericTableComponent";
import AuthCheck from "./AuthCheckComponent";

const API_URL = "https://iranaserviceapp.ir/test/api";

class SettlementRequestsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settlements: [],
      searchTerm: "",
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

    this.getSettlements();
  }

  getSettlements = () => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/clear`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("CLEAR:", data);

        this.setState({
          settlements: data.clears || [],
          loading: false,
        });
      })
      .catch((error) => {
        console.error("GET CLEAR ERROR:", error);

        this.setState({
          loading: false,
        });
      });
  };

  handleSearchChange = (e) => {
    this.setState({
      searchTerm: e.target.value,
    });
  };

  render() {
    if (!this.state.authenticated) {
      return null;
    }

    const {
      settlements,
      searchTerm,
      loading,
    } = this.state;

    const search = searchTerm.trim();

    const filtered = settlements.filter((item) => {
      const fullName = `${item.user?.name || ""} ${
        item.user?.family || ""
      }`;

      return fullName.includes(search);
    });

    const columns = [
      {
        key: "technicianName",
        label: "نام تعمیرکار",
        headerClassName: "text-primary",

        render: (row) => (
          <span className="text-dark">
            {row.user?.name || ""} {row.user?.family || ""}
          </span>
        ),
      },

      {
        key: "invoiceTotal",
        label: "جمع فاکتور ها",
        headerClassName: "text-primary",

        render: (row) => (
          <span className="small text-dark">
            {Number(row.sum || 0).toLocaleString("fa-IR")} تومان
          </span>
        ),
      },

      {
        key: "details",
        label: "جزئیات",
        width: "0.6fr",
        headerClassName: "text-primary",

        render: () => (
          <FaSlidersH
            className="text-secondary mx-auto"
            size={14}
            style={{
              transform: "rotate(90deg)",
            }}
          />
        ),
      },
    ];

    return (
      <div>
        <div
          className="container px-3 pt-4 pb-5"
          style={{ maxWidth: 480 }}
        >
          <div className="d-flex align-items-center gap-2 border rounded-pill px-3 py-2 mb-3 bg-white">
            <input
              type="text"
              placeholder="جستجو..."
              value={searchTerm}
              onChange={this.handleSearchChange}
              className="form-control border-0 shadow-none text-end p-0"
            />

            <FaSearch
              className="text-secondary"
              size={16}
            />
          </div>

          {loading ? (
            <div className="text-center text-muted py-5">
              در حال دریافت اطلاعات...
            </div>
          ) : (
            <GenericTable
              columns={columns}
              rows={filtered}
              getRowLink={(row) => `/settlements/${row.id}`}
            />
          )}
        </div>
      </div>
    );
  }
}

export default SettlementRequestsPage;