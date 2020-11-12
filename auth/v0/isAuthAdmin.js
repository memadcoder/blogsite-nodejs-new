const jwt = require("jsonwebtoken");
const Users = require("../../model/usersModel");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    let error = {};
    error.statusCode = 403;
    error.message =
      "Client does not have proper authorization. Permission Denied";
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
    error.statusCode = 403;
    error.message =
      "Client does not have proper authorization. Permission Denied";
    responseError(res, error);
    return;
  }
  req.userId = decodedToken.userId;

  Users.findById(req.userId)
    .then((user) => {
      if (user.isAdmin) {
        req.user = user
        next();
      } else {
        let error = {};
        error.statusCode = 403;
        error.message =
          "Client does not have proper authorization. Permission Denied";
        responseError(res, error);
      }
    })
    .catch((err) => {
      let error = {};
      error.statusCode = 403;
      error.message =
        "Client does not have proper authorization. Permission Denied";
      responseError(res, error);
    });
};

responseError = (res, error) => {
  res.status(error.statusCode).json({
    message: error,
  });
};
