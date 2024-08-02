const express = require('express');
const  { QueryData }  = require("../controller/getQueryData");
const router = express.Router();

router
    .post("/queryData" , QueryData)

module.exports = router