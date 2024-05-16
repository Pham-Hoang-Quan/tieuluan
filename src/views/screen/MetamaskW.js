
import React from "react";

// core components
// import IndexNavbar from "components/Navbars/IndexNavbar.js";
// import PageHeader from "components/PageHeader/PageHeader.js";
import Footer from "components/Footer/Footer.js";

// sections for this page/view
import Basics from "views/IndexSections/Basics.js";
import Navbars from "views/IndexSections/Navbars.js";
import Tabs from "views/IndexSections/Tabs.js";
import Pagination from "views/IndexSections/Pagination.js";
import Notifications from "views/IndexSections/Notifications.js";
import Typography from "views/IndexSections/Typography.js";
import JavaScript from "views/IndexSections/JavaScript.js";
import NucleoIcons from "views/IndexSections/NucleoIcons.js";
import Signup from "views/IndexSections/Signup.js";
import Examples from "views/IndexSections/Examples.js";
import Download from "views/IndexSections/Download.js";

import { Container } from "reactstrap";

export default function MetamaskW() {
    React.useEffect(() => {
        document.body.classList.toggle("index-page");
        // Specify how to clean up after this effect:
        return function cleanup() {
            document.body.classList.toggle("index-page");
        };
    }, []);

    return (
        <>
            {/* <IndexNavbar /> */}
            <div className="wrapper">
                <div className="page-header header-filter">
                    <div className="squares square1" />
                    <div className="squares square2" />
                    <div className="squares square3" />
                    <div className="squares square4" />
                    <div className="squares square5" />
                    <div className="squares square6" />
                    <div className="squares square7" />
                    <Container>
                        <div className="content-center brand">
                            <h1 className="h1-seo">Poll System</h1>
                            <h3 className="d-none d-sm-block">
                                Please login with Metamask to continue!
                            </h3>
                            <blockquote>
                                <p className="blockquote blockquote-danger">
                                    "Hệ thống sử dụng công nghệ blockchain để đảm bảo 
                                    tính minh bạch trong quá trình bình chọn.
                                     Vì thế vui lòng cài đặt Metamask cho trình duyệt của bạn để 
                                     tương tác với mạng blockchain của chúng tôi." <br />
                                    <br />
                                    <small></small>
                                </p>
                            </blockquote>
                        </div>
                    </Container>
                </div>
            </div>
        </>
    );
    
}
