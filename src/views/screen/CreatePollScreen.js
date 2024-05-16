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

// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import Footer from "components/Footer/Footer.js";
import IndexNavbar from "components/Navbars/IndexNavbar";
import { AppContext } from "context/AppContext";

import { database, storage } from "firebase.js";


import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set, onValue } from "firebase/database";
import Candidates from "components/CreatePoll/Candidates";

import { useNavigate } from 'react-router-dom';




let ps = null;

export default function CreatePollScreen() {

  const { userData, authUser } = useContext(AppContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [file, setFile] = useState(null);
  const [idVoting, setIdVoting] = useState('');
  const [formModal, setFormModal] = React.useState(false);
  const navigate = useNavigate();
  const [isPrivate, setIsPrivate] = useState(true);
  const [password, setPassword] = useState("");


  useEffect(() => {

    console.log("Auth user: ", authUser);
    if (idVoting) {
      try {
        // const dataRef = dbRef(database, '/candidates/' + idVoting);
        // onValue(dataRef, (snapshot) => {
        //   const data = snapshot.val();
        //   console.log(data);
        // });
      } catch (e) {
        console.error(e)
      }
    }

  }, []);

  function generateRandomId() {
    return Date.now(); // Sử dụng thời gian hiện tại làm ID, có thể không đảm bảo tính duy nhất trong một số trường hợp.
  }

  // hàm tạo voting với firebase
  const handleCreatePoll1 = async () => {

    try {
      let imageUrl = ""
      if (file) {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytesResumable(storageRef, file);
        // Get download URL of the uploaded image
        imageUrl = await getDownloadURL(storageRef);
        console.log("Downloading image", imageUrl);
      }

      const id = generateRandomId();
      setIdVoting(id);
      // Save data to Realtime Database
      const pollData = {
        id: id,
        title: title,
        description: description,
        imgUrl: imageUrl,
        startAt: startAt,
        endAt: endAt,
        owner: userData.userId,
        createAt: Date.now(),
        // options: null,
        // Add other data fields here
      };

      // const db = getDatabase();
      // // const newPollRef = dbRef(db, 'polls').push();
      // await set(newPollRef, pollData);

      set(dbRef(database, 'polls/' + id), pollData)
        .then(() => {
          console.log("Đã ghi thông tin cuộc bình chọn");
        })
        .catch((error) => {
          console.error("Lỗi khi ghi thông tin cuộc bình chọn ", error);
        });
      navigate(`/addCandidate?votingId=${id}&title=${title}`);
    } catch (e) {
      console.error(e);
    }

  }

  //hàm tạo voting với mongodb
  const handleCreatePoll = async () => {

    try {
      let imageUrl = "url"
      if (file) {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytesResumable(storageRef, file);
        // Get download URL of the uploaded image
        imageUrl = await getDownloadURL(storageRef);
        console.log("Downloading image", imageUrl);
      }

      try {

        const userVoting = JSON.parse(localStorage.getItem("user-voting"));
        console.log("User voting: ", userVoting._id);
        const res = await fetch(`http://localhost:5500/api/votings/create`, {
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
  return (
    <>
      <IndexNavbar />
      <div className="wrapper">
        <section className="section">
          <Container>
            <Row>
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

              <Col className="ml-auto" md="6">
                <Card className="center card-coin card-plain"
                  style={{ marginTop: '210px', fontSize: '150%' }}
                >
                  <CardHeader>
                    {/* <img
                      alt="..."
                      className="img-center img-fluid"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunflower_sky_backdrop.jpg/440px-Sunflower_sky_backdrop.jpg"
                      style={{ width: '300px', height: '200px', objectFit: 'cover' }}
                    /> */}
                    <img
                      id="uploaded-image"
                      alt="Uploaded Image"
                      className="img-center img-fluid"
                      style={{ width: '500px', height: '300px', objectFit: 'cover' }}
                      src="https://cannamazoo.com/assets/defaults/img/default-product-img.jpg"
                    />
                  </CardHeader>
                  {/* <CardBody>
                    <Row>
                      <Col className="text-center" md="12">
                        <h4 className="text-uppercase">Image</h4>
                        <span>Plan</span>
                        <hr className="line-info" />
                      </Col>
                    </Row>

                  </CardBody> */}
                  <hr className="line-info" />
                  <CardFooter className="text-center">

                    <label htmlFor="file-upload" className="custom-file-upload btn-simple" >
                      Upload Image
                    </label>
                    <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </CardFooter>
                </Card>
                <Button
                  className="btn-round float-right"
                  color="primary"
                  data-placement="right"
                  // id="tooltip341148792"
                  type="button"
                  onClick={() => handleCreatePoll()}
                >
                  Next step
                </Button>
              </Col>

            </Row>

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
        {/* <Footer /> */}

      </div>
    </>
  );
}
