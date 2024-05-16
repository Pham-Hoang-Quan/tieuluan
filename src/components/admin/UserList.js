
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
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

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

function UserList() {
    const { columns, rows } = authorsTableData();
    const { columns: pColumns, rows: pRows } = projectsTableData();
    // const [controller, dispatch, users] = useMaterialUIController();
    const [tableData, setTableData] = useState({ columns: [], rows: [] });
    const [users, setUsers] = useState([])
    useEffect(() => {
        // async function fetchUsers() {
        //     const db = getDatabase();
        //     const usersRef = ref(db, 'users');
        //     const snapshot = await get(usersRef);
        //     if (snapshot.exists()) {
        //         setUsers(snapshot.val());
        //         // console.log(snapshot.val());
        //         // console.log(users);
        //     } else {
        //         console.log("No data available");
        //     }
        // }
        // fetchUsers();

        async function getUsers() {
            try {
                const response = await fetch(`http://localhost:5500/api/users/getUsers/user`);
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error in getUsers: ", error.message);
            }
        }
        getUsers();
    }, [users]);

    useEffect(() => {
        if (users && typeof users === 'object') {
            const columns = [
                { Header: "No", accessor: "no" },
                { Header: "Name", accessor: "name" },
                { Header: "ID", accessor: "id" },
                { Header: "Created ", accessor: "createAt" },
                { Header: "Action", accessor: "action" },
                // { Header: "Address", accessor: "address" },
                // { Header: "Email", accessor: "email" },
                // { Header: "Avatar URL", accessor: "avtUrl" },
                // Add more columns as needed
            ];

            // rows: [
            //     {
            //       author: <Author image={team2} name="John Michael" email="john@creative-tim.com" />,
            //       function: <Job title="Manager" description="Organization" />,
            //       status: (
            //         <MDBox ml={-1}>
            //           <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
            //         </MDBox>
            //       ),
            //       employed: (
            //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            //           23/04/18
            //         </MDTypography>
            //       ),
            //       action: (
            //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            //           Edit
            //         </MDTypography>
            //       ),
            //     },
            //     {

            const rows = Object.keys(users || {})
                .map((id) => {
                    const user = users[id];
                    if (user) {
                        return {
                            no: Object.keys(users || {}).indexOf(id) + 1,
                            id,
                            name: <Author image={user.avtUrl || team2} name={user.name} email={user.email} />,
                            email: user.email,
                            address: user.address,
                            // avtUrl: user.avtUrl,
                            createAt: <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                                {new Date(user.createAt).toLocaleDateString()}
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
    }, [users]);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    {
                        users &&
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
                                        Users Table
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
                    {/* <Grid item xs={12}>
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
                                    Authors Table
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{ columns, rows }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid> */}
                    {/* <Grid item xs={12}>
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
                                    Projects Table
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{ columns: pColumns, rows: pRows }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid> */}

                </Grid>
            </MDBox>

        </DashboardLayout>
    );
}

export default UserList;
