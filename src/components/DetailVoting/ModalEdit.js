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

} from "reactstrap";

import { AppContext } from "context/AppContext";

import { database, storage } from "firebase.js";


import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
let ps = null;

const ModalEdit = ({ votingInfo, loadVotingInfo }) => {

    const { userData, authUser } = useContext(AppContext);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startAt, setStartAt] = useState("");
    const [endAt, setEndAt] = useState("");
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const [isPrivate, setIsPrivate] = useState(true);
    const [password, setPassword] = useState("");
    const [useImgAddress, setUseImgAddress] = useState(false);
    const [imgAddress, setImgAddress] = useState(votingInfo.imgUrl);

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
    //hàm tạo voting với mongodb
    const handleCreatePoll = async () => {

        try {
            let imageUrl = votingInfo.imgUrl
            if (useImgAddress) {
                imageUrl = imgAddress;
            } else {
                if (file) {
                    // Upload image to Firebase Storage
                    const storageRef = ref(storage, `images/${file.name}`);
                    await uploadBytesResumable(storageRef, file);
                    // Get download URL of the uploaded image
                    imageUrl = await getDownloadURL(storageRef);
                    console.log("Downloading image", imageUrl);
                }
            }
            try {
                const title = document.getElementById("title-input").value;
                const description = document.getElementById("des-input").value;
                const startAt = document.getElementById("start-at").value;
                const endAt = document.getElementById("end-at").value;



                const userVoting = JSON.parse(localStorage.getItem("user-voting"));
                console.log("User voting: ", userVoting._id);
                const res = await fetch(`/api/votings/updateVoting/${votingInfo._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: title,
                        description: description,
                        imgUrl: imageUrl,
                        startAt: startAt,
                        endAt: endAt,
                    }),
                });
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                loadVotingInfo();
                // window.location.reload();
                // navigate(`/votingDetail?votingId=${votingInfo._id}`);
                // navigate(`/addCandidate?votingId=${data._id}&title=${data.title}`);
            } catch (error) {
                console.log((error.message));
            } finally {
                // setLoading(false);
            }
        } catch (e) {
            console.error(e);
        }

    }

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setFile(file);
        console.log("File:", file)
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
    return (
        <Row>
            <Col className="ml-auto" md="12">
                <Card className="center card-coin card-plain"
                    style={{ marginTop: '100px', fontSize: '150%' }}
                >
                    <CardHeader>
                        {!useImgAddress ? (
                            <img
                                id="uploaded-image"
                                alt="Uploaded Image"
                                className="img-center img-fluid"
                                style={{ width: '500px', height: '300px', objectFit: 'cover' }}
                                src={votingInfo.imgUrl}
                            />
                        ) : (
                            <img
                                id="image-address"
                                alt="Uploaded Image"
                                className="img-center img-fluid"
                                style={{ width: '500px', height: '300px', objectFit: 'cover' }}
                                src={imgAddress || "https://cannamazoo.com/assets/defaults/img/default-product-img.jpg"}
                            />
                        )}
                    </CardHeader>
                    {!useImgAddress ? (
                        <CardFooter className="text-center">
                            <label htmlFor="file-upload" className="custom-file-upload btn-simple">
                                Upload Image
                            </label>
                            <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                        </CardFooter>
                    ) : (
                        <CardFooter className="text-center">
                            <InputGroup>
                                <Input
                                    id='img-address'
                                    placeholder="Image Address"
                                    type="text"
                                    value={imgAddress}
                                    onChange={handleInputChange}
                                />
                            </InputGroup>
                        </CardFooter>

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

                </Card>

            </Col>
            {/* cột infomation */}
            <Col md="12">
                <Card className="card-plain">
                    <CardBody>
                        <Form>
                            <Row>
                                <Col md="12">
                                    <FormGroup>
                                        <label>Title</label>
                                        <Input
                                            id="title-input"
                                            defaultValue={votingInfo.title}
                                            placeholder="Title of your poll"
                                            type="text"
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>

                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <label>Start at</label>
                                        <Input
                                            id="start-at"
                                            defaultValue={votingInfo.startAt}
                                            type="date"
                                            onChange={(e) => setStartAt(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <label>End at</label>
                                        <Input
                                            id="end-at"
                                            defaultValue={votingInfo.endAt}
                                            type="date"
                                            onChange={(e) => setEndAt(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12">
                                    <FormGroup>
                                        <label>Description</label>
                                        <Input
                                            id="des-input"
                                            defaultValue={votingInfo.description}
                                            placeholder="Hello there!"
                                            type="textarea"
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
                </Card>
                <Button
                    className="btn-round float-right"
                    color="primary"
                    data-placement="right"
                    // id="tooltip341148792"
                    type="button"
                    onClick={() => handleCreatePoll()}
                >
                    Update
                </Button>
            </Col>
            {/* cột image */}


        </Row>
    );
};

export default ModalEdit;