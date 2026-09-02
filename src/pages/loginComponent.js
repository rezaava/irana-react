import React from "react";
import styles from "../css/login.module.css"; // مسیر فایل ماژول
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaArrowLeft, FaArrowRight, FaKey } from "react-icons/fa";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: "phone", // "phone" | "code"
            phone: "",
            phoneError: "",
            code: "",
            codeError: "",
        };
        this.phoneRef = React.createRef();
        this.codeRef = React.createRef();
    }

    handlePhoneSubmit = (e) => {
        e.preventDefault();
        const phone = this.phoneRef.current.value.trim();
        const cleanPhone = phone.replace(/\D/g, "");

        if (cleanPhone.length === 11) {
            this.setState({ phoneError: "", step: "code" }, () => {
                this.codeRef.current.focus();
            });
        } else {
            this.setState({
                phoneError: "شماره موبایل باید ۱۱ رقم باشد",
            });
            this.phoneRef.current.focus();
        }
    };

    handleCodeSubmit = (e) => {
        e.preventDefault();
        const code = this.state.code.trim();
        if (code.length === 4 && /^\d{4}$/.test(code)) {
            this.setState({ codeError: "" });
            alert("کد تأیید صحیح است: " + code);
        } else {
            this.setState({
                codeError: "کد باید ۴ رقم باشد",
            });
            this.codeRef.current.focus();
        }
    };

    handleCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        this.setState({ code: value, codeError: "" });
    };

    render() {
        return (
            <main className="container mt-4 pt-5">
                <Link to="/welcome/" className={styles["back-link"]}>
                    <FaArrowRight size={18} />
                </Link>

                <div className="align-items-center position-fixed top-50 start-50 translate-middle">
                    <div className={`${styles["login-box-login"]} shadow text-center ${styles["item-back"]} ${styles["boder"]} p-4 rounded-5 d-flex justify-content-center align-items-center`}>
                        <div className={styles["welcome-box"]}>
                            <img src="../img/aaa.png" alt="logo" className={styles["img-box"]} />

                            {this.state.step === "phone" ? (
                                <div className="mt-5">
                                    <form className="mt-4" onSubmit={this.handlePhoneSubmit}>
                                        <div className={styles["custom-floating"]}>
                                            <FaPhoneAlt className={styles["custom-icon"]} />
                                            <input
                                                type="tel"
                                                id="phone"
                                                className={`${styles["custom-input"]} ${this.state.phoneError ? "is-invalid" : ""}`}
                                                placeholder=" "
                                                dir="rtl"
                                                value={this.state.phone}
                                                ref={this.phoneRef}
                                                onChange={(e) => {
                                                    this.setState({ phone: e.target.value });
                                                    if (this.state.phoneError) this.setState({ phoneError: "" });
                                                }}
                                            />
                                            <label htmlFor="phone" className={styles["custom-label"]}>
                                                شماره موبایل
                                            </label>
                                        </div>
                                        {this.state.phoneError && (
                                            <div className={`${styles["text-danger"]} ${styles["text-end"]} ${styles["small"]} ${styles["mt-1"]}`}>
                                                {this.state.phoneError}
                                            </div>
                                        )}
                                        <div className={styles["group-btn"]}>
                                            <button type="submit" className={styles["custom-btn"]}>
                                            ارسال کد
                                        </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="mt-5">
                                    <form onSubmit={this.handleCodeSubmit}>
                                        <div className={styles["custom-floating"]}>
                                            <FaKey className={styles["custom-icon"]} />
                                            <input
                                                type="text"
                                                id="code"
                                                className={`${styles["custom-input"]} ${this.state.codeError ? "is-invalid" : ""}`}
                                                placeholder=" "
                                                dir="ltr"
                                                ref={this.codeRef}
                                                value={this.state.code}
                                                onChange={this.handleCodeChange}
                                                maxLength="4"
                                            />
                                            <label htmlFor="code" className={styles["custom-label"]}>
                                                کد تأیید
                                            </label>
                                        </div>
                                        {this.state.codeError && (
                                            <div className={`${styles["text-danger"]} ${styles["text-end"]} ${styles["small"]} ${styles["mt-1"]}`}>
                                                {this.state.codeError}
                                            </div>
                                        )}
                                        <button type="submit" className={styles["custom-btn"]}>
                                            تأیید کد
                                        </button>
                                    </form>
                                    <button
                                        className="btn btn-link mt-2"
                                        onClick={() =>
                                            this.setState({ step: "phone", code: "", codeError: "" })
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