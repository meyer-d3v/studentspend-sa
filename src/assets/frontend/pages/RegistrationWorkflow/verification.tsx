import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore: No declaration file for module '../../backend/firebaseConfig/config'
import { auth, db } from '../../../backend/firebaseConfig/config';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import styles from "../../styles/RegisterWorkflowStyles/Verification.module.css";
import { LoaderCircle } from 'lucide-react';
import { getAuth } from 'firebase/auth';
//import { verifyCode } from '../../../backend/emailVerification/verifyEmail';
import { handleSendVerification } from '../../../backend/emailVerification/handleSendVerification';
//import { sendVerificationEmail } from '../../../backend/emailVerification/emailProvider';

const Verification: React.FC = () => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        email: "",
        uid: "",
        otp: "null",
        inputCode: ""
    });
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [countdown, setCountdown] = useState(24);



    
    const updateverificationStatus = async () => {

        try {

            const ref = doc(db, "users", userData.uid);

            await updateDoc(ref, {
                isVerified: true,
            });

        } catch (e) {

            console.log("Error occured: " + e);
            setError("Error occured: " + e);

        }

    }

    const verifyEmail = async () => {

        try {

            setLoading(true);

            // You often need to reload the user to get the latest status from the server
            await auth.currentUser?.reload();

            if (auth.currentUser?.emailVerified) {
                console.log("User is verified, let them in!");
                await updateverificationStatus();
                navigate("/income");
            } else {
                console.log("Still waiting for verification...");
                return;
            }

            

        } catch (e) {

            setError("Error occured: " + e);
            
        } finally {

            setLoading(false);

        }
    }    

    const sendVerification = async () => {

        setCountdown(30);
        handleSendVerification();

    }

    useEffect(() => {

        const fetchUserEmail = async () => {

            try {
                const uid = getAuth().currentUser?.uid || "";
                const otpRef = doc(db, "users", uid);
                const otpSnap = await getDoc(otpRef);

                if (!otpSnap.exists()) {
                    console.error("Error occured: No database document found");
                    setError("Error occured: No database document found");
                    return;
                }

                const data = otpSnap.data() as { email?: string };

                setUserData((prev) => ({
                    ...prev,
                    uid: uid,
                    email: data.email || ""
                }));
            } catch (e) {
                setError("Error occured: " + e);
            }
        };

        fetchUserEmail();
        sendVerification();

    }, []);

    // Simple countdown effect for the resend link timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <span className={styles.stepText}>STEP 3 OF 5</span>
                
                <h1 className={styles.title}>Verify your email address</h1>
                
                <p className={styles.subtitle}>
                    We sent a verification link to {userData.email}. <br />
                    Please check your inbox and click the link to verify your account.
                </p>

                <div className={styles.resendContainer}>
                    <span className={styles.resendText}>Did not get it? </span>
                    {countdown > 0 ? (
                        <span className={styles.resendWait}>
                            Send the link again in 0:{countdown.toString().padStart(2, '0')}
                        </span>
                    ) : (
                        <button className={styles.resendBtn} onClick={() => sendVerification()}>Send the link again</button>
                    )}
                </div>

                {error && (
                    <div className={styles.errorMessage} style={{ color: 'red', marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}

                <div className={styles.actionButtons}>
                    {/* Once they click the link in their email, they click this to proceed */}
                    <button className={styles.primaryBtn} onClick={() => verifyEmail()}>
                        {loading ? (
                            <LoaderCircle size={16} className={`loaderCircle`}/>
                        )
                        :
                        (
                            <>Continue</>
                        )}
                    </button>
                    <button className={styles.secondaryBtn} onClick={() => navigate("/details")}>Back</button>
                </div>
            </div>
        </div>
    )
};

export default Verification;