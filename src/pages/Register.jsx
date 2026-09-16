import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import "./Auth.css";

export default function Register() {

  const navigate =
    useNavigate();

  const {
    register,
  } = useAuth();

  const [
    name,
    setName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
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
  // REGISTER HANDLER
  // ==========================================

  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");

    // Validate name
    if (!name.trim()) {

      setError(
        "Please enter your full name."
      );

      return;
    }

    // Validate email
    if (!email.trim()) {

      setError(
        "Please enter your email address."
      );

      return;
    }

    // Validate password
    if (password.length < 6) {

      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    // Confirm password
    if (
      password !==
      confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;
    }

    setIsLoading(true);

    // Call AuthContext register
    const result =
      register(
        name,
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

    // Registration successful
    setIsLoading(false);

    // Go to dashboard
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
            LEFT BRAND
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
              Start optimizing
              <br />
              your revenue today.
            </h2>

            <p>
              Create your account and get
              actionable pricing insights
              for your products.
            </p>


            <div className="brand-features">

              <div className="brand-feature">
                <span>✓</span>

                <p>
                  Manage your entire
                  product catalog
                </p>

              </div>


              <div className="brand-feature">
                <span>✓</span>

                <p>
                  Generate pricing
                  recommendations
                </p>

              </div>


              <div className="brand-feature">
                <span>✓</span>

                <p>
                  Track revenue
                  opportunities
                </p>

              </div>

            </div>

          </div>


          <div className="auth-brand-footer">
            © 2026 PricePilot AI
          </div>

        </div>


        {/* =================================
            REGISTER FORM
        ================================= */}

        <div className="auth-form-section">

          <div className="auth-form-wrapper">


            <div className="auth-header">

              <h2>
                Create your account
              </h2>

              <p>
                Start your journey with
                PricePilot AI
              </p>

            </div>


            <form
              className="auth-form"
              onSubmit={
                handleRegister
              }
            >


              {error && (

                <div className="auth-error">
                  {error}
                </div>

              )}


              {/* NAME */}

              <div className="form-group">

                <label>
                  Full name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="form-group">

                <label>
                  Confirm password
                </label>

                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={
                    confirmPassword
                  }
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              {/* SUBMIT */}

              <button
                type="submit"
                className="auth-submit"
                disabled={
                  isLoading
                }
              >
                {isLoading
                  ? "Creating account..."
                  : "Create account"}
              </button>

            </form>


            <p className="auth-switch">

              Already have an account?

              {" "}

              <Link to="/login">
                Sign in
              </Link>

            </p>


          </div>

        </div>

      </div>

    </div>
  );
}