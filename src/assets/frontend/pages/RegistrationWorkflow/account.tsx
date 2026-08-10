import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
// @ts-ignore: No declaration file for module '../../backend/firebaseConfig/config'
import { db, auth } from '../../../backend/firebaseConfig/config';
import styles from "../../styles/RegisterWorkflowStyles/Account.module.css";
import { LoaderCircle } from 'lucide-react';

const Account: React.FC = () => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        terms: true
    });
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const validatePassword = () => {

        if (userData.password != userData.confirmPassword) {
            return false;
        }

        return true;

    }

    const createUser = async () => { 

        try {

            setLoading(true);

            if (!validatePassword()) return setError("Password do not match");
            
            const response = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
            
            console.log(response);

            

            const userDataPayload = {
                email: userData.email,
                terms: true,
                isActive: true,
                isVerified: false,
            }

            const ref = doc(db, "users", response.user.uid);

            await setDoc(ref, userDataPayload);

            const criticalData = {uid: response.user.uid}

            navigate("/details", { state: criticalData });

            
            
        } catch (e) {

            setError("Error occured: " + e);

        } finally {

            setLoading(false);

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
                        onChange={(e) => setUserData((prev) => ({
                            ...prev,
                            email: e.target.value
                        }))}
                        placeholder="d.meyer@student.ac.za"
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
                        onChange={(e) => setUserData((prev) => ({
                            ...prev,
                            password: e.target.value
                        }))}
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
                        onChange={(e) => setUserData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value
                        }))}
                    />
                    </div>
                </div>

                <div className={styles.checkboxGroup}>
                    <input 
                        type="checkbox" 
                        id="terms" 
                        className={styles.checkbox} 
                        required={true}
                        onChange={(e) => setUserData((prev) => ({
                            ...prev,
                            terms: e.target.checked
                        }))}
                        defaultChecked 
                    />
                    <label htmlFor="terms" className={styles.checkboxLabel}>
                        I agree to the terms of use and to my financial data being stored<br />securely.
                    </label>
                </div>

                {error && (
                    <div className={styles.errorMessage} style={{ color: 'red', marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}

                <div className={styles.actionGroup}>
                    <button type="button" className={styles.primaryButton} disabled={!userData.terms} onClick={() => createUser()}>
                        {loading ? (
                            <LoaderCircle size={16} className={`loaderCircle`}/>
                        )
                        :
                        (
                            <>Continue</>
                        )}
                    </button>
                    <div className={styles.secondaryLink} onClick={() => navigate("/login")}>
                        I already have an account
                    </div>
                </div>

                </form>
            </div>
        </div>
    )
};

export default Account;