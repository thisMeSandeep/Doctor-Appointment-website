import jwt from "jsonwebtoken";

// admin authentication middleware

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
  
    if (!atoken) {
      return res.status(401).json({
        success: false,
        message: "Access denied",
      });
    }

    const decoded_token = jwt.verify(atoken, process.env.JWT_SECRET);

    if (decoded_token.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    next();
  } catch (err) {
    console.error(`Failed to authenticate admin: ${err.message}`);
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

export default authAdmin;
