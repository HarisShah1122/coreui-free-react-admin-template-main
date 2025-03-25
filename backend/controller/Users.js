const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt"); 
const sequelize = require("../config/database");
const gatekeeper = require("./gatekeeper");
const validateUser = require("./validateUser");
const express = require("express");
const router = express.Router();
const Users = require("../models/Users");

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Login route (API)
  app.post(
    "/login",
    gatekeeper.unauthenticateUser,
    [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail(),
      body("password").notEmpty().withMessage("Password is required"),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: errors.array().map((err) => err.msg).join(", "),
        });
      }

      try {
        const user = await Users.findOne({ where: { email: req.body.email } });
        if (!user) {
          return res.status(404).json({ error: "User not found." });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials." });
        }

        req.session.username = req.body.email;
        return res.status(200).json({ message: "User successfully logged in." });
      } catch (error) {
        return res.status(500).json({ error: "Login failed: " + error.message });
      }
    }
  );

  // Signup route (API)
  app.post(
    "/signup",
    gatekeeper.unauthenticateUser,
    validateUser,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: errors.array().map((err) => err.msg).join(", "),
        });
      }

      try {
        // Hash password before saving
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        await Users.create({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: hashedPassword, 
        });

        return res.status(201).json({ message: "User registered successfully." });
      } catch (error) {
        return res.status(500).json({ error: "User registration failed: " + error.message });
      }
    }
  );

  app.get("/check-auth", (req, res) => {
    if (req.session.username) {
      return res.status(200).json({ message: "Authenticated" });
    }
    return res.status(401).json({ error: "Not authenticated" });
  });

  // Logout route (API)
  app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed: " + err.message });
      }
      return res.status(200).json({ message: "Logged out successfully." });
    });
  });
};
