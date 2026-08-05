import React, { useState } from 'react';
import { replace, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
// @ts-ignore: No declaration file for module '../../backend/firebaseConfig/config'
import { auth } from '../../../backend/firebaseConfig/config';
import styles from "../../styles/RegisterWorkflowStyles/Verification.module.css";

const Verification: React.FC = () => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        
    });
    const [error, setError] = useState<string>();

    const nextPage = (path: string) => {
        navigate("/" + path);
    };

    

    return (
        <div className={styles.pageContainer}>
            <div className={styles.formWrapper}>
                
                <div className={styles.stepIndicator}>STEP 3 OF 5</div>
                <h1 className={styles.title}>Enter your verification code</h1>
                <p className={styles.subtitle}>We sent a six digit code to k.majiba@mycput.ac.za</p>

                <form className={styles.form}>
                
                <div className={styles.otpGroup}>
                    <input type="text" maxLength={1} className={`${styles.otpInput} ${styles.filled}`} defaultValue="4" />
                    <input type="text" maxLength={1} className={`${styles.otpInput} ${styles.filled}`} defaultValue="7" />
                    <input type="text" maxLength={1} className={`${styles.otpInput} ${styles.filled}`} defaultValue="2" />
                    <input type="text" maxLength={1} className={`${styles.otpInput} ${styles.filled}`} defaultValue="9" />
                    <input type="text" maxLength={1} className={`${styles.otpInput} ${styles.filled}`} defaultValue="0" />
                    <input type="text" maxLength={1} className={styles.otpInput} autoFocus />
                </div>

                <div className={styles.resendText}>
                    Did not get it? <a href="#resend" className={styles.resendLink}>Send the code again</a> in 0:24
                </div>

                <div className={styles.actionGroup}>
                    <button type="button" className={styles.primaryButton} onClick={() => nextPage("income")}>
                    Verify and continue
                    </button>
                    <button type="button" className={styles.secondaryButton} onClick={() => nextPage("details")}>
                    Back
                    </button>
                </div>

                </form>
            </div>
        </div>
    )
};

export default Verification;