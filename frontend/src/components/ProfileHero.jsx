import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader/Loader";
import Login from "./Login";
import AddressForm from "./AddressForm";
import OTPVerification from "./OTPVerification";
import VerificationSuccess from "./VerificationSuccess";
import axios from "axios";


const ProfileHero = () => {
  const { setLoggedIn } = useContext(CartContext);
  const { formData, updateFormData, loggedin, inputValue, setInputValue } =
    useContext(CartContext);
  const [localFormData, setLocalFormData] = useState(formData);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  const [showError, setShowError] = useState(false);

  const [buttonPressed, setButtonPressed] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);
  const [showOrderPlaced, setShowOrderPlaced] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const handleSendOtp = () => {
    setShowLogin(true);
    console.log(cartItems);
  };

  const handleMobileNumber = async (isResend = false) => {
    if (!isResend && inputValue.length !== 10) {
      setShowError(true);
      return;
    }

    if (isResend) {
      setShowLogin(false);
      setShowOTPVerification(true);
    }

    try {
      console.log("Sending OTP to:", inputValue);
      const response = await axios.post(
        "https://us-central1-annapoornamithai-webapp.cloudfunctions.net/app/customers/send-otp",
        { email: inputValue },
        { withCredentials: true }
      );
      console.log("OTP send response:", response.data);
      // Handle successful OTP send (e.g., show a success message)
    } catch (error) {
      console.error("Error sending OTP:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      if (isResend) {
        setShowOTPVerification(false);
        setShowLogin(true);
        setShowError(true);
      }
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  const handlePlaceOrder = async () => {
    try {
      setButtonPressed(true);
      console.log(document.cookie); // This might not show HttpOnly cookies
      console.log(cartItems);
      // Step 1: Create an order in your backend to get an order ID
      const authToken = localStorage.getItem("authToken");
      const address =
        formData.addressLine1 +
        " " +
        formData.landmark +
        "," +
        formData.pincode;
      // Make sure authToken exists
      if (!authToken) {
        throw new Error("No authentication token found. Please log in.");
      }
      const cart = localStorage.getItem("cart");
      const response = await axios.post(
        "https://us-central1-annapoornamithai-webapp.cloudfunctions.net/app/customers/orders",
        {
          totalPrice: total.toFixed(2),
          currency: "INR",
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          user_mobile: inputValue,
          address: address,
          role: "customer",
          orderItems: cartItems,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.status) {
        setButtonPressed(false);
      }
      const order = response.data;
      console.log(order);

      // Step 2: Initiate the Razorpay payment
      const options = {
        key: "rzp_test_ZyVKG8K6k1Gol1",
        amount: order.amount,
        currency: "INR",
        name: "Your Store Name",
        description: "Order Payment",
        order_id: order.id,
        handler: async (response) => {
          try {
            console.log(formData);
            console.log(subtotal);
            console.log(gst);
            console.log(delivery);
            setIsLoading(true);
            const paymentResponse = await axios.post(
              "https://us-central1-annapoornamithai-webapp.cloudfunctions.net/app/customers/verify-order",
              {
                orderId: order.id,
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                orderItems: cartItems,
                totalAmount: subtotal.toFixed(2),
                gst: gst.toFixed(2),
                delivery: delivery,
                email: formData.email,
                userName: formData.name,
                address: address,
                mobile: formData.mobile,
                user_mobile: inputValue,
                preorderDate: formData.preOrderDate,
              },
              {
                withCredentials: true,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authToken}`, // Use authToken here, not token
                },
              }
            );

            const result = paymentResponse.data;
            if (result.status) {
              setShowOrderPlaced(true);
              clearCart();

              // Redirect to order confirmation page or show a success message
            } else {
              alert(
                "Payment successful but failed to update order. Please contact support."
              );
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Error verifying payment. Please contact support.");
          } finally {
            setIsLoading(false); // Stop loading regardless of outcome
            setButtonPressed(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email, // Fixed typo in email
          contact: formData.mobile, // Changed to string for consistency
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            setButtonPressed(false);
            console.log("Razorpay payment modal closed");
          },
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error creating order:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
      alert("Failed to create order. Please try again.");
    }
  };
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerificationSuccess = () => {
    setIsVerified(true);
  };

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateFormData(localFormData);
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error("Error updating data:", error);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    setLocalFormData("");
    navigate("/");
  };

  return (
    <div>
      {/* Left side - Profile Card */}

      {loggedin ? (
        <div className="flex flex-col md:flex-row gap-8 p-6 max-w-6xl mx-auto">
          <div className="md:w-1/3">
            <div className="bg-[#C2B280] rounded-lg p-6 text-center">
              <img
                src="/path-to-avatar-image.jpg"
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h2 className="text-xl font-bold text-white mb-2">
                {formData.name || "Your Name"}
              </h2>
              <p className="text-white mb-4">
                {formData.mobile || "Your Phone "}
              </p>
              <button className="bg-white text-[#C2B280] px-4 py-2 rounded-full">
                Edit Profile
              </button>
            </div>
            <div className="mt-6 bg-white rounded-lg p-6 shadow">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <span className="mr-2">📍</span> Delivery Address
                </li>
                <li
                  className="flex items-center cursor-pointer"
                  onClick={() => navigate("/orders")}
                >
                  <span className="mr-2">📜</span> Order History
                </li>
                <li
                  className="flex items-center cursor-pointer"
                  onClick={() => navigate("/terms")}
                >
                  <span className="mr-2"></span> Terms And Conditions{" "}
                </li>
                <li
                  className="flex items-center cursor-pointer"
                  onClick={() => navigate("/privacy")}
                >
                  <span className="mr-2"></span> Privacy Policy{" "}
                </li>
                <li
                  className="flex items-center cursor-pointer"
                  onClick={() => navigate("/shipping")}
                >
                  <span className="mr-2"></span> Shipping and Delivery Policy
                </li>

                <li
                  className="flex items-center cursor-pointer"
                  onClick={() => navigate("/refund")}
                >
                  <span className="mr-2"></span> Refund Policy
                </li>
                <li className="flex items-center cursor-pointer">
                  <span className="mr-2">📞</span> Contact Us
                </li>
                <li
                  className="flex items-center cursor-pointer"
                  onClick={handleLogout}
                >
                  <span className="mr-2">🚪</span> Logout
                </li>
              </ul>
            </div>
          </div>

          {/* Right side - Address Form */}
          <div className="md:w-2/3">
            <h2 className="text-xl font-bold mb-4">
              Personal & Delivery Address
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Please enter the required details to create your account
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#FAAF40] mb-2">
                  PERSONAL DETAILS*
                </h3>
                <input
                  type="text"
                  name="name"
                  value={localFormData.name || ""}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="mobile"
                  value={localFormData.mobile || ""}
                  onChange={handleChange}
                  placeholder="Mobile"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="email"
                  value={localFormData.email || ""}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#FAAF40] mb-2">
                  DELIVERY DETAILS*
                </h3>
                <input
                  type="text"
                  name="pincode"
                  value={localFormData.pincode || ""}
                  onChange={handleChange}
                  placeholder="Pin code"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="landmark"
                  value={localFormData.landmark || ""}
                  onChange={handleChange}
                  placeholder="Landmark"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-6">
                <input
                  type="text"
                  name="addressLine1"
                  value={localFormData.addressLine1 || ""}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#332D21] text-white font-bold py-3 px-4 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save details"}
              </button>
            </form>
            <div className="mt-4 text-center">
              {isLoading && <Loader />}
              {showSuccess && (
                <div className="text-green-500 font-semibold">
                  Details updated successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
        <div className="flex justify-center mb-4">
        <button className=" bg-[#332D21] text-white font-bold py-3 px-4 rounded-lg mt-6" onClick={()=>setShowLogin(true)}>Login to View Details</button>

        </div>
        {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <Login
            setShowLogin={setShowLogin}
            setShowOTPVerification={setShowOTPVerification}
            setInputValue={setInputValue}
            handleMobileNumber={handleMobileNumber}
          />
        </div>
      )}
      {showOTPVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <OTPVerification
            setShowOTPVerification={setShowOTPVerification}
            onVerificationSuccess={handleVerificationSuccess}
            setLoggedIn={setLoggedIn}
            hasVerified={hasVerified}
            setHasVerified={setHasVerified}
            handleMobileNumber={()=>handleMobileNumber(true)}
          />
        </div>
      )}

      {hasVerified && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <VerificationSuccess
        
            setShowOTPVerification={setShowOTPVerification}
            setShowAddressForm={setShowAddressForm}
          ></VerificationSuccess>
        </div>
      )}

      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <AddressForm onClose={() => setShowAddressForm(false)} setHasVerified={setHasVerified} />
        </div>
      )}
        </div>
      )}
    </div>
  );
};

export default ProfileHero;
