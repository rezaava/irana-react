import React from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import NotificationCard from "./NotificationsCardComponent";

// داده‌ی نمونه — در پروژه‌ی واقعی از API می‌آید
const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    image: "https://placehold.co/600x400/1a2b40/38bdf8?text=%F0%9F%A4%9D",
    title: "همکاران عزیز",
    excerpt:
      "با سلام و درود خدمت تمامی دوستان و همکاران عزیز 🖐️🖐️ ⭐با توجه به افزایش قیمت ها در اجناس که هر روزه باعث اختلال در گردش مالی...",
  },
  {
    id: 2,
    image: "https://placehold.co/600x400/1e3a8a/facc15?text=Irana+Service",
    title: "خوش آمدید به مجموعه ایرانا سرویس",
    excerpt:
      "با سلام خدمت تمامی دوستان و تکنسین های مجموعه ایرانا 🖐️🖐️ ما در اینجا تمامی تکنسین های خوب کشور را برمی گزینیم که با سرویس دهی عال...",
  },
];

// صفحه‌ی لیست اطلاعیه‌ها
class NotificationsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { notifications: SAMPLE_NOTIFICATIONS };
  }

  render() {
    const { notifications } = this.state;

    return (
      <div>
        <div className="container px-3 pt-4 pb-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h1 className="fs-6 fw-semibold text-dark m-0">اطلاعیه ها</h1>
            <Link
              to="/notifications/add"
              className="btn btn-light rounded-circle border p-2 d-flex align-items-center justify-content-center"
              style={{ width: 40, height: 40, transition: "background-color 0.15s ease" }}
            >
              <FaPlus size={16} />
            </Link>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center text-muted py-5">
              اطلاعیه‌ای برای نمایش وجود ندارد.
            </div>
          ) : (
            notifications.map((n) => (
              <NotificationCard key={n.id} notification={n} />
            ))
          )}
        </div>
      </div>
    );
  }
}

export default NotificationsPage;