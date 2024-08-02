import express from "express";
const { CreateUser , LoginUser} = require("../controller/UserController");

const router = express.Router();

router
    .post("/register" , CreateUser)
    .post("/login" , LoginUser)

module.exports = router