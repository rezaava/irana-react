import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import withRouter from "./withRouter";
import AuthCheck from "./AuthCheckComponent";
import Loader from "./LoaderComponent";

const API_URL = "https://iranaserviceapp.ir/test/api";

class NotificationDetailPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notification: null,
      loading: true,
      authenticated: false,
    };

    this.handleBack = this.handleBack.bind(this);
  }

  componentDidMount() {
    if (!AuthCheck()) {
      return;
    }

    this.setState({
      authenticated: true,
    });

    this.getNotification();
  }

  getNotification = () => {
    const { id } = this.props.params;
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/ano?id=${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("ANO:", data);

        this.setState({
          notification: data.ano || data.anos || null,
          loading: false,
        });
      })
      .catch((error) => {
        console.error("GET ANO ERROR:", error);

        this.setState({
          loading: false,
        });
      });
  };

  handleBack() {
    this.props.navigate("/notifications");
  }

  render() {
    if (!this.state.authenticated) {
      return null;
    }

    const { notification, loading } = this.state;

    if (loading) {
      return <Loader />;
    }

    if (!notification) {
      return (
        <div className="text-center text-muted py-5">
          اطلاعیه پیدا نشد.
        </div>
      );
    }

    return (
      <div>
        <div
          className="container px-3 pt-4 pb-5"
        >
          <div className="d-flex align-items-start justify-content-between mb-3">
            <div>
              <div className="text-dark fw-semibold">
                اطلاعیه #{notification.id}
              </div>

              {notification.date && (
                <div className="text-muted small mt-1">
                  {notification.date}
                  {notification.time && ` - ${notification.time}`}
                </div>
              )}
            </div>

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

          {notification.file && (
            <img
              src={`https://iranaserviceapp.ir/test/${notification.file}`}
              alt={notification.title}
              className="w-100 rounded-4"
              style={{
                height: 240,
                objectFit: "cover",
              }}
            />
          )}

          <h2 className="fs-6 fw-semibold text-dark text-end mb-3 mt-3">
            {notification.title}
          </h2>

          <p
            className="text-dark text-end mb-0"
            style={{
              lineHeight: 2,
              whiteSpace: "pre-line",
            }}
          >
            {notification.text}
          </p>
        </div>
      </div>
    );
  }
}

export default withRouter(NotificationDetailPage);