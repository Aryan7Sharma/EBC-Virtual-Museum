import { Router } from "express";
import { storage } from "../../storage";
import { isAuthenticated } from "../../middleware/auth";
import crypto from "crypto";
import {
  getAuthorizationUrl,
  exchangeCodeForToken,
  fetchUserInfo,
  mapSSOUserToInternal,
} from "../../config/sso-config";
import { c } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

const router = Router();

// Store for CSRF state tokens (in production, use Redis or database)
const stateStore = new Map<string, { timestamp: number }>();

// Extend session type to include userId and ssoUser
declare module "express-session" {
  interface SessionData {
    userId?: string;
    ssoUser?: boolean;
    ssoState?: string;
  }
}

// Cleanup old state tokens (called periodically)
function cleanupOldStates() {
  const now = Date.now();
  const maxAge = 10 * 60 * 1000; // 10 minutes

  for (const [state, data] of Array.from(stateStore.entries())) {
    if (now - data.timestamp > maxAge) {
      stateStore.delete(state);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupOldStates, 5 * 60 * 1000);

// ============================================
// SSO ROUTES
// ============================================

// Initiate SSO login
router.get("/sso/login", (req, res) => {
  try {
    console.log("Initiating SSO login");
    // Generate random state for CSRF protection
    const state = crypto.randomBytes(32).toString('hex');
    console.log("Generated SSO state:", state);
    // Store state with timestamp
    stateStore.set(state, { timestamp: Date.now() });
    
    // Store state in session for verification
    req.session.ssoState = state;
    console.log("Stored SSO state in session:", req.session.ssoState);
    // Generate authorization URL
    const authUrl = getAuthorizationUrl(state);
    console.log("Generated SSO authorization URL:", authUrl);
    // Redirect user to SSO provider
    res.redirect(authUrl);
    console.log("Redirecting to SSO provider...");
  } catch (error) {
    console.error("Error initiating SSO login:", error);
    res.status(500).json({ message: "Failed to initiate SSO login" });
  }
});



// SSO callback handler
router.get("/sso/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    // Validate required parameters
    if (!code || !state) {
      return res.status(400).json({ message: "Missing authorization code or state" });
    }

    // Verify state for CSRF protection
    const sessionState = req.session.ssoState;
    if (!sessionState || sessionState !== state) {
      return res.status(403).json({ message: "Invalid state parameter - possible CSRF attack" });
    }

    // Verify state exists in store
    if (!stateStore.has(state as string)) {
      return res.status(403).json({ message: "State token expired or invalid" });
    }

    // Remove used state
    stateStore.delete(state as string);
    delete req.session.ssoState;

    // Exchange authorization code for access token
    const tokenData = await exchangeCodeForToken(code as string);
    
    // Fetch user info from SSO provider
    const ssoUserData = await fetchUserInfo(tokenData.access_token);
    
    // Map SSO user data to internal format
    const userData = mapSSOUserToInternal(ssoUserData);

    // Check if user exists
    let user = await storage.getUserByEmail(userData.email);

    if (user) {
      // User exists - update their info if needed
      if (userData.firstName && userData.lastName) {
        // You might want to add an update method to storage
        // For now, we'll just log in the existing user
        console.log("Existing SSO user logged in:", userData.email);
      }
    } else {
      // Create new user with SSO data
      // Generate a random password (user won't use it since they use SSO)
      const randomPassword = crypto.randomBytes(32).toString('hex');
      
      user = await storage.createUser(
        userData.email,
        randomPassword,
        userData.firstName,
        userData.lastName
      );
      
      console.log("New SSO user created:", userData.email);
    }

    // Set session
    req.session.userId = user.id;
    req.session.ssoUser = true; // Mark as SSO user

    // Redirect to home page or dashboard
    res.redirect('/');
  } catch (error) {
    console.error("Error in SSO callback:", error);
    res.redirect('/signin?error=sso_failed');
  }
});

// Check if user is SSO user
router.get("/sso/status", isAuthenticated, (req, res) => {
  res.json({
    isSSOUser: req.session.ssoUser || false,
  });
});

// ============================================
// EXISTING AUTH ROUTES
// ============================================

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password strength (minimum 8 characters)
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create user
    const user = await storage.createUser(email, password, firstName, lastName);

    // Set session
    req.session.userId = user.id;
    req.session.ssoUser = false;

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Failed to create account" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Verify credentials
    const user = await storage.verifyPassword(email, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Set session
    req.session.userId = user.id;
    req.session.ssoUser = false;

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

// Get current authenticated user
router.get("/user", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId!;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = user;
    res.json({
      ...userWithoutPassword,
      isSSOUser: req.session.ssoUser || false,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

export default router;