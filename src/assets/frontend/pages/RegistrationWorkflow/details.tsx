import React, { useEffect, useState } from 'react';
import { replace, useLocation, useNavigate } from 'react-router-dom';
// @ts-ignore: No declaration file for module '../../backend/firebaseConfig/config'
import { db, auth } from '../../../backend/firebaseConfig/config';
import styles from "../../styles/RegisterWorkflowStyles/Details.module.css";
import { doc, updateDoc } from 'firebase/firestore';
import { LoaderCircle } from 'lucide-react';

const Details: React.FC = () => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        institution: "",
        yearOfStudy: "",
        cityCampus: "",
    });

    const location = useLocation();
    const uid = location.state?.criticalData;

    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [redirectTimeLeft, setRedirectTimeLeft] = useState<number>(5);

    const addUserData = async () => {

        try {

            setLoading(true);

            const ref = doc(db, "users", uid);

            await updateDoc(ref, {
                userData
            });

            const criticalData = { uid: uid };

            navigate("/verification", { state: criticalData });
            

        } catch (e) {

            setError("Error occured: " + e);

        } finally {

            setLoading(false);

        }

    }

    useEffect (() => {

        if (uid) return;

        if (redirectTimeLeft <= 0) {
                
            replace("/");
            return;
        
        }

        const timerId = setTimeout(() => {

            setRedirectTimeLeft((prev) => prev - 1);
            setError("Unauthorized access\nRedirecting in " + redirectTimeLeft);

        }, 5000);

        return () => clearTimeout(timerId);
        

    }, [redirectTimeLeft]);
  

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
                        onChange={(e) => setUserData((prev) => ({
                            ...prev,
                            firstName: e.target.value
                        }))}
                        defaultValue="Dean"
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
                        onChange={(e) => setUserData((prev) => ({
                            ...prev,
                            lastName: e.target.value
                        }))}
                        defaultValue="Meyer"
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
                        onChange={(e) => setUserData((prev) => ({
                            ...prev,
                            institution: e.target.value
                        }))}
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
                        onChange={(e) => setUserData((prev) => ({
                            ...prev,
                            yearOfStudy: e.target.value
                        }))}
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
                        onChange={(e) => setUserData((prev) => ({
                            ...prev,
                            cityCampus: e.target.value
                        }))}
                        defaultValue="D6, Cape Town"
                    />
                    </div>
                </div>

                {error && (
                    <div className={styles.errorMessage} style={{ color: 'red', marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}

                <div className={styles.actionGroup}>
                    <button type="button" className={styles.primaryButton} onClick={() => addUserData()}>
                        {loading ? (
                            <LoaderCircle size={16} />
                        )
                        :
                        (
                            <>Continue</>
                        )}
                    </button>
                    <button type="button" className={styles.secondaryButton} onClick={() => navigate("/account")}>
                        Back
                    </button>
                </div>

                </form>
            </div>
        </div>
    )
};

export default Details;