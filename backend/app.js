const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");
const customerRoutes = require("./Routes/customerRoutes");
const menuRoutes = require("./Routes/menuRoutes");
const { db } = require("./firebaseAdmin");
const adminRoutes = require("./Routes/adminRoutes");
const pincode = require("./Modules/validPincode");
const path = require("path");
const pdf = require("html-pdf");
const axios = require("axios");
const featueRoutes = require("./Routes/featureRoutes");
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://annapoorna-mithais.onrender.com",
    ], // or your production frontend URL
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("api/menus", menuRoutes);
app.use("api/customers", customerRoutes);
app.use("api/admin", adminRoutes);
app.use("api/feature", featueRoutes);
// app.post("/test", async (req, res) => {
//   const { pincode } = req.body;
//   try {
//     const response = await axios.get(
//       `https://api.postalpincode.in/pincode/${pincode}`
//     );

//     console.log(response);
//     const postOffices = response.data[0]?.PostOffice || [];
//     if (postOffices.length > 0) {
//       const state = postOffices[0].State;
//       const district = postOffices[0].District;
//       console.log("hii");
//       // Check if the state is Tamil Nadu, Karnataka, or Kerala
//       if (!["Tamil Nadu", "Karnataka", "Kerala"].includes(state)) {
//         const pincodeData = {
//           pincode: pincode,
//           state: state,
//           district: district,
//         };

//         const pincodeRef = db.collection("pincodes").doc();
//         await pincodeRef.set(pincodeData);

//         return res
//           .status(400)
//           .json({ status: false, message: "Not deliverable" });
//       }
//     } else {
//       return res
//         .status(400)
//         .json({ status: false, message: "Invalid PinCode" });
//     }
//     return res.status(200).json({ message: "success" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Error fetching pincode data" });
//   }
// });

// app.post("/comparePrice", (req, res) => {
//   const { minimumOrderValue, cartValue } = req.body;
//   if (cartValue >= minimumOrderValue) {
//     res.json({
//       status: true,
//       message: "Cart value meets the minimum order requirement.",
//     });
//   } else {
//     res.json({
//       status: false,
//       message: "Cart value is below the minimum order requirement.",
//     });
//   }
// });
// app.post("/finalAmount", (req, res) => {
//   const { totalAmount, taxPercentage, discountPercentage, deliveryFee } =
//     req.body;

//   const taxAmount = (totalAmount * taxPercentage) / 100;

//   const discountAmount = (totalAmount * discountPercentage) / 100;

//   const finalAmount = totalAmount + taxAmount - discountAmount + deliveryFee;

//   res.json({
//     totalAmount,
//     taxAmount,
//     discountAmount,
//     deliveryFee,
//     finalAmount,
//   });
// });

module.exports = app;
