

// @mui material components
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import moment from "moment";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// import { Grid } from "@mui/material";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import MDTypography from "components/MDTypography";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link, useNavigate } from "react-router-dom";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};

function PublicVotings() {
  const [polls, setPolls] = useState([]);
  const [recentPolls, setRecentPolls] = useState([]);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    // hàm láy danh sách votings từ mongodb
    async function getAllVotings() {
      try {
        const response = await fetch(`/api/votings/getVotings/public`);
        const data = await response.json();
        console.log(data);
        setPolls(data);
        // lấy 4 votings gần nhất gán vào recentPolls
        setRecentPolls(data.slice(0, 3));
      } catch (error) {
        console.error(error);
      }
    }
    getAllVotings();
    console.log("Votings: " + recentPolls);
  }, []);

  return (
    <div>
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          padding: '20px 20px 0px 20px',
          borderRadius: '30px',
        }}>
        <Row style={{
          height: '37px',
        }}>
          <Col>
            <h2 className="text-left" 
              style={{
                marginLeft: '30px'
              }}
            >Public Votings</h2>
          </Col>
          <Col>
            <div className="text-right">
              <Link to='/public-votings'>
                <a
                // href="/votings"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '16px',
                  marginRight: '30px'
                  // fontWeight: 'bold',
                }}
              >
                View All
              </a>
              </Link>
              
            </div>
          </Col>
        </Row>
        <Carousel responsive={responsive}>
          {polls.map((poll) => (
            <Col lg="12" sm="12"
              key={poll._id}
              onClick={() => { navigate(`/votingDetail?votingId=${poll._id}`) }}
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div className="info" style={{ paddingTop: '10px' }}>
                <div className="icon icon-primary">
                  <div >
                    <img
                      src={poll.imgUrl}
                      alt={poll.title}
                      style={{ height: '200px', width: '300px', objectFit: 'cover' }}
                    />
                  </div>
                </div>
                <h4 className="info-title">{poll.title}</h4>
                <hr className="line-primary" />
                <p>
                  Ends {moment(`${poll.endAt}`, 'YYYYMMDD').fromNow()}
                  {/* {poll.endAt} */}
                </p>
              </div>
            </Col>
          ))}
        </Carousel>
        {/* </Row> */}

      </div>
    </div>
  );
}

export default PublicVotings;
