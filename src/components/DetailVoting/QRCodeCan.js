import React from 'react';
import QRCode from 'qrcode.react';
import { ethers } from "ethers";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { getDatabase, ref as dbRef, set, onValue, query, orderByChild, equalTo, child, get } from "firebase/database";
import { database } from "../../firebase";
import { CardBody, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import { Card, CardHeader, CardFooter, Button } from "reactstrap";
const QRCodeCan = ({ userId, votingId }) => {

    const [updateVoteList, setUpdateVoteList] = React.useState([]);
    const [candidateNames, setCandidateNames] = React.useState([]);

    React.useEffect(() => {
        const signer = new ethers.providers.Web3Provider(
            window.ethereum,
        ).getSigner();
        const sdk = ThirdwebSDK.fromSigner(signer, "sepolia");
        const smartContractAddress = "0xe9fE15A6Be86a57c9A8dbB3dcD4441CFE24471C0"

        // lấy các update từ smart contract,


        const getUpdateVoteList = async () => {
            try {
                if (votingId && userId && candidateNames.length <= 0) {
                    const contract = await sdk.getContract(smartContractAddress);
                    const Data = await contract.call("getVoteUpdatesByIdVotingAndUser", [votingId, userId]);
                    // gán các úpdate vào state updateVoteList
                    setUpdateVoteList(Data);

                    // nếu không có update nào thì lấy ra các vote của user đó
                    if (Data.length == 0) {
                        const votesByUserId = await contract.call("getvotesByIdUser", [userId]);
                        votesByUserId.map(async (vote) => {
                            console.log("Vote", vote);
                            if (vote.idVoting == votingId) {
                                const response = await fetch(`http://localhost:5500/api/candidates/${vote.idCandidate}`);
                                if (response.ok) {
                                    const candidateData = await response.json();
                                    console.log("CandidateData", candidateData.name);
                                    const candidateName = candidateData.name;
                                    setCandidateNames(prevNames => [...prevNames, candidateName]);
                                } else {
                                    console.log("No data available");
                                }
                            }
                        })
                    }

                    const firstVote = Data[0];
                    const response = await fetch(`http://localhost:5500/api/candidates/${firstVote.idCandidateOld}`);
                    if (response.ok) {
                        const candidateData = await response.json();
                        console.log("CandidateData", candidateData.name);
                        const candidateName = candidateData.name;
                        setCandidateNames(prevNames => [...prevNames, candidateName]);
                    } else {
                        console.log("No data available");
                    }

                    // console.log("DataUpdate", Data);
                    Data.map(async (update) => {
                        console.log("New candidate id", update.idCandidateNew);

                        const response = await fetch(`http://localhost:5500/api/candidates/${update.idCandidateNew}`);
                        if (response.ok) {
                            const candidateData = await response.json();
                            console.log("CandidateData", candidateData.name);
                            const candidateName = candidateData.name;
                            setCandidateNames(prevNames => [...prevNames, candidateName]);
                        } else {
                            console.log("No data available");
                        }

                        // const candidatesRef = dbRef(database, `candidates/${update.idCandidateNew}`);
                        // const snapshot = await get(candidatesRef);
                        // if ((snapshot.exists())) {
                        //     console.log("CandidateData", snapshot.val().name);
                        //     const candidateName = snapshot.val().name;
                        //     setCandidateNames(prevNames => [...prevNames, candidateName]);
                        // } else {
                        //     console.log("No data available");
                        // }

                        // const candidateName = getCanName(update.idCandidateNew);
                        // console.log("CandidateName", candidateName);
                        // setCandidateNames(prevNames => [...prevNames, candidateName]);
                    })
                    console.log("Những update", Data);
                    console.log("VoteUpdate", updateVoteList);

                    console.log("CandidateNames", candidateNames);

                }
            } catch (error) {
                console.error(error)
            }
        }
        getUpdateVoteList()
    }, [votingId, userId]);


    // Component logic and state go here
    const getInfo = () => {
        let info = "";
        let countVoteList = 1;
        candidateNames.map((name) => {
            info += "Lần " + countVoteList + ": " + name + " \n";
            countVoteList++;
        })
        return info;

    };

    return (
        // JSX code for rendering the component goes here
        <div>
            <Card className="card-coin card-plain"
                style={{ marginTop: "20px", marginBottom: "20px", marginLeft: "20px", marginRight: "20px" }}
            >
                <CardBody>
                    <Col className="text-center" md="12">
                        <Row>
                            <Col>
                                <span>
                                    <span className="btn-link" style={{ color: 'white' }}>
                                        Scan to see your history
                                    </span>
                                </span>
                                <hr className="line-primary" />

                                <QRCode
                                    value={getInfo()}
                                    size={190}
                                    level={"L"}
                                    includeMargin={true}
                                />
                            </Col>
                            {/* <p>{getInfo()}</p> */}
                        </Row>
                        
                    </Col>
                </CardBody>
            </Card>
            <Button
                className="mt-4"
                color="warning"
                href="#candidates"
            // style={{ position: "relative", top: "20%", left: "45%", transform: "translateX(-50%)" }}
            >
                Go to vote
            </Button>
        </div>
    );
};

export default QRCodeCan;