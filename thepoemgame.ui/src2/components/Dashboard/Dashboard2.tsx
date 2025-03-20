'use client'

import { useAuth } from '@/auth/use-auth';
import Link from 'next/link';
import Card from '@/components/Card/Card';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
      
      <div className={styles.cardsContainer}>
        {/* Groups Card */}
        <Link href="/groups" className={styles.cardLink}>
          <Card className={styles.card}>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>Groups</h2>
              <p className={styles.cardDescription}>
                View and manage your poem game groups
              </p>
            </div>
          </Card>
        </Link>

        {/* Inbox Card */}
        <Link href="/inbox" className={styles.cardLink}>
          <Card className={styles.card}>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>Inbox</h2>
              <p className={styles.cardDescription}>
                Check invitations and notifications
              </p>
            </div>
          </Card>
        </Link>

        {/* Character Card */}
        <Link href="/character" className={styles.cardLink}>
          <Card className={styles.card}>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>Character</h2>
              <p className={styles.cardDescription}>
                View and update your poet profile
              </p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}