
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import { useMaterialUIController } from "context";
import { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import MDAvatar from "components/MDAvatar";

import moment from "moment";

const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDAvatar src={image} name={name} size="sm" />
        <MDBox ml={2} lineHeight={1}>
            <MDTypography display="block" variant="button" fontWeight="medium">
                {name}
            </MDTypography>
            <MDTypography variant="caption">{email}</MDTypography>
        </MDBox>
    </MDBox>
);

function PollsList() {
    const { columns, rows } = authorsTableData();
    const { columns: pColumns, rows: pRows } = projectsTableData();
    // const [controller, dispatch, users] = useMaterialUIController();
    const [tableData, setTableData] = useState({ columns: [], rows: [] });
    const [polls, setPolls] = useState([])
    
    useEffect(() => {
        async function getVotings() {
            try {
                const response = await fetch(`/api/votings/getVotings/all`);
                const data = await response.json();
                console.log(data);
                setPolls(data);
            } catch (error) {
                console.error(error);
            }
        }
        getVotings();
    }, []);

    useEffect(() => {
        if (polls && typeof polls === 'object') {
            const columns = [
                { Header: "No", accessor: "no" },
                { Header: "Name", accessor: "name" },
                { Header: "ID", accessor: "id" },
                { Header: "Created ", accessor: "createAt" },
                { Header: "End ", accessor: "endAt" },
                { Header: "Action", accessor: "action" },
            ];

            const rows = Object.keys(polls || {})
                .map((id) => {
                    const poll = polls[id];
                    console.log(poll)
                    if (poll) {
                        return {
                            no: Object.keys(polls || {}).indexOf(id) + 1,
                            id: poll._id,
                            name: <Author image={poll.imgUrl} name={poll.title} email={"Owner: " + (poll.owner ? poll.owner.name : 'N/A')} />,
                            email: poll.email,
                            address: poll.address,
                            createAt: <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                                {moment(poll.createdAt).format("MMM Do YY")}
                            </MDTypography>,
                            endAt: <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                                {moment(poll.endAt).format("MMM Do YY")}
                            </MDTypography>,
                            action: <MDTypography component="a" href="#" variant="caption" color="info" fontWeight="medium">
                                Detail
                            </MDTypography>
                            // Add more fields as needed
                        };
                    }
                })

            setTableData({ columns, rows });
        }
    }, [polls]);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    {
                        polls &&
                        <Grid item xs={12}>
                            <Card>
                                <MDBox
                                    mx={2}
                                    mt={-3}
                                    py={3}
                                    px={2}
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                >
                                    <MDTypography variant="h6" color="white">
                                        Votings Table
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={3}>
                                    <DataTable
                                        table={tableData}
                                        isSorted={false}
                                        entriesPerPage={false}
                                        showTotalEntries={false}
                                        noEndBorder
                                    />
                                </MDBox>
                            </Card>
                        </Grid>}
                </Grid>
            </MDBox>

        </DashboardLayout>
    );
}

export default PollsList;
