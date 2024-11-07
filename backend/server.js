const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();
const app = express();



const OTP_EXPIRY = 5 * 60 * 1000;
// MongoDB connection setup
const uri = process.env.MONGO_URI || "mongodb+srv://<your-mongodb-username>:<your-mongodb-password>@cluster0.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  await client.connect();
  console.log("Connected to MongoDB database.");
}

connectDB();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Use CORS and allow requests from specific origins
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3009'], // Frontend ports
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true,
}));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || "e56957c56aba54fc727170e3d11154c07f903bcc6d19c10353f36a8f87dc5c872cbcc18c9a936f65797d736c2b756d07f5e77cf4c7353fb5d8bad61d33e57c86ce6d8832d242039dbd6de9ba1d1a79a98abbf83091a441f416baded054019eb673f6dbea29cffbc1b3c1ee367812b24f14e7edd93e031cc51b30d4da951b2786c1a382a9ea356126168cb6c522becfe13023e5a335bcbf87dd865cce04459b5c7d9a65719be4326a3d442b39435402419d3e582a0378f88c34408652488add835492be92341fc34174223f86e72920dece02eacdbfa4f10da2160f954b0cb9733eadf84f143afc0b94d02c5b34136f74c0a2abdb0f5c0dc3819495f2a611ac72";
const db = client.db("oceanbloom");
const usersCollection = db.collection("users");
const adminsCollection = db.collection("admin");
const pendingUsersCollection = db.collection("pendingUsers");
const activityCollection = db.collection("Activity");
// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token
  if (!token) return res.sendStatus(401); // Unauthorized
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user; // Add user info to request
    next();
  });
};

// Create a TTL index to automatically delete unverified users after 24 hours
pendingUsersCollection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 });

async function logUserActivity(userId, activityType, activityDetails) {
  const activity = { userId, activityType, activityDetails, timestamp: new Date() };
  await activityCollection.insertOne(activity);
}

// GET user profile
app.get("/api/user/profile", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(404).send("User not found");
    res.json({ name: user.name, email: user.email });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).send("Server error");
  }
});

// PUT update user profile
app.put("/api/user/profile", authenticateToken, async (req, res) => {
  const { username, password, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(404).send("User not found");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).send("Incorrect password");

    const hashedPassword = newPassword ? await bcrypt.hash(newPassword, 10) : user.password;
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { name: username || user.name, password: hashedPassword } }
    );
    res.send("Profile updated successfully");
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).send("Server error");
  }
});



// Signup route
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json("Please fill in all fields");
  }

  try {
    // Check if the user already exists in both pending and main collections
    const existingUser = await usersCollection.findOne({ email });
    const pendingUser = await pendingUsersCollection.findOne({ email });

    if (existingUser || pendingUser) {
      return res.status(409).json("Email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Insert unverified user into pendingUsers collection
    await pendingUsersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      createdAt: new Date(),  // Track creation date for TTL
    });

    const verificationLink = `http://localhost:5050/api/verify-email?token=${verificationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `<p>Please verify your email by clicking <a href="${verificationLink}">here</a>.</p>`,
    });
    res.status(201).json("Verification email sent. Please check your inbox.");
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json("Error registering user");
  }
});

// Verification route
app.get("/api/verify-email", async (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).json("Invalid verification token");

  try {
    // Find user in pending collection
    const pendingUser = await pendingUsersCollection.findOne({ verificationToken: token });
    if (!pendingUser) return res.status(400).json("Invalid or expired verification token");

    // Move the user to the main users collection
    await usersCollection.insertOne({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      isVerified: true,
    });

    // Remove the user from pending collection
    await pendingUsersCollection.deleteOne({ _id: pendingUser._id });

    res.json("Email verified successfully. You can now sign in.");
  } catch (error) {
    console.error("Error verifying email:", error.message);
    res.status(500).json("Server error");
  }
});

// Signin route
app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Please fill in all fields");
  }

  try {
    const user = await usersCollection.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(400).json("User not confirmed or does not exist.");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json("Invalid email or password");
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + OTP_EXPIRY;
    await usersCollection.updateOne({ email }, { $set: { otp, otpExpiry } });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your One-Time Password (OTP)",
      html: `<p>Your OTP is ${otp}. It is valid for 5 minutes.</p>`
    });
    res.json("OTP sent to your email. Please verify.");
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json("Server error during login");
  }
});

// OTP verification route
// OTP verification route
app.post("/api/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  // Validate the request body
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  try {
    // Find the user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Check if OTP is valid and not expired
    if (!user.otp || Date.now() > user.otpExpiry || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Clear OTP fields after successful verification
    await usersCollection.updateOne(
      { email },
      { $unset: { otp: "", otpExpiry: "" } }
    );

    // Create a JWT token
    const token = jwt.sign({ id: user._id, role: "user" }, JWT_SECRET, { expiresIn: "1h" });

    // Log user activity
    await logUserActivity(user._id, "Login", "User logged in with OTP");

    // Respond with the success message and JWT token
    res.json({
      message: "OTP verified successfully",
      token: token,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
});

app.get("/api/user/dashboard", authenticateToken, async (req, res) => {
  res.json({ message: "Welcome to the dashboard" });
});

app.get("/api/user/verify-token", authenticateToken, (req, res) => {
  // If the token is verified successfully, send a success message
  res.status(200).json({ message: "Token is valid" });
});
app.get("/api/user/logout", authenticateToken, async (req, res) => {
  try {
    // Optional: Log the logout activity
    await logUserActivity(req.user.id, "Logout", "User logged out");

    // Clear the client-side token by sending a success response.
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ message: "Server error during logout" });
  }
});
// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});