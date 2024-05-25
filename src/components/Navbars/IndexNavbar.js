
import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Avatar, Badge, Box, CircularProgress, TextField } from "@mui/material";
// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";
import {
  getAuth,
  signOut,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { AppContext } from "context/AppContext";
import { Drawer } from "@mui/material";
import { ref, uploadBytesResumable, getDownloadURL, } from "firebase/storage";
import { database, storage } from "firebase.js";
import { useNavigate } from 'react-router-dom';
import axios from "axios";


export default function IndexNavbar({ isLogin }) {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [collapseOut, setCollapseOut] = React.useState("");
  const [color, setColor] = React.useState("navbar-transparent");
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { userData, authUser, setAuthUser, } = useContext(AppContext);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const navigate = useNavigate();

  const [openChangePass, setOpenChangePass] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  var userInfo = JSON.parse(localStorage.getItem("user-voting"));

  React.useEffect(() => {
    window.addEventListener("scroll", changeColor);
    console.log("isLogin", isLogin);
    console.log(userData)
    return function cleanup() {
      window.removeEventListener("scroll", changeColor);
    };
  }, []);
  const changeColor = () => {
    if (
      document.documentElement.scrollTop > 99 ||
      document.body.scrollTop > 99
    ) {
      setColor("bg-info");
    } else if (
      document.documentElement.scrollTop < 100 ||
      document.body.scrollTop < 100
    ) {
      setColor("navbar-transparent");
    }
  };
  const toggleCollapse = () => {
    document.documentElement.classList.toggle("nav-open");
    setCollapseOpen(!collapseOpen);
  };
  const onCollapseExiting = () => {
    setCollapseOut("collapsing-out");
  };
  const onCollapseExited = () => {
    setCollapseOut("");
  };
  const scrollToDownload = () => {
    document
      .getElementById("download-section")
      .scrollIntoView({ behavior: "smooth" });
  };
  const signout = async () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log("Sign-out successful");
    }).catch((error) => {
      // An error happened.
      console.error(error);
    });

    try {
      //////
      const response = await axios.post(`/api/auth/logout`)
        .then((res) => {
          console.log(res);
          localStorage.removeItem("user-voting");
          setAuthUser(null);
          navigate('/signIn-page');
        })
    } catch (error) {
      // toast.error(error.message);
    } finally {
      // setLoading(false);
    }
  }

  const [selectedImage, setSelectedImage] = useState(userInfo ? userInfo.avtUrl : null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleUpdateUser = async () => {
    setOpen(false);
    setLoading(true);
    const auth = getAuth();

    try {
      // Ensure the DOM is fully loaded
      const nameInput = document.getElementById("name-input");
      const emailInput = document.getElementById("email-input");

      if (!nameInput || !emailInput) {
        alert("Name and email input elements not found");
        setLoading(false);
        return;
      }

      let imageUrl = userInfo.avtUrl;

      if (file) {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `userImgs/${file.name}`);
        await uploadBytesResumable(storageRef, file);
        // Get download URL of the uploaded image
        imageUrl = await getDownloadURL(storageRef);
        console.log("Downloading image", imageUrl);
      }

      if (nameInput.value === userInfo.name &&
        emailInput.value === userInfo.email &&
        imageUrl === userInfo.avtUrl) {
        alert("No change");
        setLoading(false);
        return;
      }

      if (nameInput.value === "" || emailInput.value === "") {
        alert("Name and email must not be empty");
        setLoading(false);
        return;
      }

      // Updating email in Firebase if it has changed
      if (emailInput.value !== userInfo.email) {
        const user = auth.currentUser;
        const credential = promptForCredentials(); // Make sure to implement this function

        await reauthenticateWithCredential(user, credential);

        try {
          await updateEmail(auth.currentUser, emailInput.value);
          alert('Verification email sent to old email address');
        } catch (error) {
          alert("Error updating email: " + error.message);
          setLoading(false);
          return;
        }
      }

      // Updating user information in MongoDB
      const response = await axios.post(`/api/users/updateUser/${userInfo._id}`, {
        name: nameInput.value,
        email: emailInput.value,
        avtUrl: imageUrl,
      }).then(response => {
        console.log(response);
      }).catch(err => {
        console.error(err);
      })

      // Fetch updated user information from MongoDB and update localStorage
      const response2 = await axios.get(`/api/users/${userInfo._id}`)
        .then((res) => {
          console.log(res);
          localStorage.setItem("user-voting", JSON.stringify(res.data));
        })
        .catch((error) => {
          console.error(error);
        });

    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };



  const handleChangePassword = async () => {
    setOpenChangePass(false);
    setLoading(true);
    const auth = getAuth();
    try {
      const oldPassword = document.getElementById("old-password-input").value;
      const newPassword = document.getElementById("new-password-input").value;

      if (oldPassword === "" || newPassword === "") {
        alert("Password must not be empty");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/auth/changePassword/${userInfo._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword,
          newPassword
        }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Password updated successfully on MongoDB", data);

        const user = auth.currentUser;
        const credential = promptForCredentialsForChangePass(userInfo.email, oldPassword);
        reauthenticateWithCredential(user, credential).then(() => {
          updatePassword(auth.currentUser, newPassword).then(() => {
            alert('Password changed successfully');
          }).catch((error) => {
            alert("Error updating password in Firebase: ", error.message);
          });
        }).catch((error) => {
          alert("Re-authentication error: ", error.message);
        });
      } else {
        const errorData = await res.json();
        console.error("Error from server: ", errorData.error);
        alert(`Error: ${errorData.error}`);
      }

      ////
      const response = await axios.post(`/api/auth/changePassword/${userInfo._id}`, {
        oldPassword,
        newPassword
      })
        .then((res) => {
          console.log(res);
          alert("Password changed successfully");
        })
        .catch((error) => {
          console.error("Error changing password: ", error);
        });
    } catch (e) {
      console.error("Error changing password: ", e);
    } finally {
      setLoading(false);
    }
  }

  function promptForCredentialsForChangePass(email, password) {
    return EmailAuthProvider.credential(email, password);
  }

  function promptForCredentials() {
    const email = userInfo.email;
    const password = prompt("Please enter your password to change email address");
    return EmailAuthProvider.credential(email, password);
  }

  const handleSendEmail = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, userInfo.email)
      .then(() => {
        alert("Email sent");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }
  return (
    <Navbar className={"fixed-top " + color} color-on-scroll="100" expand="lg">
      {loading &&
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '9999',

          }}
        >
          <CircularProgress
            style={{ margin: 'auto', position: 'absolute', top: '50%', left: '50%' }}
          >
          </CircularProgress>
        </div>

      }
      <Container>
        <div className="navbar-translate">
          <NavbarBrand to="/" tag={Link} id="navbar-brand">
            <span>Poll • </span>
            Chain
          </NavbarBrand>
          <UncontrolledTooltip placement="bottom" target="navbar-brand">

          </UncontrolledTooltip>
          <button
            aria-expanded={collapseOpen}
            className="navbar-toggler navbar-toggler"
            onClick={toggleCollapse}
          >
            <span className="navbar-toggler-bar bar1" />
            <span className="navbar-toggler-bar bar2" />
            <span className="navbar-toggler-bar bar3" />
          </button>
        </div>
        <Collapse
          className={"justify-content-end " + collapseOut}
          navbar
          isOpen={collapseOpen}
          onExiting={onCollapseExiting}
          onExited={onCollapseExited}
        >
          <div className="navbar-collapse-header">
            <Row>
              <Col className="collapse-brand" xs="6">
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                  PollChain
                </a>
              </Col>
              <Col className="collapse-close text-right" xs="6">
                <button
                  aria-expanded={collapseOpen}
                  className="navbar-toggler"
                  onClick={toggleCollapse}
                >
                  <i className="tim-icons icon-simple-remove" />
                </button>
              </Col>
            </Row>
          </div>
          <Nav navbar>
            <NavItem className="p-0">
              <NavLink
                data-placement="bottom"
                href="https://twitter.com/CreativeTim"
                rel="noopener noreferrer"
                target="_blank"
                title="Follow us on Twitter"
              >
                <i className="fab fa-twitter" />
                <p className="d-lg-none d-xl-none">Twitter</p>
              </NavLink>
            </NavItem>
            <NavItem className="p-0">
              <NavLink
                data-placement="bottom"
                href="https://www.facebook.com/CreativeTim"
                rel="noopener noreferrer"
                target="_blank"
                title="Like us on Facebook"
              >
                <i className="fab fa-facebook-square" />
                <p className="d-lg-none d-xl-none">Facebook</p>
              </NavLink>
            </NavItem>
            <NavItem className="p-0">
              <NavLink
                data-placement="bottom"
                href="https://www.instagram.com/CreativeTimOfficial"
                rel="noopener noreferrer"
                target="_blank"
                title="Follow us on Instagram"
              >
                <i className="fab fa-instagram" />
                <p className="d-lg-none d-xl-none">Instagram</p>
              </NavLink>
            </NavItem>
            {/* {userData && collapseOpen === true ? ( */}
            {userInfo && collapseOpen === true ? (
              <>
                <NavItem className="p-0">
                  <NavLink
                    data-placement="bottom"
                    // href=""
                    rel="noopener noreferrer"
                    title="Sign out"
                    onClick={signout}
                  >
                    <i className="fas fa-sign-out-alt" />
                    <p className="d-lg-none d-xl-none">Sign out</p>
                  </NavLink>
                </NavItem>
                <NavItem className="p-0">
                  <NavLink
                    data-placement="bottom"
                    // href=""
                    rel="noopener noreferrer"
                    title="Sign out"
                    onClick={{}}
                  >
                    <i className="fas fa-user-circle"></i>
                    <p className="d-lg-none d-xl-none">My Account</p>
                  </NavLink>
                </NavItem>
              </>
            ) : (
              <div></div>
            )}
            {/* // 2 nút ở ngoài */}
            {userInfo ? (
              <>
                <NavItem>
                  <Button
                    className="nav-link d-none d-lg-block"
                    color="primary"
                    // target="_blank"
                    href=""
                    onClick={toggleDrawer(true)}
                  >
                    <i className="tim-icons icon-single-02" />

                    {userInfo.name || "Account"}

                  </Button>
                </NavItem>
                {/* <NavItem>
                  <Button
                    className="nav-link d-none d-lg-block"
                    color="default"
                    onClick={signout}
                  >
                    <i className="fas fa-sign-out-alt" />
                    Log out
                  </Button>
                </NavItem> */}
                <NavItem>

                  <Link to="/createPoll">
                    <Button
                      className="nav-link d-none d-lg-block"
                      color="default"
                    // onClick={() => { navigate('/createPoll'); }}
                    >
                      <i className="fas fa-plus"></i>
                      Create a voting
                    </Button>
                  </Link>
                </NavItem>
              </>
            ) : (
              <NavItem>
                <Button
                  className="nav-link d-none d-lg-block"
                  color="primary"
                  // target="_blank"
                  href="/signIn-page"
                >
                  <i className="tim-icons icon-single-02" /> Login
                </Button>
              </NavItem>
            )}

            <UncontrolledDropdown nav>
              <DropdownMenu className="dropdown-with-icons">
                <DropdownItem href="https://demos.creative-tim.com/blk-design-system-react/#/documentation/overview">
                  <i className="tim-icons icon-paper" />
                  Documentation
                </DropdownItem>
                <DropdownItem tag={Link} to="/register-page">
                  <i className="tim-icons icon-bullet-list-67" />
                  Register Page
                </DropdownItem>
                <DropdownItem tag={Link} to="/landing-page">
                  <i className="tim-icons icon-image-02" />
                  Landing Page
                </DropdownItem>
                <DropdownItem tag={Link} to="/profile-page">
                  <i className="tim-icons icon-single-02" />
                  Profile Page
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Container>

      <Drawer open={open} onClose={toggleDrawer(false)} anchor='right'>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '50ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <Row style={{ margin: '20px' }}>
            <i className="fas fa-times"
              style={{ margin: 'auto 10px auto', fontSize: '19px' }}
              onClick={() => { setOpen(false) }}
            />
            <h2 style={{ color: 'black', margin: 'auto 10px auto' }}>
              Your information
            </h2>

          </Row>

          {userInfo &&
            <div>
              <div>
                <Row style={{ margin: '19px' }}>
                  <Col>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <label
                          style={{ fontSize: '24px', color: 'gray' }}
                          htmlFor="file-upload"
                        >
                          <i className="fas fa-upload" />{/* Sử dụng biểu tượng edit từ react-icons */}
                          <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        </label>
                      }
                    >
                      <img
                        id="uploaded-image"
                        alt="..."
                        className="img-fluid rounded-circle shadow-lg"
                        src={selectedImage || "https://cannamazoo.com/assets/defaults/img/default-product-img.jpg"}
                        style={{ width: "180px", height: "180px", objectFit: 'cover' }}
                      />
                    </Badge>
                  </Col>
                  <Col style={{
                    margin: '19px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>

                    <Link style={{ width: '100%' }} to="/your-votings">
                      <Button
                        className="btn-simple btn-round"
                        variant="outlined"
                        style={{
                          margin: '10px'
                        }}>
                        Your Votings
                      </Button>
                    </Link>
                    <Button
                      onClick={() => setOpenChangePass(true)}
                      variant="outlined"
                      style={{
                        margin: '10px'
                      }}>
                      Change password
                    </Button>
                  </Col>
                </Row>
              </div>
              <div style={{ margin: '10px' }} >
                <TextField
                  onChange={(e) => setName(e.target.value)}
                  id="name-input"
                  label="Full name"
                  // value={userInfo.name}
                  defaultValue={userInfo.name}
                />
              </div>
              <div style={{ margin: '10px' }} >
                <TextField
                  onChange={(e) => setEmail(e.target.value)}
                  id="email-input"
                  label="Email"
                  defaultValue={userInfo.email}
                />
              </div>
              <div style={{ margin: '10px', marginLeft: '30px' }} >
                <Row>
                  <Button
                    onClick={() => handleUpdateUser()}
                    className="btn-simple btn-round"
                    color="default"
                    variant="outlined"
                    style={{
                      margin: '10px'
                    }}>
                    Save
                  </Button>
                  <Button
                    onClick={() => signout()}
                    className="btn-icon btn-round"
                    color="default"
                    type="button"
                    style={{ margin: 'auto 0 auto' }}
                    title="Log out"
                  >
                    <i className="fas fa-sign-out-alt" />
                    {/* Log out */}
                  </Button>
                </Row>
              </div>
            </div>
          }
        </Box>
      </Drawer>
      <Drawer open={openChangePass} onClose={toggleDrawer(false)} anchor='right'>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '50ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <Row style={{ margin: '20px' }}>
            <i className="fas fa-times"
              style={{ margin: 'auto 10px auto', fontSize: '19px' }}
              onClick={() => { setOpenChangePass(false) }}
            />
            <h2 style={{ color: 'black', margin: 'auto 10px auto' }}>
              Change Password
            </h2>

          </Row>
          {userInfo &&
            <div>
              <div>
              </div>
              <div style={{ margin: '10px' }} >
                <TextField
                  onChange={(e) => setName(e.target.value)}
                  id="old-password-input"
                  label="Your old password"
                  defaultValue=""
                />
              </div>
              <div style={{ margin: '10px' }} >
                <TextField
                  onChange={(e) => setEmail(e.target.value)}
                  id="new-password-input"
                  label="Your new password"
                  defaultValue=""
                />
              </div>

              <div style={{
                margin: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <p
                  style={{
                    color: 'gray',
                  }}
                > Forget your password ?</p>
                <a
                  style={{
                    // textAlign: 'center',
                    color: 'blue',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSendEmail()}
                >Get a link to reset password</a>
              </div>
              <div style={{ margin: '10px', marginLeft: '30px' }} >
                <Row>
                  <Button
                    onClick={() => { setOpenChangePass(false) }}
                    className=" btn-simple btn-icon btn-round"
                    color="default"
                    type="button"
                    style={{ margin: 'auto 0 auto', height: '40px', width: '40px' }}
                    title="Log out"
                  >
                    <i className="fas fa-chevron-left" />

                    {/* Log out */}
                  </Button>
                  <Button
                    onClick={() => handleChangePassword()}
                    className="btn btn-round"
                    color="default"
                    variant="outlined"
                    style={{
                      margin: '10px'
                    }}>
                    Change
                  </Button>

                </Row>

              </div>
            </div>
          }
        </Box>
      </Drawer>

    </Navbar>


  );
}
