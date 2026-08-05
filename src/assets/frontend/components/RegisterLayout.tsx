// components/Layout.tsx
import React, { useState } from "react";
// @ts-ignore
import RegisterSidebar from "./RegisterSidebar";
import styles from "../styles/RegisterLayout.module.css";
import { Outlet } from "react-router-dom";



const RegisterLayout: React.FC = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.appLayout}>
      <RegisterSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={styles.mainContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default RegisterLayout;
