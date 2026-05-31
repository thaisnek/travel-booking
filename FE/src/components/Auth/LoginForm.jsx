import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const LoginForm = ({ onLogin }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    await onLogin(form, setError);
  };

  return (
    <Form className="auth-form" onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="auth-form-group" controlId="loginUsername">
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
      <Form.Group className="auth-form-group" controlId="loginPassword">
        <Form.Label>Mật khẩu</Form.Label>
        <Form.Control
          className="auth-input"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Nhập mật khẩu"
          autoComplete="current-password"
          required
        />
      </Form.Group>
      <Button type="submit" className="auth-submit w-100">Đăng nhập</Button>
    </Form>
  );
};


export default LoginForm;
