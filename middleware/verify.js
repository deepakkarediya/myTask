var jwt = require("jsonwebtoken");
const JWT_SECRET = "deep404";

const verify = (req, res, next) => {
  let success = false;
  // Get the user from the jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    res
      .status(401)
      .send({ success, error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    // console.log(data);
    req.regis1 = data.regis;
    if (data) {
      next();
    }
  } catch (error) {
    res
      .status(401)
      .send({ success, error: "Please authenticate using a valid token" });
  }
};

module.exports = verify;
