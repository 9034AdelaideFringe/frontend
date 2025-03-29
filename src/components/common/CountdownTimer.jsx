import React, { useState, useEffect } from 'react';
import styles from './CountdownTimer.module.css';

const CountdownTimer = () => {
  const [time, setTime] = useState({
    hours: '00',
    minutes: '00',
  });

  useEffect(() => {
    const updateCurrentTime = () => {
      // Create a date object using Australia/Adelaide timezone
      const options = {
        timeZone: 'Australia/Adelaide',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Use 24-hour format
      };
      
      const adelaideTime = new Date().toLocaleTimeString('en-AU', options);
      
      // Split the time string (format: "HH:MM")
      const [hours, minutes] = adelaideTime.split(':');
      
      setTime({
        hours: hours,
        minutes: minutes
      });
    };
    
    // Update immediately and then every second
    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.countdownContainer}>
      <div className={styles.countdownTimer}>
        <div className={styles.timeUnit}>
          <div className={styles.timeValue}>{time.hours}</div>
        </div>
        <div className={styles.timeSeparator}>:</div>
        <div className={styles.timeUnit}>
          <div className={styles.timeValue}>{time.minutes}</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;