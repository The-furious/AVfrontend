import React, { useState } from 'react';
import './forgotPassword.css';

function ForgotPassword({ onPasswordReset }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [otpValidated, setOtpValidated] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState('');

  const handleSendOtp = () => {
    // Implement logic to send OTP to the email
    // For now, let's just log the email and generate a random OTP
    console.log('Sending OTP to:', email);
    const generatedOtp = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit OTP
    console.log('Generated OTP:', generatedOtp);
    // You can send the OTP to the email here
  };

  const handleValidateOtp = () => {
    // Implement OTP validation logic
    // For now, let's just check if the entered OTP matches the expected OTP
    const expectedOtp = 1234; // Assume the expected OTP is 1234
    if (parseInt(otp) === expectedOtp) {
      setOtpValidated(true);
    } else {
      setOtpValidated(false);
      // Handle incorrect OTP
    }
  };

  const handleResetPassword = () => {
    if (newPassword !== repeatPassword) {
      setPasswordMatchError('Passwords do not match');
      return;
    }
    // Implement logic to reset the password
    // For now, let's just log the new password
    console.log('New password:', newPassword);
    // You can update the password in your backend here
    // Once the password is successfully reset, you can call onPasswordReset() to close the forgot password form
    onPasswordReset();
  };

  return (
    <div className="forgot-password-container">
      {!otpValidated ? (
        <div>
          <h2>Forgot Password</h2>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button onClick={handleSendOtp}>Send OTP</button>
          <label>Enter OTP:</label>
          <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button onClick={handleValidateOtp}>Validate OTP</button>
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
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
