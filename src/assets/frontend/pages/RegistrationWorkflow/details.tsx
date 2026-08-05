import React, { useState } from 'react';
import { replace, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
// @ts-ignore: No declaration file for module '../../backend/firebaseConfig/config'
import { auth } from '../../../backend/firebaseConfig/config';
import styles from "../../styles/RegisterWorkflowStyles/Details.module.css";

const Details: React.FC = () => {

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
                
                <div className={styles.stepIndicator}>STEP 2 OF 5</div>
                <h1 className={styles.title}>Tell us about you</h1>
                <p className={styles.subtitle}>This is what we will greet you with on the dashboard.</p>

                <form className={styles.form}>
                
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                    <label htmlFor="firstName" className={styles.label}>
                        First name
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        className={styles.input}
                        defaultValue="Khanyisile"
                    />
                    </div>
                    <div className={styles.inputGroup}>
                    <label htmlFor="surname" className={styles.label}>
                        Surname
                    </label>
                    <input
                        type="text"
                        id="surname"
                        className={styles.input}
                        defaultValue="Majiba"
                    />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="institution" className={styles.label}>
                    Institution
                    </label>
                    <input
                    type="text"
                    id="institution"
                    className={styles.input}
                    defaultValue="Cape Peninsula University of Technology"
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                    <label htmlFor="yearOfStudy" className={styles.label}>
                        Year of study
                    </label>
                    <input
                        type="text"
                        id="yearOfStudy"
                        className={styles.input}
                        defaultValue="Second year"
                    />
                    </div>
                    <div className={styles.inputGroup}>
                    <label htmlFor="cityOrCampus" className={styles.label}>
                        City or campus
                    </label>
                    <input
                        type="text"
                        id="cityOrCampus"
                        className={styles.input}
                        defaultValue="D6, Cape Town"
                    />
                    </div>
                </div>

                <div className={styles.actionGroup}>
                    <button type="button" className={styles.primaryButton} onClick={() => nextPage("verification")}>
                    Continue
                    </button>
                    <button type="button" className={styles.secondaryButton} onClick={() => nextPage("account")}>
                    Back
                    </button>
                </div>

                </form>
            </div>
        </div>
    )
};

export default Details;