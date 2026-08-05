// components/Layout.tsx
import React, { useState } from "react";
// @ts-ignore
import Sidebar from "./MainSidebar";
import styles from "../styles/MainLayout.module.css";
import Header from "./Header";
import { Outlet } from "react-router-dom";



const MainLayout: React.FC = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.appLayout}>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={styles.mainContent}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
