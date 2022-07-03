import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import billsRoutes from "./routes/billsRoutes.js";

const server = express();

server.use(cors());
server.use(express.json());

server.use(authRoutes);
server.use(billsRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT);
