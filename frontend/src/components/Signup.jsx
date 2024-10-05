import React, { useState } from 'react';
import axios from 'axios';
import Loader from './Loader/Loader';
import VerificationSuccess from './VerificationSuccess';

const SignupForm = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post("https://us-central1-annapoornamithai-webapp.cloudfunctions.net/app/customers/signup", {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password
      });
      if (response.data.status) {
       
        onClose();
      } else {
        alert("Failed");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      alert("An error occurred while creating your account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async() =>{
    const response = await axios.post("https:www.annapoornamithai.com/customers/signup",{
        name,
        email,
        mobile,
        password
    });
    response.data.status ? alert("Success") : alert("Failed");
}

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-8 w-[400px] relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4">
          <img src="closeoverlay.svg" alt="Close" />
        </button>
        <h2 className="text-xl font-bold mb-4 flex items-center">
          Create Account
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Please enter the required details to create your account
        </p>
        <form onSubmit={handleCreateAccount}>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[#FAAF40] mb-2">PERSONAL DETAILS*</h3>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[#FAAF40] mb-2">SECURITY*</h3>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#332D21] text-white font-bold py-3 px-4 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;