

// @mui material components
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// import { Grid } from "@mui/material";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import MDTypography from "components/MDTypography";
function PublicVotings() { 
  const [polls, setPolls] = useState([]);
  const [recentPolls, setRecentPolls] = useState([]);
  const [countVotings, setCountVotings] = useState(0);
  const [countVotingsDoing, setCountVotingsDoing] = useState([]);

  const [users, setUsers] = useState([]);
  const [countUsers, setCountUsers] = useState(0);
  useEffect(() => {
    // hàm láy danh sách votings từ mongodb
    async function getAllVotings() {
      try {
        const response = await fetch(`http://localhost:5500/api/votings/getVotings/all`);
        const data = await response.json();
        console.log(data);
        setPolls(data);
        // lấy 4 votings gần nhất gán vào recentPolls
        setRecentPolls(data.slice(0, 3));
      } catch (error) {
        console.error(error);
      }
    }

    // hàm lấy danh sách các users từ mongodb
    async function getAllUsers() {
      try {
        const response = await fetch(`http://localhost:5500/api/users/getUsers/user`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    }
    getAllVotings();
    getAllUsers();
    console.log("Votings: " + recentPolls);
  }, []);

  return (
      <Grid item xs={12} lg={12} style={{ backgroundColor: 'white', borderRadius: '16px' }}>
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Recents
          </MDTypography>
        </MDBox>
        <MDBox p={2}>
          <Grid container spacing={6}>
            {polls.map((poll) => (
              <Grid item xs={12} md={6} xl={3} key={poll._id}>
                <DefaultProjectCard
                  image={poll.imgUrl}
                  // label={`ID #${poll._id}`}
                  title={poll.title} // Replace with the actual title property
                  description={poll.description.slice(0, 70) + ' ...'}
                  action={{
                    type: "internal",
                    route: `/votingDetail?votingId=${poll.id}`, // Replace with the actual route
                    color: "info",
                    label: "view voting",
                  }}
                />
              </Grid>
            ))}

          </Grid>
        </MDBox>
      </Grid>






    
  );
}

export default PublicVotings;
