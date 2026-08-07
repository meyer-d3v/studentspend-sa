import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, replace } from 'react-router-dom';
// @ts-ignore: No declaration file for module '../../backend/firebaseConfig/config'
import { db, auth } from '../../../backend/firebaseConfig/config';
import { updateDoc, doc } from 'firebase/firestore';
import styles from "../../styles/RegisterWorkflowStyles/Income.module.css";
import { LoaderCircle } from 'lucide-react';

const Income: React.FC = () => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        nsfasAllowance: 0,
        partTimeWork: 0,
        familySupport: 0,
        totalIncome: 0
    });

    const location = useLocation();
    const uid = location.state?.criticalData;

    const [error, setError] = useState<string>();
    const [redirectTimeLeft, setRedirectTimeLeft] = useState<number>(5);
    const [loading, setLoading] = useState<boolean>(false);


    const updateUserData = async () => {

        try {

            setLoading(true);

            const ref = doc(db, "users", uid);

            await updateDoc(ref, {
                nsfasAllowance: userData.nsfasAllowance,
                partTimeWork: userData.partTimeWork,
                familySupport: userData.familySupport,
                totalIncome: (userData.nsfasAllowance + userData.familySupport + userData.partTimeWork) 
            })

            const criticalData = { 
                uid: uid,
                monthlyIncome: (userData.nsfasAllowance + userData.partTimeWork + userData.familySupport)
            };

            navigate("/budget", { state: criticalData });

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
                
                <div className={styles.stepIndicator}>STEP 4 OF 5</div>
                <h1 className={styles.title}>What comes in each month?</h1>
                <p className={styles.subtitle}>Your budget is built from this figure.</p>

                <form className={styles.form}>
                
                <div className={styles.incomeList}>
                    
                    {/* NSFAS Allowance Item */}
                    <div className={styles.incomeItem}>
                    <div className={styles.itemDetails}>
                        <h4 className={styles.itemTitle}>NSFAS allowance</h4>
                        <p className={styles.itemDescription}>Living and personal care, paid monthly</p>
                    </div>
                    <div className={styles.inputWrapper}>
                        <span className={styles.currencySymbol}>R</span>
                        <input 
                            type="text" 
                            className={styles.amountInput} 
                            onChange={(e) => setUserData((prev) => ({
                                ...prev,
                                nsfasAllowance: parseInt(e.target.value.trim())
                            }))}
                            defaultValue="0" 
                        />
                    </div>
                    </div>

                    {/* Part-time Work Item */}
                    <div className={styles.incomeItem}>
                    <div className={styles.itemDetails}>
                        <h4 className={styles.itemTitle}>Part-time work</h4>
                        <p className={styles.itemDescription}>Tutoring, retail, campus jobs</p>
                    </div>
                    <div className={styles.inputWrapper}>
                        <span className={styles.currencySymbol}>R</span>
                        <input 
                            type="text" 
                            className={styles.amountInput} 
                            onChange={(e) => setUserData((prev) => ({
                                ...prev,
                                partTimeWork: parseInt(e.target.value.trim())
                            }))}
                            defaultValue="0" 
                        />
                    </div>
                    </div>

                    {/* Family Support Item */}
                    <div className={styles.incomeItem}>
                    <div className={styles.itemDetails}>
                        <h4 className={styles.itemTitle}>Family support</h4>
                        <p className={styles.itemDescription}>Money sent from home</p>
                    </div>
                    <div className={styles.inputWrapper}>
                        <span className={styles.currencySymbol}>R</span>
                        <input 
                            type="text" 
                            className={styles.amountInput} 
                            onChange={(e) => setUserData((prev) => ({
                                ...prev,
                                familySupport: parseInt(e.target.value.trim())
                            }))}
                            defaultValue="0" 
                        />
                    </div>
                    </div>

                </div>

                {/* Total Summary Box */}
                <div className={styles.totalBox}>
                    <span className={styles.totalLabel}>Total monthly income</span>
                    <span className={styles.totalAmount}>R {userData.nsfasAllowance + userData.partTimeWork + userData.familySupport}</span>
                </div>

                {error && (
                    <div className={styles.errorMessage} style={{ color: 'red', marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}

                <div className={styles.actionGroup}>
                    <button type="button" className={styles.primaryButton} onClick={() => updateUserData()}>
                        {loading ? (
                            <LoaderCircle size={16} />
                        )
                        :
                        (
                            <>Continue</>
                        )}
                    </button>
                    <button type="button" className={styles.secondaryButton} onClick={() => navigate("/verification")}>
                        Back
                    </button>
                </div>

                </form>
            </div>
        </div>
    )
};

export default Income;