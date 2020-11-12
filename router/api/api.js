const express = require("express");

const v0Routes = require("./v0/routes");

const router = express.Router();

router.use("/v0", v0Routes);

module.exports = router;
