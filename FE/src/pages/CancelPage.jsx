import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const CancelPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Thanh toán đã được hủy');
  const navigate = useNavigate();

  useEffect(() => {
    const bookingId = searchParams.get('bookingId');
    
    if (!bookingId) {
      setMessage('Không tìm thấy thông tin booking');
    }

    const timer = setTimeout(() => {
      navigate("/history");
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>{message}</h2>
      <p>Bạn sẽ được chuyển về trang lịch sử...</p>
    </div>
  );
};

export default CancelPage;
