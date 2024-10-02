require("dotenv").config({ path: "../config.env" });
// const db = require("../Modules/mysql");
const { db } = require("../firebaseAdmin");
const fs = require("fs");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const Razorpay = require("razorpay");
const pdf = require("html-pdf");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const twilio = require("twilio");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_KEY);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
exports.signupCustomer = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    console.log(req.body);

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new customer document in Firestore
    const customerData = {
      name,
      email,
      mobile,
      password: hashPassword,
      role: "customer",
    };

    // Use mobile number as the document ID or a unique ID for the customer
    const customerDocRef = db.collection("customers").doc(phone); // You can change this to a different unique identifier

    // Set the customer document
    await customerDocRef.set(customerData);

    return res.status(201).json({
      status: true,
      type: "Sign Up",
      message: "Sign Up Successful",
    });
  } catch (error) {
    console.error("Error inserting customer details:", error);
    return res
      .status(500)
      .json({ status: false, message: "Error inserting customer details" });
  }
};
console.log();


// Function to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// exports.sendOTP = async (req, res) => {
//   const { mobileNumber } = req.body; // Expect phone number in the request body
//   console.log(req.body);
//   try {
//     if (!mobileNumber) {
//       return res.status(400).send({ error: "Phone number is required" });
//     }

//     // Generate the OTP
//     const otp = generateOTP();

// await db.collection("login_otp").doc(mobileNumber).set(
//   {
//     mobileNumber: mobileNumber,
//     otp: otp,
//   },
//   { merge: true }
// ); // Merge to update if the document already exists
//     // Message to send via SNS
//     const message = `Your OTP for Login for AnnaPoorna Mithai is: ${otp}`;
//     // Send SMS via AWS SNS
//     // const params = {
//     //   Message: message,
//     //   PhoneNumber: phoneNumber, // E.164 format, e.g., +11234567890
//     // };
//     // const data = await snsClient.send(new PublishCommand(params));
//     // console.log("OTP sent successfully: ", data);
//     await client.messages.create({
//       body: `Your OTP is ${otp}`,
//       from: "+15085072466",
//       to: "+91" + mobileNumber,
//     });
//     res.status(200).send({ message: "OTP sent successfully", otp });
//   } catch (err) {
//     console.error("Error sending OTP: ", err);
//     res.status(500).send({ error: "Failed to send OTP" });
//   }
// };

// exports.sendOTP = async (req, res) => {
//   const { mobileNumber } = req.body;
//   try {
//     const userDocRef = db.collection("customers").doc(mobileNumber);
//     const userDoc = await userDocRef.get();

//     if (!userDoc.exists) {
//       return res.status(404).json({ status: false, message: "Register to continue" });
//     }

//     const response = await axios.get("https://api.msg91.com/api/v5/otp", {
//       params: {
//         template_id: process.env.MSG_TEMPLATE,
//         mobile: "91" + mobileNumber,
//         authkey: process.env.MSG_AUTH,
//         otp_length: 6, // Specify that the OTP should be 6 digits
//       },
//     });

//     console.log("OTP sent successfully:", response.data);
//   } catch (error) {
//     console.error(
//       "Error sending OTP:",
//       error.response ? error.response.data : error.message
//     );
//   }
// };

// exports.verifyOtp = async (req, res) => {
//   console.log("hii");
//   console.log(req.body);
//   const { mobileNumber, otp } = req.body;

//   try {
//     // Fetch user and OTP data from Firestore
//     console.log(`Searching OTP for mobileNumber: ${mobileNumber}`);
//     const otpQuerySnapshot = await db
//       .collection("login_otp")
//       .where("mobileNumber", "==", mobileNumber)
//       .get();

//     // Log the number of documents found
//     console.log(
//       `Found ${otpQuerySnapshot.size} document(s) for mobileNumber ${mobileNumber}`
//     );

//     // Check if any OTP document exists
//     console.log(otpQuerySnapshot.empty);
//     if (otpQuerySnapshot.empty) {
//       console.log(`No OTP found for mobileNumber: ${mobileNumber}`);
//       return res.status(404).json({ status: false, message: "OTP not found" });
//     }

//     // Extract the first matching document (assuming one OTP per mobileNumber)
//     const otpDoc = otpQuerySnapshot.docs[0];
//     const otpData = otpDoc.data();

//     console.log(`Fetched OTP from Firestore: ${otpData.otp}`);

//     // Fetch user data
//     const userDocRef = db.collection("customers").doc(mobileNumber);
//     const userDoc = await userDocRef.get();

//     if (!userDoc.exists) {
//       return res.status(404).json({ status: false, message: "User not found" });
//     }

//     const userRecord = userDoc.data();
//     console.log(userRecord);

//     // Verify OTP
//     if (otpData.otp !== otp) {
//       console.log(`Invalid OTP. Expected: ${otpData.otp}, Received: ${otp}`);
//       return res.status(400).json({ status: false, message: "Invalid OTP" });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       {
//         userName: userRecord.name,
//         email: userRecord.email,
//         mobile: userRecord.mobile,
//         role: userRecord.role,
//       },
//       SECRET_KEY,
//       { expiresIn: "1h" }
//     );

//     // Clean up OTP after successful login
//     await otpDoc.ref.delete(); // Delete the OTP document from Firestore

//     // Send token to the frontend
//     return res.status(200).json({
//       status: true,
//       message: "Login Successful",
//       token,
//       user: {
//         userName: userRecord.name,
//         email: userRecord.email,
//         mobile: userRecord.mobile,
//         role: userRecord.role,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ status: false, message: "Error validating OTP" });
//   }
// };

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  console.log("otp");
  try {
    const userDocRef = db.collection("customers").doc(email);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ status: false, message: "Register to continue" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await db.collection("login_otp").doc(email).set(
      {
        email: email,
        otp: otp,
      },
      { merge: true }
    );

    // Configure the email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Read the HTML template
    const templatePath = path.join(__dirname, "otpTemplate.html");
    let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

    // Replace the placeholder with the OTP
    htmlTemplate = htmlTemplate.replace("{{OTP}}", otp);

    // Send email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email, // Assuming the user document contains an email field
      subject: "Your OTP for Login to Annapoorna Mithai",
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);

    console.log("OTP sent successfully via email");

    res.json({
      status: true,
      message: "OTP sent successfully",
      otp: otp, // Optionally return the OTP for testing purposes, but remove this in production
    });
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    res.status(500).json({ status: false, message: "Error sending OTP" });
  }
};

// exports.verifyOtp = async (req, res) => {
//   console.log("Incoming request:", req.body);

//   const { mobileNumber, otp } = req.body;

//   try {

//     const userDocRef = db.collection("customers").doc(mobileNumber);
//     const userDoc = await userDocRef.get();

//     // Check if the user exists
//     if (!userDoc.exists) {
//       return res.status(404).json({
//         status: false,
//         message: "User not found. Please register.",
//       });
//     }

//     const response = await axios.get(
//       "https://control.msg91.com/api/v5/otp/verify",
//       {
//         params: {
//           otp: otp,
//           mobile: "91" + mobileNumber,
//           authkey: process.env.MSG_AUTH,
//         },
//       }
//     );

//     console.log("OTP verification successful:", response.data);

//     const userRecord = userDoc.data();
//     console.log(userRecord);

//     const token = jwt.sign(
//       {
//         userName: userRecord.name,
//         email: userRecord.email,
//         mobile: userRecord.mobile,
//         role: userRecord.role,
//       },
//       SECRET_KEY
//       // { expiresIn: "1h" }
//     );

//     // Send success response to client
//     return res.status(200).json({
//       status: true,
//       message: "Login Successful",
//       token,
//       user: {
//         userName: userRecord.name,
//         email: userRecord.email,
//         mobile: userRecord.mobile,
//         role: userRecord.role,
//       },
//     });
//   } catch (error) {
//     console.error(
//       "Error verifying OTP:",
//       error.response ? error.response.data : error.message
//     );

//     // Send error response to client
//     return res.status(400).json({
//       status: false,
//       message: "OTP verification failed",
//       error: error.response ? error.response.data : error.message,
//     });
//   }
// };

exports.verifyOtp = async (req, res) => {
  console.log("Incoming request:", req.body);

  const { email, otp } = req.body;

  try {
    // Fetch the user's document from Firestore
    const userDocRef = db.collection("customers").doc(email);
    const userDoc = await userDocRef.get();

    // Check if the user exists
    if (!userDoc.exists) {
      return res.status(404).json({
        status: false,
        message: "User not found. Please register.",
      });
    }

    const userRecord = userDoc.data();

    const otpDocRef = db.collection("login_otp").doc(email);
    const otpDoc = await otpDocRef.get();

    if (!otpDoc.exists) {
      return res.status(404).json({
        status: false,
        message: "OTP not found. Please request a new OTP.",
      });
    }

    const otpRecord = otpDoc.data();

    // Validate the OTP
    if (otpRecord.otp != otp) {
      return res.status(400).json({
        status: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    // OTP is valid, generate JWT token
    const token = jwt.sign(
      {
        userName: userRecord.name,
        email: userRecord.email,
        mobile: userRecord.mobile,
        role: userRecord.role,
      },
      SECRET_KEY
      // { expiresIn: "1h" } // Optionally set token expiration
    );

    console.log("OTP verification successful:", userRecord);

    // Send success response with JWT token
    return res.status(200).json({
      status: true,
      message: "Login Successful",
      token,
      user: {
        userName: userRecord.name,
        email: userRecord.email,
        mobile: userRecord.mobile,
        role: userRecord.role,
      },
    });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);

    // Send error response to client
    return res.status(500).json({
      status: false,
      message: "OTP verification failed",
      error: error.message,
    });
  }
};

exports.logoutCustomer = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
  });
  return res
    .status(200)
    .json({ status: true, message: "Logged out successfully" });
};

// const sendWhatsAppOrderData = async (userData) => {
//   console.log(userData);
//   const {
//     mobile,
//     userName,
//     orderId,
//     items,
//     totalAmount,
//     paymentStatus,
//     deliveryStatus,
//   } = userData;

//   const orderItems = items.map(
//     (item) =>
//       `${item.name} - ${item.weight}, ${item.quantity} quantity, ${item.price} \n`
//   );

//   const data = {
//     apiKey: process.env.AISENSY_KEY,
//     campaignName: "Order_Data",
//     destination: mobile, // Recipient's phone number
//     userName: userName, // Your username or identifier
//     templateParams: [
//       userName,
//       orderItems,
//       totalAmount,
//       paymentStatus,
//       deliveryStatus,
//     ], // Array of template parameters
//   };

//   try {
//     const response = await axios.post(
//       "https://backend.aisensy.com/campaign/t1/api/v2",
//       data,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("Message sent successfully:", response.data);
//   } catch (error) {
//     console.error(
//       "Error sending message:",
//       error.response ? error.response.data : error.message
//     );
//   }
// };

// const sendWhatsAppOrderData = async (userData) => {
//   console.log(userData);
//   const {
//     mobile,
//     userName,
//     orderId,
//     items,
//     totalAmount,
//     paymentStatus,
//     deliveryStatus,
//   } = userData;

//   // Convert order items array to a string, listing each item on a new line
//   const orderItems = items
//     .map(
//       (item) =>
//         `${item.name} - ${item.weight}, ${item.quantity} quantity, ₹${item.price}`
//     )
//     .join("\n"); // Join items into a single string with line breaks

//   const data = {
//     apiKey: process.env.AISENSY_KEY,
//     campaignName: "Order_Data",
//     destination: String(mobile), // Ensure mobile is a string
//     userName: String(userName),  // Ensure userName is a string
//     templateParams: [
//       String(userName),
//       orderItems, // Ensure the items are properly formatted as a single string
//       String(totalAmount),
//       String(paymentStatus),
//       String(deliveryStatus),
//     ], // Array of template parameters must all be strings
//   };

//   try {
//     const response = await axios.post(
//       "https://backend.aisensy.com/campaign/t1/api/v2",
//       data,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("Message sent successfully:", response.data);
//   } catch (error) {
//     console.error(
//       "Error sending message:",
//       error.response ? error.response.data : error.message
//     );
//   }
// };

const sendWhatsAppOrderData = async (userData) => {
  console.log(userData);
  const {
    mobile,
    userName,
    orderId,
    items,
    totalAmount,
    paymentStatus,
    deliveryStatus,
  } = userData;

  const orderItems = items
    .map(
      (item) =>
        `${item.name} - ${item.weight}, ${item.quantity} quantity, ₹ ${item.price}`
    )
    .join("");

  const data = {
    apiKey: process.env.AISENSY_KEY,
    campaignName: "Order_Data",
    destination: String(mobile), // Ensure mobile is a string
    userName: String(userName), // Ensure userName is a string
    templateParams: [
      String(userName),
      orderItems, // Ensure the items are properly formatted as a single string
      String(totalAmount),
      String(paymentStatus),
      String(deliveryStatus),
    ], // Array of template parameters must all be strings
    media: {
      url: "https://aisensy-project-media-library-stg.s3.ap-south-1.amazonaws.com/IMAGE/5f450b00f71d36faa1d02bc4/9884334_graffiti%20dsdjpg",
      filename: "demo-file",
    },
  };

  try {
    const response = await axios.post(
      "https://backend.aisensy.com/campaign/t1/api/v2",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response ? error.response.data : error.message
    );
  }
};

exports.createOrder = async (req, res) => {
  console.log("body in create order Route");
  console.log(req.body);
  console.log("user in create order Route");
  console.log(req.user);
  const { name, mobile, address, orderItems, totalPrice, user_mobile } =
    req.body;

  if (
    !name ||
    !mobile ||
    !address ||
    !orderItems ||
    !totalPrice ||
    !user_mobile
  )
    return res
      .status(400)
      .json({ status: false, message: "All Details are Needed" });

  const options = {
    amount: totalPrice * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };
  try {
    const order = await razorpay.orders.create(options);
    if (!order)
      return res
        .status(500)
        .json({ status: false, message: "Error in Creating Payment" });

    return res.status(201).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Error placing order" });
  }
};

const renderTemplate = (view, data) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.join(__dirname, "views", `${view}.ejs`),
      data,
      (err, html) => {
        if (err) return reject(err);
        resolve(html);
      }
    );
  });
};

// exports.verifyOrder = async (req, res) => {
//   const {
//     orderId,
//     paymentId,
//     razorpayOrderId,
//     razorpaySignature,
//     orderItems,
//     totalAmount,
//     email,
//     userName,
//     address,
//     mobile,
//     gst,
//     delivery,
//     user_mobile,
//     preorderDate,
//   } = req.body;

//   console.log("body in verify order route:", req.body);

//   const generatedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(`${razorpayOrderId}|${paymentId}`)
//     .digest("hex");

//   const finalTotalAmount = Number(totalAmount) + Number(gst) + Number(delivery);

//   if (generatedSignature === razorpaySignature) {
//     try {
//       console.log("Hash verified");

//       const preOrderDate = preorderDate || null;
//       const currentDate = new Date();

//       // Prepare order data to insert into Firestore
//       const orderData = {
//         transaction_id: orderId,
//         name: userName,
//         mobile: mobile,
//         address: address,
//         order_items: orderItems, // Firestore automatically stores as array
//         total_price: finalTotalAmount,
//         user_mobile: user_mobile,
//         created_at: currentDate,
//         preorder_date: preOrderDate,
//         payment_status: "paid",
//         delivery_status: "processing",
//       };

//       // Insert order data into Firestore
//       await db.collection("orders").add(orderData);
//       console.log("Order successfully saved to Firestore");

//       const userData = {
//         mobile: user_mobile,
//         userName: userName,
//         orderId: orderId,
//         items: orderItems,
//         totalAmount: finalTotalAmount,
//         paymentStatus: "Paid",
//         deliveryStatus: "Order in Processing",
//       };

//       // Generate bill data
//       const billData = {
//         orderId: orderId,
//         orderDate: new Date().toLocaleString(),
//         preOrderDate: preOrderDate,
//         paymentMethod: "Online",
//         customerName: userName,
//         customerAddress: address,
//         customerMobile: mobile,
//         customerEmail: email,
//         orderItems: orderItems,
//         itemTotal: totalAmount,
//         gst: gst,
//         delivery: delivery,
//         finalAmount: finalTotalAmount,
//       };

//       console.log("bill data:", billData);

//       // Render HTML for bill
//       const html = await renderTemplate("bill", billData);

//       // Generate PDF from HTML
//       const pdfBuffer = await new Promise((resolve, reject) => {
//         pdf
//           .create(html, { format: "A4", border: "10mm" })
//           .toBuffer((err, buffer) => {
//             if (err) return reject(err);
//             resolve(buffer);
//           });
//       });

//       // Configure Nodemailer for email sending
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: "muhilkumaran@gmail.com",
//           pass: "lkmvwumfkxzfblxe",
//         },
//       });

//       const mailOptions = {
//         from: "muhilkumaran@gmail.com",
//         to: email,
//         subject: `Invoice - Order ${orderId}`,
//         text: `Dear ${userName},\n\nPlease find attached the invoice for your recent purchase.\n\nThank you for shopping with us!`,
//         attachments: [
//           {
//             filename: `invoice-${orderId}.pdf`,
//             content: pdfBuffer,
//             contentType: "application/pdf",
//           },
//         ],
//       };

//       // Send email with the PDF attachment
//       await new Promise((resolve, reject) => {
//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error) return reject(error);
//           resolve(info);
//         });
//       });

//       // Send success response to client
//       res
//         .status(200)
//         .json({ status: true, message: "Payment Successful and email sent" });
//     } catch (error) {
//       console.log("Error processing order:", error);
//       res.status(500).json({ status: false, error: "Failed to process order" });
//     }
//   } else {
//     res.status(400).json({ status: false, error: "Invalid Payment signature" });
//   }
// };

exports.verifyOrder = async (req, res) => {
  const {
    orderId,
    paymentId,
    razorpayOrderId,
    razorpaySignature,
    orderItems,
    totalAmount,
    email,
    userName,
    address,
    mobile,
    gst,
    delivery,
    user_mobile,
    preorderDate,
  } = req.body;

  console.log("body in verify order route:", req.body);

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${paymentId}`)
    .digest("hex");

  const finalTotalAmount = Number(totalAmount) + Number(gst) + Number(delivery);

  if (generatedSignature === razorpaySignature) {
    try {
      console.log("Hash verified");

      const preOrderDate = preorderDate || null;
      const currentDate = new Date();

      // Fetch the number of documents in the 'orders' collection
      const orderCountSnapshot = await db.collection("orders").get();
      const orderCount = orderCountSnapshot.size;

      console.log("Total orders so far:", orderCount);

      // Prepare order data to insert into Firestore
      const orderData = {
        order_id: orderCount + 1,
        transaction_id: orderId,
        name: userName,
        mobile: mobile,
        address: address,
        order_items: orderItems, // Firestore automatically stores as array
        total_price: finalTotalAmount,
        user_mobile: user_mobile,
        created_at: currentDate,
        preorder_date: preOrderDate,
        payment_status: "paid",
        delivery_status: "processing",
        // Assign the next order number
      };

      // Insert order data into Firestore
      await db.collection("orders").add(orderData);
      console.log("Order successfully saved to Firestore");

      const userData = {
        mobile: user_mobile,
        userName: userName,
        orderId: orderId,
        items: orderItems,
        totalAmount: finalTotalAmount,
        paymentStatus: "Paid",
        deliveryStatus: "Order in Processing",
      };

      // Generate bill data
      const billData = {
        orderId: orderCount + 1,
        orderDate: new Date().toLocaleString(),
        preOrderDate: preOrderDate,
        paymentMethod: "Online",
        customerName: userName,
        customerAddress: address,
        customerMobile: mobile,
        customerEmail: email,
        orderItems: orderItems,
        itemTotal: totalAmount,
        gst: gst,
        delivery: delivery,
        finalAmount: finalTotalAmount,
      };

      console.log("bill data:", billData);

      // Render HTML for bill
      const html = await renderTemplate("bill", billData);

      // Generate PDF from HTML
      const pdfBuffer = await new Promise((resolve, reject) => {
        pdf
          .create(html, { format: "A4", border: "10mm" })
          .toBuffer((err, buffer) => {
            if (err) return reject(err);
            resolve(buffer);
          });
      });

      // Configure Nodemailer for email sending
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: [email,process.env.GMAIL_USER],
        subject: `Invoice - Order ${orderCount + 1}`,
        text: `Dear ${userName},\n\nPlease find attached the invoice for your recent purchase.\n\nThank you for shopping with us!`,
        attachments: [
          {
            filename: `invoice-${orderCount + 1}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      };

      // Send email with the PDF attachment
      await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) return reject(error);
          resolve(info);
        });
      });

      // Send success response to client
      res
        .status(200)
        .json({ status: true, message: "Payment Successful and email sent" });
    } catch (error) {
      console.log("Error processing order:", error);
      res.status(500).json({ status: false, error: "Failed to process order" });
    }
  } else {
    res.status(400).json({ status: false, error: "Invalid Payment signature" });
  }
};

exports.sendContactUs = async (req, res) => {
  try {
    const { name, mobile, message } = req.body;

    // Create a transport object with Gmail configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Define the HTML content for the email
    const htmlContent = `
      <html>
      <head>
        <style>
          .email-body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
          }
          .header {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
          }
          .content {
            margin: 20px;
          }
          .footer {
            text-align: center;
            font-size: 0.8em;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="email-body">
          <div class="header">
            <h2>FEEDBACK</h2>
          </div>
          <div class="content">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Mobile:</strong> ${mobile}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          </div>
          <div class="footer">
            <p>Thank you for reaching out!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: "Someone Tried To Contact You",
      html: htmlContent,
    };

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) return reject(error);
        resolve(info);
      });
    });

    // Respond with success message
    return res
      .status(200)
      .json({ status: true, message: "Email Sent Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Failed to Send Email" });
  }
};

exports.webhook = async (req, res) => {
  const secret = "YOUR_WEBHOOK_SECRET";
  // Verify the webhook signature
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    // Handle the event based on its type
    const event = req.body.event;
    const paymentEntity = req.body.payload.payment.entity;

    if (event === "payment.captured") {
      const orderId = paymentEntity.order_id;
      try {
        const updateSQL =
          "UPDATE customer_orders SET payment_status = ? where transaction_id =?";
        const updateResult = await new Promise((resolve, reject) => {
          db.query(updateSQL, ["paid", orderId], (err, result) => {
            if (err) {
              return reject(err);
            }
            resolve(result);
          });
        });

        if (updateResult.affectedRows > 0) {
          const SQL = "SELECT * from customer_orders  where transaction_id =?";
          const result = await new Promise((resolve, reject) => {
            db.query(SQL, [orderId], (err, result) => {
              if (err) {
                return reject(err);
              }
              resolve(result);
            });
          });
          const orderData = result[0];
          sendWhatsAppOrderData(orderData);

          return res
            .status(200)
            .json({ status: true, message: "Payment updated to paid" });
        }
      } catch (err) {
        console.error("Failed to update order status:", err);
        res
          .status(500)
          .json({ status: false, message: "Database update failed" });
      }
    } else {
      res.status(400).json({ status: false, message: "event not handled" });
    }
  } else {
    res.status(400).json({ status: false, message: "invalid signature" });
  }
};

// exports.getOrders = async (req, res) => {
//   try {
//     const { mobileNumber } = req.query;
//     console.log("In get order");
//     console.log(req.query);
//     console.log(mobileNumber);
//     if (!mobileNumber)
//       return res.status(400).json({
//         status: false,
//         message: "mobileNumber is required to Fetch orders",
//       });
//     // const sql = "SELECT * FROM customer_orders WHERE user_mobile = ? LIMIT 4";
//     const sql =
//       "SELECT * FROM customer_orders WHERE user_mobile = ? ORDER BY created_at DESC";
//     const result = await new Promise((resolve, reject) => {
//       db.query(sql, [mobileNumber], (err, result) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve(result);
//       });
//     });
//     return res.status(200).json({ status: true, result: result });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ status: false, message: "Error fetching orders" });
//   }
// };

exports.getOrders = async (req, res) => {
  try {
    const { email } = req.query;
    console.log("In get order");
    console.log(req.query);
    console.log(email);

    // Check if mobileNumber is provided
    if (!email) {
      return res.status(400).json({
        status: false,
        message: "email is required to fetch orders",
      });
    }

    // Query Firestore to get orders by user_mobile, ordered by created_at (timestamp) in descending order
    const ordersSnapshot = await db
      .collection("orders")
      .where("user_mobile", "==", email)
      .orderBy("created_at", "desc")
      .get();

    // Check if there are no orders found
    if (ordersSnapshot.empty) {
      return res.status(200).json({ status: true, result: [] });
    }

    // Extract order data from snapshot
    const orders = ordersSnapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(),
    }));

    // Send the orders in the response
    return res.status(200).json({ status: true, result: orders });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Error fetching orders" });
  }
};
