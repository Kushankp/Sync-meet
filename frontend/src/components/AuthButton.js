import React from 'react';

function AuthButton({ onClick, disabled, text }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}

export default AuthButton;