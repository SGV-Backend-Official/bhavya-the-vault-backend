import { Schema, model } from "mongoose";

const settlementSchema = new Schema(
  {
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    payableAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    receivableAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    netAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    settlementStatus: {
      type: String,
      enum: ["pending", "reminded", "paid"],
      default: "pending",
    },

    referenceType: {
      type: String,
      enum: ["tournament"],
      default: "tournament",
    },
  },
  {
    timestamps: true,
  },
);

const Settlement = model("Settlement", settlementSchema);

export { Settlement };
