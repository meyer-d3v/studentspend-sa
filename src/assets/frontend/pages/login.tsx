import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
// @ts-ignore: No declaration file for module '../../backend/firebaseConfig/config'
import { auth } from '../../backend/firebaseConfig/config';
import styles from "../styles/Login.module.css";

const Login: React.FC = () => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState<string>();

    const nextPage = () => {
      navigate("/account");
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
            <div className={styles.loginCard}>

            {error && (
                <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}
            
            <div className={styles.logoGroup}>
                <div className={styles.logoIcon}></div>
                <span className={styles.logoText}>StudentSpend SA</span>
            </div>

            <div className={styles.headerText}>
                <h1 className={styles.title}>Welcome back</h1>
                <p className={styles.subtitle}>Log in to pick up where you left off.</p>
            </div>

            <form className={styles.form}>
                <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>Email or student number</label>
                <input 
                    type="text" 
                    id="email" 
                    className={styles.input} 
                    defaultValue="k.majiba@mycput.ac.za" 
                />
                </div>

                <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input 
                    type="password" 
                    id="password" 
                    className={styles.input} 
                    defaultValue="............" 
                />
                </div>

                <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} defaultChecked />
                    <span className={styles.checkboxText}>Keep me logged<br/>in</span>
                </label>
                <a href="#forgot" className={styles.forgotLink}>Forgot password?</a>
                </div>

                <button type="button" className={styles.submitButton}>Log in</button>
            </form>

            <div className={styles.footer}>
                <span className={styles.footerText}>New here? </span>
                <div className={styles.createLink} onClick={() => nextPage()}>Create an account</div>
            </div>
            
            </div>
        </div>
    )
};

export default Login;