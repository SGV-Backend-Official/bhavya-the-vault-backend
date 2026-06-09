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
      default: "Tournament",
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
    }, // To track which blind level is currently active in the running tournament, which blind level is currently active during gameplay. It is used for blind progression and timer management.

    numberOfLevels: {
      type: Number,
      required: true,
    }, // stores how many blind levels exist in the tournament

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
    totalPrizePool: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Tournament = model("Tournament", tournamentSchema);

export { Tournament };
