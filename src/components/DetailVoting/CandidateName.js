import React from 'react';
import { useEffect } from 'react';
import { database, storage } from "firebase.js";


import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set, onValue, query, orderByChild, equalTo, child, get } from "firebase/database";



const CandidateName = (canId) => {

    const [candidateName, setCandidateName] = React.useState("");
    useEffect(() => {
        const loadCandidates = () => {
            const candidatesRef = query(dbRef(database, `candidates/${canId}`));
            onValue(candidatesRef, (snapshot) => {
                const candidatesData = snapshot.val();
                if (candidatesData) {
                    const candidate = Object.values(candidatesData);
                    setCandidateName(candidate.name);
                    // console.log(filteredCandidates);
                    console.log(candidate)
                } else {

                }
            });
        }
        loadCandidates();
    }, []);
    return (
        <div>
            {candidateName ? (
                { candidateName }
            ) :
                "Candidate not found"}

        </div>
    );
};

export default CandidateName;