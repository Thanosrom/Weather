import React, { useState } from 'react';
//CSS
import '../CSS/Modal.css';

//Modal Reusable Component
function CustomModal({ children, onClose, onSelectDate }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    onSelectDate(date); 
    onClose();
  };

  const today = new Date();
  const futureDates = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return date;
  });

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        {children}
        <div className="dateList">
          {futureDates.map((date, index) => (
            <button key={index} className="dateItem" onClick={() => handleDateSelect(date)}>
              {date.getDate()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomModal;
