import { database } from "firebase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [userData, setUserData] = useState(null); // State để lưu trữ dữ liệu user

    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("user-voting")) || null);

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
        setAuthUser(JSON.parse(localStorage.getItem('user-voting')));
    }, [auth]);

    return (
        <AppContext.Provider value={{authUser, setAuthUser}}> {/* Truyền userData qua Context */}
            {children}
        </AppContext.Provider>
    );
};
