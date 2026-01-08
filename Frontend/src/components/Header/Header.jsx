import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../../context';
import styles from './Header.module.css';

function Header() {
  const { setUser } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div className={styles.logo}>EVING4DI</div>
          <div className={styles.nav}>
            <span className={styles.navItem}>Home</span>
            <span className={styles.navItem}>How it works</span>
          </div>
        </div>
        
        <div className={styles.rightSection}>
          <span onClick={handleLogout} className={styles.logout}>
            LOG OUT
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;