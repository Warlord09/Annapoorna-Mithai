import React, { useContext,useState } from 'react';
import { CartContext } from '../context/CartContext'; // Adjust the import path as needed

const AddressForm = ({ onClose, setHasVerified }) => {
  const { formData, updateFormData, addAddress } = useContext(CartContext);
  const [isPreOrder, setIsPreOrder] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handlePreOrderChange = (e) => {
    setIsPreOrder(e.target.value === 'yes');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addAddress();
    onClose();
    setHasVerified(false);
  };

  // Calculate the minimum date for pre-order (1 week from today)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 7);
  const minDateString = minDate.toISOString().split('T')[0];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-xl p-8 w-[400px] relative max-h-[90vh] overflow-y-auto">
      <button onClick={onClose} className="absolute top-4 right-4">
        <img src="closeoverlay.svg" alt="Close" />
      </button>
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className="mr-2">←</span> Personal & Delivery Address
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Please enter the required details to create your account
      </p>
      <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[#FAAF40] mb-2">PERSONAL DETAILS*</h3>
            <input
              type="text"
              name="name"
              value={formData.name}
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
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[#FAAF40] mb-2">DELIVERY DETAILS*</h3>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
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
              value={formData.landmark}
              onChange={handleChange}
              placeholder="Landmark"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder="Enter your Address"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your mail Id"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[#FAAF40] mb-2">PRE-ORDER OPTION</h3>
            <select
              name="preOrder"
              onChange={handlePreOrderChange}
              className="w-full p-2 border rounded"
            >
              <option value="no">No, I want standard delivery</option>
              <option value="yes">Yes, I want to pre-order</option>
            </select>
          </div>
          {isPreOrder && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-[#FAAF40] mb-2">SELECT PRE-ORDER DATE</h3>
              <input
                type="date"
                name="preOrderDate"
                min={minDateString}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#332D21] text-white font-bold py-3 px-4 rounded-lg"
          >
            Proceed to next
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;