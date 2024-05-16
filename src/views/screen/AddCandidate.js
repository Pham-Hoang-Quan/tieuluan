import React, { useContext, useState, useEffect } from "react";
import classnames from "classnames";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Label,
    FormGroup,
    Form,
    Input,
    Container,
    Row,
    Col,
    CardFooter,
    Modal,
    InputGroup,
    ListGroup,
    ListGroupItem,
} from "reactstrap";

// core components
import Footer from "components/Footer/Footer.js";
import IndexNavbar from "components/Navbars/IndexNavbar";
import { AppContext } from "context/AppContext";

import { database, storage } from "firebase.js";


import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set, onValue, query, orderByChild, equalTo } from "firebase/database";
import Candidates from "components/CreatePoll/Candidates";
import { id } from "ethers/lib/utils";

import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";




let ps = null;

export default function AddCandidate() {

    const {userData} = useContext(AppContext);
    const [formModal, setFormModal] = React.useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [idCan, setIdCan] = useState('');
    const [candidates, setCandidates] = useState('');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const idVoting = searchParams.get('votingId');
    const title = searchParams.get('title');
    const navigate = useNavigate();
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
    useEffect(() => {
        loadCandidates();
    }, []);


    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            // Set the uploaded image to the img element
            const img = document.getElementById('uploaded-image');
            img.src = reader.result;
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    function generateRandomId() {
        return Date.now(); // Sử dụng thời gian hiện tại làm ID, có thể không đảm bảo tính duy nhất trong một số trường hợp.
    }
    const handleAddCandidate = async () => {

        try {
            let imageUrl = "img"
            if (file) {
                // Upload image to Firebase Storage
                const storageRef = ref(storage, `candidatesImg/${file.name}`);
                await uploadBytesResumable(storageRef, file);
                // Get download URL of the uploaded image
                imageUrl = await getDownloadURL(storageRef);
                console.log("Downloading image", imageUrl);
            }

            const id = generateRandomId();
            setIdCan(id);
            // Save data to Realtime Database
            // const canData = {
            //     id: id,
            //     name: name,
            //     description: description,
            //     imgUrl: imageUrl,
            //     idVoting: idVoting,
            //     countVote: 0,
            //     // options: null,
            //     // Add other data fields here
            // };
            // set(dbRef(database, 'candidates/' + id), canData)
            //     .then(() => {
            //         console.log("Đã ghi thông tin cuộc bình chọn");
            //     })
            //     .catch((error) => {
            //         console.error("Lỗi khi ghi thông tin cuộc bình chọn ", error);
            //     });

            // thêm vào mongodb
        const res = await fetch(`http://localhost:5500/api/candidates/add/${idVoting}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                imgUrl: imageUrl,
                name,
                description,
            }),
        });

        if (res.ok) {
            const data = await res.json();
            console.log(data);
            // history.push('/');
            
        }

            loadCandidates()

        } catch (e) {
            console.error(e);
        }
        setFormModal(false);
        loadCandidates()
    }
    const loadCandidates = async () => {
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

    const handleFinish = () => {
        navigate(`/votingDetail?votingId=${idVoting}`);
    };

    if (!Array.isArray(candidates)) {
        // Trả về null hoặc hiển thị thông báo lỗi tùy thuộc vào trường hợp
        return (
            <>
                <IndexNavbar />
                <div className="wrapper">
                    <section className="section">
                        <Container>
                            <Card className="card-plain">
                                <CardHeader>
                                    <Row>
                                        <div>
                                            <h1 className="profile-title text-left">Candidates</h1>
                                            <h5 className="text-on-back">2</h5>
                                        </div>
                                        <Button
                                            className="btn-simple btn-round"
                                            color="primary"
                                            type="button"
                                            style={{ height: '50px', marginTop: '50px', marginLeft: '10px' }}
                                            onClick={() => setFormModal(true)}
                                        >
                                            Add
                                        </Button>
                                    </Row>

                                </CardHeader>
                            </Card>




                        </Container>
                    </section>


                </div>
            </>
        ); // hoặc thông báo lỗi
    }

    return (
        <>
            <IndexNavbar />
            <div className="wrapper">
                <section className="section">
                    <Container>
                        <Card className="card-plain">
                            <CardHeader>
                                <Row style={{marginBottom: "-50px"}}>
                                    <Col>
                                        <div>
                                            <h1 className="profile-title text-left">Candidates</h1>
                                            <h5 className="text-on-back">2</h5>
                                        </div>
                                    </Col>

                                    <Col style={{display: "flex", justifyContent: 'flex-end'}}>
                                        <Button
                                            className="btn-simple btn-round"
                                            color="primary"
                                            type="button"
                                            style={{ height: '50px', marginTop: '50px', marginLeft: '10px' }}
                                            onClick={() => setFormModal(true)}
                                        >
                                            Add
                                        </Button>
                                        <Button
                                            className="btn-simple btn-round"
                                            color="info"
                                            type="button"
                                            style={{ height: '50px', marginTop: '50px', marginLeft: '10px' }}
                                            onClick={() => handleFinish()}
                                        >
                                            Finish
                                        </Button>
                                    </Col>
                                </Row>

                            </CardHeader>
                        </Card>

                        {/* <Candidates candidates={candidates} /> */}
                        <Row>
                            {candidates.map(candidate => (
                                <><Col md="4" key={candidate.id} style={{ marginTop: '100px' }}
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
                                                style={{ width: "180px", height: "180px", objectFit: 'cover' }} />
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
                                                    <ListGroupItem>{candidate.description.slice(0, 190) + '...'}</ListGroupItem>
                                                </ListGroup>
                                            </Row>
                                        </CardBody>
                                        <CardFooter className="text-center">
                                            <Button className="btn-simple" color="primary">
                                                Vote
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </Col>

                                </>

                            ))}
                            <Col md="4"
                                style={{ marginTop: '100px', }}
                            >
                                <Card className="card-coin card-plain"
                                    style={{ height: '420px', display: 'flex', justifyContent: 'center' }}
                                >
                                    <CardFooter className="text-center">
                                        <Button className="btn-simple" color="info" onClick={() => setFormModal(true)}>
                                            Add candidate
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>

                    </Container>
                </section>
                {/* <Footer /> */}
                <Modal
                    modalClassName="modal-black"
                    isOpen={formModal}
                    toggle={() => setFormModal(false)}
                    style={{ height: "200px", marginTop: '0px', }}

                >
                    <div className="modal-header justify-content-center">
                        <button className="close" onClick={() => setFormModal(false)}>
                            <i className="tim-icons icon-simple-remove text-white" />
                        </button>
                        <div className="text-muted text-center ml-auto mr-auto">
                            <h3 className="mb-0">Add candidate</h3>
                        </div>
                    </div>
                    <div className="modal-body">
                        <Row style={{ display: "flex", justifyContent: "center" }}>
                            <Col className="mt-sm-0" sm="12" xs="12"
                                style={{ display: "flex", justifyContent: "center" }}
                            >
                                {/* <small className="d-block text-uppercase font-weight-bold mb-4">
                                    Image
                                </small> */}
                                <img
                                    id="uploaded-image"
                                    alt="..."
                                    className="img-fluid rounded-circle shadow-lg"
                                    src="https://cannamazoo.com/assets/defaults/img/default-product-img.jpg"
                                    style={{ width: "180px", height: "180px", objectFit: 'cover' }}
                                />
                                <label
                                    className="edit-button"
                                    htmlFor="file-upload"
                                >
                                    <i className="far fa-edit" />{/* Sử dụng biểu tượng edit từ react-icons */}
                                    <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                </label>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <Card className="card-plain">
                                    <CardHeader>
                                        {/* <h1 className="profile-title text-left">Information</h1>
                                        <h5 className="text-on-back">1</h5> */}
                                    </CardHeader>
                                    <CardBody>
                                        <Form>
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <label>Name</label>
                                                        <Input defaultValue="" placeholder="Option" type="text" onChange={(e) => setName(e.target.value)} />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <label>Description</label>
                                                        <Input placeholder="Hello there!" type="textarea" onChange={(e) => setDescription(e.target.value)} />
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <Button
                                                className="btn-round float-right"
                                                color="primary"
                                                data-placement="right"
                                                // id="tooltip341148792"
                                                type="button"
                                                onClick={() => handleAddCandidate()}
                                            >
                                                Add Candidates
                                            </Button>

                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </div>
        </>
    );
}
