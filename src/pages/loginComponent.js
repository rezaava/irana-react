import React from "react";
import styles from "../css/login.module.css";
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaArrowRight, FaKey } from "react-icons/fa";

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            step: "phone",
            phone: "",
            id: "",
            phoneError: "",
            code: "",
            codeError: "",
            loading: false,
        };

        this.phoneRef = React.createRef();
        this.codeRef = React.createRef();
    }

    componentDidMount() {
        const token = localStorage.getItem("token");

        if (token) {
            window.location.href = "/";
        }

        const navOuter = document.querySelector(".nav-outer");

        if (navOuter) {
            navOuter.style.display = "none";
        }
    }

    componentWillUnmount() {
        const navOuter = document.querySelector(".nav-outer");

        if (navOuter) {
            navOuter.style.display = "";
        }
    }

    // =========================
    // ارسال شماره موبایل
    // POST /login
    // =========================
    handlePhoneSubmit = (e) => {
        e.preventDefault();

        const phone = this.phoneRef.current.value.trim();
        const cleanPhone = phone.replace(/\D/g, "");

        if (cleanPhone.length !== 11) {
            this.setState(
                {
                    phoneError: "شماره موبایل باید ۱۱ رقم باشد",
                },
                () => {
                    this.phoneRef.current.focus();
                }
            );

            return;
        }

        this.setState({
            phone: cleanPhone,
            phoneError: "",
            loading: true,
        });

        fetch("https://iranaserviceapp.ir/test/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                mobile: cleanPhone,
            }),
        })
            .then((response) => {
                return response.json().then((data) => ({
                    status: response.status,
                    ok: response.ok,
                    data: data,
                }));
            })
            .then((result) => {
                if (!result.ok || result.data?.status === "0") {
                    throw new Error(
                        result.data?.message || "کاربر وجود ندارد!"
                    );
                }

                // =========================
                // گرفتن ID کاربر از API
                // =========================
                const userId =
                    result.data?.id ||
                    result.data?.user_id ||
                    result.data?.data?.id ||
                    result.data?.data?.user_id ||
                    result.data?.user?.id ||
                    result.data?.data?.user?.id;

                if (!userId) {
                    console.error("User ID پیدا نشد:", result.data);

                    throw new Error(
                        "شناسه کاربر از سرور دریافت نشد"
                    );
                }

                this.setState(
                    {
                        step: "code",
                        loading: false,
                        phone: cleanPhone,
                        id: userId,
                        code: "",
                        codeError: "",
                    },
                    () => {
                        this.codeRef.current.focus();
                    }
                );
            })
            .catch((error) => {
                console.error("Login error:", error);

                this.setState({
                    loading: false,
                    phoneError:
                        error.message ||
                        "خطایی در ارتباط با سرور رخ داد",
                });
            });
    };

    // =========================
    // بررسی کد
    // POST /check-code
    // =========================
    handleCodeSubmit = (e) => {
        e.preventDefault();

        const code = this.state.code.trim();

        if (code.length !== 4 || !/^\d{4}$/.test(code)) {
            this.setState(
                {
                    codeError: "کد باید ۴ رقم باشد",
                },
                () => {
                    this.codeRef.current.focus();
                }
            );

            return;
        }

        this.setState({
            codeError: "",
            loading: true,
        });

        fetch("https://iranaserviceapp.ir/test/api/check-code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                mobile: this.state.phone,
                sms: code,
            }),
        })
            .then((response) => {
                return response.json().then((data) => ({
                    status: response.status,
                    ok: response.ok,
                    data: data,
                }));
            })
            .then((result) => {
                if (!result.ok) {
                    throw new Error(
                        result.data?.message ||
                            "کد وارد شده صحیح نیست"
                    );
                }

                const token =
                    result.data?.token ||
                    result.data?.access_token ||
                    result.data?.data?.token ||
                    result.data?.data?.access_token;

                if (!token) {
                    console.error(
                        "Token پیدا نشد:",
                        result.data
                    );

                    throw new Error(
                        "کد ورود اشتباه هست"
                    );
                }

                // =========================
                // ذخیره اطلاعات
                // =========================
                localStorage.setItem("token", token);
                localStorage.setItem(
                    "mobile",
                    this.state.phone
                );
                localStorage.setItem(
                    "user_id",
                    this.state.id
                );

                this.setState({
                    loading: false,
                });

                window.location.href = "/";
            })
            .catch((error) => {
                console.error(
                    "Check code error:",
                    error
                );

                this.setState({
                    loading: false,
                    codeError:
                        error.message ||
                        "خطایی در ارتباط با سرور رخ داد",
                });
            });
    };

    // =========================
    // تغییر کد
    // =========================
    handleCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");

        this.setState({
            code: value,
            codeError: "",
        });
    };

    // =========================
    // بازگشت به شماره
    // =========================
    handleBackToPhone = () => {
        this.setState({
            step: "phone",
            code: "",
            codeError: "",
        });
    };

    render() {
        return (
            <main className="container mt-4 pt-5">
                <Link
                    to="/welcome/"
                    className={styles["back-link"]}
                >
                    <FaArrowRight size={18} />
                </Link>

                <div className="align-items-center position-fixed top-50 start-50 translate-middle">
                    <div
                        className={`${styles["login-box-login"]} shadow text-center ${styles["item-back"]} ${styles["boder"]} p-4 rounded-5 d-flex justify-content-center align-items-center`}
                    >
                        <div className={styles["welcome-box"]}>
                            <img
                                src="../img/login.png"
                                alt="logo"
                                className={styles["img-box"]}
                            />

                            {this.state.step === "phone" ? (
                                <div className="mt-5">
                                    <form
                                        className="mt-4"
                                        onSubmit={
                                            this.handlePhoneSubmit
                                        }
                                    >
                                        <div
                                            className={
                                                styles[
                                                    "custom-floating"
                                                ]
                                            }
                                        >
                                            <FaPhoneAlt
                                                className={
                                                    styles[
                                                        "custom-icon"
                                                    ]
                                                }
                                            />

                                            <input
                                                type="tel"
                                                id="phone"
                                                className={`${styles["custom-input"]} ${
                                                    this.state
                                                        .phoneError
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                placeholder=" "
                                                dir="rtl"
                                                value={
                                                    this.state.phone
                                                }
                                                ref={
                                                    this.phoneRef
                                                }
                                                disabled={
                                                    this.state.loading
                                                }
                                                onChange={(e) => {
                                                    this.setState({
                                                        phone: e.target
                                                            .value,
                                                        phoneError:
                                                            "",
                                                    });
                                                }}
                                            />

                                            <label
                                                htmlFor="phone"
                                                className={
                                                    styles[
                                                        "custom-label"
                                                    ]
                                                }
                                            >
                                                شماره موبایل
                                            </label>
                                        </div>

                                        {this.state.phoneError && (
                                            <div
                                                className={`${styles["text-danger"]} ${styles["text-end"]} ${styles["small"]} ${styles["mt-1"]}`}
                                            >
                                                {
                                                    this.state
                                                        .phoneError
                                                }
                                            </div>
                                        )}

                                        <div
                                            className={
                                                styles["group-btn"]
                                            }
                                        >
                                            <button
                                                type="submit"
                                                className={
                                                    styles[
                                                        "custom-btn"
                                                    ]
                                                }
                                                disabled={
                                                    this.state.loading
                                                }
                                            >
                                                {this.state.loading
                                                    ? "در حال ارسال..."
                                                    : "ارسال کد"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="mt-5">
                                    <form
                                        onSubmit={
                                            this.handleCodeSubmit
                                        }
                                    >
                                        <div
                                            className={
                                                styles[
                                                    "custom-floating"
                                                ]
                                            }
                                        >
                                            <FaKey
                                                className={
                                                    styles[
                                                        "custom-icon"
                                                    ]
                                                }
                                            />

                                            <input
                                                type="text"
                                                id="code"
                                                className={`${styles["custom-input"]} ${
                                                    this.state
                                                        .codeError
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                placeholder=" "
                                                dir="ltr"
                                                ref={
                                                    this.codeRef
                                                }
                                                value={
                                                    this.state.code
                                                }
                                                onChange={
                                                    this
                                                        .handleCodeChange
                                                }
                                                maxLength="4"
                                                disabled={
                                                    this.state.loading
                                                }
                                            />

                                            <label
                                                htmlFor="code"
                                                className={
                                                    styles[
                                                        "custom-label"
                                                    ]
                                                }
                                            >
                                                کد تأیید
                                            </label>
                                        </div>

                                        {this.state.codeError && (
                                            <div
                                                className={`${styles["text-danger"]} ${styles["text-end"]} ${styles["small"]} ${styles["mt-1"]}`}
                                            >
                                                {
                                                    this.state
                                                        .codeError
                                                }
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            className={
                                                styles[
                                                    "custom-btn"
                                                ]
                                            }
                                            disabled={
                                                this.state.loading
                                            }
                                        >
                                            {this.state.loading
                                                ? "در حال بررسی..."
                                                : "تأیید کد"}
                                        </button>
                                    </form>

                                    <button
                                        className="btn btn-link mt-2"
                                        onClick={
                                            this
                                                .handleBackToPhone
                                        }
                                        disabled={
                                            this.state.loading
                                        }
                                    >
                                        بازگشت به ویرایش شماره
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

export default Login;