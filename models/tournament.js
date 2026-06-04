import { Schema, model } from "mongoose";

const blindLevelSchema = new Schema(
  {
    level: {
      type: Number,
      required: true,
    },

    smallBlind: {
      type: Number,
      required: true,
    },

    bigBlind: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const tournamentPlayerSchema = new Schema(
  {
    player: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rebuyCount: {
      type: Number,
      default: 0,
    },

    isEliminated: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    currentStack: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const tournamentSchema = new Schema(
  {
    gameType: {
      type: String,
      required: true,
    },
    tournamentCode: {
      type: String,
      required: true,
      unique: true,
    },

    startingStack: {
      type: Number,
      required: true,
    },

    blindInterval: {
      type: Number,
      required: true,
    },

    buyInAmount: {
      type: Number,
      required: true,
    },

    tournamentFee: {
      type: Number,
      required: true,
    },

    rebuyAllowed: {
      type: Boolean,
      default: false,
    },

    payoutStructure: {
      type: String,
      enum: ["winner_takes_all", "top_3"],
      required: true,
    },

    blindLevels: [blindLevelSchema],

    players: [tournamentPlayerSchema],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    currentLevel: {
      type: Number,
      default: 1,
    },
    numberOfLevels: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["lobby", "active", "completed"],
      default: "lobby",
    },

    isTimerPaused: {
      type: Boolean,
      default: false,
    },

    winner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    endedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Tournament = model("Tournament", tournamentSchema);

export { Tournament };
