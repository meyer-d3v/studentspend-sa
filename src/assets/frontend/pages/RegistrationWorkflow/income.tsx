import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore: No declaration file for module '../../backend/firebaseConfig/config'
import { db, auth } from '../../../backend/firebaseConfig/config';
import { updateDoc, doc } from 'firebase/firestore';
import styles from "../../styles/RegisterWorkflowStyles/Income.module.css";
import { LoaderCircle } from 'lucide-react';
import { getAuth } from 'firebase/auth';

const Income: React.FC = () => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        nsfasAllowance: 0,
        partTimeWork: 0,
        familySupport: 0,
    });

    const uid = getAuth().currentUser?.uid;

    const [error, setError] = useState<string>();
    const [redirectTimeLeft, setRedirectTimeLeft] = useState<number>(5);
    const [loading, setLoading] = useState<boolean>(false);


    const updateUserData = async () => {

        try {

            setLoading(true);

            if (uid) {

                const ref = doc(db, "users", uid);

                await updateDoc(ref, {
                    income: {
                        nsfasAllowance: userData.nsfasAllowance,
                        partTimeWork: userData.partTimeWork,
                        familySupport: userData.familySupport,
                        totalIncome: (userData.nsfasAllowance + userData.partTimeWork + userData.familySupport)
                    },
                });

            }

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


    useEffect(() => {
    
        console.log(uid);

        if (uid) return;
    
        if (redirectTimeLeft === 0) {
            navigate("/", { replace: true });
            return;
        }
    
        const timerId = setTimeout(() => {
            setRedirectTimeLeft((prev) => prev - 1);
            // Remove the dynamic setError from here. 
            // Just set the static error state once if needed.
            setError("Unauthorized access"); 
        }, 1000);
    
        return () => clearTimeout(timerId);
    
    }, [redirectTimeLeft, uid, navigate]);

    

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
                            type="number" 
                            className={styles.amountInput} 
                            value={userData.nsfasAllowance || ""}
                            onChange={(e) => setUserData((prev) => ({
                                ...prev,
                                nsfasAllowance: e.target.valueAsNumber || 0
                            }))}
                            placeholder="0" 
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
                                type="number" 
                                className={styles.amountInput} 
                                value={userData.partTimeWork || ""}
                                onChange={(e) => setUserData((prev) => ({
                                    ...prev,
                                    partTimeWork: e.target.valueAsNumber || 0
                                }))}
                                placeholder="0" 
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
                                type="number" 
                                className={styles.amountInput} 
                                value={userData.familySupport  || ""}
                                onChange={(e) => {

                                    console.log(e.target.valueAsNumber)
                                    console.log(typeof e.target.valueAsNumber)
                                    
                                    setUserData((prev) => ({
                                        ...prev,
                                        familySupport: e.target.valueAsNumber || 0
                                    }))

                                    console.log(userData.familySupport)
                                }}
                                placeholder="0" 
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
                            <LoaderCircle size={16} className={`loaderCircle`}/>
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