import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
// @ts-ignore: No declaration file for module '../../backend/firebaseConfig/config'
import { auth, db } from '../../backend/firebaseConfig/config';
import styles from "../styles/Login.module.css";
import { LoaderCircle } from 'lucide-react';

const Login: React.FC = () => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const nextPage = (path: string) => {

      navigate("/" + path);

    };

    const logUserIn = async () => { 

        try {

            console.log("Tester");

            setLoading(true);

            await signInWithEmailAndPassword(auth, userData.email, userData.password);

            if (auth.currentUser?.emailVerified) {

                console.log("User is verified, let them in!");

                //check if user has done the complete registration workflow
                if (await fetchUserEmailStatus() == true) {
                    navigate("/dashboard");
                } else {
                    navigate("/income");
                }

            } else {
                console.log("Still waiting for verification...");
                navigate("/verification");
                return;
            }
            
            
        } catch (e) {

            setError("Error occured: " + e);

        } finally {

            setLoading(false);

        }

    }



    const fetchUserEmailStatus = async (): Promise<boolean> => {
            
        try {
            const uid = getAuth().currentUser?.uid || "";
            const otpRef = doc(db, "users", uid);
            const otpSnap = await getDoc(otpRef);

            if (!otpSnap.exists()) {
                console.error("Error occured: No database document found");
                setError("Error occured: No database document found");
                return false;
            }

            const data = otpSnap.data() as { isVerified?: boolean  };

            if (data.isVerified) {

                return true;

            } else {

                return false;

            }

        } catch (e) {

            setError("Error occured: " + e);
            return false;

        }
    };
    

    return (

        <div className={styles.pageContainer}>
            <div className={styles.loginCard}>
            
            <div className={styles.logoGroup}>
                <div className={styles.logoIcon}></div>
                <span className={styles.logoText}>StudentSpend SA</span>
            </div>

            <div className={styles.headerText}>
                <h1 className={styles.title}>Welcome back</h1>
                <p className={styles.subtitle}>Log in to pick up where you left off.</p>
            </div>

            <form className={styles.form} onSubmit={() => logUserIn()}>
                <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input 
                        type="text" 
                        id="email" 
                        className={styles.input} 
                        onChange={(e) => setUserData((prev) => ({
                            ...prev,
                            email: e.target.value
                        }))} 
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        className={styles.input} 
                        onChange={(e) => setUserData((prev) => ({
                            ...prev,
                            password: e.target.value
                        }))}
                    />
                </div>

                <div className={styles.formOptions}>
                    <label className={styles.checkboxLabel}>
                        <input type="checkbox" className={styles.checkbox} defaultChecked />
                        <span className={styles.checkboxText}>Keep me logged<br/>in</span>
                    </label>
                    <a href="#forgot" className={styles.forgotLink}>Forgot password?</a>
                </div>

                <button type="button" className={styles.submitButton} onClick={() => logUserIn()}>
                    {loading ? (
                        <LoaderCircle size={18} className={`loaderCircle`} />
                    )
                    :
                    (
                        <>Log in</>
                    )}
                </button>

            </form>

            {error && (
                <div className={styles.errorMessage} style={{ color: 'red', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            <div className={styles.footer}>
                <span className={styles.footerText}>New here? </span>
                <div className={styles.createLink} onClick={() => nextPage("account")}>Create an account</div>
            </div>
            
            </div>
        </div>
    )
};

export default Login;