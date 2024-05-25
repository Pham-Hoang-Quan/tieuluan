import React, { useEffect } from 'react';
import QRCode from 'qrcode.react';

import { CardBody, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import { Card, CardHeader, CardFooter, Button } from "reactstrap";
const QRCodeCan = ({ userId, votingId }) => {
    const [updateVoteList, setUpdateVoteList] = React.useState([]);
    const [candidateNames, setCandidateNames] = React.useState([]);
    React.useEffect(() => {
        const getUpdateVoteList = async () => {
            try {
                if (votingId && userId && candidateNames.length <= 0) {
                    const res = await fetch(`/api/smartcontract/getVoteUpdatesByIdVotingAndUser/${votingId}/${userId}`)
                    const Data = await res.json();
                    console.log("getVoteUpdatesByIdVotingAndUser ", Data)
                    setUpdateVoteList(Data);
                    // nếu không có update nào thì lấy ra các vote của user đó
                    if (Data.length == 0) {
                        const res = await fetch(`/api/smartcontract/getVoteByIdUser/${userId}`)
                        const votesByUserId = await res.json();
                        votesByUserId.map(async (vote) => {
                            console.log("Vote", vote);
                            if (vote.idVoting == votingId) {
                                const response = await fetch(`/api/candidates/${vote.idCandidate}`);
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
                    const response = await fetch(`/api/candidates/${firstVote[3]}`);
                    if (response.ok) {
                        const candidateData = await response.json();
                        console.log("CandidateData", candidateData.name);
                        const candidateName = candidateData.name;
                        setCandidateNames(prevNames => [...prevNames, candidateName]);
                    } else {
                        console.log("No data available");
                    }

                    Data.map(async (update) => {
                        console.log("New candidate id", update.idCandidateNew);

                        const response = await fetch(`/api/candidates/${update[2]}`);
                        if (response.ok) {
                            const candidateData = await response.json();
                            console.log("CandidateData", candidateData.name);
                            const candidateName = candidateData.name;
                            setCandidateNames(prevNames => [...prevNames, candidateName]);
                        } else {
                            console.log("No data available");
                        }
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
        if (candidateNames.length == 0) {
            return "You have never voted before !"
        }
        candidateNames.map((name) => {
            info += "Lần " + countVoteList + ": " + name + " \n";
            countVoteList++;
        })
        return info;

    };

    return (
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

        </div>
    );
};

export default QRCodeCan;