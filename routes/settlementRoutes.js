import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getSettlementDashboardController } from "../controllers/settlement/getSettlementDashboardController.js";

const router = Router();

router.get("/dashboard", authMiddleware, getSettlementDashboardController);

export { router as settlementRoutes };
