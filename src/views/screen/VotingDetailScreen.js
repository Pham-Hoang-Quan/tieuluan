import React, { useContext, useState, useEffect } from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
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

import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import CircularProgress from '@mui/material/CircularProgress';

// core components
import IndexNavbar from "components/Navbars/IndexNavbar";
import { AppContext } from "context/AppContext";

import { database, storage } from "firebase.js";


import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set, onValue, query, orderByChild, equalTo, child, get } from "firebase/database";
import Candidates from "components/CreatePoll/Candidates";
import { id } from "ethers/lib/utils";

import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import moment from "moment";



// import Loading from "components/CreatePoll/Loading";
import { BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, Bar, LabelList, Cell, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts";

import { ethers } from "ethers";
import { map } from "jquery";
import UpdateVoteList from "components/DetailVoting/UpdateVoteList";
import QRCode from 'qrcode.react';
import QRCodeCan from "components/DetailVoting/QRCodeCan";
import CandidatesList from "components/DetailVoting/CandidatesList";
import Top5Table from "../../components/DetailVoting/Top5Table";
import Top5Chart from "components/DetailVoting/Top5Chart";
import FinishVoting from "components/DetailVoting/FinishVoting";

let ps = null;

export default function VotingDetail() {
    const { userData, state, authUser } = useContext(AppContext);
    const [candidates, setCandidates] = useState('');
    const [votingInfo, setVotingInfo] = useState();
    const [votedModal, setVotedModal] = useState(false);
    const [trans, setTrans] = useState([]);
    const { contract } = state;
    const [isLoading, setIsLoading] = useState(false)
    const [userIsVoted, setUserIsVoted] = useState(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const idVoting = searchParams.get('votingId');
    const [canIdOld, setCanIdOld] = useState('');
    const [isFinished, setIsFinished] = useState(false);
    const userInfor = JSON.parse(localStorage.getItem('user-voting'));
    function generateRandomId() {
        return Date.now(); // Sử dụng thời gian hiện tại làm ID, có thể không đảm bảo tính duy nhất trong một số trường hợp.
    }
    const smartContractAddress = "0xe9fE15A6Be86a57c9A8dbB3dcD4441CFE24471C0"
    const signer = new ethers.providers.Web3Provider(
        window.ethereum,
    ).getSigner();
    const sdk = ThirdwebSDK.fromSigner(signer, "sepolia");
    // hàm bình chọn , thêm một bình chọn vào mảng votes trên blockchain
    const handleAddVoteTransOnBC = async (canId) => {
        setIsLoading(true);
        try {
            console.log("VoteInfo: ", canId, idVoting, userInfor._id);
            const canIdString = canId.toString()
            const id = generateRandomId().toString();
            const contract = await sdk.getContract(smartContractAddress);
            const result = await contract.call("addVote", ['v' + id, userInfor._id, canIdString, idVoting, id]);
            setVotedModal(true);
            console.log("Result: ", result);
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
            const userId = userData.userId;
            const contract = await sdk.getContract(smartContractAddress);
            const result = await contract.call("updateVote", ['v' + id, userInfor._id, canIdString, canIdOld, idVoting, id]);
            setVotedModal(true);
            console.log("Trans Data Update: ", id, userId, canId, idVoting, canIdOld);
            console.log("Result: ", result);
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
        // const candidatesRef = query(dbRef(database, 'candidates'));
        // onValue(candidatesRef, (snapshot) => {
        //     const candidatesData = snapshot.val();
        //     if (candidatesData) {
        //         const candidatesList = Object.values(candidatesData);
        //         const filteredCandidates = candidatesList.filter(candidate => candidate.idVoting === idVoting);
        //         setCandidates(filteredCandidates);
        //         // console.log(filteredCandidates);
        //         console.log(candidatesList)
        //         console.log(candidates)
        //     } else {
        //         setCandidates([]);
        //     }
        // });

        try {
            const res = await fetch(`http://localhost:5500/api/votings/getAllCandiddates/${idVoting}`);
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setCandidates(data);
            }
        } catch (e) {
            console.error(e);
        }
    }
    // hàm lấy thông của cuộc bình chọn từ firebase
    const loadVotingInfo = async () => {
        // lấy thông tin cuộc bình chọn từ firebase
        // try {
        //     const votingInfoRef = dbRef(database, `polls/` + idVoting);
        //     onValue(votingInfoRef, (snapshot) => {
        //         const votingData = snapshot.val();
        //         if (votingData) {
        //             // Xử lý dữ liệu ở đây nếu cần
        //             setVotingInfo(votingData);
        //             setIsFinished(moment(votingData.endAt, 'YYYYMMDD').isBefore(moment()));
        //         } else {
        //             console.log("Không có dữ liệu cho nút này.");
        //         }
        //     });
        // } catch (e) {
        //     console.error(e);
        // }

        // lấy thông tin cuộc bình chọn từ mongodb
        try {
            const res = await fetch(`http://localhost:5500/api/votings/${idVoting}`);
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setVotingInfo(data);
            }
        } catch (e) {
            console.error(e);
        }

    }
    // hàm lấy các votes từ blockchain
    const getTransWithVotingId = async () => {
        try {
            if (idVoting) {
                const contract = await sdk.getContract(smartContractAddress);
                const transData = await contract.call("getvotesByIdVoting", [idVoting]);
                setTrans(transData);
                console.log("transData", transData);
                console.log("trans", trans);
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        console.log("trans", trans);
        const userId = userInfor ? userInfor._id : null;
        if (userId) {
            trans.map((tran) => {
                if (tran.idUser == userId) {
                    setUserIsVoted(true)
                    setCanIdOld(tran.idCandidate)

                    console.log(tran)
                    console.log("User is voted")
                } else {
                    console.log("User no vote")
                }
            })
        }
    }, [trans]);
    useEffect(() => {
        try {
            loadCandidates();
            loadVotingInfo();
            // hàm lấy dữ liệu transaction từ Blockchain;
            getTransWithVotingId();
        } catch (e) {
            console.error(e);
        }
    }, []);

    React.useEffect(() => {
        if (navigator.platform.indexOf("Win") > -1) {
            document.documentElement.className += " perfect-scrollbar-on";
            document.documentElement.classList.remove("perfect-scrollbar-off");
            let tables = document.querySelectorAll(".table-responsive");
            for (let i = 0; i < tables.length; i++) {
                ps = new PerfectScrollbar(tables[i]);
            }
        }
        console.log("User: ", userData);

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

    const carouselItems = votingInfo ? [
        {
            src: `${votingInfo.imgUrl}`,
            altText: "Slide 1",
            caption: "",
        },
        {
            src: `${votingInfo.imgUrl}`,
            altText: "Slide 2",
            caption: "",
        },
        {
            src: `${votingInfo.imgUrl}`,
            altText: "Slide 3",
            caption: "",
        },
    ] : [];

    // const mergedData = [];
    // for (let i = 0; i < candidates.length; i++) {
    //     const candidate = candidates[i];
    //     let countVote = 0;
    //     if (trans) {
    //         for (let j = 0; j < trans.length; j++) {
    //             if (trans[j].id !== "") {
    //                 console.log("So sánh", trans[j].idCandidate, " với ", candidates[i]._id)
    //                 if (trans[j].idCandidate.toString() === candidates[i].id.toString()) {
    //                     countVote++;
    //                 }
    //             }
    //         }
    //     }
    //     mergedData.push({
    //         id: candidate._id,
    //         name: candidate.name,
    //         description: candidate.description,
    //         countVote: countVote,
    //         imgUrl: candidate.imgUrl
    //     });
    // }
    const mergedData = candidates.map(candidate => {
        const countVote = trans.reduce((count, tran) => {
            return tran.idCandidate?.toString() === candidate._id?.toString() ? count + 1 : count;
        }, 0);
        return { ...candidate, countVote };
    }).sort((a, b) => b.countVote - a.countVote);

    console.log("Merged Data: ", mergedData);
    const sortedCandidates = mergedData.sort((a, b) => b.countVote - a.countVote);
    const topFiveCandidates = sortedCandidates.slice(0, 5);

    const transformedData = mergedData.map((candidate, index) => ({
        name: candidate.name,
        countVote: candidate.countVote,
    }));
    console.log("transformedData", transformedData);

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
    return (
        <>
            <IndexNavbar />
            <div className="wrapper">
                <section className="section">
                    <Container>
                        <Row className="justify-content-between align-items-center"
                        // style={{ marginTop: "60px" }}
                        >
                            <Col className="mb-5 mb-lg-0" lg="5" style={{ marginTop: "60px" }}>
                                <h1 className="display-1 text-white">
                                    {votingInfo.title}
                                </h1>

                                <Row>
                                    <Col>
                                        <footer className="blockquote-footer">Posted: <cite title="Source Title">{moment(`${votingInfo.createAt}`, 'x').fromNow()}</cite></footer>
                                        <footer className="blockquote-footer">End at: <cite title="Source Title">{moment(`${votingInfo.endAt}`, 'YYYYMMDD').fromNow()}</cite></footer>
                                    </Col>
                                    <Col>

                                    </Col>
                                </Row>


                                {userData &&
                                    <QRCodeCan userId={userInfor._id} votingId={idVoting}></QRCodeCan>
                                }
                                {/* <Button
                                    className="mt-4"
                                    color="warning"
                                    href="https://demos.creative-tim.com/blk-design-system-react/#/documentation/alert"
                                >
                                    View candidates
                                </Button> */}
                                {/* nếu người dùng đã bình chọn thì hiển thị component đã bình chọn */}

                                {/* component update luôn được hiên thị 
                                    ở update sẽ tự gọi dữ liệu để hiển thị */}
                                {userData && <UpdateVoteList idVoting={idVoting} userId={userData.userId} >
                                </UpdateVoteList>}

                            </Col>
                            <Col lg="6">
                                <UncontrolledCarousel
                                    items={carouselItems}
                                    indicators={false}
                                    autoPlay={false}
                                />
                                <p className="text-white mt-4">
                                    {votingInfo.description}
                                </p>
                            </Col>
                        </Row>
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
                        {/* <Row id="candidates">
                            <Top5Chart transformedData={transformedData}></Top5Chart>
                            <Top5Table
                                handleUpdateVoteTransOnBC={handleUpdateVoteTransOnBC}
                                topFiveCandidates={topFiveCandidates}
                                handleAddTransOnBC={handleAddVoteTransOnBC}
                                userIsVoted={userIsVoted}
                                canIdOld={canIdOld}
                            >
                            </Top5Table>
                        </Row> */}
                        <Card className="card-plain">
                            <CardHeader>
                                <Row style={{ marginBottom: "-50px" }}>
                                    <Col style={{ display: "flex", justifyContent: 'flex-end' }}>
                                    </Col>
                                </Row>
                            </CardHeader>
                        </Card>
                        {/* // Hiển thị danh sách các ứng viên */}
                        {/* <CandidatesList
                            handleUpdateVoteTransOnBC={handleUpdateVoteTransOnBC}
                            mergedData={mergedData}
                            handleAddTransOnBC={handleAddVoteTransOnBC}
                            userIsVoted={userIsVoted}
                            canIdOld={canIdOld}>
                        </CandidatesList> */}
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
            </div>
        </>
    );
}

