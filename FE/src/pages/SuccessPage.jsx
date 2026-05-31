import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const paymentId = searchParams.get('paymentId');
    const payerId = searchParams.get('PayerID');
    const bookingId = searchParams.get('bookingId');

    if (!paymentId || !payerId || !bookingId) {
      navigate("/error", { state: "Thiếu thông tin thanh toán" });
      return;
    }

    const timer = setTimeout(() => {
      navigate("/history", { 
        state: { 
          message: "Thanh toán thành công",
          paymentId,
          bookingId 
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>💰 Thanh toán thành công!</h2>
      <p>Bạn sẽ được chuyển về trang lịch sử trong giây lát...</p>
    </div>
  );
};

export default SuccessPage;
