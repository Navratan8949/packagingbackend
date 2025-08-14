const jwt = require("jsonwebtoken");
const ClientModel = require("../model/client.model");

const clientauthMiddleware = async (req, res, next) => {
  try {
    const clientToken = req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!clientToken) {
      return res.status(401).json({ message: "Unauthorized. Token missing." });
    }

    const decoded = jwt.verify(clientToken, process.env.JWT_SECRET);
    const user = await ClientModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: "client",
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

module.exports = clientauthMiddleware;
