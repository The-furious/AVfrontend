import React, { useState } from 'react';
import axios from 'axios';
import './forgotPassword.css';

function ForgotPassword({ onPasswordReset }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [otpValidated, setOtpValidated] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resetPasswordError, setResetPasswordError] = useState('');
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  const clearErrors = () => {
    setTimeout(() => {
      setOtpError('');
      setResetPasswordError('');
      setPasswordMatchError('');
    }, 2000); // 5000 milliseconds = 5 seconds
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:8090/auth/createOTP', {
        username: email, // Use the email as the username
        otp: 0 // Initial OTP value, can be changed based on backend logic
      });
      console.log('OTP sent:', response.data);
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setOtpError('Error sending OTP. Please try again.');
      clearErrors();
    }
  };

  const handleValidateOtp = async () => {
    try {
      const response = await axios.post('http://localhost:8090/auth/verifyOTP', {
        username: email, // Use the email as the username
        otp: otp
      });
      console.log('OTP validated:', response.data);
      setOtpValidated(true);
    } catch (error) {
      console.error('Error validating OTP:', error);
      setOtpError('Invalid OTP. Please try again.');
      clearErrors();
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== repeatPassword) {
      setPasswordMatchError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8090/auth/changePassword', {
        username: email, // Use the email as the username
        password: newPassword
      });
      console.log('Password changed:', response.data);
      setPasswordResetSuccess(true); // Set the success message visibility
      onPasswordReset();
    } catch (error) {
      console.error('Error changing password:', error);
      setResetPasswordError('Error changing password. Please try again.');
      clearErrors();
    }
  };

  const handleCloseSuccessMessage = () => {
    setPasswordResetSuccess(false); // Close the success message popup
  };

  return (
    <div className="forgot-password-container">
      {!otpValidated ? (
        <div>
          <h2>Forgot Password</h2>
          <label>User_Name :</label>
          <input type="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button onClick={handleSendOtp}>Send OTP</button>
          {otpSent && (
            <>
              <label>Enter OTP:</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <button onClick={handleValidateOtp}>Validate OTP</button>
            </>
          )}
          {otpError && <span className="error">{otpError}</span>}
        </div>
      ) : (
        <div>
          <h2>Reset Password</h2>
          <label>New Password:</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <label>Repeat Password:</label>
          <input type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
          {passwordMatchError && <span className="error">{passwordMatchError}</span>}
          <button onClick={handleResetPassword}>Reset Password</button>
          {resetPasswordError && <span className="error">{resetPasswordError}</span>}
        </div>
      )}

      {/* Success message popup */}
      {passwordResetSuccess && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={handleCloseSuccessMessage}>&times;</span>
            <p>Password reset successful!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
