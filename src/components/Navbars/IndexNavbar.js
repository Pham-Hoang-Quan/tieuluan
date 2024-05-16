
import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
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
import { getAuth, signOut } from "firebase/auth";
import { AppContext } from "context/AppContext";



export default function IndexNavbar({ isLogin }) {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [collapseOut, setCollapseOut] = React.useState("");
  const [color, setColor] = React.useState("navbar-transparent");
  // const [storedUser, setStoredUser] = React.useState("")

  const {userData, authUser, setAuthUser} = useContext(AppContext);


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

  // hàm đăng xuất dùng FB
  const signout = () => {
    const auth = getAuth();

    signOut(auth).then(() => {
      // Sign-out successful.
      console.log("Sign-out successful");
      window.location.href = "/signIn-page";

    }).catch((error) => {
      // An error happened.
      console.error(error);
    });
  }

  // const  signout = async () => {
  //   const auth = getAuth();

  //   try {
	// 		const res = await fetch("http://localhost:5500/api/auth/logout", {
	// 			method: "POST",
	// 			headers: { "Content-Type": "application/json" },
	// 		});
	// 		const data = await res.json();
	// 		if (data.error) {
	// 			throw new Error(data.error);
	// 		}

	// 		localStorage.removeItem("chat-user");
	// 		setAuthUser(null);
      
	// 	} catch (error) {
	// 		// toast.error(error.message);
	// 	} finally {
	// 		// setLoading(false);
	// 	}
  // }

  return (
    <Navbar className={"fixed-top " + color} color-on-scroll="100" expand="lg">
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
            {userData && collapseOpen === true ? (
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
            {userData ? (
            

              <><NavItem>
                <Button
                  className="nav-link d-none d-lg-block"
                  color="primary"
                  // target="_blank"
                  href=""
                >
                  <i className="tim-icons icon-single-02" />

                  {userData.name || "Account"}
                  
                </Button>
              </NavItem><NavItem>
                  <Button
                    className="nav-link d-none d-lg-block"
                    color="default"
                    onClick={signout}
                  >
                    <i className="fas fa-sign-out-alt" />

                    Log out
                  </Button>
                </NavItem></>
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
              {/* <DropdownToggle
                caret
                color="default"
                data-toggle="dropdown"
                href="#pablo"
                nav
                onClick={(e) => e.preventDefault()}
              >
                <i className="fa fa-cogs d-lg-none d-xl-none" />
                Getting started
              </DropdownToggle> */}
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



            {/* <NavItem>
              <Button
                className="nav-link d-none d-lg-block"
                color="default"
                onClick={scrollToDownload}
              >
                <i className="tim-icons icon-cloud-download-93" /> Download
              </Button>
            </NavItem> */}
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}
