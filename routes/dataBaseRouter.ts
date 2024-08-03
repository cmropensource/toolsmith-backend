import express from 'express';
const { AddDataBase , getDatabases } = require("../controller/dataBasesController");
const { AuthWare } = require("../middleware/AuthMiddleWare");

const router = express.Router();

router
    .post("/addDatabase" , AuthWare , AddDataBase)
    .get("/getDatabases" , AuthWare ,getDatabases)

module.exports = router

