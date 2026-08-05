import React, { useState } from 'react';
import { replace, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
// @ts-ignore: No declaration file for module '../../backend/firebaseConfig/config'
import { auth } from '../../../backend/firebaseConfig/config';
import styles from "../../styles/RegisterWorkflowStyles/Finish.module.css";

const Finish: React.FC = () => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        
    });
    const [error, setError] = useState<string>();

    const nextPage = (path: string) => {
      navigate("/" + path);
    };

    

    return (
        <div className={styles.pageContainer}>
            <div className={styles.cardWrapper}>
                
                <div className={styles.iconContainer}>
                <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.checkIcon}
                >
                    <path 
                    d="M20 6L9 17L4 12" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    />
                </svg>
                </div>

                <h1 className={styles.title}>You are set up, Khanyisile.</h1>
                <p className={styles.subtitle}>
                Your budget is live. Add your first expense and the dashboard starts filling in.
                </p>

                <div className={styles.statsContainer}>
                <div className={styles.statBox}>
                    <span className={styles.statLabel}>Monthly income</span>
                    <span className={styles.statValue}>R 6 700</span>
                </div>
                <div className={styles.statBox}>
                    <span className={styles.statLabel}>Monthly limit</span>
                    <span className={styles.statValue}>R 6 000</span>
                </div>
                <div className={`${styles.statBox} ${styles.noBorder}`}>
                    <span className={styles.statLabel}>Weekly limit</span>
                    <span className={`${styles.statValue} ${styles.highlightedValue}`}>R 1 500</span>
                </div>
                </div>

                <div className={styles.actionGroup}>
                <button type="button" className={styles.primaryButton} onClick={() => nextPage("dashboard")}>
                    Go to my dashboard
                </button>
                <a href="#change-budget" className={styles.textLink} onClick={() => nextPage("budget")}>
                    Change my budget
                </a>
                </div>

            </div>
        </div>
    )
};

export default Finish;