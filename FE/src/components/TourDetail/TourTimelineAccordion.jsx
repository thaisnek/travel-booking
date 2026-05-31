import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const TourTimelineAccordion = ({ timelines }) => {
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleAccordion = (index) => {
    setOpenIndexes(
      openIndexes.includes(index)
        ? openIndexes.filter(i => i !== index)
        : [...openIndexes, index]
    );
  };

  return (
    <div style={{ margin: '25px 0 60px 0' }}>
      {timelines && timelines.length > 0 ? (
        timelines.map((timeline, index) => (
          <div
            key={timeline.timeLineID || index}
            style={{
              border: '1px solid #ddd',
              marginBottom: '10px',
              borderRadius: '5px',
            }}
          >
            <h5 style={{ margin: 0 }}>
              <button
                onClick={() => toggleAccordion(index)}
                style={{
                  width: '100%',
                  padding: '15px',
                  textAlign: 'left',
                  background: openIndexes.includes(index) ? '#f5f5f5' : '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {timeline.title || `Ngày ${index + 1}`}
                <span>
                  {openIndexes.includes(index) ? (
                    <FaMinus style={{ fontSize: '1rem' }} />
                  ) : (
                    <FaPlus style={{ fontSize: '1rem' }} />
                  )}
                </span>
              </button>
            </h5>
            <div
              style={{
                display: openIndexes.includes(index) ? 'block' : 'none',
                padding: '15px',
                borderTop: '1px solid #ddd',
              }}
            >
              <p>{timeline.description}</p>
            </div>
          </div>
        ))
      ) : (
        <p>Chưa có lịch trình chi tiết.</p>
      )}
    </div>
  );
};

export default TourTimelineAccordion;