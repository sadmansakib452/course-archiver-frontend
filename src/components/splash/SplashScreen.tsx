"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./splash.module.css";

interface SplashScreenProps {
  onFinish?: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Ensure the splash screen lasts exactly 1s (1000ms)
    const timer = setTimeout(() => {
      setIsVisible(false);
      onFinish?.();
    }, 1000); // 1s duration

    return () => clearTimeout(timer);
  }, [onFinish]);

  return isVisible ? (
    <div className={styles.splashContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <Image
              src="/images/logo/logo.svg"
              alt="University Logo"
              width={140}
              height={140}
              priority
            />
          </div>
        </div>
        <div className={styles.titleContainer}>
          <h1 className={styles.appTitle}>Course Archiver</h1>
        </div>
      </div>
    </div>
  ) : null;
};

export default SplashScreen;
