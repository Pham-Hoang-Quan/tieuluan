
import React from "react";
import classnames from "classnames";
// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardImg,
    CardTitle,
    Label,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Container,
    Row,
    Col,
} from "reactstrap";

// import { useHistory } from 'react-router-dom';

// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import Footer from "components/Footer/Footer.js";
import Signup from "views/IndexSections/Signup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase.js";

import { getDatabase, ref, set, serverTimestamp, onValue } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

import { AppContext } from "context/AppContext";
import { useContext } from "react";
import { Button as ButtonAnt, Divider, notification, Space } from 'antd';
import axios from "axios";


export default function SignInScreen({ account }) {
    const [squares1to6, setSquares1to6] = React.useState("");
    const [squares7and8, setSquares7and8] = React.useState("");
    const [fullNameFocus, setFullNameFocus] = React.useState(false);
    const [emailFocus, setEmailFocus] = React.useState(false);
    const [passwordFocus, setPasswordFocus] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [userId, setUserId] = useState("");
    const timestamp = serverTimestamp(); // Lấy thời gian hiện tại từ máy chủ Firebase
    const navigate = useNavigate();

    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement) => {
        api.info({
            message: `Notification ${placement}`,
            description:
                'Your account is blocked from accessing the system. Please contact the administrator for more information.',
            placement,
        });
    };

    React.useEffect(() => {
        document.body.classList.toggle("register-page");
        document.documentElement.addEventListener("mousemove", followCursor);
        // Specify how to clean up after this effect:
        return function cleanup() {
            document.body.classList.toggle("register-page");
            document.documentElement.removeEventListener("mousemove", followCursor);
        };
    }, []);
    const followCursor = (event) => {
        let posX = event.clientX - window.innerWidth / 2;
        let posY = event.clientY - window.innerWidth / 6;
        setSquares1to6(
            "perspective(500px) rotateY(" +
            posX * 0.05 +
            "deg) rotateX(" +
            posY * -0.05 +
            "deg)"
        );
        setSquares7and8(
            "perspective(500px) rotateY(" +
            posX * 0.02 +
            "deg) rotateX(" +
            posY * -0.02 +
            "deg)"
        );
    };

    // hàm đăng nhập với Fisebase Auth
    const signIn = async () => {
        try {
            // đăng nhập bằng firebase auth
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Đăng nhập thành công
                    const user = userCredential.user;
                    console.log("user logon", user);
                    console.log("user logon", user.uid);
                    signInWithMongodb();
                }) // bắt lỗi
                .catch((error) => {
                    const errorMessage = error.message;
                    console.log("error", error);
                    alert(errorMessage);
                    return;
                })
        } catch (e) {
            console.error(e);
        } finally {
        }

    }

    const { setAuthUser } = useContext(AppContext);

    const signInWithMongodb = async () => {
        console.log("sign in", email, password)
        try {
            const res = await axios.post(`/api/auth/login`, {
                email: email,
                password: password
            })
                .then((res) => {
                    console.log(res.data.user);
                    if (res.data.user.userId == "0") {
                        openNotification(res.data.user.name)
                        return
                    }
                    if (res.data.error) {
                        throw new Error(res.data.error);
                    }

                    localStorage.setItem("user-voting", JSON.stringify(res.data.user));
                    setAuthUser(res.data.user);
                    navigate('/');
            })
        } catch (error) {
            // toast.error(error.message);
        } finally {
            // setLoading(false);
        }
    };


    return (
        <>
            <ExamplesNavbar />
            {contextHolder}
            <div className="wrapper">
                <div className="page-header">
                    <div className="page-header-image" />
                    <div className="content">
                        <Container>
                            <Row className="row-grid justify-content-between align-items-center">
                                <Col className="mb-lg-auto" lg="6">
                                    <Card className="card-register">
                                        <CardHeader>
                                            <CardImg
                                                alt="..."
                                                src={require("assets/img/square-purple-1.png")}
                                            />
                                            <CardTitle tag="h4">Sign In</CardTitle>
                                        </CardHeader>
                                        <CardBody>
                                            <Form className="form">

                                                <InputGroup
                                                    className={classnames({
                                                        "input-group-focus": emailFocus,
                                                    })}
                                                >
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="tim-icons icon-email-85" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input
                                                        placeholder="Email"
                                                        type="text"
                                                        onFocus={(e) => setEmailFocus(true)}
                                                        onBlur={(e) => setEmailFocus(false)}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </InputGroup>
                                                <InputGroup
                                                    className={classnames({
                                                        "input-group-focus": passwordFocus,
                                                    })}
                                                >
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="tim-icons icon-lock-circle" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input
                                                        placeholder="Password"
                                                        type={showPassword ? "text" : "password"}
                                                        onFocus={(e) => setPasswordFocus(true)}
                                                        onBlur={(e) => setPasswordFocus(false)}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                    <i
                                                        className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        style={{
                                                            margin: 'auto 10px auto 10px',
                                                        }}
                                                    ></i>
                                                </InputGroup>

                                                <Label>

                                                    <span className="form-check-sign" />Don't have an account? {" "}
                                                    <a href="#pablo" onClick={() => window.location.href = '/signUp-page'}>
                                                        Create an account
                                                    </a>
                                                    .
                                                </Label>

                                            </Form>
                                        </CardBody>
                                        <CardFooter>
                                            <Button className="btn-round" color="primary" size="lg" onClick={signIn}>
                                                Sign In
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </Col>
                                <Col lg="6">
                                    <h3 className="display-3 text-white">
                                        A polling system with blockchain technology
                                    </h3>
                                    <p className="text-white mb-3">
                                        Here you can poll whatever you like
                                    </p>
                                    {/* <div className="btn-wrapper">
                                        <Button color="primary" to="register-page" >
                                            Register Page
                                        </Button>
                                    </div> */}
                                </Col>
                            </Row>
                            <div className="register-bg" />
                            {/* <div
                                className="square square-1"
                                id="square1"
                                style={{ transform: squares1to6 }}
                            /> */}
                            {/* <div
                                className="square square-2"
                                id="square2"
                                style={{ transform: squares1to6 }}
                            /> */}
                            <div
                                className="square square-3"
                                id="square3"
                                style={{ transform: squares1to6 }}
                            />
                            <div
                                className="square square-4"
                                id="square4"
                                style={{ transform: squares1to6 }}
                            />
                            <div
                                className="square square-5"
                                id="square5"
                                style={{ transform: squares1to6 }}
                            />
                            <div
                                className="square square-6"
                                id="square6"
                                style={{ transform: squares1to6 }}
                            />
                        </Container>
                    </div>
                </div>
                <Footer />

            </div>
        </>
    );
}
