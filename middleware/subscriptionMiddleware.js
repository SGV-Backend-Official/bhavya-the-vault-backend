import { User } from "../models/User.js";

const subscriptionMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.subscriptionStatus !== "active") {
      return res.status(403).json({
        success: false,
        message: "Subscription required to access this resource",
      });
    }

    next();
  } catch (error) {
    console.error("Subscription Middleware Error:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while checking subscription status",
    });
  }
};

export { subscriptionMiddleware };

// The purpose of this middleware is to check if the authenticated user has an active subscription before allowing access to certain protected routes. It retrieves the user's subscription status from the database and responds with an appropriate error message if the subscription is inactive or if the user is not found. If the subscription is active, it allows the request to proceed to the next middleware or route handler.
