const express = require("express");

const apiRoutes = require("./api/api");

const router = express.Router();

router.use("/api", apiRoutes);

router.get("/", (req, res, next) => {
  console.log("Personal Blog");
  res.status(200).json({
    message: "Personal Blog",
  });
});

module.exports = router;
