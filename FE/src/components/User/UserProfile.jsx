import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserProfile,
  updateUser,
  changePassword,
  changeAvatar,
} from '../../services/api';
import { jwtDecode } from "jwt-decode";

const BACKEND_URL = "http://localhost:8080";
const IMAGE_PATH = "/ltweb/images/avatar/";
const DEFAULT_AVATAR = "/assets/images/user-profile/user_avatar.jpg";

const getAvatarSrc = (avatarUrl) => {
  if (!avatarUrl) return DEFAULT_AVATAR;
  if (
    avatarUrl.startsWith("data:") ||
    avatarUrl.startsWith("blob:") ||
    avatarUrl.startsWith("http://") ||
    avatarUrl.startsWith("https://") ||
    avatarUrl.startsWith("/assets/")
  ) {
    return avatarUrl;
  }
  if (avatarUrl.startsWith(IMAGE_PATH)) {
    return `${BACKEND_URL}${avatarUrl}`;
  }
  return `${BACKEND_URL}${IMAGE_PATH}${avatarUrl.replace(/^\/+/, "")}`;
};


const UserProfile = () => {
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId;
    } catch {
      userId = null;
    }
  }

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarVersion, setAvatarVersion] = useState(Date.now());
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    address: "",
    email: "",
    phoneNumber: ""
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPass: "",
    newPass: ""
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const avatarInputRef = useRef();

  // Lấy dữ liệu user thực tế từ backend khi component mount
  useEffect(() => {
    if (!userId) {
      alert("Bạn chưa đăng nhập!");
      navigate("/login");
      return;
    }
    getUserProfile(userId)
      .then(res => {
        const userData = res.data;
        setUser(userData);
        setAvatarPreview(userData.avatarUrl || "");
        setProfileForm({
          fullName: userData.fullName || "",
          address: userData.address || "",
          email: userData.email || "",
          phoneNumber: userData.phone || ""
        });
      })
      .catch(() => alert("Không lấy được thông tin user!"));
  }, [userId, navigate]);

  // Xử lý chọn ảnh đại diện và preview + gửi lên BE
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("Chỉ chấp nhận file JPG hoặc PNG!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Ảnh không được lớn hơn 5MB!");
        return;
      }
      // Preview
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target.result);
      };
      reader.readAsDataURL(file);

      // Gửi lên BE
      changeAvatar(userId, file)
        .then(res => {
          alert(res.data.message || "Cập nhật ảnh thành công!");
          if (res.data.result && res.data.result.avatarUrl) {
            setAvatarPreview(res.data.result.avatarUrl);
            setAvatarVersion(Date.now());
          }
        })
        .catch(err => {
          alert(
            err.response?.data?.message ||
              "Có lỗi khi cập nhật ảnh đại diện!"
          );
        });
    }
  };

  // Xử lý thay đổi thông tin profile
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý submit thông tin profile (gửi lên BE)
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateUser(userId, profileForm)
      .then(res => {
        setUser(prev => ({ ...prev, ...profileForm }));
        alert(res.data.message || "Cập nhật thông tin thành công!");
      })
      .catch(err => {
        alert(
          err.response?.data?.message ||
            "Bạn chưa thay đổi thông tin nào, vui lòng kiểm tra lại!"
        );
      });
  };


  // Xử lý thay đổi mật khẩu
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };


  // Xử lý submit đổi mật khẩu (gửi lên BE)
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPass.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    setPasswordError("");
    changePassword(userId, {
      oldPassword: passwordForm.oldPass,
      newPassword: passwordForm.newPass
    })
      .then(res => {
        alert(res.data.message || "Đổi mật khẩu thành công!");
        setPasswordForm({ oldPass: "", newPass: "" });
        setShowPasswordForm(false);
      })
      .catch(err => {
        setPasswordError(
          err.response?.data?.message ||
            "Mật khẩu cũ không chính xác hoặc mật khẩu mới trùng với mật khẩu cũ!"
        );
      });
  };


  if (!user) return <div>Đang tải thông tin người dùng...</div>;

  const avatarSrc = getAvatarSrc(avatarPreview);
  const displayAvatarSrc = avatarSrc.startsWith(BACKEND_URL)
    ? `${avatarSrc}?v=${avatarVersion}`
    : avatarSrc;

  return (
    <div className="user-profile">
      <div className="container-xl px-4 mt-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-xl-4">
            <div className="card mb-4 mb-xl-0">
              <div className="card-header">Ảnh đại diện</div>
              <div className="card-body text-center">
                <img
                  className="img-account-profile rounded-circle mb-2"
                  src={displayAvatarSrc}
                  style={{ width: 160, height: 160, objectFit: "cover" }}
                  alt={`Ảnh đại diện`}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_AVATAR;
                  }}
                />
                <div className="small font-italic text-muted mb-4">
                  JPG hoặc PNG không lớn hơn 5 MB
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={avatarInputRef}
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => avatarInputRef.current.click()}
                >
                  Tải ảnh lên
                </button>
              </div>
            </div>
            <div className="card mb-4 mb-xl-0">
              <button
                className="btn btn-primary"
                onClick={() => setShowPasswordForm((show) => !show)}
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
          {/* Main content */}
          <div className="col-xl-8">
            <div className="card mb-4">
              <div className="card-header">Thông tin tài khoản</div>
              <div className="card-body">
                <form onSubmit={handleProfileSubmit} className="updateUser">
                  <div className="row gx-3 mb-3">
                    <div className="col-md-12">
                      <label className="small mb-1" htmlFor="inputFullName">Họ và tên</label>
                      <input
                        className="form-control"
                        id="inputFullName"
                        name="fullName"
                        type="text"
                        placeholder="Họ và tên"
                        value={profileForm.fullName}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row gx-3 mb-3">
                    <div className="col-md-12">
                      <label className="small mb-1" htmlFor="inputLocation">Địa chỉ</label>
                      <input
                        className="form-control"
                        id="inputLocation"
                        name="address"
                        type="text"
                        placeholder="Địa chỉ"
                        value={profileForm.address}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="small mb-1" htmlFor="inputEmailAddress">Email</label>
                    <input
                      className="form-control"
                      id="inputEmailAddress"
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="row gx-3 mb-3">
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="inputPhone">Phone number</label>
                      <input
                        className="form-control"
                        id="inputPhone"
                        name="phoneNumber"
                        type="text"
                        placeholder="Số điện thoại"
                        value={profileForm.phoneNumber}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                  </div>
                  <button className="btn btn-primary" type="submit">
                    Lưu thông tin
                  </button>
                </form>
              </div>
            </div>
            {/* Đổi mật khẩu */}
            {showPasswordForm && (
              <div style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 24,
                marginBottom: 24,
                maxWidth: 850,
                background: '#fafbfc'
              }}>
                <h5 style={{ marginBottom: 20 }}>Đổi mật khẩu</h5>
                <form onSubmit={handlePasswordSubmit}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Mật khẩu cũ</label>
                    <input
                      type="password"
                      name="oldPass"
                      value={passwordForm.oldPass}
                      onChange={handlePasswordChange}
                      style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                      placeholder="Nhập mật khẩu cũ"
                      required
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Mật khẩu mới</label>
                    <input
                      type="password"
                      name="newPass"
                      value={passwordForm.newPass}
                      onChange={handlePasswordChange}
                      style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                      placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                      required
                    />
                  </div>
                  {passwordError && (
                    <div style={{ color: 'red', marginBottom: 10 }}>
                      {passwordError}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" className="btn btn-primary">
                      Thay đổi
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordForm(false)}>
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
