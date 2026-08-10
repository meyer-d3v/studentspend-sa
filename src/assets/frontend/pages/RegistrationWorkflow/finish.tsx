import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore: No declaration file for module '../../backend/firebaseConfig/config'
import { db, auth } from '../../../backend/firebaseConfig/config';
import styles from "../../styles/RegisterWorkflowStyles/Finish.module.css";
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Finish: React.FC = () => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: "",
        monthlyIncome: 0,
        monthlyLimit: 0,
        weeklyLimit: 0,
    });

    const [error, setError] = useState<string>("");

    const nextPage = (path: string) => {
      navigate("/" + path);
    };


    useEffect(() => {
    
        const fetchUserDetails = async () => {
        
            try {
                const uid = getAuth().currentUser?.uid || "";
                const otpRef = doc(db, "users", uid);
                const otpSnap = await getDoc(otpRef);

                if (!otpSnap.exists()) {
                    console.error("Error occured: No database document found");
                    setError("Error occured: No database document found");
                    return;
                }

                const data = otpSnap.data() as { 
                    firstName?: string,
                    email?: string, 
                    income?: { 
                        totalIncome?: number 
                    },
                    limits?: {
                        monthlyLimit? : number,
                        weeklyLimit? : number
                    }
                };

                setUserData((prev) => ({
                    ...prev,
                    name: data?.firstName || "",
                    monthlyIncome: data.income?.totalIncome || 0,
                    monthlyLimit: data.limits?.monthlyLimit || 0,
                    weeklyLimit: data.limits?.weeklyLimit || 0
                }));

            } catch (e) {
                setError("Error occured: " + e);
            }
        };

        fetchUserDetails();

    }, []);
    

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

                <h1 className={styles.title}>You are set up, {userData.name}.</h1>
                <p className={styles.subtitle}>
                    Your budget is live. Add your first expense and the dashboard starts filling in.
                </p>

                <div className={styles.statsContainer}>
                <div className={styles.statBox}>
                    <span className={styles.statLabel}>Monthly income</span>
                    <span className={styles.statValue}>R {userData.monthlyIncome}</span>
                </div>
                <div className={styles.statBox}>
                    <span className={styles.statLabel}>Monthly limit</span>
                    <span className={styles.statValue}>R {userData.monthlyLimit}</span>
                </div>
                <div className={`${styles.statBox} ${styles.noBorder}`}>
                    <span className={styles.statLabel}>Weekly limit</span>
                    <span className={`${styles.statValue} ${styles.highlightedValue}`}>R {userData.weeklyLimit}</span>
                </div>
                </div>

                {error && (
                    <div className={styles.errorMessage} style={{ color: 'red', marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}

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