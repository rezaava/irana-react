import React from "react";
import {
  FaChevronLeft,
  FaUserEdit,
  FaTag,
  FaPercentage,
} from "react-icons/fa";
import InfoField from "./InfoFieldComponenet";
import withRouter from "./withRouter";
import AuthCheck from "./AuthCheckComponent";

const API_URL = "https://iranaserviceapp.ir/test/api";

class SettlementDetailPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settlement: null,
      loading: true,
      authenticated: false,
      showImageModal: false,
    };

    this.handleBack = this.handleBack.bind(this);
    this.handleOpenImage = this.handleOpenImage.bind(this);
    this.handleCloseImage = this.handleCloseImage.bind(this);
  }

  componentDidMount() {
    if (!AuthCheck()) {
      return;
    }

    this.setState({
      authenticated: true,
    });

    this.getSettlement();
  }

  getSettlement = () => {
    const { id } = this.props.params;
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/clear/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("CLEAR DETAIL:", data);

        this.setState({
          settlement: data.clears || null,
          loading: false,
        });
      })
      .catch((error) => {
        console.error("GET CLEAR DETAIL ERROR:", error);

        this.setState({
          loading: false,
        });
      });
  };

  handleBack() {
    this.props.navigate("/settlements");
  }

  handleOpenImage() {
    this.setState({
      showImageModal: true,
    });
  }

  handleCloseImage() {
    this.setState({
      showImageModal: false,
    });
  }

  render() {
    if (!this.state.authenticated) {
      return null;
    }

    const {
      settlement,
      loading,
      showImageModal,
    } = this.state;

    if (loading) {
      return (
        <div className="text-center text-muted py-5">
          در حال دریافت اطلاعات...
        </div>
      );
    }

    if (!settlement) {
      return (
        <div className="text-center text-muted py-5">
          درخواست تسویه پیدا نشد.
        </div>
      );
    }

    const technicianName = `${settlement.user?.name || ""} ${
      settlement.user?.family || ""
    }`.trim();

    const imageUrl = settlement.file1
      ? `https://iranaserviceapp.ir/test/files/clear/${settlement.file1}`
      : null;

    return (
      <div>
        <div className="container px-3 pt-4 pb-5">

          {/* دکمه بازگشت */}
          <div className="d-flex justify-content-end mb-4">
            <button
              type="button"
              onClick={this.handleBack}
              className="btn btn-light rounded-circle border p-2 d-flex align-items-center justify-content-center"
              style={{
                width: 36,
                height: 36,
                transition: "background-color 0.15s ease",
              }}
            >
              <FaChevronLeft size={14} />
            </button>
          </div>

          {/* نام تعمیرکار */}
          <InfoField
            icon={<FaUserEdit size={18} />}
            label="نام تعمیرکار"
            value={technicianName}
          />

          {/* کد درخواست */}
          <InfoField
            icon={<FaTag size={18} />}
            label="کد درخواست"
            value={settlement.text1 || "-"}
          />

          {/* مبلغ */}
          <InfoField
            icon={<FaPercentage size={18} />}
            label="جمع فاکتور ها (فقط پورسانت)"
          >
            <span className="fw-semibold">
              {Number(settlement.sum || 0).toLocaleString("fa-IR")} تومان
            </span>
          </InfoField>

          {/* فیش واریزی */}
          {imageUrl && (
            <div className="d-flex align-items-start justify-content-between gap-3 border rounded-4 px-3 py-3 mb-3 bg-white">
              <span className="text-muted">
                فیش واریزی:
              </span>

              <img
                src={imageUrl}
                alt="فیش واریزی"
                className="rounded-3 border"
                onClick={this.handleOpenImage}
                style={{
                  width: 200,
                  height: 168,
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            </div>
          )}
        </div>

        {/* Modal نمایش کامل تصویر */}
        {showImageModal && imageUrl && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            onClick={this.handleCloseImage}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            }}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-xl"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content bg-dark border-0">

                <div className="modal-header border-0">
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={this.handleCloseImage}
                    aria-label="بستن"
                  />
                </div>

                <div className="modal-body text-center p-2">
                  <img
                    src={imageUrl}
                    alt="فیش واریزی"
                    className="img-fluid rounded-3"
                    style={{
                      maxHeight: "85vh",
                      width: "auto",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(SettlementDetailPage);