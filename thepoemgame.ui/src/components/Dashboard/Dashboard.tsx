'use client'

import { useAuth } from '@/auth/use-auth';
import Link from 'next/link';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
      
      <div className={styles.cardsContainer}>
        {/* Groups Card */}
        <Link href="/groups" className={styles.cardLink}>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>Groups</h2>
              <p className={styles.cardDescription}>
                View and manage your poem game groups
              </p>
              <div className={styles.doodle}>
                <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="25" cy="15" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="15" cy="35" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="35" cy="35" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="25" y1="25" x2="25" y2="30" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="20" y1="30" x2="30" y2="30" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="15" y1="27" x2="15" y2="35" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="35" y1="27" x2="35" y2="35" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Inbox Card */}
        <Link href="/inbox" className={styles.cardLink}>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>Inbox</h2>
              <p className={styles.cardDescription}>
                Check invitations and notifications
              </p>
              <div className={styles.doodle}>
                <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="15" width="30" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10,15 L25,25 L40,15" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="20" y1="20" x2="10" y2="30" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="30" y1="20" x2="40" y2="30" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Character Card */}
        <Link href="/character" className={styles.cardLink}>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>Character</h2>
              <p className={styles.cardDescription}>
                View and update your poet profile
              </p>
              <div className={styles.doodle}>
                <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="25" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M15,35 C15,25 35,25 35,35" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M20,15 Q25,10 30,15" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="20" cy="17" r="1.5" fill="currentColor" />
                  <circle cx="30" cy="17" r="1.5" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}