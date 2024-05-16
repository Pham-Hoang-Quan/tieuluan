import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { ethers } from 'ethers';
import MetamaskW from "views/screen/MetamaskW";
import SignUpScreen from "views/screen/SignUpScreen";
import SignInScreen from "views/screen/SignInScreen";
import Home from "views/screen/Home";
import Index from "views/Index";
import LandingPage from "views/examples/LandingPage";
import { database } from "firebase.js";
import ProfilePage from "views/examples/ProfilePage";
import CreatePollScreen from "views/screen/CreatePollScreen";
import { AppProvider } from "context/AppContext";
import AddCandidate from "views/screen/AddCandidate";
import VotingDetail from "views/screen/VotingDetailScreen";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import AdminDashboard from "views/admin/AdminDashboard.js";
import { MaterialUIControllerProvider } from "context/index.js";
import UserList from "views/admin/UserListScreen.js";
import Votings from "views/admin/Votings.js";
import UserListScreen from "views/admin/UserListScreen.js";
// import Dashboard from "views/admin/Dashboard.js";
// import Admin from "admin/Admin.js";

import { createThirdwebClient, getContract, resolveMethod } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import {
    ThirdwebProvider,
    metamaskWallet,
    coinbaseWallet,
    walletConnect,
} from "@thirdweb-dev/react";

import Moralis from "moralis";
import TransactionsListScreen from "views/admin/TransactionsListScreen.js";
// create the client with your clientId, or secretKey if in a server environment
export const client = createThirdwebClient({
    clientId: "1192a17dcfa660494bf84eeb55d314d2"
});

// connect to your contract
export const contract = getContract({
    client,
    chain: defineChain(11155111),
    address: "0xB4a2471E5984296624546b64C574741e8237dE5D"
});




function App() {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState(null);
    const auth = getAuth();

    const [state, setState] = useState({
        provider: null,
        singer: null,
        contract: null,
    })

    useEffect(() => {
        connectToMetamask();

    }, []);

    // useEffect(() => {
    //     const template = async () => {
    //         const contractAddress = "0x513D620ACeF51ef37F09fd95ECD53655Cd2AE85D";
    //         const contractABI = abi.abi;
    //         try {
    //             const { ethereum } = window;
    //             const account = await ethereum.request({
    //                 method: "eth_requestAccounts"
    //             })

    //             window.ethereum.on("accountsChanged", () => {
    //                 window.location.reload()
    //             })
    //             setAccount(account)
    //             setIsConnected(true)
    //             const provider = new ethers.providers.Web3Provider(ethereum) // read the blockchain
    //             const signer = provider.getSigner() // write the blockchain signer
    //             const contract = new ethers.Contract(
    //                 contractAddress,
    //                 contractABI,
    //                 signer
    //             )
    //             console.log(contract)
    //             setState({ provider, signer, contract })
    //         } catch (error) {
    //             alert(error.message)
    //             console.log(error)
    //         }
    //     }
    //     template()
    // }, []);



    // async function getTransactions() {
    //     try {
    //         console.log("Start Moralis");
    //         await Moralis.start({
    //           apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjkyNWJlYzA3LTFhZTAtNGU4Ny1hYWUyLTE1OWM2YmQzM2MwOCIsIm9yZ0lkIjoiMzkxNDQxIiwidXNlcklkIjoiNDAyMjE4IiwidHlwZUlkIjoiNDJkYWI1MzAtZmM1Ni00MjQ5LTk5YmItZWE1YWE3YjhmM2E0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTUxNjM3MzMsImV4cCI6NDg3MDkyMzczM30.WG6SseusNECSeXiYsTezKhN6oA-aFTaZeoNLT2J7Qws"
    //         });

    //         const response = await Moralis.EvmApi.events.getContractLogs({
    //           "chain": "sepolia",
    //           "order": "DESC",
    //           "address": "0xe9fE15A6Be86a57c9A8dbB3dcD4441CFE24471C0"
    //         });
    //         console.log("Transactions",response);
    //       } catch (e) {
    //         console.error(e);
    //       }
    // }





    async function connectToMetamask() {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                setProvider(provider);
                setAccount(address);
                setIsConnected(true);
            } catch (err) {
                console.error(err);
            }
        } else {
            console.error("Metamask is not detected in the browser")
        }
    }

    if (!isConnected) {
        return <MetamaskW />;
    }

    return (
        <ThirdwebProvider>
            <AppProvider>
                <Provider store={store}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Home isLogin={isLogin} user={user} />} />
                            <Route path="/signUp-page" element={<SignUpScreen account={account} />} />
                            <Route path="/signIn-page" element={<SignInScreen account={account} />} />
                            <Route path="/createPoll" element={<CreatePollScreen />} />
                            <Route path="/addCandidate" element={<AddCandidate />} />
                            <Route path="/votingDetail" element={<VotingDetail />} />
                        // các trang templates
                            <Route path="/components" element={<Index />} />
                            <Route path="/landing" element={<LandingPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/adminDashboard" element={
                                <MaterialUIControllerProvider>
                                    {/* Other components */}
                                    <AdminDashboard />
                                    {/* Other components */}
                                </MaterialUIControllerProvider>} />

                            <Route path="/userList" element={
                                <MaterialUIControllerProvider>
                                    {/* Other components */}
                                    <UserListScreen />
                                    {/* Other components */}
                                </MaterialUIControllerProvider>} />
                            <Route path="/transactions" element={
                                <MaterialUIControllerProvider>
                                    {/* Other components */}
                                    <TransactionsListScreen />
                                    {/* Other components */}
                                </MaterialUIControllerProvider>} />
                            <Route path="/votings" element={
                                <MaterialUIControllerProvider>
                                    {/* Other components */}
                                    <Votings></Votings>
                                    {/* Other components */}
                                </MaterialUIControllerProvider>} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </BrowserRouter>
                </Provider>

            </AppProvider>
        </ThirdwebProvider>



    );
}

export default App;