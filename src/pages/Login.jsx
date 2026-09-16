import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();

  const {
    login,
  } = useAuth();

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  // ==========================================
  // LOGIN HANDLER
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    // Basic validation
    if (!email.trim()) {
      setError(
        "Please enter your email address."
      );

      setIsLoading(false);

      return;
    }

    if (!password) {
      setError(
        "Please enter your password."
      );

      setIsLoading(false);

      return;
    }

    // Call AuthContext login
    const result = login(
      email,
      password
    );

    if (!result.success) {
      setError(
        result.message
      );

      setIsLoading(false);

      return;
    }

    // Successful login
    setIsLoading(false);

    // Navigate to dashboard
    navigate(
      "/dashboard",
      {
        replace: true,
      }
    );
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* =================================
            LEFT BRAND PANEL
        ================================= */}

        <div className="auth-brand">

          <div className="brand-logo">
            P
          </div>

          <h1>
            PricePilot AI
          </h1>

          <p className="brand-subtitle">
            Revenue Intelligence
          </p>

          <div className="brand-content">

            <h2>
              Smarter pricing.
              <br />
              Better revenue.
            </h2>

            <p>
              Optimize your product prices
              using intelligent pricing
              recommendations and revenue
              insights.
            </p>

            <div className="brand-features">

              <div className="brand-feature">
                <span>✓</span>
                <p>
                  AI-powered pricing
                  recommendations
                </p>
              </div>

              <div className="brand-feature">
                <span>✓</span>
                <p>
                  Real-time product insights
                </p>
              </div>

              <div className="brand-feature">
                <span>✓</span>
                <p>
                  Revenue optimization
                  analytics
                </p>
              </div>

            </div>

          </div>

          <div className="auth-brand-footer">
            © 2026 PricePilot AI
          </div>

        </div>


        {/* =================================
            RIGHT LOGIN PANEL
        ================================= */}

        <div className="auth-form-section">

          <div className="auth-form-wrapper">

            <div className="mobile-logo">

              <div className="brand-logo">
                P
              </div>

              <div>
                <strong>
                  PricePilot AI
                </strong>

                <span>
                  Revenue Intelligence
                </span>
              </div>

            </div>


            <div className="auth-header">

              <h2>
                Welcome back
              </h2>

              <p>
                Sign in to continue to your
                dashboard
              </p>

            </div>


            <form
              className="auth-form"
              onSubmit={handleLogin}
            >

              {/* ERROR */}

              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}


              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Email address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              {/* PASSWORD */}

              <div className="form-group">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="auth-submit"
                disabled={isLoading}
              >
                {isLoading
                  ? "Signing in..."
                  : "Sign in"}
              </button>

            </form>


            <div className="auth-divider">
              <span>
                OR
              </span>
            </div>


            <p className="auth-switch">

              Don't have an account?

              {" "}

              <Link to="/register">
                Create an account
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}