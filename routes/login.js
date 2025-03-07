var express = require("express");
var router = express.Router();
const sql = require("mssql");
require("dotenv").config();
const axios = require("axios");
const config = {
    server: process.env.THEREFORE_URI,
    port: parseInt(process.env.THEREFORE_PORT),
    database: process.env.THEREFORE_DATABASE,
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
    authentication: {
      type: "default",
      options: {
        //domain: 'SMTP-GROUP', // Domain or machine name (or leave as an empty string for local auth)
        userName: process.env.THEREFORE_USERNAME, // Leave empty for the current Windows user
        password: process.env.THEREFORE_PASSWORD, // Leave empty for the current Windows user
      },
    },
  };
router.post("/get-role", async (req, res) => {
  try {
    const { username } = req.body;  
   
    let pool = await sql.connect(config);
     const result = await pool.request()
          .input("username", sql.NVarChar, username)
          .query(`
            SELECT Type_RH,Role_AD FROM TheSirh WHERE Login = @username
          `);
    return res.status(200).json(result.recordset);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
module.exports = router;