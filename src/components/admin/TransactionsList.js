
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
import { useEffect, useState } from "react";
import MDAvatar from "components/MDAvatar";
import team2 from "assets/images/team-2.jpg";

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

function TransactionsList() {
    const { columns, rows } = authorsTableData();
    const { columns: pColumns, rows: pRows } = projectsTableData();
    // const [controller, dispatch, users] = useMaterialUIController();
    const [tableData, setTableData] = useState({ columns: [], rows: [] });
    const [trans, setTrans] = useState([]);
    // useEffect(() => {
    //     async function fetchUsers() {
    //         const db = getDatabase();
    //         const usersRef = ref(db, 'users');
    //         const snapshot = await get(usersRef);
    //         if (snapshot.exists()) {
    //             setUsers(snapshot.val());
    //             // console.log(snapshot.val());
    //             // console.log(users);
    //         } else {
    //             console.log("No data available");
    //         }
    //     }
    //     fetchUsers();
    // }, [users]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const address = "0xe9fE15A6Be86a57c9A8dbB3dcD4441CFE24471C0"; // Địa chỉ cụ thể bạn muốn truy vấn
                const chain = "sepolia"; // Mạng blockchain bạn muốn truy vấn
                const url = `https://deep-index.moralis.io/api/v2.2/${address}?chain=${chain}`;

                const response = await fetch(url, {
                    headers: {
                        'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjkyNWJlYzA3LTFhZTAtNGU4Ny1hYWUyLTE1OWM2YmQzM2MwOCIsIm9yZ0lkIjoiMzkxNDQxIiwidXNlcklkIjoiNDAyMjE4IiwidHlwZUlkIjoiNDJkYWI1MzAtZmM1Ni00MjQ5LTk5YmItZWE1YWE3YjhmM2E0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTUxNjM3MzMsImV4cCI6NDg3MDkyMzczM30.WG6SseusNECSeXiYsTezKhN6oA-aFTaZeoNLT2J7Qws',
                        'Accept': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error("Không thể tải dữ liệu từ server");
                }

                const responseData = await response.json();
                setTrans(responseData.result);
                console.log(responseData.result);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [trans]);

    useEffect(() => {
        if (
            true 
            
            // trans
            //  && typeof trans === 'object'
        ) {
            const columns = [
                // { Header: "No", accessor: "no" },
                // { Header: "Name", accessor: "name" },
                // { Header: "ID", accessor: "id" },
                // { Header: "Created ", accessor: "createAt" },
                // { Header: "Action", accessor: "action" },
                // { Header: "Address", accessor: "address" },
                // { Header: "Email", accessor: "email" },
                // { Header: "Avatar URL", accessor: "avtUrl" },
                // Add more columns as needed
                { Header: "Hash", accessor: "hash" },
                { Header: "From Address", accessor: "from_address" },
                { Header: "Input", accessor: "input" },
                { Header: "Block Timestamp", accessor: "block_timestamp" },
            ];

            const rows = Object.keys(trans || {})
                .map((hash) => {
                    const tran = trans[hash];
                    const input = tran.input;
                    if (tran) {
                        return {
                            hash: tran.hash,
                            from_address: tran.from_address,
                            input: tran.input,
                            block_timestamp: tran.block_timestamp,
                        };
                    }
                })

            setTableData({ columns, rows });
        }
    }, [trans]);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
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
                                    Transactions Table
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{ columns, rows: rows }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
}

export default TransactionsList;