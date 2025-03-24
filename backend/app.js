// require("dotenv").config();
// const express = require("express");
// const app = express();
// const config = require("./config/config");
// const { Sequelize } = require("sequelize");
// const sequelize = require("./config/database");
// const jwt = require("jsonwebtoken"); 

// const bodyParser = require("body-parser");
// const path = require("path");
// const session = require("express-session");
// const SequelizeStore = require("connect-session-sequelize")(session.Store);
// const flash = require("connect-flash");
// const User = require("./models/Users");
// const Prescription = require("./models/Prescription");

// const cors = require("cors");

// app.use(cors({
//   origin: "http://localhost:3001", 
//   credentials: true,
// }));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json({ limit: "50mb" }));

// const JWT_SECRET = process.env.JWT_SECRET || "8Kj9mPq2v";

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   console.log("Authorization Header:", authHeader);
//   const token = authHeader && authHeader.split(" ")[1]; 
//   if (!token) {
//     return res.status(401).json({ error: "Access denied, no token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     console.log("Decoded Token:", decoded); 
//     req.user = decoded; 
//     next();
//   } catch (error) {
//      console.error("Token Verification Error:", error); 
//     res.status(403).json({ error: "Invalid token" });
//   }
// };


// app.post("/signup", async (req, res) => {
//   try {
//     const { firstname, lastname, email } = req.body;
//     if (!firstname || !lastname || !email) {
//       return res.status(400).json({ error: "All fields are required" });
//     }
//     const newUser = await User.create({ firstname, lastname, email });
//     const token = jwt.sign(
//       { id: newUser.id, email: newUser.email },
//       JWT_SECRET,
//       { expiresIn: "24h" }
//     );
//     res.status(201).json({ message: "User registered successfully", token });
//   } catch (error) {
//     console.error("Signup Error:", error);
//     if (error.name === "SequelizeUniqueConstraintError") {
//       return res.status(400).json({ error: "Email already in use" });
//     }
//     res.status(500).json({ error: "Registration failed", details: error.message });
//   }
// });
// app.post("/login", async (req, res) => {
//   try {
//     console.log("Login Request Body:", req.body);
//     const { email } = req.body;
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

    
//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       JWT_SECRET,
//       { expiresIn: "24h" } 
//     );

//     res.status(200).json({ message: "User logged in successfully", token });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ error: "Login failed", details: error.message });
//   }
// });


// app.post("/save_prescription", authenticateToken, async (req, res) => {
//   try {
//     console.log("Request Body:", req.body); 
//     console.log("Authenticated User:", req.user); 

//     const prescriptionData = req.body;
//     const requiredFields = [
//       "erx_no", "erx_date", "prescriber_id", "member_id", "payer_tpa",
//       "emirates_id", "reason_of_unavailability", "physician", "prescription_date",
//       "patient_name", "gender", "date_of_birth", "weight", "mobile", "email", "fill_date",
//       "drugs", "diagnoses"
//     ];

    
//     for (const field of requiredFields) {
//       if (!prescriptionData[field]) {
//         return res.status(400).json({ error: `${field} is required` });
//       }
//     }

//     console.log("Prescription Data to Save:", prescriptionData);


//     const newPrescription = await Prescription.create(prescriptionData);
//     res.status(201).json({ message: "Prescription saved successfully", id: newPrescription.id });
//   } catch (error) {
//     console.error("Prescription Save Error:", error);
//     res.status(500).json({ error: "Failed to save prescription", details: error.message });
//   }
// });
// app.get("/home", (req, res) => {
//   res.status(200).json({ message: "Welcome to the Home Page!" });
// });

// app.use(express.static(path.join(__dirname, "../client/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/build", "index.html"));
// });

// require("./controller/Users")(app);
// require("./controller/PrescriptionController")(app);

// const port = process.env.PORT || config.port;
// sequelize
//   .sync({ force: false })
//   .then(() => {
//     console.log("Database synced successfully");
//     app.listen(port, () => {
//       console.log(`Server running on port ${port}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Error syncing database:", error);
//   });