import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import passport from "passport";
import session from "express-session";
import "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";

// missing imports for HTTP server and sockets
import http from "http";
import { Server as IOServer } from "socket.io";

dotenv.config();
const app = express();



// Configure CORS with proper origin and credentials
// 'http://localhost:5173',
// 'http://127.0.0.1:5173',
const allowedOrigins = [
  "https://restaurant1-eight.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL
].filter(Boolean);

// Middleware to log origin for debugging
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    console.log(`[CORS DEBUG] Request Origin: ${origin}`);
    if (allowedOrigins.includes(origin)) {
      console.log(`[CORS DEBUG] Origin Allowed`);
    } else {
      console.log(`[CORS DEBUG] Origin NOT in allowed list`);
    }
  }
  next();
});

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));





import MongoStore from 'connect-mongo';

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || '4d4c72bdf2399c78c4c3fcaf000b8fe0',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // Ensure this env var is set on Render
    collectionName: 'sessions',      // Optional: defaults to 'sessions'
    ttl: 24 * 60 * 60                // Optional: 1 day in seconds
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  },
  proxy: true
}));

// Initialize passport and session
app.set("trust proxy", 1);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());


app.use("/api/auth", googleAuthRoutes); // Mount Google auth routes at /api/auth
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => res.send("Restaurant API is running"));

app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // create HTTP server and attach Socket.IO
    const httpServer = http.createServer(app);
    const io = new IOServer(httpServer, {
      cors: {
        origin: allowedOrigins,
        credentials: true,
      },
    });

    // store io instance on app so it can be accessed in controllers
    app.set("io", io);

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      socket.on("joinUser", (userId) => {
        if (userId) {
          socket.join(userId);
          console.log(`Socket ${socket.id} joined room ${userId}`);
        }
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
      });
    });

    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
