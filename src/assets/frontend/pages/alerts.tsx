import React, { useEffect, useState } from 'react';
import styles from "../styles/Alerts.module.css";
import { collection, getDocs, query, where, type Timestamp, orderBy, getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// @ts-ignore
import { db } from "../../backend/firebaseConfig/config";

type Alerts = {
  id: string,
  status: string,
  title: string,
  description: string
  createdAt: Timestamp
}

/*
const alertsData = [
  {
    status: 'warning',
    title: 'Food budget at 84%',
    time: 'Just now',
    description: 'You have spent R 620 of R 1 800 allocated to food but three weeks remain. Consider slowing down.'
  },
  {
    status: 'info',
    title: 'Large expense recorded',
    time: '2 hours ago',
    description: 'A textbook purchase of R 300 was added to education, above your R 250 large expense threshold.'
  },
  {
    status: 'danger',
    title: 'Weekly limit reached',
    time: 'Yesterday',
    description: 'Week three spending hit R 1 500. Spending from here comes out of next week.'
  },
  {
    status: 'success',
    title: 'NSFAS allowance received',
    time: '3 days ago',
    description: 'R 5 200 was added to your income for October. Your weekly limit was recalculated.'
  },
  {
    status: 'success',
    title: 'Data budget on track',
    time: '5 days ago',
    description: 'You are at 50% of your data and airtime allocation halfway through the month.'
  }
];
*/

const settingsData = [
  {
    title: 'Email notifications',
    description: 'Weekly summary each Monday',
    defaultChecked: true
  },
  {
    title: 'Large expense alerts',
    description: 'Anything above R 250',
    defaultChecked: true
  },
  {
    title: 'Budget limit alerts',
    description: 'Category and monthly totals',
    defaultChecked: true
  },
  {
    title: 'Financial tip of the day',
    description: 'One short tip each morning',
    defaultChecked: false
  }
];

const Alerts: React.FC = () => {

  const [warningLevel, setWarningLevel] = useState<number>(80);
  const [userAlerts, setUserAlerts] = useState<Alerts[]>([]);

  const getUserAlerts = async () => {

    try {

      const uid = getAuth().currentUser?.uid;
      const ref = collection(db, "alerts");
      const alertsQuery = query(ref, 
        where("userId", "==", uid),
        orderBy("createdAt", "desc"),
      )

      const alertSnapshot = await getDocs(alertsQuery);

      const data = alertSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setUserAlerts(data as any || []);


    } catch (e) {

      console.log("Error occured while trying fetch user alerts. Error: " + e);

    }

  }

  const getUserWarningLevel = async () => {

    try {

      const uid = getAuth().currentUser?.uid;
      if (!uid) return;
      const ref = doc(db, "users", uid);
      const snapshot = await getDoc(ref);

      const data = snapshot.data();

      setWarningLevel((data as any)?.warningLevel as number || 80)


    } catch (e) {

      console.log("Error occured while trying fetch user warning level. Error: " + e);

    }

  }

  useEffect(() => {

    try {

      getUserAlerts();
      getUserWarningLevel();

    } catch (e) {

      console.log("Error occured while trying fetch user alerts. Error: " + e);

    }

  }, []);



  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Alerts and notifications</h1>
        <button className={styles.markReadBtn}>Mark all as read</button>
      </header>

      <div className={styles.layout}>
        {/* Left Column: Alerts List */}
        <div className={styles.alertsCard}>
          
          {/*
            {alertsData.map((alert, index) => (
              <div key={index} className={styles.alertItem}>
                <div className={styles.alertHeader}>
                  <div className={styles.titleGroup}>
                    <span className={`${styles.statusDot} ${styles[alert.status]}`}></span>
                    <h3 className={styles.alertTitle}>{alert.title}</h3>
                  </div>
                  <span className={styles.alertTime}>{alert.time}</span>
                </div>
                <p className={styles.alertDescription}>{alert.description}</p>
              </div>
            ))}
          */}

          {userAlerts.length !== 0 ? (
            <>
            {userAlerts.map((alert, index) => (
              <div key={index} className={styles.alertItem}>
                <div className={styles.alertHeader}>
                  <div className={styles.titleGroup}>
                    <span className={`${styles.statusDot} ${styles[alert.status]}`}></span>
                    <h3 className={styles.alertTitle}>{alert.title}</h3>
                  </div>
                  <span className={styles.alertTime}>{alert.createdAt?.toDate ? alert.createdAt.toDate().toLocaleDateString() : ''}</span>
                </div>
                <p className={styles.alertDescription}>{alert.description}</p>
              </div>
            ))}
            </>
          )
          : 
          (
            <>
              <div>
                No alerts
              </div>
            </>
          )
          }

        </div>

        {/* Right Column: Settings */}
        <div className={styles.settingsCard}>
          <h2 className={styles.settingsTitle}>Notification settings</h2>
          
          <div className={styles.settingsList}>
            {settingsData.map((setting, index) => (
              <div key={index} className={styles.toggleRow}>
                <div className={styles.toggleText}>
                  <h4 className={styles.toggleTitle}>{setting.title}</h4>
                  <p className={styles.toggleDescription}>{setting.description}</p>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" defaultChecked={setting.defaultChecked} />
                  <span className={styles.slider}></span>
                </label>
              </div>
            ))}
          </div>

          <hr className={styles.divider} />

          <div className={styles.warningLevelSection}>
            <h4 className={styles.warningLevelTitle}>Warning level</h4>
            <div className={styles.warningBarGroup}>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: `${warningLevel}%` }}></div>
              </div>
              <span className={styles.warningPercentage}>{warningLevel}%</span>
            </div>
            <p className={styles.warningDescription}>
              You are alerted once a category or your monthly budget reaches this level.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;