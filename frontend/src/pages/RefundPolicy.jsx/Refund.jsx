import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Slider from "../../components/Slider/Slider";
import Footer from "../../components/Footer";
import FooterBar from "../../components/FooterBar";

const Refund = () => {
  const [cartItemCount, setCartItemCount] = useState(0);

  const updateCartItemCount = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = storedCart.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(count);
  };

  useEffect(() => {
    updateCartItemCount();
    window.addEventListener("storage", updateCartItemCount);
    return () => {
      window.removeEventListener("storage", updateCartItemCount);
    };
  }, []);

  const PolicySection = ({ title, content }) => (
    <div className="mb-6">
      <h2 className="font-bold font-Nunito text-[16px] text-[#606060] mb-2">
        {title}
      </h2>
      <div className="font-[400] text-[14px] font-Nunito text-[#606060]">
        {content}
      </div>
    </div>
  );

  return (
    <div>
      <Navbar cartItemCount={cartItemCount} />
      <Slider />
      <div className="m-8 lg:mx-auto lg:max-w-screen-xl items-center">
        <h1 className="mb-6 font-Nunito text-[24px] font-bold text-[#606060] text-center">
          Refund Policy
        </h1>

        <PolicySection
          title="1. Eligibility for Refunds"
          content={
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Damaged or Spoiled Products: If you receive a product that is
                damaged, spoiled, or otherwise inedible due to our fault, you
                may be eligible for a refund or replacement.
              </li>
              <li>
                Incorrect Order: If the items you received do not match the
                items listed in your order confirmation (wrong product, missing
                items, etc.), we will provide a replacement or issue a refund.
              </li>
              <li>
                Product Quality Issues: If the product does not meet the quality
                standards promised (stale, bad taste, etc.), and it is reported
                within the stipulated time frame, we will investigate and may
                offer a replacement or refund.
              </li>
            </ul>
          }
        />

        <PolicySection
          title="2. Reporting an Issue"
          content={
            <div>
              <p>
                To report an issue and request a refund or replacement, please
                contact our customer service team within 24 hours of receiving
                your order. Include the following information:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Order number</li>
                <li>Photos of the product(s) showing the issue</li>
                <li>
                  Description of the issue (e.g., damaged packaging, incorrect
                  item, spoiled product, etc.)
                </li>
              </ul>
            </div>
          }
        />

        <PolicySection
          title="3. Refund Process"
          content={
            <p>
              Once we receive your request, our team will review it and notify
              you of the approval or rejection of your refund within 3-5
              business days. If your request is approved, we will initiate a
              refund to your original method of payment. The refund may take
              5-10 business days to reflect in your account, depending on your
              payment provider.
            </p>
          }
        />

        <PolicySection
          title="4. Non-Refundable Situations"
          content={
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Change of Mind: We do not provide refunds for orders where the
                customer has simply changed their mind.
              </li>
              <li>
                Incorrect Address or Failure to Collect: If the order was not
                delivered due to an incorrect address provided by the customer
                or was not collected by the customer, we will not provide a
                refund.
              </li>
              <li>
                Late Complaints: Complaints made beyond{" "}
                <span className="font-bold">24 hours</span> after delivery will
                not be eligible for a refund or replacement.
              </li>
            </ul>
          }
        />

        <PolicySection
          title="5. Exchange Policy"
          content={
            <p>
              In certain cases where a refund is not possible, we may offer an
              exchange of the product. The exchange will be subject to product
              availability and shipping considerations. Any additional shipping
              costs for exchanges will be borne by the customer unless it is due
              to our error.
            </p>
          }
        />

        <PolicySection
          title="6. Cancellations"
          content={
            <p>
              Orders can only be cancelled within{" "}
              <span className="font-bold">1 hour</span> of placing the order,
              provided the order has not been dispatched. To cancel an order,
              please contact our customer service team immediately. After this
              time, we cannot guarantee cancellation, and the order may be
              subject to our regular refund policy.
            </p>
          }
        />

        <PolicySection
          title="7. Contact Us"
          content={
            <div>
              <p>
                If you have any questions about our Refund Policy, please
                contact us at:
              </p>
              <p className="font-bold mt-2">AnnapoornaMithai Sweets & Bakery</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:support@annapoornamithai.com"
                  className="text-blue-600 hover:underline"
                >
                  support@annapoornamithai.com
                </a>
              </p>
              <p>Mobile: +919600200484</p>
            </div>
          }
        />

        <div className="mt-6">
          <h3 className="font-bold font-Nunito text-[16px] text-[#606060] mb-2">
            Return Address:
          </h3>
          <p className="font-[400] text-[14px] font-Nunito text-[#606060]">
            AnnapoornaMithai Sweets & Bakery
            <br />
            12/2, Ram Nagar, Bypass Road, Near Aparna Towers,
            <br />
            Madurai, TamilNadu 625010
          </p>
          <p className="mt-2 font-[400] text-[14px] font-Nunito text-[#606060]">
            Depending on your location, the time it may take for your exchanged
            product to reach you may vary.
          </p>
        </div>
      </div>
      <Footer />
      <FooterBar cartItemCount={cartItemCount} />
    </div>
  );
};

export default Refund;
