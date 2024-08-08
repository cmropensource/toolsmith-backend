const express = require('express');
const  { QueryData , QueryMongo }  = require("../controller/getQueryData");
const router = express.Router();
const { AuthWare } = require("../middleware/AuthMiddleWare");

router
    .post("/queryDataPost" , AuthWare , QueryData)
    .post("/queryDataMongo" , AuthWare , QueryMongo)

module.exports = router