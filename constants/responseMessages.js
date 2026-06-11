export const RESPONSE_MESSAGES = {
  COMMON: {
    INTERNAL_SERVER_ERROR: "An internal server error occurred",
    UNAUTHORIZED: "Unauthorized access",
    RECORDS_FETCHED: "Records fetched successfully",
    RECORD_CREATED: "Record created successfully",
    RECORD_UPDATED: "Record updated successfully",
    RECORD_DELETED: "Record deleted successfully",
  },

  AUTH: {
    LOGIN_SUCCESS: "Login successful",
    SIGNUP_SUCCESS: "Account created successfully",
    INVALID_CREDENTIALS: "Invalid email or password",
    OTP_VERIFIED: "OTP verified successfully",
  },

  TOURNAMENT: {
    CREATED: "Tournament created successfully",
    STARTED: "Tournament started successfully",
    COMPLETED: "Tournament completed successfully",
    NOT_FOUND: "Tournament not found",
    WINNER_DECLARED: "Winner declared successfully",
  },

  SETTLEMENT: {
    CREATED: "Settlements created successfully",
    UPDATED: "Settlement status updated successfully",
    NOT_FOUND: "Settlement not found",
  },
};
