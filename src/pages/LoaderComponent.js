import React from "react";

class Loader extends React.Component {
    render() {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
            >
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">
                        در حال بارگذاری...
                    </span>
                </div>
            </div>
        );
    }
}

export default Loader;