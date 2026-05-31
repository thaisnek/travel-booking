
import axios from 'axios';

const API_URL = 'http://localhost:8080/ltweb/api'; 

export const getTours = async () => {
  try {
    const response = await axios.get(`${API_URL}/home/tours`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tours:', error);
    throw error;
  }
};

export const getAvailableTours = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/tours/all-tours`, { params });
    return response.data; 
  } catch (error) {
    console.error('Error fetching available tours:', error);
    throw error;
  }
};


export const getTourDetail = async (tourID) => {
  try {
    const response = await axios.get(`${API_URL}/tours/tour-details/${tourID}`);
    console.log("API Response:", response.data); // Debug dữ liệu từ BE
    return response.data;
  } catch (error) {
    console.error("Error fetching tour detail:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${API_URL}/bookings/create`,
      bookingData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: `${API_URL}/bookings/create`,
    });
    throw error;
  }
};

export const initiatePayment = async (bookingId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${API_URL}/payment/create?bookingId=${bookingId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error initiating payment:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: `${API_URL}/payment/create?bookingId=${bookingId}`,
    });
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${API_URL}/bookings/${bookingId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error cancelling booking:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: `${API_URL}/bookings/${bookingId}/cancel`,
    });
    throw error;
  }
};

export const getUserTourBookingStatus = async (userId, tourId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/bookings/tour-status`, {
      params: { userId, tourId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking user tour booking status:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: `${API_URL}/bookings/tour-status`,
    });
    throw error;
  }
};

// Kiểm tra xem người dùng có thể đánh giá không
export const canReview = async (userId, tourId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/reviews/can-review`, {
      params: { userId, tourId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi kiểm tra quyền đánh giá');
  }
};

// Tạo đánh giá mới
export const createReview = async (reviewData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${API_URL}/reviews`, reviewData,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi gửi đánh giá');
  }
};

// Lấy danh sách đánh giá của tour
export const getReviewsByTourId = async (tourId) => {
  try {
    const response = await axios.get(`${API_URL}/reviews/tour/${tourId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách đánh giá');
  }
};

export const getAllTours = async (page = 0, size = 9) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/admin/tours`, { 
    params: { page, size },
    headers: {
        Authorization: `Bearer ${token}`,
      },
   });
  return res.data;
};

export const createTour = async (tourData) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(`${API_URL}/admin/tours/create`, tourData,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    // Xử lý mọi loại lỗi (mạng, server, validation)
    return {
      code: error.response?.status || 500,
      message: 
        error.response?.data?.message || // Lỗi từ server
        error.message ||                 // Lỗi từ axios
        "Không thể kết nối đến server",
      result: null
    };
  }
};

export const updateTour = async (id, tourData) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.put(`${API_URL}/admin/tours/update/${id}`, tourData,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return {
      code: error.response?.status || 500,
      message: 
        error.response?.data?.message || 
        error.message || 
        "Không thể cập nhật tour",
      result: null
    };
  }
};



export const deleteTour = async (id) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_URL}/admin/tours/${id}`,{
    headers: {
        Authorization: `Bearer ${token}`,
      },
  });
};

export const getAllBookings = async (page = 0, size = 9) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/admin/bookings`, { 
    params: { page, size },
    headers: {
        Authorization: `Bearer ${token}`,
      },
  });
  return res.data;
};

export const deleteBooking = async (id) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_URL}/admin/bookings/${id}`,{
    headers: {
        Authorization: `Bearer ${token}`,
      },
  }
  );
};

export const updateBookingStatus = async (id, status) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API_URL}/admin/bookings/${id}/status`, null, {
    params: { status },
    headers: {
        Authorization: `Bearer ${token}`,
      },
  });
  return res.data;
};

export const getAllReviews = async (page = 0, size = 10) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/admin/reviews`, { 
    params: { page, size },
    headers: {
        Authorization: `Bearer ${token}`,
      },
   });
  return res.data;
};

export const deleteReview = async (id) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_URL}/admin/reviews/${id}`,{
    headers: {
        Authorization: `Bearer ${token}`,
      },
  });
};


export const getAllPromotions = async (page = 0, size = 9) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/admin/promotions`, { 
    params: { page, size },
    headers: {
        Authorization: `Bearer ${token}`,
      },
  });
  return res.data;
};

export const createPromotion = async (promotion) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API_URL}/admin/promotions/create`, promotion,{
    headers: {
        Authorization: `Bearer ${token}`,
      },
  });
  return res.data;
};

export const updatePromotion = async (id, promotion) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API_URL}/admin/promotions/update/${id}`, promotion,{
    headers: {
        Authorization: `Bearer ${token}`,
      },
  });
  return res.data;
};

export const deletePromotion = async (id) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_URL}/admin/promotions/${id}`,{
    headers: {
        Authorization: `Bearer ${token}`,
      },
  });
};


export const getUserProfile = (userId) =>{
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/users/${userId}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
  

export const updateUser = (userId, data) =>{
  const token = localStorage.getItem("token");
  return axios.put(`${API_URL}/users/update/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
  

export const changePassword = (userId, data) =>{
  const token = localStorage.getItem("token");
  return axios.put(`${API_URL}/users/change-password/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
  

export const changeAvatar = (userId, file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const token = localStorage.getItem("token");
  return axios.put(`${API_URL}/users/change-avatar/${userId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};


export const deleteUser = async (userId) => {
  const token = localStorage.getItem("token");
  try {
    await axios.delete(`${API_URL}/admin/users/delete/${userId}`,{
      headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    });
    // Optionally return something or just let it resolve
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Error deleting user"
    );
  }
};


// Register
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const text = await response.text();
    return { ok: response.ok, message: text };
  } catch (error) {
    return { ok: false, message: "Network error!" };
  }
};

// Login
export const login = async (loginData) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });
    if (!response.ok) {
      return {};
    }
    return await response.json();
  } catch (error) {
    return {};
  }
};

export const getAdminById = async (adminId) => {
  const token = localStorage.getItem("token"); // Nếu backend yêu cầu xác thực
  const res = await axios.get(`${API_URL}/admin/${adminId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};



export const getDashboardStats = () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/admin/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
};

export const getTopTours = () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/admin/dashboard/top-tours`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
};

export const getTopCustomers = () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/admin/dashboard/top-customers`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
};
