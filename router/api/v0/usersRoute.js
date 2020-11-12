const express = require("express");

const usersController = require("../../../controller/api/v0/usersController");

const isAuthAdmin = require("../../../auth/v0/isAuth");
const isAuth = require("../../../auth/v0/isAuth");

const router = express.Router();

router.get("/", usersController.getUsers);
router.post("/",usersController.createUser);
router.post("/login",usersController.login);
router.delete("/:userId",isAuthAdmin,usersController.deleteById);
router.put("/:userId",isAuth,usersController.updateUser);


module.exports = router;
