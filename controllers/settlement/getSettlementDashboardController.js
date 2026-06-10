import {
  getSettlementListData,
  getSettlementDashboardData,
} from "../../services/settlement/settlementDashboardService.js";

const getSettlementDashboardController = async (req, res) => {
  try {
    const dashboard = await getSettlementDashboardData();

    const settlements = await getSettlementListData();

    return res.status(200).json({
      success: true,
      data: {
        dashboard,
        settlements,
      },
    });
  } catch (error) {
    console.error("Error fetching settlement dashboard data:", error);

    return res.status(500).json({
      success: false,
      message: "An error occured while fetching settlement dashboard data",
    });
  }
};

export { getSettlementDashboardController };
