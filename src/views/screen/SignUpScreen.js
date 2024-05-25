
import React from "react";
import classnames from "classnames";
import { useEffect } from "react";
import abi from "../../contract/TransactionManager.json"
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

import Footer from "components/Footer/Footer.js";

import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase.js";

import { getDatabase, ref, set, serverTimestamp, onValue } from "firebase/database";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import { database } from "../../firebase.js";
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
// import AppContext from "antd/es/app/context.js";

// import { prepareContractCall, sendTransaction } from "thirdweb";

import { AppContext } from "context/AppContext";


import axios from "axios";



export default function SignUpScreen({ account }) {
    // const { userData, state } = useContext(AppContext);
    const [squares1to6, setSquares1to6] = React.useState("");
    const [squares7and8, setSquares7and8] = React.useState("");
    const [fullNameFocus, setFullNameFocus] = React.useState(false);
    const [emailFocus, setEmailFocus] = React.useState(false);
    const [passwordFocus, setPasswordFocus] = React.useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [userId, setUserId] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const timestamp = serverTimestamp(); // Lấy thời gian hiện tại từ máy chủ Firebase

    const navigate = useNavigate();
    const { userData, state } = useContext(AppContext);

    const { setAuthUser } = useContext(AppContext);

    const signup = async () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);
                const user = userCredential.user;

                // Thêm thông tin người dùng vào cơ sở dữ liệu
                const userData = {
                    userId: user.uid,
                    name: name,
                    email: email,
                    avtUrl: "",
                    role: 'user',
                    createAt: timestamp,
                    address: account, // id của metamask trả về
                };
                // Ghi thông tin người dùng vào cơ sở dữ liệu
                set(ref(database, 'users/' + user.uid), userData)
                    .then(() => {
                        console.log("User data written successfully to database");
                        // Sau khi ghi thành công vào cơ sở dữ liệu, chuyển hướng người dùng đến trang chủ
                        // window.location.href = "/";

                    })
                    .catch((error) => {
                        console.error("Error writing user data to database: ", error);
                    });
            }
            )
            .catch((error) => {
                console.error(error);
            });


        // thêm vào mongodb
        const res = await fetch(`/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                address: account,
                avtUrl: "avatar",
                email,
                password,
                name,
                role: "user",
                userId
            }),
        });

        if (res.ok) {
            const data = await res.json();
            console.log(data);
            localStorage.setItem("user-voting", JSON.stringify(data.newUser));
            setAuthUser(data.newUser);
            handleAddUseIdOnBC(data.newUser._id);
            // history.push('/');
            navigate('/');
        }
    }

    const handleAddUseIdOnBC = async (userId) => {
        try {
            axios.post("/api/smartcontract/addUser",
                { user: userId }).
                then(response => {
                    console.log(response.data);
                });
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <>
            <IndexNavbar />
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
                                            <CardTitle tag="h4">Register</CardTitle>
                                        </CardHeader>
                                        <CardBody>
                                            <Form className="form">
                                                <InputGroup
                                                    className={classnames({
                                                        "input-group-focus": fullNameFocus,
                                                    })}
                                                >
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="tim-icons icon-single-02" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input
                                                        placeholder="Full Name"
                                                        type="text"
                                                        onFocus={(e) => setFullNameFocus(true)}
                                                        onBlur={(e) => setFullNameFocus(false)}
                                                        onChange={(e) => setName(e.target.value)}
                                                    />
                                                </InputGroup>
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
                                                    {/* <Button onClick={() => setShowPassword(!showPassword)}> */}
                                                    {/* {showPassword ? 'Hide' : 'Show'} password */}
                                                    <i
                                                        className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        style={{
                                                            margin: 'auto 10px auto 10px',
                                                        }}
                                                    ></i>
                                                    {/* </Button> */}
                                                </InputGroup>
                                                <FormGroup check className="text-left">
                                                    <Label check>
                                                        <Input type="checkbox" />
                                                        <span className="form-check-sign" />I agree to the{" "}
                                                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                                            terms and conditions
                                                        </a>
                                                        .
                                                    </Label>
                                                </FormGroup>
                                            </Form>
                                        </CardBody>
                                        <CardFooter>
                                            <Button className="btn-round" color="primary" size="lg" onClick={signup}>
                                                Sign Up
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
