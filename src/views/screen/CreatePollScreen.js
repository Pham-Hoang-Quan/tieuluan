
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
  // Modal,
  InputGroup,

} from "reactstrap";
import { Modal, Button as ButtonAnt } from "antd";

// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import Footer from "components/Footer/Footer.js";
import IndexNavbar from "components/Navbars/IndexNavbar";
import { AppContext } from "context/AppContext";

import { database, storage } from "firebase.js";


import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set, onValue } from "firebase/database";
import Candidates from "components/CreatePoll/Candidates";
import env from "react-dotenv";

import { useNavigate } from 'react-router-dom';
let ps = null;
export default function CreatePollScreen() {

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
  const [imgAddress, setImgAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const handleCancel = () => {
    setOpen(false);
  };

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
      let imageUrl = "url"
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
        const userVoting = JSON.parse(localStorage.getItem("user-voting"));
        console.log("User voting: ", userVoting._id);
        const res = await fetch(`/api/votings/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            description: description,
            imgUrl: imageUrl,
            startAt: startAt,
            endAt: endAt,
            owner: userVoting._id,
            password: password,
            isPrivate: isPrivate,
          }),

        });

        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        navigate(`/addCandidate?votingId=${data._id}&title=${data.title}`);
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
  const [tabs, setTabs] = React.useState(1);
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

  const handleGenerateImage = async () => {
    console.log("Generating image" , )
    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer sk-proj-CklyUXsPDeu1w56phw4jT3BlbkFJyrvLz52kCUyWyXlNVld5"
        },
        body: JSON.stringify({
          model: "dall-e-2",
          prompt: prompt,
          n: 1,
          size: "1024x1024"
        })
      });

      const data = await response.json();
      // nếu response là 401 thì báo lỗi

      if (data) {
        const imgUrl = data.data[0].url;
        console.log(data.data[0].url);
        setImgAddress(data.data[0].url);
        const uploadedImage = document.getElementById('uploaded-image');
        if (uploadedImage) {
          uploadedImage.src = imgUrl;
        }
        const uploadedImage2 = document.getElementById('image-address');
        if (uploadedImage2) {
          uploadedImage2.src = imgUrl;
        }
      }

    } catch (error) {
      console.error(error);
      alert("Your prompt is not valid. Please try again");
    }
    setOpen(false)
  };
  return (
    <>
      <IndexNavbar />
      <div className="wrapper">
        <section className="section">
          <Container>
            <Row>
              {/* cột infomation */}
              <Col md="6">
                <Card className="card-plain">
                  <CardHeader>
                    <h1 className="profile-title text-left">Information</h1>
                    <h5 className="text-on-back">1</h5>
                  </CardHeader>
                  <CardBody>
                    <Form>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>Title</label>
                            <Input defaultValue="" placeholder="Title of your poll" type="text" onChange={(e) => setTitle(e.target.value)} />
                          </FormGroup>
                        </Col>
                        {/* <Col md="6">
                          <FormGroup>
                            <label>Email address</label>
                            <Input placeholder="mike@email.com" type="email" />
                          </FormGroup>
                        </Col> */}
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label>Start at</label>
                            <Input defaultValue="" type="date" onChange={(e) => setStartAt(e.target.value)} />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <label>End at</label>
                            <Input defaultValue="" type="date" onChange={(e) => setEndAt(e.target.value)} />
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
                      <Row>
                        <Col md="12">
                          <FormGroup check>
                            <Label check>
                              <Input defaultChecked type="checkbox" onChange={(e) => setIsPrivate(e.target.checked)} />
                              <span className="form-check-sign" />
                              Private?
                            </Label>
                          </FormGroup>
                        </Col>
                      </Row>

                      {isPrivate && (
                        <Row>
                          <Col md="12">
                            <FormGroup>
                              <label>Password for this voting</label>
                              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </FormGroup>
                          </Col>
                        </Row>
                      )}


                      {/* <UncontrolledTooltip
                        delay={0}
                        placement="right"
                        target="tooltip341148792"
                      >
                        Bước tiếp theo là thêm các lựa chọn
                      </UncontrolledTooltip> */}
                    </Form>
                  </CardBody>
                </Card>
              </Col>
              {/* cột image */}
              <Col className="ml-auto" md="6">
                <Card className="center card-coin card-plain"
                  style={{ marginTop: '210px', fontSize: '150%' }}
                >
                  <CardHeader>
                    {!useImgAddress ? (
                      <img
                        id="uploaded-image"
                        alt="Uploaded Image"
                        className="img-center img-fluid"
                        style={{ width: '500px', height: '300px', objectFit: 'cover' }}
                        src="https://cannamazoo.com/assets/defaults/img/default-product-img.jpg"
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
                <Button
                  className="btn-round float-left"
                  color="default"
                  data-placement="right"
                  // id="tooltip341148792"
                  type="button"
                  // onClick={() => handleCreatePoll()}
                  onClick={showModal}
                >
                  AI Generate Image
                </Button>
                <Button
                  className="btn-round float-right"
                  color="primary"
                  data-placement="right"
                  // id="tooltip341148792"
                  type="button"
                  onClick={() => handleCreatePoll()}
                >
                  Add Candidates
                </Button>
              </Col>

            </Row>
          </Container>
        </section>
        {/* <Footer /> */}
        <Modal
          open={open}
          title="Enter prompt you want to generate image"
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <ButtonAnt key="back" onClick={handleCancel}>
              Cancel
            </ButtonAnt>,
            <ButtonAnt key="submit" type="primary" loading={loading} onClick={() => { handleGenerateImage() }}>
              Submit
            </ButtonAnt>,
          ]}
        >
          <Input
            placeholder="Prompt"
            onChange={(e) => setPrompt(e.target.value)}
            style={{
              color: 'black'
            }}
          />
        </Modal>
      </div>
    </>
  );
}
