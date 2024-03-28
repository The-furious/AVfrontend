import React, { useState } from 'react';
import './patientlogin.css';
import axios from 'axios';

const IndianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const IndianCities = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Kakinada', 'Kadapa', 'Anantapur', 'Chittoor', 'Kadapa'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Namsai', 'Roing', 'Tezu'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Karimganj', 'Dhubri'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Durg', 'Raigarh', 'Korba', 'Bilaspur', 'Rajnandgaon', 'Jagdalpur', 'Ambikapur', 'Mahasamund'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Ponda', 'Mapusa', 'Bicholim', 'Curchorem'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Nadiad', 'Mehsana'],
  'Haryana': ['Faridabad', 'Gurgaon', 'Hisar', 'Panipat', 'Ambala', 'Rohtak', 'Karnal', 'Sonipat', 'Yamunanagar', 'Panchkula'],
  'Himachal Pradesh': ['Shimla', 'Mandi', 'Solan', 'Dharamshala', 'Una', 'Kullu', 'Bilaspur', 'Hamirpur', 'Nahan', 'Sundarnagar'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City', 'Deoghar', 'Phusro', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur', 'Shimoga'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Kannur', 'Kottayam', 'Alappuzha', 'Kollam'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati', 'Nanded'],
  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Kakching', 'Nambol', 'Lilong', 'Wangoi', 'Sugnu', 'Lamsang', 'Mayang Imphal'],
  'Meghalaya': ['Shillong', 'Tura', 'Nongstoin', 'Jowai', 'Baghmara', 'Williamnagar', 'Nongpoh', 'Resubelpara', 'Ampati', 'Mairang'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib', 'Serchhip', 'Lawngtlai', 'Saitual', 'Saitual', 'Khawhai'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Phek', 'Zunheboto', 'Kiphire', 'Longleng'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jeypore'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot', 'Moga', 'Firozpur', 'Hoshiarpur'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Sikar', 'Pali'],
  'Sikkim': ['Gangtok', 'Namchi', 'Mangan', 'Singtam', 'Gyalshing', 'Rangpo', 'Soreng', 'Jorethang', 'Nepalganj']
};

function PatientSignUp({ setShowSignUp }) {
  const [formData, setFormData] = useState({
    name : '',
    email: '',
    contactNumber: '',
    sex: '',
    age: '',
  
    dateOfBirth: '',
    password: '',
    address: '',
    weight : '',
    height : '',
    bloodGroup: '',
    country:'',
    city: '',
    state: '',
    pincode: '',
    username: '',
  });
  const cityOptions = IndianCities[formData.state] || [];

 
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
  const handlePhoneNumberChange = (e) => {
    const { name, value } = e.target;
    // Restrict input to only numerical digits and limit length to 10 characters for phone number
    if (name === 'contactNumber' && /^\d{0,10}$/.test(value)) {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
      setPhoneError('');
    } else if (name !== 'contactNumber') {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    } else {
      setPhoneError('Please enter a valid phone number (10 numeric digits)');
    }
  };
  

  const handleSubmit = async (e) => {
       e.preventDefault();
    // const errors = validateForm(formData);
  
    // if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post('http://localhost:8090/patient/createPatient', formData);
        console.log('Response from backend:', response.data);
        // Handle success response from backend
      } catch (error) {
        console.error('Error:', error.response.data);
        // Handle error response from backend
      }
    // } else {
    //   setFormErrors(errors);
    // }
  };

  const validateForm = (formData) => {
    const errors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'address'  && key !== 'state' && key !== 'pincode' && key !== 'password' && !formData[key]) {
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
            Name<span className="required">*</span>:
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
            {formErrors.firstName && <span className="error">{formErrors.name}</span>}
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
     </label>
        <label>
          Phone Number<span className="required">*</span>:
          <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handlePhoneNumberChange} />
          
        </label>
        <label>
          Address :
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </label>
       
        <div className="city-state-container">
        <label>
          Country:
          <input type="text" name="country" value={formData.country} onChange={handleChange} />
       
        </label>
          <label>
            State:
            <select name="state" value={formData.state} onChange={handleChange}>
              <option value="">Select</option>
              {IndianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>
          <label>
            City:
            <select name="city" value={formData.city} onChange={handleChange}>
              <option value="">Select</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Pincode:
          <input type="text" name="pincode" value={formData.pincode} onChange={handlePincodeChange} />
          {/* {pincodeError && <span className="error">{pincodeError}</span>} */}
        </label>
        <label>
          Weight:
          <input type="text" name="weight" value={formData.weight} onChange={handleChange} />
        </label>
        <label>
          Height:
          <input type="text" name="height" value={formData.height} onChange={handleChange} />
        </label>
        <label>
          Blood Group:
          <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} />
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
