import React from 'react';
import { CardBody, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import { Card, CardHeader, CardFooter, Button } from "reactstrap";
const CandidatesList = ({ mergedData, handleUpdateVoteTransOnBC, userIsVoted, handleAddVoteTransOnBC, canIdOld }) => {
    // Cần một biến để lưu id của ứng viên hiện tại được vote để ẩn nút Vote ở ứng viên đó
    return (
        <div>
            {mergedData &&
                <Row>
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
                                                canIdOld == candidate.id ? (
                                                    <Button className="btn-simple" color="success" >
                                                        Voted
                                                    </Button>
                                                ) : (
                                                    <Button className="btn-simple" color="primary" onClick={() => { handleUpdateVoteTransOnBC(candidate.id) }}>
                                                        Re-vote
                                                    </Button>
                                                )
                                            ) : (
                                                <Button className="btn-simple" color="primary" onClick={() => { handleAddVoteTransOnBC(candidate.id) }}>
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
        </div>
    );
};

export default CandidatesList;