import React, { useState } from 'react';
import './patientlogin.css';

function PatientSignUp({ setShowSignUp }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    sex: '',
    age: '',
    emailOTP: '',
    dateOfBirth: '',
    password: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    username: '',
  });

  const [emailValidated, setEmailValidated] = useState(false);
  const [otpValidated, setOTPValidated] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error message when the field is edited
    setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' }));

    // Password validation
    if (name === 'password') {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
      if (!passwordRegex.test(value)) {
        setPasswordError('Password must contain at least one lowercase letter, one uppercase letter, one number, one symbol, and have a minimum length of 8 characters');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleOTPValidation = () => {
    // Implement your OTP validation logic here
    setOTPValidated(true); // Assuming OTP validation is successful
  };

  const handleSendOTP = () => {
    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(formData.email)) {
      setEmailValidated(true);
      // Implement the logic to send OTP
      console.log('Sending OTP to:', formData.email);
    } else {
      setEmailValidated(false);
      setFormErrors(prevErrors => ({ ...prevErrors, email: 'Please enter a valid email address' }));
    }
  };

  const handlePincodeChange = (e) => {
    const { name, value } = e.target;
    // Restrict input to only numerical digits and limit length to 6 characters for pincode
    if (name === 'pincode' && /^\d{0,6}$/.test(value)) {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
      setPincodeError('');
    } else if (name !== 'pincode') {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    } else {
      setPincodeError('Please enter a valid pincode (6 numeric digits)');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length === 0) {
      console.log(formData); // You can do further processing with the form data here
    } else {
      setFormErrors(errors);
    }
  };

  const validateForm = (formData) => {
    const errors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'addressLine1' && key !== 'addressLine2' && key !== 'state' && key !== 'pincode' && key !== 'password' && !formData[key]) {
        errors[key] = 'This field is required';
      }
    });
    if (formData.password && passwordError) {
      errors.password = passwordError;
    }
    return errors;
  };

  const handleLoginClick = () => {
    setShowSignUp(false);
  };

  return (
    <div className="Patient">
      <h1>SignUp Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="name-container">
          <label>
            First Name<span className="required">*</span>:
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            {formErrors.firstName && <span className="error">{formErrors.firstName}</span>}
          </label>
          <label>
            Last Name<span className="required">*</span>:
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            {formErrors.lastName && <span className="error">{formErrors.lastName}</span>}
          </label>
        </div>
        <div className="sex-dob-container">
          <label>
            Sex<span className="required">*</span>:
            <select name="sex" value={formData.sex} onChange={handleChange}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {formErrors.sex && <span className="error">{formErrors.sex}</span>}
          </label>
          <label>
            Date of Birth<span className="required">*</span>:
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
            {formErrors.dateOfBirth && <span className="error">{formErrors.dateOfBirth}</span>}
          </label>
        </div>
        <label className="email-container">
          Email<span className="required">*</span>:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          <button type="button" onClick={handleSendOTP}>Send OTP</button>
          {emailValidated && <span style={{ color: 'green', marginLeft: '5px' }}>&#10004;</span>}
          {formErrors.email && <span className="error">{formErrors.email}</span>}
        </label>
        <div className="otp-container">
          <label>
            Email OTP:
            <input type="text" name="emailOTP" value={formData.emailOTP} onChange={handleChange} />
          </label>
          <button type="button" className="otp-button" onClick={handleOTPValidation}>Validate OTP</button>
        </div>
        <label>
          Phone Number<span className="required">*</span>:
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          {phoneError && <span className="error">{phoneError}</span>}
        </label>
        <label>
          Address Line 1:
          <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} />
        </label>
        <label>
          Address Line 2:
          <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} />
        </label>
        <div className="city-state-container">
          <label>
            City:
            <input type="text" name="city" value={formData.city} onChange={handleChange} />
          </label>
          <label>
            State :
            <input type="text" name="state" value={formData.state} onChange={handleChange} />
            {/* {formErrors.state && <span className="error">{formErrors.state}</span>} */}
          </label>
        </div>
        <label>
          Pincode:
          <input type="text" name="pincode" value={formData.pincode} onChange={handlePincodeChange} />
          {/* {pincodeError && <span className="error">{pincodeError}</span>} */}
        </label>
        <label className="username-password-container">
          Username<span className="required">*</span>:
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
          {formErrors.username && <span className="error">{formErrors.username}</span>}
        </label>
        <label className="username-password-container">
          Password<span className="required">*</span>:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
          {formErrors.password && <span className="error">{formErrors.password}</span>}
        </label>
        <button type="submit">Submit</button>
      </form>
      <button className='loginback' onClick={handleLoginClick}>Back to Login</button>
    </div>
  );
}

export default PatientSignUp;
