import React from 'react';
import './styles.css';

interface AlertProps {
    icon?: React.ReactNode;
    text: string;
}
const Alert: React.FC<AlertProps> = ({icon, text}) => {
    return (
      <div className="alert-component">
        <span className="icon">{icon}</span>
        <span>{text}</span>
      </div>
    );
  };

export default Alert;
