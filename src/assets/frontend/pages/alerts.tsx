import React, { useState } from 'react';
import { replace, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
// @ts-ignore: No declaration file for module '../../backend/firebaseConfig/config'
import { auth } from '../../backend/firebaseConfig/config';

const Alerts: React.FC = () => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        
    });
    const [error, setError] = useState<string>();

    const nextPage = () => {
      navigate("./finish");
      replace("./finish");
    };

    

    return (
        <>
            
        </>
    )
};

export default Alerts;