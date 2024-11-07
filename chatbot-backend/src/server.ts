import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import apiGateway from "./api-gateway";

const app = express();
const PORT = 5000;

// Configure CORS middleware globally
app.use(
  cors({
    origin: [
      'http://frontend-service',
      'http://localhost:30080',
      'http://frontend-service.default.svc.cluster.local',
      'http://localhost',
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    exposedHeaders: ["Content-Length", "X-Kuma-Revision"],
  })
);

// Body parser middleware
app.use(bodyParser.json());

// Define API routes
app.use("/api", apiGateway);

// Handle OPTIONS preflight requests if needed
app.options('*', (req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
