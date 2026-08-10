import React from 'react';
import styles from "../styles/About.module.css";
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {

    const navigate = useNavigate();

    const navigateToPage = (path: string) => {    

        navigate("/" + path);

    }


    return (

        <div className={styles.container}>

            <header className={styles.header}>
                <div className={styles.headerContent}>
                <div className={styles.logoGroup}>
                    <div className={styles.logoIcon}></div>
                    <span className={styles.logoText}>StudentSpend SA</span>
                </div>
                <nav className={styles.navGroup}>
                    <div className={styles.navLink} onClick={() => navigateToPage("")}>Home</div>
                    <div className={styles.navLink} onClick={() => navigateToPage("about")}>About</div>
                    <button className={styles.loginButton} onClick={() => navigateToPage("login")}>Log in</button>
                </nav>
                </div>
            </header>
      
            {/* Top Section */}
            <div className={styles.topSection}>
                
                {/* Left Column: Context */}
                <div className={styles.leftColumn}>
                <h1 className={styles.mainTitle}>Why we built this</h1>
                <p className={styles.paragraph}>
                    Most students receive their allowance in one payment and are expected to 
                    stretch it across a whole month. There is no shortage of budgeting apps, but 
                    almost none of them speak in rands, understand NSFAS payment cycles, or 
                    account for a taxi fare that changes week to week.
                </p>
                <p className={styles.paragraph}>
                    StudentSpend SA keeps one question in front of you at all times: what is safe 
                    to spend this week. Everything else in the app exists to answer it.
                </p>
                </div>

                {/* Right Column: How it works card */}
                <div className={styles.howItWorksCard}>
                <h3 className={styles.sectionSubtitle}>How it works</h3>
                
                <div className={styles.stepList}>
                    {/* Step 1 */}
                    <div className={styles.stepItem}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h4 className={styles.stepTitle}>Tell us what comes in</h4>
                        <p className={styles.stepDescription}>NSFAS, part-time work and money from home.</p>
                    </div>
                    </div>

                    {/* Step 2 */}
                    <div className={styles.stepItem}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h4 className={styles.stepTitle}>Set a monthly limit</h4>
                        <p className={styles.stepDescription}>We work the weekly limit out from what is left.</p>
                    </div>
                    </div>

                    {/* Step 3 */}
                    <div className={styles.stepItem}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h4 className={styles.stepTitle}>Log as you spend</h4>
                        <p className={styles.stepDescription}>Every expense lands in a category.</p>
                    </div>
                    </div>

                    {/* Step 4 */}
                    <div className={styles.stepItem}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h4 className={styles.stepTitle}>Get warned early</h4>
                        <p className={styles.stepDescription}>Alerts before a category runs dry, not after.</p>
                    </div>
                    </div>
                </div>
                </div>

            </div>

            {/* Divider */}
            <hr className={styles.divider} />

            {/* Bottom Section: The Team */}
            <div className={styles.teamSection}>
                <h3 className={styles.sectionSubtitle}>The Team</h3>
                
                <div className={styles.teamGrid}>

                {/* Team Member 1 */}
                <div className={styles.teamCard}>
                    <h4 className={styles.memberName}>Dean Meyer</h4>
                    <p className={styles.memberRole}>Full-Stack Developer</p>
                </div>
                
                {/* Team Member 2 */}
                <div className={styles.teamCard}>
                    <h4 className={styles.memberName}>Khanyisile Majiba</h4>
                    <p className={styles.memberRole}>UI and UX design</p>
                </div>

                {/* Team Member 3 */}
                <div className={styles.teamCard}>
                    <h4 className={styles.memberName}>Group member 3</h4>
                    <p className={styles.memberRole}>Firebase and data</p>
                </div>

                {/* Team Member 4 */}
                <div className={styles.teamCard}>
                    <h4 className={styles.memberName}>Group member 4</h4>
                    <p className={styles.memberRole}>Testing and research</p>
                </div>

                </div>
            </div>

        </div>
    )
};

export default About;