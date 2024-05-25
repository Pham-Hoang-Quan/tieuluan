
import React, { useContext, useEffect, useState } from "react";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import {
    Button,
    Label,
    FormGroup,
    CustomInput,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Container,
    Row,
    Col,
    Modal,
    UncontrolledAlert,
} from "reactstrap";
import { Link, useNavigate } from 'react-router-dom';
import { getDatabase, ref as dbRef, set, onValue, query, orderByChild, equalTo, child, get } from "firebase/database";
import { database, storage } from "firebase.js";
import { AppContext } from "context/AppContext";
import PublicVotings from "components/home/PublicVotings";
import { MaterialUIControllerProvider } from "context";
import UploadImage from "components/home/UploadImage";
import { message } from 'antd';
import axios from "axios";


export default function Home({ isLogin }) {

    const [inputFocus, setInputFocus] = React.useState(false);
    const navigate = useNavigate();
    const [idSearch, setIdSearch] = React.useState("");
    const [formModal, setFormModal] = React.useState(false);
    const [votingInfo, setVotingInfo] = React.useState();
    const [errorSearch, setErrorSearch] = React.useState(false);
    const [password, setPassword] = useState("");

    const [messageApi, contextHolder] = message.useMessage();
    const warning = (message) => {
        messageApi.open({
            type: 'warning',
            content: message,
        });
    };

    const userInfor = JSON.parse(localStorage.getItem("user-voting"));

    React.useEffect(() => {
        document.body.classList.toggle("index-page");
        // Specify how to clean up after this effect:
        return function cleanup() {
            document.body.classList.toggle("index-page");
        };
    }, []);

    const handleJoin = async () => {
        if (votingInfo.isPrivate) {
            try {
                const idVoting = votingInfo._id;
                axios.post(`/api/participants/addUserWithPassword/${idVoting}`, { userId: userInfor._id, password })
                    .then(res => {
                        console.log(res);
                        console.log(res.data);
                        navigate(`/votingDetail?votingId=${votingInfo._id}`)
                    })
                    .catch(err => {
                        warning("Passwords do not match")
                        console.log(err);
                    })
            } catch (e) {
                console.error(e);
            }
        } else {
            try {
                const idVoting = votingInfo._id;
                axios.post(`/api/participants/addParticipant/${idVoting}`, { userId: userInfor._id })
                    .then(res => {
                        console.log(res);
                        console.log(res.data);
                        navigate(`/votingDetail?votingId=${votingInfo._id}`)
                    })
                    .catch(err => {
                        warning("Passwords do not match")
                        console.log(err);
                    })
            } catch (e) {
                console.error(e);
            }
        }
    }

    const handleSearch = async () => {
        // lấy thong tin voting từ mongodb
        try {
            const res = await axios.get(`/api/votings/${idSearch}`)
                .then(res => {
                    console.log(res);
                    setVotingInfo(res.data);
                    setFormModal(true);
                }).catch(err => {
                    console.log(err);
                    warning("This voting is not available");
                });
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            {contextHolder}
            <IndexNavbar isLogin={isLogin} />
            <div className="wrapper">
                <div
                    className="page-header"
                    style={{ overflow: 'auto' }}
                >
                    <div className="squares square1" />
                    <div className="squares square2" />
                    <div className="squares square3" />
                    <div className="squares square4" />
                    <div className="squares square5" />
                    <div className="squares square6" />
                    <div className="squares square7" />

                    <Container >
                        <div className="content-center brand" style={{ position: "relative", top: "28%", left: "50%", right: "0", bottom: "0" }}>
                            {(errorSearch) ? (
                                <div message="This voting is not exits" type="warning" showIcon />
                            ) : (
                                <div></div>
                            )}
                            <Row style={{ marginBottom: '50px' }}>
                                <Col lg="12" sm="12">
                                    <h1 className="h1-seo">PollChain</h1>
                                    <h4 className="d-none d-sm-block">
                                        A voting system with blockchain
                                    </h4>
                                    <InputGroup>
                                        <Input placeholder="Enter id to search..." type="text"
                                            style={{ borderColor: '#edd0f1' }}
                                            onChange={(e) => setIdSearch(e.target.value)}
                                            onKeyPress={(event) => {
                                                if (event.key === 'Enter') {
                                                    handleSearch();
                                                }
                                            }}
                                        />
                                        <InputGroupAddon onClick={() => handleSearch()} addonType="append">
                                            <InputGroupText
                                                style={{ borderColor: '#edd0f1' }}
                                            >
                                                <i className="fa fa-search" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Col>

                            </Row>
                        </div>

                        <div className="" style={{ marginTop: '137px' }}>
                            <Row>
                                <Col lg="12" sm='12'>
                                    <PublicVotings></PublicVotings>
                                </Col>
                            </Row>
                        </div>



                    </Container>





                </div>
                <Modal
                    // modalClassName="modal-black"
                    isOpen={formModal}
                    toggle={() => setFormModal(false)}
                    style={{ marginTop: '-55px' }}
                >
                    <div className="modal-header justify-content-center">
                        <button className="close" onClick={() => setFormModal(false)}>
                            <i className="tim-icons icon-simple-remove " />
                        </button>

                        <div className="text-muted text-center ml-auto mr-auto">
                            {/* <h3 className="mb-0">Searching for {idSearch}...</h3> */}
                            {/* <Alert
                                message="Found successfully"
                                description=""
                                type="success"
                                showIcon
                            /> */}
                        </div>
                    </div>
                    <div className="modal-body">
                        <div>
                            {(votingInfo) ? (
                                <div className="text-center text-muted mb-4 mt-3">
                                    <h2 style={{ marginTop: "-20px" }} className="title text-default">{votingInfo.title}</h2>
                                    {/* <h2 className="title title-up">{votingInfo.title}</h2> */}
                                    <img
                                        alt="..."
                                        className="img-fluid rounded shadow"
                                        src={votingInfo.imgUrl}
                                        style={{ width: "370px", height: '180px', objectFit: 'cover' }}
                                    />
                                    {votingInfo.isPrivate ?
                                        <div>
                                            <p className="text-muted">
                                                This voting is private, please enter the password to join
                                            </p>
                                            <FormGroup>
                                                {/* <Label for="password">Password</Label> */}
                                                <Input
                                                    id="password"
                                                    placeholder="Password"
                                                    type="password"
                                                    style={{ borderColor: '#edd0f1', color: 'black' }}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </FormGroup>
                                        </div>


                                        : <p className="text-muted">

                                        </p>}

                                    <Button
                                        style={{ marginTop: "20px" }}
                                        color="default" type="button"
                                        onClick={() => { handleJoin() }}
                                    >
                                        Join
                                    </Button>
                                </div>


                            ) : (
                                <div className="text-center text-muted mb-4 mt-3">
                                    <small>Searching for {idSearch}...</small>
                                </div>
                            )}
                        </div>
                    </div>
                </Modal >
            </div >
        </>
    );

}
