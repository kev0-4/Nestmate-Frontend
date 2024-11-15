import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Person from "../../assets/PersonIcon.svg";
import Lottie from "react-lottie";
import loadingAnimation from "../../assets/loadingAnimation.json"; 

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dob: "",
  });
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dob") {
      const date = new Date(value);
      setFormData({ ...formData, dob: date.toISOString() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setValidationErrors({ ...validationErrors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setValidationErrors({});

    try {
      const response = await fetch(
        "https://nestmatebackend.ktandon2004.workers.dev/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log("Response status:", response.status);
      console.log("Response data:", data);
      if (response.status === 201) {
        // Store token and userId in localStorage
        localStorage.setItem("token", data.token); // Store token for authorization
        localStorage.setItem("userId", data.id);   // Store userId for user-specific needs

        // Redirect to dashboard
        navigate("/dashboard");
        console.log("Navigation called");
      } else if (response.status === 400 && data.errors) {
        // Handle validation errors
        const newValidationErrors = {};
        for (const error of data.errors) {
          newValidationErrors[error.path] = error.message;
        }
        setValidationErrors(newValidationErrors);
      } else {
        // Handle other errors
        setError(data.error || "An error occurred during signup");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="welcome-screen">
      <div className="center-container">
        <h1 className="welcome-text">
          ENTER <br /> YOUR DETAILS
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            className="input-field"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="input-field"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {validationErrors.email && (
            <p className="error-text">{validationErrors.email}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            className="input-field"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {validationErrors.password && (
            <p className="error-text">{validationErrors.password}</p>
          )}

          <input
            type="tel"
            placeholder="Phone"
            className="input-field"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <select
            className="input-field"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {validationErrors.gender && (
            <p className="error-text">{validationErrors.gender}</p>
          )}

          <input
            type="date"
            placeholder="DOB"
            className="input-field"
            name="dob"
            value={formData.dob ? formData.dob.split("T")[0] : ""} // Display only the date part
            onChange={handleChange}
          />

          <button
            type="submit"
            className="login-button phone-login"
            disabled={isLoading}
          >
            <div className="icon-circle">
              <img src={Person} alt="Person Icon" width="24" height="24" />
            </div>
            <div className="text-container">Sign Up</div>
          </button>
          {isLoading && (
            <div className="loading-animation">
              <Lottie options={defaultOptions} height={100} width={100} />
            </div>
          )}
          {error && <p className="error-text">{error}</p>}
        </form>
        <p className="signup-text">
          Already have an account?{" "}
          <Link to="/signin" className="signup-link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
