import React, { useState, useEffect, useContext } from "react";
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
import { AppContext } from "context/AppContext.js";

import Moralis from "moralis";
import TransactionsListScreen from "views/admin/TransactionsListScreen.js";
import YourVotings from "views/screen/YourVotings.js";
import PublicVotingsScreen from "views/screen/PublicVotingsScreen.js";
import { AdminRoute } from "components/admin/AdminRoute.js";
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

    // if (!isConnected) {
    //     return <MetamaskW />;
    // }

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
                            <Route path="/your-votings" element={<YourVotings />} />
                            <Route path="/public-votings" element={<PublicVotingsScreen />} />
                            // các trang template
                            <Route path="/components" element={<Index />} />
                            <Route path="/landing" element={<LandingPage />} />
                            <Route path="/profile" element={<ProfilePage />} />

                            <Route path="/adminDashboard" element={
                                <AdminRoute>
                                    <MaterialUIControllerProvider>
                                        <AdminDashboard />
                                    </MaterialUIControllerProvider>
                                </AdminRoute>
                            } />
                            <Route path="/votings" element={
                                <AdminRoute>
                                    <MaterialUIControllerProvider>
                                        <Votings />
                                    </MaterialUIControllerProvider>
                                </AdminRoute>
                            } />
                            <Route path="/users" element={
                                <AdminRoute>
                                    <MaterialUIControllerProvider>
                                        <UserListScreen />
                                    </MaterialUIControllerProvider>
                                </AdminRoute>
                            } />
                            <Route path="/transactions" element={
                                <AdminRoute>
                                    <MaterialUIControllerProvider>
                                        <TransactionsListScreen />
                                    </MaterialUIControllerProvider>
                                </AdminRoute>
                            } />

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </BrowserRouter>
                </Provider>

            </AppProvider>
        </ThirdwebProvider>



    );
}

export default App;