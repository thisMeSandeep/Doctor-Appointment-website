import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
 

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied ! no token found",
      });
    }

    const decoded_jwt = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded_jwt) {
      return res.status(401).json({
        success: false,
        message: "Token verification failed",
      });
    }

    req.body.userId = decoded_jwt.id;

    next();
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default authUser;
