import React from "react";
import { FaChevronLeft } from "react-icons/fa";

// داده‌ی نمونه — در پروژه‌ی واقعی از API بر اساس id مسیر می‌آید
const SAMPLE_NOTIFICATION = {
  number: 44,
  date: "۱۵ بهمن ۱۴۰۱",
  time: "۰۰:۵۷:۵۰",
  image: "https://placehold.co/600x400/1a2b40/38bdf8?text=%F0%9F%A4%9D",
  title: "همکاران عزیز",
  body:
    "با سلام و درود خدمت تمامی دوستان و همکاران عزیز 🖐️🖐️\n\n" +
    "⭐با توجه به افزایش قیمت ها در اجناس که هر روزه باعث اختلال در گردش مالی و پول و در نتیجه کسادی بازار می‌شود تیم ایرانا سرویس با دقت و راهنمایی مهندسی بهترین مشتری ها را در شهرستان جذب می‌کند\n" +
    "در تعمیرات و قطعات مصرفی خود دقت داشته باشید که به بهترین شکل ممکن و با رضایت کامل مشتری خدماتتان را تحویل دهید\n\n" +
    "💥💥 تیم پشتیبانی ما به بهترین شکل کنار شماست 💥💥\n\n" +
    "🌀🌀اولویت ما تعمیرکاران ما هستند",
};

// صفحه‌ی جزئیات یک اطلاعیه
class NotificationDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { notification: SAMPLE_NOTIFICATION };
    this.handleBack = this.handleBack.bind(this);
  }

  handleBack() {
    // مسیر بازگشت بعداً وصل می‌شود (مثلاً navigate(-1))
    console.log("بازگشت به لیست اطلاعیه ها");
  }

  render() {
    const { notification } = this.state;

    return (
      <div>
        <div className="container px-3 pt-4 pb-5" style={{ maxWidth: 480 }}>
          {/* هدر */}
          <div className="d-flex align-items-start justify-content-between mb-3">
            <div>
              <div className="text-dark fw-semibold">اطلاعیه #{notification.number}</div>
              <div className="text-muted small mt-1">
                {notification.date} - {notification.time}
              </div>
            </div>
            <button
              type="button"
              onClick={this.handleBack}
              className="btn btn-light rounded-circle border p-2 d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36, transition: "background-color 0.15s ease" }}
            >
              <FaChevronLeft size={14} />
            </button>

          </div>

          <img
            src={notification.image}
            alt={notification.title}
            className="w-100 rounded-4 mb-3"
            style={{ height: 260, objectFit: "cover" }}
          />

          <h2 className="fs-6 fw-semibold text-dark text-end mb-3">
            {notification.title}
          </h2>

          <p
            className="text-dark text-end mb-0"
            style={{ lineHeight: 2, whiteSpace: "pre-line" }}
          >
            {notification.body}
          </p>
        </div>
      </div>
    );
  }
}

export default NotificationDetailPage;