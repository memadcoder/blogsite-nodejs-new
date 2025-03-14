const jwt = require("jsonwebtoken");
const Users = require("../../model/usersModel");

module.exports = (req, res, next) => {
  // console.log("token", req);
  console.log("params", req.get("Authorization"));
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    let error = {};
    error.statusCode = 401;
    error.message = "Not authenticated";
    responseError(res, error);
    return;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "ThisIsASecretKeyAndKey");
  } catch (error) {
    error.statusCode = 500;
    responseError(res, error);
    return;
  }
  if (!decodedToken) {
    let error = {};
    error.statusCode = 401;
    error.message = "Not authenticated";
    responseError(res, error);
    return;
  }
  req.userId = decodedToken.userId;
  Users.findById(req.userId)
    .then((user) => {
      if (user) {
        req.user = user;
        next();
      } else {
        let error = {};
        error.statusCode = 401;
        error.message = "Not authenticated";
        responseError(res, error);
        return;
      }
    })
    .catch((error) => {
      responseError(res, error);
      return;
    });
};

responseError = (res, error) => {
  res.status(error.statusCode).json({
    message: error,
  });
};
