import jwt from "jsonwebtoken";
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    //check if token exists

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    //extract token
    const token = authHeader.split(" ")[1];

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //attach decoded user data
    req.user = decoded;

    //proceed to next middleware
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export { authMiddleware };

//purpose of this middleware is to protect routes by verifying the presence and validity of a JWT token in the Authorization header of incoming requests. If the token is valid, it attaches the decoded user information to the request object and allows the request to proceed. If the token is missing, invalid, or expired, it responds with an appropriate error message and status code.
