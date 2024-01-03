import React from "react";
import "./modal.css";

const Modal = ({ isOpen, onClose, title, content }) => {
  console.log('Modal isOpen:', isOpen);
  if (!isOpen) {
    return null;
  }

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="modal-content">{content}</div>
      </div>
    </div>
  );
};

export default Modal;
