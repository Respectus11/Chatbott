import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../utils/authApi";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { token } = await loginApi({ email, password });
      localStorage.setItem("token", token);
      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to log in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <div className="auth-logo">
            <span className="auth-logo-mark">ም</span>
            <div className="auth-logo-text">
              <span className="auth-logo-title">Merkuze Access</span>
              <span className="auth-logo-sub">
                ጥቁር አንበሳ ሆስፒታል · Tikur Anbessa
              </span>
            </div>
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">
            Sign in to use Merkuze and manage your documents.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <footer className="auth-footer">
          <p>
            New here?{" "}
            <Link to="/signup" className="auth-link">
              Create an account
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default LoginPage;
