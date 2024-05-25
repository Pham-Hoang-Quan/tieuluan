import React, { useContext, useState, useEffect } from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Form, FormGroup, Label, Input } from "reactstrap";

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col,
    CardFooter,
    Modal,
    ListGroup,
    ListGroupItem,
    Table,
    UncontrolledCarousel,
    CardTitle,
    UncontrolledAlert,
} from "reactstrap";

import CircularProgress from '@mui/material/CircularProgress';

// core components
import IndexNavbar from "components/Navbars/IndexNavbar";
import { AppContext } from "context/AppContext";




import { Navigate, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import moment from "moment";




// import Loading from "components/CreatePoll/Loading";
import { BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, Bar, LabelList, Cell, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts";


import QRCodeCan from "components/DetailVoting/QRCodeCan";
import CandidatesList from "components/DetailVoting/CandidatesList";
import Top5Table from "../../components/DetailVoting/Top5Table";
import Top5Chart from "components/DetailVoting/Top5Chart";
import FinishVoting from "components/DetailVoting/FinishVoting";
import ModalEdit from "components/DetailVoting/ModalEdit";
import axios from "axios";

let ps = null;

export default function VotingDetail() {
    const { authUser, setAuthUser } = useContext(AppContext);
    const [candidates, setCandidates] = useState('');
    const [votingInfo, setVotingInfo] = useState();
    const [votedModal, setVotedModal] = useState(false);
    const [trans, setTrans] = useState([]);

    const [isLoading, setIsLoading] = useState(false)
    const [userIsVoted, setUserIsVoted] = useState(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const idVoting = searchParams.get('votingId');
    const [canIdOld, setCanIdOld] = useState('');
    const [isFinished, setIsFinished] = useState(false);
    const userInfor = JSON.parse(localStorage.getItem('user-voting'));
    const [isOwner, setIsOwner] = useState(false);
    const [formModal, setFormModal] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    function generateRandomId() {
        return Date.now(); // Sử dụng thời gian hiện tại làm ID, có thể không đảm bảo tính duy nhất trong một số trường hợp.
    }

    // hàm bình chọn , thêm một bình chọn vào mảng votes trên blockchain
    const handleAddVoteTransOnBC = async (canId) => {
        setIsLoading(true);
        try {
            const canIdString = canId.toString()
            const id = generateRandomId().toString();
            const res = await axios.post(`/api/smartcontract/addVote`, {
                _id: 'v' + id,
                _idUser: userInfor._id,
                _idCandidate: canIdString,
                _idVoting: idVoting,
                _time: id
            }).then(result => {
                console.log(result.data);
                setVotedModal(true);
            })
        } catch (error) {
            // alert(error.reason);
            console.log(error.message);
            if (error.reason == 'execution reverted: User has already voted for this votingId') {
                alert("You have already voted for this voting");
            }
        } finally {
            setIsLoading(false);
        }

    }
    // hàm cập nhật lại vote khi người dùng đã bình chọn trước đó
    const handleUpdateVoteTransOnBC = async (canId) => {
        setIsLoading(true);
        try {
            const canIdString = canId.toString()
            const id = generateRandomId().toString();
            const res = await axios.post(`/api/smartcontract/updateVote`, {
                _id: 'v' + id,
                _idUser: userInfor._id,
                _idCandidateNew: canIdString,
                _idCandidateOld: canIdOld,
                _idVoting: idVoting,
                _time: id
            }).then(result => {
                console.log(result.data);
                setVotedModal(true);
            })
            setVotedModal(true);
        } catch (error) {
            // alert(error.reason);
            console.log(error.message);
            if (error.reason == 'execution reverted: User has already voted for this votingId') {
                alert("You have already voted for this voting");
            }
        } finally {
            setIsLoading(false);
        }

    }
    // hàm lấy danh sách các ứng viên từ firebase
    const loadCandidates = async () => {
        try {
            const res = await fetch(`/api/votings/getAllCandiddates/${idVoting}`);
            if (res.ok) {
                const data = await res.json();
                setCandidates(data);
            }
        } catch (e) {
            console.error(e);
        }
    }
    const loadVotingInfo = async () => {
        // lấy thông tin cuộc bình chọn từ mongodb
        try {
            const res = await fetch(`/api/votings/${idVoting}`);
            if (res.ok) {
                const data = await res.json();
                setVotingInfo(data);
                console.log(data.owner, userInfor._id);
                if (data.owner == userInfor._id) {
                    setIsOwner(true);
                }
            } else {
                alert("Voting not found")
                return (<div></div>)
                navigate("/")

            }
            setFormModal(false)
        } catch (e) {
            console.error(e);
        }
    }
    // hàm lấy các votes từ blockchain
    const getTransWithVotingId = async () => {
        try {
            if (idVoting) {
                const res = await fetch(`/api/smartcontract/getVoteByIdVoting/${idVoting}`)
                const transData = await res.json();
                setTrans(transData);
                console.log(transData);
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        const userId = userInfor ? userInfor._id : null;
        if (userId) {
            trans.map((tran) => {
                if (tran[1] == userId) {
                    setUserIsVoted(true)
                    setCanIdOld(tran[2])
                } else {
                    console.log("User no vote")
                }
            })
        }
    }, [trans]);
    useEffect(() => {
        const loadData = async () => {
            try {
                await loadCandidates();
                await loadVotingInfo();
                await getTransWithVotingId();
            } catch (e) {
                console.error(e);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        // nếu voting là private thì kiểm tra join hay chưa,
        // là public thì cho isJoined = true
        // nếu chưa join thì return form để nhập mật khẩu và join
        if (votingInfo) {
            if (votingInfo.isPrivate) {
                const userId = userInfor ? userInfor._id : null;
                const checkUserJoinVoting = async () => {
                    try {
                        const res = await fetch(`/api/participants/checkUser/${idVoting}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ userId }),
                        });
                        if (res.ok) {
                            const data = await res.json();
                            setIsJoined(data.isJoin);
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
                checkUserJoinVoting();
            } else if (votingInfo.isPrivate == false) {
                setIsJoined(true);
            }
        }


    }, [votingInfo])

    React.useEffect(() => {
        if (navigator.platform.indexOf("Win") > -1) {
            document.documentElement.className += " perfect-scrollbar-on";
            document.documentElement.classList.remove("perfect-scrollbar-off");
            let tables = document.querySelectorAll(".table-responsive");
            for (let i = 0; i < tables.length; i++) {
                ps = new PerfectScrollbar(tables[i]);
            }
        }
        document.body.classList.toggle("profile-page");
        // Specify how to clean up after this effect:
        return function cleanup() {
            if (navigator.platform.indexOf("Win") > -1) {
                ps.destroy();
                document.documentElement.className += " perfect-scrollbar-off";
                document.documentElement.classList.remove("perfect-scrollbar-on");
            }
            document.body.classList.toggle("profile-page");
        };

    }, []);

    if (!candidates || !votingInfo || isLoading) {
        // Trả về null hoặc hiển thị thông báo lỗi tùy thuộc vào trường hợp
        return (
            <>
                <IndexNavbar />
                <div className="wrapper">
                    <section style={{}} className="section">
                        {/* <Loading></Loading> */}
                        <CircularProgress color="inherit" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                    </section>
                </div>
            </>
        ); // hoặc thông báo lỗi
    }

    const mergedData = candidates.map(candidate => {
        const countVote = trans.reduce((count, tran) => {
            return tran[2]?.toString() === candidate._id?.toString() ? count + 1 : count;
        }, 0);
        return { ...candidate, countVote };
    }).sort((a, b) => b.countVote - a.countVote);

    const sortedCandidates = mergedData.sort((a, b) => b.countVote - a.countVote);
    const topFiveCandidates = sortedCandidates.slice(0, 5);

    const transformedData = mergedData.map((candidate, index) => ({
        name: candidate.name,
        countVote: candidate.countVote,
    }));

    if (moment(votingInfo.endAt, 'YYYYMMDD').isBefore(moment())) {
        return (
            <>
                <IndexNavbar />
                <div className="wrapper">
                    <section className="section">
                        <Container>
                            <FinishVoting votingInfo={votingInfo} mergedData={mergedData}></FinishVoting>
                        </Container>
                    </section>
                </div>
            </>
        );
    }

    const handleJoinVoting = async () => {
        try {
            const res = await fetch(`/api/participants/addUserWithPassword/${idVoting}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userInfor._id, password }),
            });
            if (res.ok) {
                const data = await res.json();
                setIsJoined(data.isJoin);
            }
        } catch (e) {
            console.error(e);
        }
    }

    if (isJoined == false) {
        return (
            <div>
                <IndexNavbar />
                <Container
                    style={{
                        marginTop: '200px',
                        // width: '400px',
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleJoinVoting();
                        }}
                    >
                        <FormGroup>
                            <h3 className="text-white">This is a private voting, please enter the password to join</h3>

                            <Label for="password">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormGroup>
                        <Button type="submit" color="primary">Join Voting</Button>
                    </Form>
                </Container>

            </div >
        );
    }
    return (
        <>
            <IndexNavbar />
            <div className="wrapper">
                <section className="section">
                    <Container>
                        <Row style={{
                            marginTop: '20px',
                        }}>
                            <h1 className="display-1 text-white">
                                {votingInfo.title}
                                {/* {authUser.name} */}
                            </h1>
                        </Row>
                        {/* hàng thông tin */}
                        <Row className="justify-content-between align-items-center"
                        // style={{ marginTop: "60px" }}
                        >
                            {/* cột ảnh và mô tả */}
                            <Col lg="6">
                                {/* <UncontrolledCarousel
                                        items={carouselItems}
                                        indicators={false}
                                        autoPlay={false}
                                    /> */}
                                <img
                                    id="uploaded-image"
                                    alt="Uploaded Image"
                                    className="img-center img-fluid"
                                    style={{ width: '500px', height: '300px', objectFit: 'cover' }}
                                    src={votingInfo.imgUrl}
                                />
                                <p className="text-white mt-4">
                                    {votingInfo.description}
                                </p>
                            </Col>
                            {/* cột QR code */}
                            <Col className="mb-5 mb-lg-0" lg="5" style={{ marginTop: "60px" }}>
                                {/* <h1 className="display-1 text-white">
                                    {votingInfo.title}
                                </h1> */}

                                {userInfor &&
                                    <QRCodeCan userId={userInfor._id} votingId={idVoting}></QRCodeCan>
                                }


                                <Row>
                                    <Col>
                                        <footer className="blockquote-footer">Posted: <cite title="Source Title">{moment(`${votingInfo.startAt}`, 'YYYYMMDD').fromNow()}</cite></footer>
                                        <footer className="blockquote-footer">End at: <cite title="Source Title">{moment(`${votingInfo.endAt}`, 'YYYYMMDD').fromNow()}</cite></footer>
                                        <footer className="blockquote-footer">ID: <cite title="Source Title">{votingInfo._id}</cite></footer>
                                    </Col>
                                </Row>
                                <Row className="justify-content-between align-items-center">
                                    {isOwner &&
                                        <>
                                            <Button
                                                className="mt-4"
                                                color="default"
                                                onClick={() => setFormModal(true)}
                                            >
                                                Update information
                                            </Button>
                                            <Button
                                                className="mt-4"
                                                color="default"
                                                onClick={() => {
                                                    navigate(`/addCandidate?votingId=${idVoting}`)
                                                }}
                                            >
                                                Add Candidate
                                            </Button>
                                        </>
                                    }
                                    <Button
                                        className="mt-4"
                                        color="warning"
                                        href="#candidates"
                                    // style={{ position: "relative", top: "20%", left: "45%", transform: "translateX(-50%)" }}
                                    >
                                        Go to vote
                                    </Button>
                                </Row>



                            </Col>


                        </Row>
                        {/* Các ứng viên */}
                        <Row>
                            <Card className="card-chart card-plain">
                                <CardHeader>
                                    <Row>
                                        <Col className="text-left" sm="6">
                                            <hr className="line-info" />
                                            <h5 className="card-category">The result</h5>
                                            <CardTitle tag="h2">Candidates</CardTitle>
                                        </Col>
                                        <Col style={{ display: "flex", alignItems: 'flex-end', alignContent: "center", flexDirection: 'row-reverse' }}>
                                            <Button
                                                className="btn-simple btn-round"
                                                color="neutral"
                                                type="button"
                                                onClick={() => { getTransWithVotingId() }}
                                            >
                                                Refresh
                                            </Button>
                                        </Col>
                                    </Row>
                                </CardHeader>

                            </Card>
                        </Row>
                        {/* Biểu đồ và bảng top 5 */}
                        {isOwner &&
                            <Row id="candidates">
                                <Top5Chart transformedData={transformedData}></Top5Chart>
                                <Top5Table
                                    handleUpdateVoteTransOnBC={handleUpdateVoteTransOnBC}
                                    topFiveCandidates={topFiveCandidates}
                                    handleAddTransOnBC={handleAddVoteTransOnBC}
                                    userIsVoted={userIsVoted}
                                    canIdOld={canIdOld}
                                >
                                </Top5Table>
                            </Row>
                        }
                        <Card className="card-plain">
                            <CardHeader>
                                <Row style={{ marginBottom: "-50px" }}>
                                    <Col style={{ display: "flex", justifyContent: 'flex-end' }}>
                                    </Col>
                                </Row>
                            </CardHeader>
                        </Card>
                        {mergedData &&
                            <Row id="candidates">
                                {mergedData.map(candidate => (
                                    <>
                                        <Col md="4" key={candidate.id} style={{ marginTop: '100px' }}
                                        >
                                            <Card className="card-coin card-plain"
                                                style={{ height: "420px" }}
                                            >
                                                <CardHeader>
                                                    <img
                                                        alt="..."
                                                        className="img-fluid rounded-circle shadow-lg"
                                                        src={candidate.imgUrl}
                                                        onError={(e) => {
                                                            e.target.src = require("../../assets/img/logo.png");
                                                        }}
                                                        style={{ width: "180px", height: "180px", objectFit: 'cover', position: 'relative', top: '0', let: '3px', }} />

                                                </CardHeader>
                                                <CardBody>
                                                    <Row>
                                                        <Col className="text-center" md="12">
                                                            <h4 className="text-uppercase">{candidate.name}</h4>
                                                            <span>
                                                                <span className="btn-link" style={{ color: 'white' }}>{candidate.countVote}</span>
                                                                votes
                                                            </span>
                                                            <hr className="line-primary" />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <ListGroup>
                                                            <ListGroupItem>{candidate.description.slice(0, 190) + ' ...'}</ListGroupItem>
                                                        </ListGroup>
                                                    </Row>
                                                </CardBody>
                                                <CardFooter className="text-center">
                                                    {
                                                        userIsVoted ? (
                                                            canIdOld == candidate._id ? (
                                                                <Button className="btn-simple" color="success" >
                                                                    Voted
                                                                </Button>
                                                            ) : (
                                                                <Button className="btn-simple" color="primary" onClick={() => { handleUpdateVoteTransOnBC(candidate._id) }}>
                                                                    Re-vote
                                                                </Button>
                                                            )
                                                        ) : (
                                                            <Button className="btn-simple" color="primary" onClick={() => { handleAddVoteTransOnBC(candidate._id) }}>
                                                                Vote
                                                            </Button>
                                                        )
                                                    }
                                                </CardFooter>
                                            </Card>
                                        </Col>
                                    </>
                                ))}
                            </Row>}
                    </Container>
                </section>
                <Modal
                    modalClassName="modal-black"
                    isOpen={formModal}
                    toggle={() => setFormModal(false)}
                    style={{ height: "90%", marginTop: '0px', }}
                >
                    <div className="modal-header justify-content-center">
                        <button className="close" onClick={() => setFormModal(false)}>
                            <i className="tim-icons icon-simple-remove text-white" />
                        </button>
                        <div className="text-muted text-center ml-auto mr-auto">
                            <h3 className="mb-0">Add candidate</h3>
                        </div>
                    </div>
                    <ModalEdit loadVotingInfo={loadVotingInfo} votingInfo={votingInfo}></ModalEdit>

                </Modal>
            </div>
        </>
    );
}

