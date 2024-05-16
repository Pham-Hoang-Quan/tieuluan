
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
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref as dbRef, set, onValue, query, orderByChild, equalTo, child, get } from "firebase/database";
import { database, storage } from "firebase.js";
import { AppContext } from "context/AppContext";
import PublicVotings from "components/home/PublicVotings";

export default function Home({ isLogin }) {

    const [inputFocus, setInputFocus] = React.useState(false);
    const navigate = useNavigate();
    const [idSearch, setIdSearch] = React.useState("");
    const [formModal, setFormModal] = React.useState(false);
    const [votingInfo, setVotingInfo] = React.useState();
    const [errorSearch, setErrorSearch] = React.useState(false);
    const [trans, setTrans] = useState([]);
    const { userData, state } = useContext(AppContext);
    const { contract } = state;
    const [password, setPassword] = useState("");

    React.useEffect(() => {
        console.log(state)
        document.body.classList.toggle("index-page");
        // Specify how to clean up after this effect:
        return function cleanup() {
            document.body.classList.toggle("index-page");
        };
    }, []);

    const getAllTrans = async () => {
        try {
            const transData = await contract.getAllTransactions();
            setTrans(transData)
            console.log(trans)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        contract && getAllTrans()
    }, [contract])

    const handleJoin = async () => {
        if (votingInfo.isPrivate) {
            try {
                const res = await fetch(`http://localhost:5500/api/votings/check-password`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        votingId: votingInfo._id,
                        password: document.querySelector("#password").value
                    }),

                });
                if (res.ok) {
                    const data = await res.json();
                    console.log(data);
                    navigate(`/votingDetail?votingId=${votingInfo._id}`);
                } else {
                    alert("Password is incorrect");
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            navigate(`/votingDetail?votingId=${votingInfo._id}`);
        }
    }

    const handleSearch = async () => {
        try {
            const votingRef = query(dbRef(database, 'polls/' + idSearch));
            onValue(votingRef, (snapshot) => {
                const votingData = snapshot.val();
                if (votingData) {
                    // navigate(`/votingDetail?votingId=${votingData.id}`);
                    setVotingInfo(votingData)
                    setFormModal(true);
                } else {
                    // alert(`Not found ${idSearch}`)
                    setErrorSearch(true)
                }
            });
        } catch (err) {
            console.error(err);
        }

        // lấy thong tin voting từ mongodb
        try {
            const res = await fetch(`http://localhost:5500/api/votings/${idSearch}`);
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setVotingInfo(data);
                setFormModal(true);
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <IndexNavbar isLogin={isLogin} />
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
                                        <InputGroupAddon addonType="append">
                                            <InputGroupText
                                                style={{ borderColor: '#edd0f1' }}
                                            >
                                                <i className="fa fa-search" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Col>
                                
                            </Row>
                            

                            <Button className="btn-round" color="info" type="button"
                                onClick={() => { navigate('/createPoll'); }}
                            >
                                <i className="fa fa-plus" />
                                {"       "}Create a poll
                            </Button>

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
                                        style={{ width: "370px" }}
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
