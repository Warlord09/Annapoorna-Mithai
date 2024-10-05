require("dotenv").config({ path: "../config.env" });
const db = require("../Modules/mysql");
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

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.signupCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO customers (name,phone,email,password) VALUES (?,?,?,?)";
    const result = await new Promise((resolve, reject) => {
      db.query(sql, [name, phone, email, hashPassword], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });

    return res.status(201).json({
      status: true,
      type: "Sign Up",
      message: "Sign Up Successful",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Error inserting customer details" });
  }
};
// Function to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  console.log(otp);
  try {
    const sql = `INSERT INTO login_otp (email, otp) 
                 VALUES (?, ?)  
                 ON DUPLICATE KEY UPDATE 
                 otp = VALUES(otp)`;
    const result = await new Promise((resolve, reject) => {
      db.query(sql, [email, otp], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
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

exports.verifyOtp = async (req, res) => {
  console.log("Incoming request:", req.body);

  const { email, otp } = req.body;

  try {
    // Fetch the user's document from Firestore
    const sql = `SELECT 
          customers.name, 
          customers.mobile, 
          customers.email, 
          customers.password, 
          login_otp.otp, 
          login_otp.expiresAt
      FROM 
          customers
      JOIN 
          login_otp 
      ON 
          customers.mobile = login_otp.mobile
      WHERE 
          login_otp.mobile = ?`;

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [mobileNumber], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });

    if (result.length === 0) {
      return res.status(404).json({ status: false, message: "OTP not found" });
    }

    const userRecord = result[0];

    // Validate the OTP
    if (userRecord.otp !== otp) {
      return res.status(400).json({ status: false, message: "Invalid OTP" });
    }

    // OTP is valid, generate JWT token
    const token = jwt.sign(
      {
        userName: userRecord.name,
        email: userRecord.email,
        mobile: userRecord.mobile,
      },
      SECRET_KEY
      // { expiresIn: "1h" } // Optionally set token expiration
    );

    const deleteSQL = `DELETE FROM login_otp WHERE mobile = ?`;
    const deleteResult = await new Promise((resolve, reject) => {
      db.query(deleteSQL, [mobileNumber], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });

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
    amount: Number(totalPrice)*100,
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
      const sql =
        "INSERT INTO customer_orders (transaction_id, name, mobile, address,order_items,total_price,created_at,preorder_date,payment_status,delivery_status,user_mobile) VALUES (?,?,?,?)";
      const result = await new Promise((resolve, reject) => {
        db.query(
          sql,
          [
            orderId,
            userName,
            mobile,
            address,
            orderItems,
            finalTotalAmount,
            currentDate,
            preOrderDate,
            "paid",
            "processing",
            user_mobile,
          ],
          (err, result) => {
            if (err) {
              return reject(err);
            }
            resolve(result);
          }
        );
      });

      // Prepare order data to insert into Firestore
      // const orderData = {
      //   order_id: orderCount + 1,
      //   transaction_id: orderId,
      //   name: userName,
      //   mobile: mobile,
      //   address: address,
      //   order_items: orderItems, // Firestore automatically stores as array
      //   total_price: finalTotalAmount,
      //   user_mobile: user_mobile,
      //   created_at: currentDate,
      //   preorder_date: preOrderDate,
      //   payment_status: "paid",
      //   delivery_status: "processing",
      //   // Assign the next order number
      // };

      // Generate bill data

      const sqlId = `SELECT order_id FROM customer_orders WHERE transaction_id = ?`;

      const resultId = await new Promise((resolve, reject) => {
        db.query(sqlId, [orderId], (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });

      const order_id = resultId[0].order_id;

      const billData = {
        orderId: order_id,
        orderDate: currentDate,
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
        to: [email, process.env.GMAIL_USER],
        subject: `Invoice - Order ${resultId}`,
        text: `Dear ${userName},\n\nPlease find attached the invoice for your recent purchase.\n\nThank you for shopping with us!`,
        attachments: [
          {
            filename: `invoice-${resultId}.pdf`,
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

    const sql = `SELECT * FROM customers WHERE  user_email = ?`;
    // Check if there are no orders found

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [email], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });

    return res.status(200).json({ status: true, result: result });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Error fetching orders" });
  }
};
