

// @mui material components
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import Invoice from "layouts/billing/components/Invoice";
import Invoices from "layouts/billing/components/Invoices";

// import { Grid } from "@mui/material";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg"; import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import Header from "layouts/profile/components/Header";
import MDTypography from "components/MDTypography";
import { getDatabase, ref, get } from "firebase/database";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;

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
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* # 3 block votings, users, and ... */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="HowToVote"
                title="Votings"
                // count={countVotings}
                count={polls.length}
                percentage={{
                  color: "success",
                  amount: countVotingsDoing.length.toString(),
                  label: "in progress",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="Users"
                title="Users"
                // count={countUsers}
                count={users.length}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Revenue"
                count="34k"
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          {/* <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Followers"
                count="+91"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid> */}


        </Grid>

        {/* <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox> */}


      </MDBox>
      <Grid item xs={12} lg={12} style={{ backgroundColor: 'white', borderRadius: '16px' }}>
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Recents
          </MDTypography>
        </MDBox>
        <MDBox p={2}>
          <Grid container spacing={6}>
            {recentPolls.map((poll) => (
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






    </DashboardLayout>
  );
}

export default Dashboard;
