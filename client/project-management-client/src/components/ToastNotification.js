import React, { useEffect } from 'react';

export default function ToastNotification({ message, clear }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clear();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, clear]);

  if (!message) return null;

  return (
    <div
      className="toast show position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 9999 }}
    >
      <div className="toast-body">{message}</div>
    </div>
  );
}
