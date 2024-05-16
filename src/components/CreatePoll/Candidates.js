
import React, { useContext } from "react";
// react plugin used to create charts
import { Line } from "react-chartjs-2";
// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    ListGroupItem,
    ListGroup,
    Container,
    Row,
    Col,
} from "reactstrap";



export default function Candidates({ candidates }) {
    React.useEffect(() => {
        document.body.classList.toggle("landing-page");
        // Specify how to clean up after this effect:
        return function cleanup() {
            document.body.classList.toggle("landing-page");
        };
    }, []);

    if (!Array.isArray(candidates)) {
        // Trả về null hoặc hiển thị thông báo lỗi tùy thuộc vào trường hợp
        return null; // hoặc thông báo lỗi
    }

    return (
        <div>
            <Row>
                {candidates.map(candidate => (
                        <><Col md="4" key={candidate.id} style={{ marginTop: '19px'}}
                    >
                        <Card className="card-coin card-plain"
                            style={{height: "480px"}}
                        >
                            <CardHeader>
                                <img
                                    id="uploaded-image"
                                    alt="..."
                                    className="img-fluid rounded-circle shadow-lg"
                                    src={candidate.imgUrl}
                                    onError={(e) => {
                                        e.target.src = require("../../assets/img/logo.png");
                                    } }
                                    style={{ width: "180px", height: "180px", objectFit: 'cover' }} />
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col className="text-center" md="12">
                                        <h4 className="text-uppercase">{candidate.name}</h4>
                                        <span>{candidate.countVote} votes</span>
                                        <hr className="line-primary" />
                                    </Col>
                                </Row>
                                <Row>
                                    <ListGroup>
                                        <ListGroupItem>{candidate.description}</ListGroupItem>
                                        
                                    </ListGroup>
                                </Row>
                            </CardBody>
                            <CardFooter className="text-center">
                                <Button className="btn-simple" color="primary">
                                    Vote
                                </Button>
                            </CardFooter>
                        </Card>
                    </Col><Col md="4"
                        style={{ marginTop: '19px', display: 'flex', justifyContent: 'center'  }}
                    >
                            <Card className="card-coin card-plain" 
                                style={{height: '480px', }}
                            >
                                <CardFooter className="text-center">
                                    <Button className="btn-simple" color="info">
                                        Add candidate
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Col></>
                    
                ))}
            </Row>

            <Row>
                <Col md="4"
                    style={{ marginTop: '120px' }}
                >
                    <Card className="card-coin card-plain"
                        style={{height:"480px"}}
                    >
                        <CardHeader>
                            <img
                                alt="..."
                                className="img-center img-fluid"
                                src={require("assets/img/etherum.png")}
                            />
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col className="text-center" md="12">
                                    <h4 className="text-uppercase">Dark Coin</h4>
                                    <span>Plan</span>
                                    <hr className="line-success" />
                                </Col>
                            </Row>
                            <Row>
                                <ListGroup>
                                    <ListGroupItem>"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod libero ut turpis dapibus, nec dictum enim ultrices. In eget magna non purus facilisis condimentum vel nec ipsum."</ListGroupItem>
                                    {/* <ListGroupItem>1000 emails</ListGroupItem>
                                    <ListGroupItem>24/7 Support</ListGroupItem> */}
                                </ListGroup>
                            </Row>
                        </CardBody>
                        <CardFooter className="text-center">
                            <Button className="btn-simple" color="success">
                                Get plan
                            </Button>
                        </CardFooter>
                    </Card>
                </Col>
                <Col md="4"
                    style={{ marginTop: '120px' }}
                >
                    <Card className="card-coin card-plain">
                        <CardHeader>
                            <img
                                alt="..."
                                className="img-center img-fluid"
                                src={require("assets/img/ripp.png")}
                            />
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col className="text-center" md="12">
                                    <h4 className="text-uppercase">Bright Coin</h4>
                                    <span>Plan</span>
                                    <hr className="line-info" />
                                </Col>
                            </Row>
                            <Row>
                                <ListGroup>
                                    <ListGroupItem>350 messages</ListGroupItem>
                                    <ListGroupItem>10K emails</ListGroupItem>
                                    <ListGroupItem>24/7 Support</ListGroupItem>
                                </ListGroup>
                            </Row>
                        </CardBody>
                        <CardFooter className="text-center">
                            <Button className="btn-simple" color="info">
                                Get plan
                            </Button>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
        </div>



    );
}
