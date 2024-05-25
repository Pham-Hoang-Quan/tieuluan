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
import Candidates from "components/CreatePoll/Candidates";

import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import * as XLSX from 'xlsx';
import { Button as AntdButton, message, Upload } from 'antd';


let ps = null;

export default function AddCandidate() {

    const { userData } = useContext(AppContext);
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

    const [useImgAddress, setUseImgAddress] = useState(false);
    const [imgAddress, setImgAddress] = useState('');

    useEffect(() => {
        // Cập nhật 'uploaded-image' khi 'imgAddress' thay đổi
        const uploadedImage = document.getElementById('image-address');
        if (uploadedImage) {
            uploadedImage.src = imgAddress;
        }
    }, [imgAddress]);

    const handleInputChange = (event) => {
        setImgAddress(event.target.value);
    };

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
            if (useImgAddress) {
                imageUrl = imgAddress;
            } else {
                if (file) {
                    // Upload image to Firebase Storage
                    const storageRef = ref(storage, `candidatesImg/${file.name}`);
                    await uploadBytesResumable(storageRef, file);
                    // Get download URL of the uploaded image
                    imageUrl = await getDownloadURL(storageRef);
                    console.log("Downloading image", imageUrl);
                }
            }
            const id = generateRandomId();
            setIdCan(id);
            const res = await fetch(`/api/candidates/add/${idVoting}`, {
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
            setUseImgAddress(false);
            setImgAddress('')
        } catch (e) {
            console.error(e);
        }
        setFormModal(false);
        loadCandidates()
    }

    const handleAddCandidateFormFile = async (imgUrl, name, description) => {
        try {
            const res = await fetch(`/api/candidates/add/${idVoting}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imgUrl: imgUrl,
                    name,
                    description,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                console.log(data);
                // history.push('/');
                console.log(name);
            }
            loadCandidates()
        } catch (e) {
            console.error(e);
        }
        loadCandidates()
    }
    const loadCandidates = async () => {
        try {
            const res = await fetch(`/api/votings/getAllCandiddates/${idVoting}`);
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

    const handleFileUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            data.forEach((row) => {
                const image = row[0];
                const name = row[1];
                const description = row[2];
                console.log(image, name, description)
                handleAddCandidateFormFile(image, name, description);
            });
        };
        reader.readAsBinaryString(file);
    };
    
    // Cấu hình props cho component Upload
    const uploadProps = {
        beforeUpload: (file) => {
            handleFileUpload(file); // Gọi hàm handleFileUpload khi chọn file
            return false; // Ngăn chặn tải lên tự động
        },
        showUploadList: false, // Ẩn danh sách tải lên
    };
    return (
        <>
            <IndexNavbar />
            <div className="wrapper">
                <section className="section">
                    <Container>
                        <Card className="card-plain">
                            <CardHeader>
                                <Row style={{ marginBottom: "-50px" }}>
                                    {/* Cột chữ */}
                                    <Col>
                                        <div>
                                            <h1 className="profile-title text-left">Candidates</h1>
                                            <h5 className="text-on-back">{candidates.length}</h5>
                                        </div>

                                    </Col>
                                    {/* Cột nút */}
                                    <Col style={{ display: "flex", justifyContent: 'flex-end', flexWrap: 'wrap' }}>
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
                                        <Upload {...uploadProps} style={{ height: '50px', marginTop: '50px', marginLeft: '10px' }}>
                                            <Button style={{ height: '50px', marginTop: '50px', marginLeft: '10px' }} className="btn-round" color="neutral" type="button">
                                                <i className="fa fa-upload" />
                                                {"  "}Import Excel
                                            </Button>
                                        </Upload>
                                        {/* <input type="file" onChange={handleFileUpload} /> */}
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

                            {!useImgAddress ? (
                                <Col className="mt-sm-0" sm="12" xs="12"
                                    style={{ display: "flex", justifyContent: "center" }}
                                >

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
                            ) : (
                                <Col className="mt-sm-0" sm="12" xs="12"
                                    style={{ display: "flex", justifyContent: "center" }}
                                >

                                    <img
                                        id="image-address"
                                        alt="..."
                                        className="img-fluid rounded-circle shadow-lg"
                                        src={imgAddress || "https://cannamazoo.com/assets/defaults/img/default-product-img.jpg"}
                                        style={{ width: "180px", height: "180px", objectFit: 'cover' }}
                                    />

                                </Col>
                            )}


                            <a
                                style={{
                                    color: '#5b8bfb',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    textAlign: 'center',
                                    display: 'block',
                                    marginBottom: '10px',
                                }}
                                onClick={() => setUseImgAddress(!useImgAddress)}
                            > {!useImgAddress ? "Use a image URL ?" : "Upload a image"}</a>

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
                                            {useImgAddress &&
                                                <Row>
                                                    <Col md="12">
                                                        <FormGroup>
                                                            <label>Image address</label>
                                                            <Input value={imgAddress} placeholder="Option" type="text" onChange={handleInputChange} />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            }
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
