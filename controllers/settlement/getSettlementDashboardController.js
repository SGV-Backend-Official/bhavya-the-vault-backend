import { RESPONSE_MESSAGES } from "../../constants/responseMessages.js";
import { STATUS_CODES } from "../../constants/statusCodes.js";
import {
  getSettlementListData,
  getSettlementDashboardData,
} from "../../services/settlement/settlementDashboardService.js";

const getSettlementDashboardController = async (req, res) => {
  try {
    const dashboard = await getSettlementDashboardData();

    const settlements = await getSettlementListData();

    return successResponse(
      res,
      RESPONSE_MESSAGES.COMMON.RECORDS_FETCHED,
      {
        dashboard,
        settlements,
      },
      STATUS_CODES.SUCCESS,
    );
  } catch (error) {
    console.error("Error fetching settlement dashboard data:", error);

    return errorResponse(
      res,
      RESPONSE_MESSAGES.COMMON.INTERNAL_SERVER_ERROR,
      error.message,
      STATUS_CODES.INTERNAL_SERVER_ERROR,
    );
  }
};

export { getSettlementDashboardController };
