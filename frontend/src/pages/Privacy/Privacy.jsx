import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Slider from "../../components/Slider/Slider";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import FooterBar from "../../components/FooterBar";

const Privacy = () => {
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
        <h1 className="text-lg font-bold mb-6 ">Privacy Policy</h1>
        <p className="mb-4">Effective Date: 07-09-2024</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">PRIVACY STATEMENT</h2>

        <h2 className="text-md font-semibold mt-6 mb-4"> 1. WHAT DO WE DO WITH YOUR INFORMATION?</h2>
        <p className="text-sm font-normal ">
          When you make a purchase from our store, we collect personal information such as your name, address, and email address as part of the buying and selling process. Additionally, when you browse our store, we automatically receive your computer's IP address to help us understand more about your browser and operating system.
        </p>
        <p className="text-sm font-normal ">

          If you opt-in, we may send you emails about our store, new products, and other updates.
        </p>

        <h2 className="text-md font-semibold mt-6 mb-4"> 2. CONSENT</h2>
        <h3 className="text-md font-semibold mt-4 mb-2">How do you get my consent?</h3>
        <p className="text-sm font-normal ">
          When you provide personal information to complete a transaction, verify your credit card, place an order, arrange a delivery, or return a purchase, we assume you consent to our collecting and using it for that specific purpose.
          For secondary purposes, such as marketing, we will either ask for your explicit consent or provide you with the option to decline.
        </p>
        <h3 className="text-md font-semibold mt-4 mb-2">How do I withdraw my consent?</h3>
        <p className="text-sm font-normal ">
          If you change your mind after opting in, you may withdraw your consent for us to contact you or for the continued collection, use, or disclosure of your information at any time by contacting us at support@annapoornamithai.com.
        </p>

        <h2 className="text-md font-semibold mt-6 mb-4"> 3. DISCLOSURE</h2>
        <p className="text-sm font-normal ">
          We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.
        </p>

        <h2 className="text-md font-semibold mt-6 mb-4"> 4. PAYMENT</h2>
        <p className="text-sm font-normal ">
          We use Razorpay to process payments. Neither we nor Razorpay store your card details on their servers. All payment data is encrypted through the Payment Card Industry Data Security Standard (PCI-DSS) during processing. Your transaction data is only used as necessary to complete your purchase. After completion, your transaction details are not saved.
        </p>
        <p className="text-sm font-normal ">
          Our payment gateway follows the PCI-DSS standards as managed by the PCI Security Standards Council, which includes brands like Visa, MasterCard, American Express, and Discover. These standards help ensure the secure handling of credit card information.
        </p>
        <p className="text-sm font-normal ">
          For more information, you may review Razorpay's terms and conditions at https://razorpay.com.
        </p>

        <h2 className="text-md font-semibold mt-6 mb-4"> 5. THIRD-PARTY SERVICES</h2>
        <p className="text-sm font-normal ">
          Generally, third-party providers used by us will collect, use, and disclose your information only to the extent necessary to perform the services they offer.
        </p>
        <p className="text-sm font-normal ">
          However, third-party payment processors, such as Razorpay, have their own privacy policies. We recommend reviewing their policies to understand how they handle your personal information.
        </p>
        <p className="text-sm font-normal ">
          Please note that some providers may operate in jurisdictions different from yours or ours. If you proceed with a transaction involving a third-party provider, your information may be subject to the laws of the jurisdiction in which the provider or its facilities are located.
        </p>
        <p className="text-sm font-normal ">
          Once you leave our website or are redirected to a third-party website, this Privacy Policy and our Terms of Service no longer apply.
        </p>
        <h3 className="text-md font-semibold mt-4 mb-2">Links</h3>
        <p className="text-sm font-normal ">
          When you click on links on our store, they may direct you away from our site. We are not responsible for the privacy practices of other sites and encourage you to read their privacy statements.
        </p>

        <h2 className="text-md font-semibold mt-6 mb-4"> 6. SECURITY</h2>
        <p className="text-sm font-normal ">
          To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.
        </p>

        <h2 className="text-md font-semibold mt-6 mb-4"> 7. COOKIES</h2>
        <p className="text-sm font-normal ">
          We use cookies to maintain session of your user. It is not used to personally identify you on other websites.
        </p>

        <h2 className="text-md font-semibold mt-6 mb-4"> 8. AGE OF CONSENT</h2>
        <p className="text-sm font-normal ">
          By using this site, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
        </p>

        <h2 className="text-md font-semibold mt-6 mb-4"> 9. CHANGES TO THIS PRIVACY POLICY</h2>
        <p className="text-sm font-normal ">
          We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will take effect immediately upon their posting on the website. If we make material changes to this policy, we will notify you here that it has been updated, so that you are aware of what information we collect, how we use it, and under what circumstances, if any, we use and/or disclose it.
        </p>
        <p className="text-sm font-normal ">
          If our store is acquired or merged with another company, your information may be transferred to the new owners so that we may continue to sell products to you.
        </p>

        <h2 className="text-md font-semibold mt-6 mb-4">Contact Us</h2>
        <p className="text-sm font-normal ">
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
        </p>
        <p className="text-sm font-normal ">AnnapoornaMithai Sweets & Bakery</p>
        <p className="text-sm font-normal ">Email: support@annapoornamithai.com</p>
        <p className="text-sm font-normal ">Mobile: +919600200484</p>
      </div>
      <Footer />
      <FooterBar />
    </>
  );
};

export default Privacy;