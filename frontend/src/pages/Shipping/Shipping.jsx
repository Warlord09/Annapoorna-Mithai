import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Slider from "../../components/Slider/Slider";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import FooterBar from "../../components/FooterBar";

const Shipping = () => {
  const [cartItemCount, setCartItemCount] = useState(0);

  const updateCartItemCount = () => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = storedCart.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(count);
  };

  useEffect(() => {
    updateCartItemCount();
    window.addEventListener('storage', updateCartItemCount);
    return () => {
      window.removeEventListener('storage', updateCartItemCount);
    };
  }, []);

  return (
    <>
      <Navbar cartItemCount={cartItemCount} />
      <Slider />
      <div className="m-8 lg:mx-auto lg:max-w-screen-xl items-center text-[#606060]">
        <h1 className="text-xl font-bold mb-6 text-center">Shipping Policy</h1>
        <p className="mb-4">
          At AnnapoornaMithai Sweets & Bakery, we make it our priority to get our fresh, authentic sweets delivered to your doorstep quickly and hassle-free, ensuring a delightful experience every time. Please familiarize yourself with our shipping policy outlined below:
        </p>

        <h2 className="text-md font-semibold mt-6 mb-4">Shipping Areas:</h2>
        <p className="text-sm">
          We currently offer shipping Karnataka, Kerala and Tamilnadu. 
          If your location is not within our shipping areas, we apologize for the inconvenience and are unable to fulfill your order at this time.
        </p>

        <h2 className="text-md font-semibold mt-6 mb-4">Order Processing Time:</h2>
        <ul className="list-disc pl-6 text-sm">
          <li>Once your order is placed and payment is confirmed, we will process and prepare it for shipment.</li>
          <li>Our typical order processing time is 2 days, excluding weekends and holidays.</li>
          <li>Please note that during peak seasons or promotional periods, processing times may be slightly longer due to high order volumes.</li>
          <li>Customers who are ordering on weekends (Saturday / Sunday) orders will be dispatched from next working day.</li>
        </ul>

        <h2 className="text-md font-semibold mt-6 mb-4">Shipment Methods:</h2>
        <ul className="list-disc pl-6 text-sm">
          <li>We work with reputable shipping carriers to ensure the safe and timely delivery of your sweets.</li>
          <li>The specific carrier and shipping method used for your order may vary based on factors such as destination, package weight, and shipping preferences.</li>
        </ul>

        <h2 className="text-md font-semibold mt-6 mb-4">Estimated Delivery Time:</h2>
        <ul className="list-disc pl-6 text-sm">
          <li>The estimated delivery time will depend on the destination and the chosen shipping method.</li>
          <li>Standard shipping generally takes between 2–7 working days to arrive after the order has been processed.</li>
        </ul>
        <p className="text-sm">
          Please note that these are estimated delivery times, and actual delivery may be affected by unforeseen circumstances or delays caused by the shipping carrier.
        </p>

        <h2 className="text-md font-semibold mt-6 mb-4">Tracking and Order Status:</h2>
        <ul className="list-disc pl-6 text-sm">
          <li>Once your order is shipped, you will receive a confirmation email with tracking information.</li>
          <li>You can use the provided tracking number to monitor the progress of your shipment on the carrier's website or through our order tracking system.</li>
          <li>If you have any concerns about the status of your order, please feel free to reach out to our customer support team for assistance.</li>
        </ul>

        <h2 className="text-md font-semibold mt-6 mb-4">Packaging and Quality Assurance:</h2>
        <ul className="list-disc pl-6 text-sm">
          <li>We take utmost care in packaging our sweets to ensure they arrive in pristine condition.</li>
          <li>Special packaging methods are employed to maintain freshness and prevent any damage during transit.</li>
          <li>In the rare event that your package arrives damaged or with quality issues, please refer to our refund policy or contact our customer support team for further assistance.</li>
        </ul>

        <p className="mt-4 text-sm">
          If you have any additional questions or require further clarification regarding our shipping policy, please do not hesitate to reach out to our customer support team. We are here to assist you and provide an enjoyable shopping experience.
        </p>

        <h2 className="text-md font-semibold mt-6 mb-4">Contact Us</h2>
        <p className="text-sm">For all customer service inquiries, please Reach Us at:</p>
        <p className="text-sm">AnnapoornaMithai Sweets & Bakery</p>
        <p className="text-sm">Email: support@annapoornamithai.com</p>
        <p className="text-sm">Mobile: +919600200484</p>
      </div>
      <Footer />
      <FooterBar />
    </>
  );
};

export default Shipping;