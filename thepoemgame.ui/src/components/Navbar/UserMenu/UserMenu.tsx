import React, { useState, useRef, useEffect } from "react";
import styles from "./UserMenu.module.css";

export interface UserMenuProps {
  name: string;
  avatarUrl?: string | undefined;
  children?: React.ReactNode;
}

const UserMenu: React.FC<UserMenuProps> = ({ name, avatarUrl, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles.userMenu} ref={menuRef}>
      <button className={styles.trigger} onClick={toggleMenu}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${name}'s avatar`}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarFallback}>{name.charAt(0)}</div>
        )}
        <span className={styles.name}>Hi, {name}!</span>
      </button>

      {isOpen && children && <div className={styles.dropdown}>{children}</div>}
    </div>
  );
};

export default UserMenu;
