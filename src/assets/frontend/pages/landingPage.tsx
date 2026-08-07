import React from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore: No declaration file for module '../../backend/firebaseConfig/config'
import { auth } from '../../backend/firebaseConfig/config';
import styles from "../styles/LandingPage.module.css";

const LandingPage: React.FC = () => {

    const navigate = useNavigate();

    const navigateToPage = (path: string) => {

        navigate("/" + path);

    }

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                <div className={styles.logoGroup}>
                    <div className={styles.logoIcon}></div>
                    <span className={styles.logoText}>StudentSpend SA</span>
                </div>
                <nav className={styles.navGroup}>
                    <a href="#home" className={styles.navLink}>Home</a>
                    <a href="#about" className={styles.navLink}>About</a>
                    <button className={styles.loginButton} onClick={() => navigateToPage("login")}>Log in</button>
                </nav>
                </div>
            </header>

            <main className={styles.mainContent}>
                <section className={styles.textContent}>
                    <h1 className={styles.headline}>
                        Budget smart.<br />
                        Study stress-free.
                    </h1>
                    <p className={styles.subhead}>
                        Set up your allowance once, then see exactly what is left for the week. Built for South African students living on NSFAS and part-time work.
                    </p>
                    
                    <div className={styles.ctaGroup}>
                        <button className={styles.primaryButton} onClick={() => navigateToPage("account")}>Get started</button>
                        <button className={styles.secondaryButton} onClick={() => navigateToPage("login")}>I already have an account</button>
                    </div>

                    <div className={styles.featuresList}>

                        <div className={styles.featureItem}>
                            <h4>Weekly limits</h4>
                            <p>Worked out from what is left</p>
                        </div>

                        <div className={styles.featureItem}>
                            <h4>Category tracking</h4>
                            <p>Transport, food, data, rent</p>
                        </div>

                        <div className={styles.featureItem}>
                            <h4>Early warnings</h4>
                            <p>Before the money runs out</p>
                        </div>
                        
                    </div>
                </section>

                <section className={styles.imageSection}>
                    <div className={styles.placeholderContainer}>
                        <div className={styles.placeholderBadge}>
                            dashboard screenshot goes here
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
};

export default LandingPage;