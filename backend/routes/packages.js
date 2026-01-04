const express = require("express");
const router = express.Router();
const Package = require("../models/Package");

// Add new travel package
router.post("/", async (req, res) => {
  try {
    const newPackage = new Package(req.body);
    await newPackage.save();
    res.status(201).json({ message: "Package added successfully" });
  } catch (error) {
    console.error("Error adding package:", error);
    res.status(500).json({ error: "Failed to add package" });
  }
});

// Get all travel packages
router.get("/", async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ error: "Failed to fetch packages" });
  }
});

module.exports = router;
