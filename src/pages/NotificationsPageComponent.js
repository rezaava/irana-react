import React from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import NotificationCard from "./NotificationsCardComponent";
import AuthCheck from "./AuthCheckComponent";

const API_URL = "https://iranaserviceapp.ir/test/api";

class NotificationsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: [],
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

    this.getNotifications();
  }
  handleDeleteNotification = (id) => {
  this.setState((prevState) => ({
    notifications: prevState.notifications.filter(
      (notification) => notification.id !== id
    ),
  }));
};

  getNotifications = () => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/ano`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("ANOS:", data);

        this.setState({
          notifications: data.anos || [],
          loading: false,
        });
      })
      .catch((error) => {
        console.error("GET ANOS ERROR:", error);

        this.setState({
          loading: false,
        });
      });
  };

  render() {
    if (!this.state.authenticated) {
      return null;
    }

    const { notifications, loading } = this.state;

    return (
      <div>
        <div className="container px-3 pt-4 pb-5">

          <div className="d-flex align-items-center justify-content-between mb-4">
            <h1 className="fs-6 fw-semibold text-dark m-0">
              اطلاعیه ها
            </h1>

            <Link
              to="/notifications/add"
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
            <div className="text-center text-muted py-5">
              در حال دریافت اطلاعات...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-muted py-5">
              اطلاعیه‌ای برای نمایش وجود ندارد.
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onDelete={this.handleDeleteNotification}
              />
            ))
          )}

        </div>
      </div>
    );
  }
}

export default NotificationsPage;