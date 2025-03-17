'use client';

import React from 'react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <span className={styles.titleText}>THE POEM GAME</span>
      </h1>
    </header>
  );
}