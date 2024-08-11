import express from 'express';
const { AddDataBase , getDatabases , getTableNames} = require("../controller/dataBasesController");
const { AuthWare } = require("../middleware/AuthMiddleWare");

const router = express.Router();

router
    .post("/addDatabase" , AuthWare , AddDataBase)
    .get("/getDatabases" , AuthWare ,getDatabases)
    .get("/getTableNames"  ,getTableNames)


module.exports = router

