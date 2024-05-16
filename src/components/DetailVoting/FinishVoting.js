import React from 'react';
import { Container, Row, Col, Button, Card, CardHeader, CardTitle, UncontrolledCarousel } from "reactstrap";
import moment from 'moment';
import QRCodeCan from './QRCodeCan';
import { AppContext } from '../../context/AppContext';
import { CandidatesList } from './CandidatesList';
import { UpdateVoteList } from './UpdateVoteList';
import { useContext } from 'react';
import { UncontrolledAlert } from 'reactstrap';
import CandidatesTable from './CandidatesTable';

const FinishVoting = ({ mergedData, votingInfo }) => {
    const { userData, state } = useContext(AppContext);
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
    
    return (
        <div>
            <div className="wrapper">
                <section className="section">
                    <Container>
                        <UncontrolledAlert className="alert-with-icon" color="warning">
                            <span data-notify="icon" className="tim-icons icon-bulb-63" />
                            <span>
                                <b>Voting has ended! -</b>
                                Voting has ended. You can only view the results of this poll.
                            </span>
                        </UncontrolledAlert>
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
                                    <QRCodeCan userId={userData.userId} votingId={votingInfo.id}></QRCodeCan>
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
                                            // onClick={() => { exportToCSV(mergedData, ['name', 'countVote'], 'candidates.csv'); }}
                                            >
                                                Export result
                                            </Button>
                                        </Col>
                                    </Row>
                                </CardHeader>

                            </Card>
                        </Row>

                        <Card className="card-plain">
                            <CardHeader>
                                <Row style={{ marginBottom: "-50px" }}>
                                    <Col style={{ display: "flex", justifyContent: 'flex-end' }}>
                                    </Col>
                                </Row>
                            </CardHeader>
                        </Card>
                        {/* // Hiển thị danh sách các ứng viên */}
                        <CandidatesTable candidates={mergedData} />
                    </Container>
                </section>
            </div>
        </div>
    );
};

export default FinishVoting;