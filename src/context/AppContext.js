import { database } from "firebase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { createContext, useEffect, useState } from "react";


import { ethers } from "ethers";
import abi from "../contract/TransactionManager.json"


export const AppContext = createContext(null);


export const AppProvider = ({ children }) => {
    const [userData, setUserData] = useState(null); // State để lưu trữ dữ liệu user

    const [state, setState] = useState({
        provider: null,
        singer: null,
        contract: null,
    })

    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("chat-user")) || null);

    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const dataRef = ref(database, '/users/' + user.uid);
                onValue(dataRef, (snapshot) => {
                    const data = snapshot.val();
                    setUserData(data); // Lưu trữ dữ liệu user vào state
                });
            } else {
                setUserData(null); // Nếu không có user, set userData thành null
            }
        });
    }, [auth]);

    useEffect(() => {
        const template = async () => {
            const contractAddress = "0x8abA1966CDF5249eFFb6eeb6fb06E1D48A3e2aB5";
            const contractABI = abi.abi;
            try {
                const { ethereum } = window;
                const account = await ethereum.request({
                    method: "eth_requestAccounts"
                })
                window.ethereum.on("accountsChanged", () => {
                    window.location.reload()
                })
                const provider = new ethers.providers.Web3Provider(ethereum) // read the blockchain
                const signer = provider.getSigner() // write the blockchain signer
                const contract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                )
                console.log(contract)
                setState({ provider, signer, contract })
            } catch (error) {
                alert(error.message)
                console.log(error)
            }
        }
        template()
    }, []);

    

    return (
        <AppContext.Provider value={{ userData, state, authUser, setAuthUser}}> {/* Truyền userData qua Context */}
            {children}
        </AppContext.Provider>
    );
};
