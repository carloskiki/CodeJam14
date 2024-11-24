import React from "react";
import { Search, LogIn } from "lucide-react";
import styles from "./header.module.css";

const Header: React.FC = ({ mainpage }: { mainpage?: boolean }) => {
  return (
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <img
            src="/images/McGill.png"
            alt="McGill Logo"
            className={styles.logo}
          />

          {
              mainpage ? (
                  <>
                      <div>
                          <h1 className={styles.title}>Apartments</h1>
                      </div>
                      <div className={styles.searchContainer}>
                        <input
                          type="text"
                          placeholder="Search apartments..."
                          className={styles.searchInput}
                        />
                        <Search className={styles.searchIcon} size={20} />
                      </div>
                      <button className={styles.loginButton}>
                        <LogIn size={20} />
                        <span>Profile</span>
                      </button>
                </>
              ) : (
                <div>
                  <h1 className={styles.title}>Martlet's Nest</h1>
                </div>
              )
          }
          
        </div>
      </header>
  )
}

export default Header;
