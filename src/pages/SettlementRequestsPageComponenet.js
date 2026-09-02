import React from "react";
import { FaSearch, FaSlidersH } from "react-icons/fa";
import GenericTable from "./GenericTableComponent";

// داده‌ی نمونه — در پروژه‌ی واقعی از API می‌آید
const SAMPLE_SETTLEMENTS = [
  { id: 1, technicianName: "امیر عبادی لکلر", invoiceTotal: "2,275,000" },
  { id: 2, technicianName: "امیر عبادی لکلر", invoiceTotal: "2,500,000" },
  { id: 3, technicianName: "علی عبداللهی", invoiceTotal: "12,000,000" },
  { id: 4, technicianName: "مهرشاد نجفی", invoiceTotal: "4,500,000" },
  { id: 5, technicianName: "پارسا پورحبیبی", invoiceTotal: "6,500,000" },
  { id: 6, technicianName: "مهرشاد نجفی", invoiceTotal: "3,000,000" },
  { id: 7, technicianName: "علی عبداللهی", invoiceTotal: "5,000,000" },
  { id: 8, technicianName: "علی عبداللهی", invoiceTotal: "10,375,000" },
  { id: 9, technicianName: "علی عبداللهی", invoiceTotal: "3,500,000" },
  { id: 10, technicianName: "علی عبداللهی", invoiceTotal: "9,650,000" },
];

// صفحه‌ی درخواست‌های تسویه
class SettlementRequestsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settlements: SAMPLE_SETTLEMENTS,
      searchTerm: "",
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSearchChange(e) {
    this.setState({ searchTerm: e.target.value });
  }

  render() {
    const { settlements, searchTerm } = this.state;

    const filtered = settlements.filter((s) =>
      s.technicianName.includes(searchTerm.trim())
    );

    const columns = [
      { key: "technicianName", label: "نام تعمیرکار", headerClassName: "text-primary" },
      {
        key: "invoiceTotal",
        label: "جمع فاکتور ها",
        headerClassName: "text-primary",
        render: (row) => (
          <span className="small text-dark">{row.invoiceTotal} تومان</span>
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
      <div>
        <div className="container px-3 pt-4 pb-5" style={{ maxWidth: 480 }}>
          {/* جستجو */}
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

          <GenericTable
            columns={columns}
            rows={filtered}
            getRowLink={(row) => `/settlements/${row.id}`}
          />
        </div>
      </div>
    );
  }
}

export default SettlementRequestsPage;