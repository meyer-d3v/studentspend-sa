import React, { useEffect, useState } from 'react';
import styles from "../styles/Settings.module.css";
import { getAuth } from 'firebase/auth';
import { replace, useNavigate } from 'react-router-dom';
// @ts-ignore
import { db } from "../../backend/firebaseConfig/config";
import { getDoc, doc, updateDoc } from 'firebase/firestore';

type User = {
  firstname: string,
  lastname: string,
  email: string,
  institution: string,
  yearOfStudy: string,
  cityCampus: string,
  income: {
    nsfasAllowance: number,
    partTimeWork: number,
    familySupport: number,
    totalIncome: number,
  }
}

const Settings: React.FC = () => {

  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    institution: "",
    yearOfStudy: "",
    cityCampus: "",
    income: {
      nsfasAllowance: 0,
      partTimeWork: 0,
      familySupport: 0,
      totalIncome: 0,
    }
  }); 

  const navigate = useNavigate();
  const uid = getAuth().currentUser?.uid || "";

  const updateUserData = async () => {

    try {

      const ref = doc(db, "users", uid);

      await updateDoc(ref, {
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        institution: userData.institution,
        yearOfStudy: userData.yearOfStudy,
        cityCampus: userData.cityCampus,
      });

      console.log("User data updated");


    } catch (e) {

      console.log("Error occured" + e);

    }

  }

  const deactivateAccount = async () => {

    try {


      const ref = doc(db, "users", uid);

      await updateDoc(ref, {
        isActive: false
      });

      signUserOut();

      console.log("User account has been deactivated");


    } catch (e) {

      console.log("User account cound not be deactivated");

    }

  }

  const resetUserData = async () => {

    try {

      await getUserData();

      console.log("User data has been reset");

    } catch (e) {

      console.log("User data could not be resetted");

    }

  }

  const signUserOut = async () => {

    try {

      getAuth().signOut;
      console.log("User logging out");
      replace("/");
      return;

    } catch (e) {

      console.log("Could not sign user out");

    }

  }

  const getUserData = async () => {

    try {

      if (!uid) {

        console.log("User not logged in");
        navigate("/");
        return;

      }

      const ref = doc(db, "users", uid);
      const snapshot = await getDoc(ref);

      const data = snapshot.data() as User;

      setUserData((prev) => ({
        ...prev,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        institution: data.institution,
        yearOfStudy: data.yearOfStudy,
        cityCampus: data.cityCampus,
        income: {
          nsfasAllowance: data.income.nsfasAllowance,
          partTimeWork: data.income.partTimeWork,
          familySupport: data.income.familySupport,
          totalIncome: data.income.totalIncome,
        }
      }))



    } catch (e) {

      console.log("Error occured: " + e);

    }

  }


  useEffect(() => {

    getUserData();

  }, []);

  

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Account</h1>

      <div className={styles.layout}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          
          {/* Profile Details Card */}
          <div className={styles.card}>
            <div className={styles.profileHeader}>
              <div className={styles.avatar}>{userData.firstname !== "" ? (userData.firstname?.charAt(0) + userData.lastname?.charAt(0)) : ""}</div>
              <div className={styles.profileInfo}>
                <h2 className={styles.profileName}>{userData.firstname}</h2>
                {/*<p className={styles.profileStudentNum}>Student number 000000000</p>*/}
              </div>
              <button className={styles.linkBtn}>Change photo</button>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  disabled={true}
                  value={userData.email}
                  placeholder="email@gmail.com" 
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label className={styles.label}>Institution</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={userData.institution}
                  onChange={(e) => setUserData((prev) => ({
                    ...prev,
                    institution: e.target.value
                  }))}
                  placeholder="CPUT" 
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Year of study</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={userData.yearOfStudy}
                  onChange={(e) => setUserData((prev) => ({
                    ...prev,
                    yearOfStudy: e.target.value
                  }))}
                  placeholder="Second year" 
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>City or campus</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={userData.cityCampus}
                  onChange={(e) => setUserData((prev) => ({
                    ...prev,
                    cityCampus: e.target.value
                  }))}
                  placeholder="District 6, Cape Twon" 
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button className={styles.primaryBtn} onClick={() => updateUserData()}>Save changes</button>
              <button className={styles.secondaryBtn} onClick={() => resetUserData()}>Cancel</button>
            </div>
          </div>

          {/* Income Sources Card */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Income sources</h3>
            
            <div className={styles.incomeList}>
              <div className={styles.incomeRow}>
                <span className={styles.incomeLabel}>NSFAS allowance</span>
                <span className={styles.incomeValue}>R {userData.income.nsfasAllowance}</span>
              </div>
              <div className={styles.incomeRow}>
                <span className={styles.incomeLabel}>Part-time work</span>
                <span className={styles.incomeValue}>R {userData.income.partTimeWork}</span>
              </div>
              <div className={styles.incomeRow}>
                <span className={styles.incomeLabel}>Family support</span>
                <span className={styles.incomeValue}>R {userData.income.familySupport}</span>
              </div>
            </div>

            <div className={styles.incomeTotal}>
              <span className={styles.totalLabel}>Total monthly income</span>
              <span className={styles.totalValue}>R {userData.income.totalIncome}</span>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          
          {/* Security Card */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Security</h3>
            
            <div className={styles.securityList}>
              <div className={styles.securityRow}>
                <div className={styles.securityInfo}>
                  <h4 className={styles.securityItemTitle}>Two-step authentication</h4>
                  <p className={`${styles.securityItemDesc} ${styles.textGreen}`}>On, by email</p>
                </div>
                <button className={styles.linkBtn}>Manage</button>
              </div>

              <div className={styles.securityRow}>
                <div className={styles.securityInfo}>
                  <h4 className={styles.securityItemTitle}>Password</h4>
                  <p className={styles.securityItemDesc}>Last changed 12 August 2026</p>
                </div>
                <button className={styles.linkBtn}>Change</button>
              </div>

              <div className={styles.securityRow}>
                <div className={styles.securityInfo}>
                  <h4 className={styles.securityItemTitle}>Signed-in devices</h4>
                  <p className={styles.securityItemDesc}>Two active sessions</p>
                </div>
                <button className={styles.linkBtn}>Review</button>
              </div>
            </div>
          </div>

          {/* Your Data Card */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Your data</h3>
            <p className={styles.dataText}>
              Your records are visible to you only. Download everything as a spreadsheet, or close the account and remove it.
            </p>
            
            <div className={styles.dataActions}>
              <button className={styles.outlineBtn}>
                Download my<br/>data
              </button>
              <button className={styles.dangerBtn} onClick={() => deactivateAccount()}>
                Deactivate<br/>account
              </button>
            </div>
          </div>

          {/* Log Out Button */}
          <button className={styles.logoutBtn} onClick={() => signUserOut()}>Log out</button>

        </div>
      </div>
    </div>
  );
};

export default Settings;