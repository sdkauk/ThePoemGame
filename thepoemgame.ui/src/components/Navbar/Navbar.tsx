import React from "react";
import styles from "./Navbar.module.css"; // Fixed capitalization
import Container from "../Container/container";

export interface NavbarProps {
  logo?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  fixed?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "xxl" | "full";
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  logo,
  children,
  actions,
  fixed = false,
  maxWidth = "full",
  className = "",
}) => {
  return (
    <header
      className={`${styles.navbar} ${fixed ? styles.fixed : ""} ${className}`}
    >
      <Container maxWidth={maxWidth}>
        <div className={styles.container}>
          {logo && <div className={styles.logo}>{logo}</div>}
          {children && <nav className={styles.nav}>{children}</nav>}
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
