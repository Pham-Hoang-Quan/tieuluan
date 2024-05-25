

import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import UserList from "components/admin/UserList";

import { ethers } from 'ethers';
import { Avatar, Tag, Space, Table } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Card, Grid } from '@mui/material';
import DashboardLayout from "layouts/dashboard";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDTypography from "components/MDTypography";
import PollsList from "components/admin/PollsList";
import TransactionsList from "components/admin/TransactionsList";
import DataTable from "examples/Tables/DataTable";



const apiKey = 'YEP15A9J216FW5YA6C7N9VSZZ7BCDS3R83';
const address = '0xe9fE15A6Be86a57c9A8dbB3dcD4441CFE24471C0';

const abi = [
    // Define your contract ABI here
    // Example:
    {
        inputs: [
            { internalType: "uint256", name: "_id", type: "uint256" },
            { internalType: "address", name: "_idUser", type: "address" },
            { internalType: "address", name: "_idCandidateNew", type: "address" },
            { internalType: "address", name: "_idCandidateOld", type: "address" },
            { internalType: "address", name: "_idVoting", type: "address" },
        ],
        name: "vote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];




export default function TransactionsListScreen() {

    // const [users, setUsers] = useState([]);

    const [tableData, setTableData] = useState({ columns: [], rows: [] });
    const [controller, dispatch] = useMaterialUIController();
    const {
        miniSidenav,
        direction,
        layout,
        openConfigurator,
        sidenavColor,
        transparentSidenav,
        whiteSidenav,
        darkMode,
    } = controller;
    const [onMouseEnter, setOnMouseEnter] = useState(false);
    const [rtlCache, setRtlCache] = useState(null);
    const { pathname } = useLocation();
    const [component, setComponent] = useState("table");
    const [errorMessage, setErrorMessage] = useState('');

    // Cache for the rtl
    useMemo(() => {
        const cacheRtl = createCache({
            key: "rtl",
            stylisPlugins: [rtlPlugin],
        });

        setRtlCache(cacheRtl);
    }, []);

    // Open sidenav when mouse enter on mini sidenav
    const handleOnMouseEnter = () => {
        if (miniSidenav && !onMouseEnter) {
            setMiniSidenav(dispatch, false);
            setOnMouseEnter(true);
        }
    };

    // Close sidenav when mouse leave mini sidenav
    const handleOnMouseLeave = () => {
        if (onMouseEnter) {
            setMiniSidenav(dispatch, true);
            setOnMouseEnter(false);
        }
    };

    // Change the openConfigurator state
    const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

    // Setting the dir attribute for the body element
    useEffect(() => {
        document.body.setAttribute("dir", direction);
    }, [direction]);

    // Setting page scroll to 0 when changing the route
    useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
    }, [pathname]);

    const getRoutes = (allRoutes) =>
        allRoutes.map((route) => {
            if (route.collapse) {
                return getRoutes(route.collapse);
            }

            if (route.route) {
                return <Route exact path={route.route} element={route.component} key={route.key} />;
            }

            return null;
        });

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        getTransactions();
    }, []);

    const getTransactions = async () => {
        try {
            const response = await fetch(
                `https://api-sepolia.etherscan.io/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${address}&apikey=${apiKey}`
            );
            const data = await response.json();
            if (data.status === '1') {
                setTransactions(data.result);
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error('Lỗi lấy giao dịch: ', error);
            setErrorMessage('Lỗi lấy giao dịch: ' + error.message);
        }
    };

    const decodeDataInput = (hexData, abi) => {
        if (!hexData) return null;

        try {
            const decoded = ethers.utils.defaultAbiCoder.decode(abi, hexData);
            return decoded;
        } catch (error) {
            console.error('Error decoding data:', error);
            return null;
        }
    };

    const renderTransactions = () => {
        if (transactions.length === 0) {
            return <p>Không có giao dịch nào</p>;
        }

        return (

            <ul>
                {transactions.map((tx, index) => (
                    <li key={index}>
                        <b>Block Number:</b> {parseInt(tx.blockNumber, 16)}<br />
                        <b>From Address:</b> {tx.topics[1]}<br />
                        <b>To Address:</b> {tx.topics[2]}<br />
                        <b>Data Input:</b> {tx.data}<br />
                        <b>Value:</b> {ethers.utils.formatEther(tx?.value || 0)} ETH<br />
                        <b>Gas:</b> {tx?.gas || 'N/A'}<br />
                        <b>Gas Price:</b>{' '}
                        {ethers.utils.formatUnits(tx?.gasPrice || 0, 'gwei')} Gwei<br />
                        <b>Nonce:</b> {tx.nonce}<br />

                        {tx.data && (
                            <div>
                                <b>Decoded Data Input:</b>
                                <pre>{JSON.stringify(decodeDataInput(tx.data, abi), null, 2)}</pre>
                            </div>
                        )}
                        <hr />
                    </li>
                ))}
            </ul>
        );
    };

    useEffect(() => {
        if (transactions && typeof transactions === 'object') {
            const columns = [
                { Header: "No", accessor: "no" },
                { Header: "Name", accessor: "name" },
                { Header: "ID", accessor: "id" },
                { Header: "Created ", accessor: "createAt" },
                { Header: "End ", accessor: "endAt" },
                { Header: "Action", accessor: "action" },
            ];

            const rows = Object.keys(transactions || {})
                .map((id) => {
                    const poll = transactions[id];
                    console.log(poll)
                    if (poll) {
                        return {
                            no: Object.keys(transactions || {}).indexOf(id) + 1,
                            id: poll._id,
                            name: poll.name,
                            email: poll.email,
                            address: poll.address,
                            createAt: <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                                poll.createdAt
                            </MDTypography>,
                            endAt: <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                                poll.endAt
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
    }, [transactions]);


    return (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
            <CssBaseline />
            {layout === "dashboard" && (
                <>
                    <Sidenav
                        color={sidenavColor}
                        brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                        brandName="Poll Chains"
                        routes={routes}
                        onMouseEnter={handleOnMouseEnter}
                        onMouseLeave={handleOnMouseLeave}
                    />
                    {/* <Configurator /> */}
                    {/* {configsButton} */}
                </>
            )}
            
            <TransactionsList>
                
            </TransactionsList>
            
        </ThemeProvider>
    );
}