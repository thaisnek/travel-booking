import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const RegisterForm = ({ onRegister }) => {
  const [form, setForm] = useState({ username: "", password: "", fullName: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(""); setSuccess("");
    await onRegister(form, setError, setSuccess);
  };

  return (
    <Form className="auth-form" onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form.Group className="auth-form-group" controlId="registerUsername">
        <Form.Label>Tên đăng nhập</Form.Label>
        <Form.Control
          className="auth-input"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Nhập tên đăng nhập"
          autoComplete="username"
          required
        />
      </Form.Group>
      <Form.Group className="auth-form-group" controlId="registerFullName">
        <Form.Label>Họ và tên</Form.Label>
        <Form.Control
          className="auth-input"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Nhập họ và tên"
          autoComplete="name"
          required
        />
      </Form.Group>
      <Form.Group className="auth-form-group" controlId="registerPassword">
        <Form.Label>Mật khẩu</Form.Label>
        <Form.Control
          className="auth-input"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Tạo mật khẩu"
          autoComplete="new-password"
          required
        />
      </Form.Group>
      <Button type="submit" className="auth-submit w-100">Đăng ký</Button>
    </Form>
  );
};


export default RegisterForm;
