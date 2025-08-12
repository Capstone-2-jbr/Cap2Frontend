import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, onClose, children, position = "center" }) => {
  const overlayRef = useRef(null);
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show) return null;

  return ReactDOM.createPortal(
    <div
      ref={overlayRef}
      className={`modal-overlay ${isOpen ? "open" : "close"}`}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose?.();
      }}
    >
      <div
        className={`modal-panel ${position === "top" ? "top" : "center"} ${
          isOpen ? "open" : "close"
        }`}
      >
        {children}
      </div>
    </div>,
    document.getElementById("modal-root") || document.body
  );
};

export default Modal;
