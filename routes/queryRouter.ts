const express = require('express');
const  { QueryData }  = require("../controller/getQueryData");
const router = express.Router();
const { AuthWare } = require("../middleware/AuthMiddleWare");

router
    .post("/queryData" , AuthWare , QueryData)

module.exports = router