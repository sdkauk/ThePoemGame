import React from "react";
import styles from "./NavItem.module.css";

export interface NavItemProps {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const NavItem: React.FC<NavItemProps> = ({
  children,
  href,
  active = false,
  onClick,
  icon,
  className = "",
}) => {
  const classes = `${styles.navItem} ${
    active ? styles.active : ""
  } ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.text}>{children}</span>
      </a>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.text}>{children}</span>
    </button>
  );
};

export default NavItem;
