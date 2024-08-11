import express from 'express';
const {insertData} = require("../controller/bulkInsert");

//multer configuration
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage : storage});

const router = express.Router();

router
    .post("/bulkInsertData" , upload.single('file') , insertData)

module.exports = router