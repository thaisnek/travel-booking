Travel Booking
Ứng dụng đặt tour du lịch gồm frontend React, backend Spring Boot và một service Python/Flask dùng TF-IDF để tìm kiếm/gợi ý tour tương tự.

Tính năng chính
Đăng ký, đăng nhập bằng JWT cho người dùng và admin.
Xem danh sách tour, lọc theo giá, khu vực, thời lượng, đánh giá và xem chi tiết tour.
Tìm kiếm tour theo điểm đến/ngày đi/ngày về hoặc theo từ khóa.
Gợi ý tour tương tự bằng Flask service, có fallback trong backend nếu service Python không khả dụng.
Đặt tour, áp dụng mã khuyến mãi, kiểm tra trạng thái booking và hủy booking đang chờ thanh toán.
Thanh toán PayPal sandbox, xử lý callback thành công/hủy và ghi nhận lịch sử.
Người dùng quản lý hồ sơ, đổi mật khẩu, đổi avatar, xem lịch sử tour và đánh giá tour.
Admin quản lý tour, upload ảnh tour, booking, review, promotion, user, contact và dashboard thống kê.
Gửi liên hệ và admin phản hồi qua email SMTP.
