import { Schema, model } from "mongoose";

const gameSchema = new Schema(
  {
    gameName: {
      type: String,
      required: true,
      trim: true,
    },

    gameType: {
      type: String,
      enum: ["Cash Game", "Tournament"],
      default: "Cash Game",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    rake: {
      type: Number,
      default: 0,
    },
    gameDate: {
      type: Date,
      required: true,
    },

    gameTime: {
      type: String,
      required: true,
      trim: true,
    },

    players: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },

    playerResults: [
      {
        player: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        amount: Number,
      },
    ],
  },
  { timestamps: true },
);

const Game = model("Game", gameSchema);

export { Game };
