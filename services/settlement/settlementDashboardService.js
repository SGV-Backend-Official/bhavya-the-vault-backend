import { Settlement } from "../../models/settlement.js";

const getSettlementListData = async () => {
  const settlements = await Settlement.find({
    settlementStatus: { $ne: "paid" },
  })
    .populate("userId", "fullName profilePic")
    .sort({ createdAt: -1 });

  return settlements.map((item) => ({
    settlementId: item._id,

    userId: item.userID?._id,
    fullName: item.userId?.fullName || null,
    profilePic: item.userID?.profilePic || null,
    payableAmount: item.payableAmount,
    receivableAmount: item.receivableAmount,
    netAmount: item.netAmount,
    settlementStatus: item.settlementStatus,
    referenceType: item.referenceType,
    tournamentId: item.tournamentId,
  }));
};

const getSettlementDashboardData = async () => {
  const openDebts = await Settlement.aggregate([
    {
      $match: {
        settlementStatus: { $ne: "paid" },
        payableAmount: { $gt: 0 },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$payableAmount" },
        totalPlayers: { $sum: 1 },
      },
    },
  ]);

  const receivables = await Settlement.aggregate([
    {
      $match: {
        settlementStatus: { $ne: "paid" },
        receivableAmount: { $gt: 0 },
      },
    },

    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$receivableAmount" },
        totalPlayers: { $sum: 1 },
      },
    },
  ]);

  const lastBalanced = await Settlement.findOne({
    settlementStatus: "paid",
  }).sort({ updatedAt: -1 });

  return {
    openDebts: openDebts?.[0]?.totalAmount || 0,
    pendingReceivables: receivables?.[0]?.totalAmount || 0,
    playersToPay: openDebts?.[0]?.totalPlayers || 0,
    payoutOwed: receivables?.[0]?.totalPlayers || 0,
    lastBalancedAt: lastBalanced?.updatedAt || null,
  };
};

export { getSettlementListData, getSettlementDashboardData };
