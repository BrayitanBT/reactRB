import './modal.css';

export default function ModalContainer({ title, onClose, children, size = 'medium' }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-content ${size}-modal`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}