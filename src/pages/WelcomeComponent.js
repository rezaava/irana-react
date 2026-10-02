import React from "react";
import '../css/welcome.css';
import { Link } from "react-router-dom";

class Welcome extends React.Component {
    componentDidMount() {
        const nav = document.querySelector(".nav-outer");
        if (nav) {
            nav.style.display = "none";
        }
    }

    componentWillUnmount() {
        const nav = document.querySelector(".nav-outer");
        if (nav) {
            nav.style.display = "";
        }
    }

    render() {
        return (
            <main className="container mt-4 pt-5">
                <img src="../img/logo.png" alt="fixed logo" className="fixed-top-left" />

                <div className="align-items-center position-fixed top-50 start-50 translate-middle">
                    <div className="login-box-login shadow text-center item-back boder p-4 rounded-5 d-flex justify-content-center align-items-center">
                        <div className="welcome-box">
                            <img className="welcome-img" src="../img/welcome.png" />

                            <div className="mt-5">
                                <p>
                                    <b>سرویسی امن و راحت برای خدمت رسانی به مشتریان</b>
                                </p>

                                <div className="mx-4 mt-4">
                                    <Link
                                        to="/login/"
                                        className="btn btn-primary w-100 rounded-3 py-2"
                                    >
                                        <small>
                                            شروع
                                        </small>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

export default Welcome;