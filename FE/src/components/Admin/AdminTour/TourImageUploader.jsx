import React, { useRef, useState } from "react";

function TourImageUploader({ tourId, onUploaded }) {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };

  React.useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  // Upload ảnh lên BE
  const handleUpload = async () => {
    if (images.length === 0) {
      alert("Vui lòng chọn ít nhất một ảnh!");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    images.forEach(img => formData.append("images", img));

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8080/ltweb/api/admin/tours/${tourId}/upload-images`, {
        method: "POST",
        body: formData,
        headers: {
        Authorization: `Bearer ${token}`,
      }
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        alert("Server trả về không phải JSON. Xem console để biết chi tiết.");
        setLoading(false);
        return;
      }
      if (data.code === 200) {
        alert("Upload ảnh thành công!");
        onUploaded && onUploaded(data.result);
        setImages([]);
        setPreviews([]);
        setFileInputKey(Date.now());
      } else {
        alert(data.message || "Upload thất bại!");
      }
    } catch (err) {
      alert("Lỗi upload ảnh: " + (err.message || ""));
    }
    setLoading(false);
  };

  return (
    <div>
      <input
        key={fileInputKey} 
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        disabled={loading}
      />
      <div style={{ display: "flex", gap: 10, margin: "10px 0" }}>
        {previews.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt="preview"
            width={80}
            height={80}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        ))}
      </div>
      <button onClick={handleUpload} disabled={loading || images.length === 0}>
        {loading ? "Đang upload..." : "Upload Ảnh"}
      </button>
    </div>
  );
}

export default TourImageUploader;
