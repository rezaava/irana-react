import React from "react";
import { FaSearch, FaSlidersH } from "react-icons/fa";
import GenericTable from "./GenericTableComponent";
import Loader from "./LoaderComponent";
import withRouter from "./withRouter";

const API_URL = "https://iranaserviceapp.ir/test/api";

// صفحه‌ی لیست «درخواست‌های ویرایش پروفایل» — دقیقاً مطابق عکس
// هر ردیف از GET /changes میاد (بدون id => آرایه‌ی همه‌ی درخواست‌های در انتظار تایید)
// و کل ردیف یه لینک به صفحه‌ی جزئیاته
class ProfileChangeRequestsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: true,
      error: false,
      searchTerm: "",
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    this.getChanges();
  }

  getChanges = () => {
    const token = localStorage.getItem("token");

    this.setState({ loading: true, error: false });

    fetch(`${API_URL}/changes`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("CHANGES LIST API:", data);
        this.setState({
          items: Array.isArray(data.users) ? data.users : [],
          loading: false,
        });
      })
      .catch((error) => {
        console.error("GET CHANGES ERROR:", error);
        this.setState({ loading: false, error: true, items: [] });
      });
  };

  handleSearchChange(e) {
    this.setState({ searchTerm: e.target.value });
  }

  render() {
    const { items, loading, error, searchTerm } = this.state;

    if (loading) {
      return <Loader />;
    }

    const filtered = items.filter((item) => {
      const term = searchTerm.trim();
      if (!term) return true;
      const fullName = `${item.name || ""} ${item.family || ""}`;
      return fullName.includes(term);
    });

    const columns = [
      {
        key: "name",
        label: "نام تعمیرکار",
        headerClassName: "text-primary",
        render: (row) => (
          <span className="small text-dark">
            {`${row.name || ""} ${row.family || ""}`.trim() || "---"}
          </span>
        ),
      },
      {
        key: "time",
        label: "زمان",
        headerClassName: "text-primary",
        render: (row) => (
          <span className="small text-muted">{row.created_at || "---"}</span>
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
            style={{ transform: "rotate(90deg)" }}
          />
        ),
      },
    ];

    return (
      <div dir="rtl">
        <div className="container px-3 pt-4 pb-5">
          <div className="d-flex align-items-center gap-2 border rounded-pill px-3 py-2 mb-3 bg-white">
            <input
              type="text"
              placeholder="جستجو..."
              value={searchTerm}
              onChange={this.handleSearchChange}
              className="form-control border-0 shadow-none text-end p-0"
            />
            <FaSearch className="text-secondary" size={16} />
          </div>

          {error && (
            <div className="text-center text-danger py-4">
              خطا در دریافت لیست درخواست‌ها
            </div>
          )}

          <GenericTable
            columns={columns}
            rows={filtered}
            getRowLink={(row) => `/profile-edit-requests/${row.user_id}`}
            emptyMessage="درخواستی برای نمایش وجود ندارد."
          />
        </div>
      </div>
    );
  }
}

export default withRouter(ProfileChangeRequestsPage);