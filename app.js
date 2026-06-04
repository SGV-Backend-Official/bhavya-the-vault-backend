import express, { json } from "express";
import cors from "cors";
import { authRoutes } from "./routes/authRoutes.js";
import { gameRoutes } from "./routes/gameRoutes.js";
import { playerRoutes } from "./routes/playerRoutes.js";
import { tournamentRoutes } from "./routes/tournamentRoutes.js";

const app = express();

app.use(cors());
app.use(json());

app.use("/api/auth/", authRoutes);
app.use("/api/game/", gameRoutes);
app.use("/api/player/", playerRoutes);
app.use("/api/tournament/", tournamentRoutes);
export { app };
