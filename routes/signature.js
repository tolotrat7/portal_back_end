var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const sql = require("mssql");
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

router.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  } else {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.decode(token);
    const nbf = new Date(decoded.nbf * 1000);
    const exp = new Date(decoded.exp * 1000);
    if (new Date() < nbf || new Date() > exp) {
      return res.status(401).json({ message: "Token invalide" });
    }
  }

  next();
});
router.post("/get-by-logins", async (req, res) => {
  try {
    const validateurs = req.body.validateurs;
    const result=await get_signatures(validateurs)
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(500).send("Database error");
    console.error(err);
  }
});
const get_signatures= async (validateurs) => {
    let params = "UserNo";
    if (isNaN(parseInt(validateurs[0]))) params = "Login";
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(
        `SELECT Name,UserNo,Signature FROM [Therefore].[dbo].[TheSignature] JOIN TheUser ON TheUser.Name = Login WHERE ${params} IN (${
          "'" + validateurs.join("','") + "'"
        })`
      );
      return result;
}

router.post("/update/:username", async (req, res) => {
  

  try {
    const signatures=await get_signatures([req.params.username]);
    let query=`UPDATE [Therefore].[dbo].[TheSignature] SET Signature=@signature WHERE Login = @username`
    
    if(signatures.recordset.length===0){
        query=`INSERT INTO [Therefore].[dbo].[TheSignature] (Login,Signature) VALUES (@username,@signature)`
    }
   
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("username", sql.NVarChar, req.params.username)
      .input("signature", sql.NVarChar, req.body.signature)
      .query(query);
    res.json({ message: "Signature updated successfully", result: result });
  } catch (err) {
    res.status(500).send("Database error");
    console.error(err);
  }
});
module.exports = router;
