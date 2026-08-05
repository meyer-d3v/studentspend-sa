import React, { useState } from 'react';
import { replace, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
// @ts-ignore: No declaration file for module '../../backend/firebaseConfig/config'
import { auth } from '../../../backend/firebaseConfig/config';
import styles from "../../styles/RegisterWorkflowStyles/Account.module.css";

const Account: React.FC = () => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState<string>();

    const nextPage = (path: string) => {
      navigate("/" + path);
    };

    const getYear = () => {
      return new Date().getFullYear().toString();
    }

    const logUserIn = async () => { 

        try {

            const response = await signInWithEmailAndPassword(auth, userData.email, userData.password);

            if (response) {
                nextPage;
            }

            throw new Error("Could not sign in");
            
        } catch (e) {

            setError("Error occured: " + e);

        }

    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.formWrapper}>
                
                <div className={styles.stepIndicator}>STEP 1 OF 5</div>
                <h1 className={styles.title}>Create your account</h1>
                <p className={styles.subtitle}>Use your student email or your student number.</p>

                <form className={styles.form}>
                
                <div className={styles.inputGroup}>
                    <label htmlFor="studentId" className={styles.label}>
                    Student email or student number
                    </label>
                    <input
                    type="text"
                    id="studentId"
                    className={styles.input}
                    defaultValue="k.majiba@student.ac.za"
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className={styles.input}
                        defaultValue="............"
                    />
                    </div>
                    <div className={styles.inputGroup}>
                    <label htmlFor="confirmPassword" className={styles.label}>
                        Confirm password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className={styles.input}
                        defaultValue="............"
                    />
                    </div>
                </div>

                <div className={styles.checkboxGroup}>
                    <input 
                    type="checkbox" 
                    id="terms" 
                    className={styles.checkbox} 
                    defaultChecked 
                    />
                    <label htmlFor="terms" className={styles.checkboxLabel}>
                    I agree to the terms of use and to my financial data being stored<br />securely.
                    </label>
                </div>

                <div className={styles.actionGroup}>
                    <button type="button" className={styles.primaryButton} onClick={() => nextPage("details")}>
                    Continue
                    </button>
                    <div className={styles.secondaryLink} onClick={() => nextPage("login")}>
                        I already have an account
                    </div>
                </div>

                </form>
            </div>
        </div>
    )
};

export default Account;