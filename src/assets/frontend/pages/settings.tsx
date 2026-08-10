import React from 'react';
import styles from "../styles/Settings.module.css";

const Settings: React.FC = () => {

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Account</h1>

      <div className={styles.layout}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          
          {/* Profile Details Card */}
          <div className={styles.card}>
            <div className={styles.profileHeader}>
              <div className={styles.avatar}>DM</div>
              <div className={styles.profileInfo}>
                <h2 className={styles.profileName}>Dean Meyer</h2>
                <p className={styles.profileStudentNum}>Student number 000000000</p>
              </div>
              <button className={styles.linkBtn}>Change photo</button>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  defaultValue="email@gmail.com" 
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label className={styles.label}>Institution</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  defaultValue="CPUT" 
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Year of study</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  defaultValue="Second year" 
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>City or campus</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  defaultValue="District 6, Cape Twon" 
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button className={styles.primaryBtn}>Save changes</button>
              <button className={styles.secondaryBtn}>Cancel</button>
            </div>
          </div>

          {/* Income Sources Card */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Income sources</h3>
            
            <div className={styles.incomeList}>
              <div className={styles.incomeRow}>
                <span className={styles.incomeLabel}>NSFAS allowance</span>
                <span className={styles.incomeValue}>R 5 200.00</span>
              </div>
              <div className={styles.incomeRow}>
                <span className={styles.incomeLabel}>Part-time work</span>
                <span className={styles.incomeValue}>R 1 100.00</span>
              </div>
              <div className={styles.incomeRow}>
                <span className={styles.incomeLabel}>Family support</span>
                <span className={styles.incomeValue}>R 400.00</span>
              </div>
            </div>

            <div className={styles.incomeTotal}>
              <span className={styles.totalLabel}>Total monthly income</span>
              <span className={styles.totalValue}>R 6 700.00</span>
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
              <button className={styles.dangerBtn}>
                Delete<br/>account
              </button>
            </div>
          </div>

          {/* Log Out Button */}
          <button className={styles.logoutBtn}>Log out</button>

        </div>
      </div>
    </div>
  );
};

export default Settings;