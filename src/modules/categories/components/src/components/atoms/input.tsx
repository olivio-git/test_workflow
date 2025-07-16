// Este archivo define un componente de entrada reutilizable que se utiliza en varios formularios dentro de la aplicación.

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div className="input-container">
      {label && <label className="input-label">{label}</label>}
      <input className={`input-field ${error ? 'input-error' : ''}`} {...props} />
      {error && <p className="input-error-message">{error}</p>}
    </div>
  );
};

export default Input;