import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
  (req, res) => {
    // Create JWT token after successful authentication
    if (!req.user) {
      return res.redirect('http://localhost:5173/login?error=authentication_failed');
    }

    const token = jwt.sign(
      { 
        userId: req.user._id,
        id: req.user._id, // Adding id field to match your format
        role: req.user.role || 'user',
        email: req.user.email,
        name: req.user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Debug log
    console.log('Created token for user:', {
      userId: req.user._id,
      role: req.user.role,
      email: req.user.email
    });

    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/auth/success?token=${token}`);
  }
);

export default router;