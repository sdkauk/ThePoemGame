"use client";

import React from "react";
import Button from "@/components/Button/Button";
import styles from "./landing-page.module.css";
import Container from "@/components/Container/container";

interface LandingPageProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export default function LandingPage({ onLogin, onSignUp }: LandingPageProps) {
  return (
    <Container>
      <p className={styles.subtitle}>
        Collaborate on poetry with friends and fellow writers
      </p>

      <div className={styles.buttonGroup}>
        <Button onClick={onLogin} variant="primary" size="lg">
          Log In
        </Button>
        <Button onClick={onSignUp} variant="outline" size="lg">
          Sign Up
        </Button>
      </div>
    </Container>
  );
}
