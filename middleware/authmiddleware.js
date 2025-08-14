const jwt = require("jsonwebtoken");
const AdminModel = require("../model/admin.model");

const adminauthMiddleware = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized. Token missing." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await AdminModel.findById(decoded.id);

    if (!user || !["admin"].includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Only admin  can perform this action." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token", error: error.message });
  }
};

module.exports = adminauthMiddleware;
