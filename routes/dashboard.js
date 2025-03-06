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
router.get("/status", async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(
        `SELECT SUM(Valide) AS 'Validées',SUM(Refuse) AS 'Refusées' ,COUNT(*)-SUM(Valide)-SUM(Refuse) AS 'En attente' FROM recrutement_info;`
      );
    return res.status(200).json(result.recordset);
  } catch (error) {
    // ////console.log("Erreur");
    // Gestion des erreurs
    return res.status(500).json(error.message);
  }
});
router.get("/status/:etat", async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let condition = `WHERE ${req.params.etat}=1`;
    // //console.log(`SELECT * FROM recrutement_info ${condition}`)
    if (req.params.etat == "Attente") {
      condition = `WHERE Valide=0 and Refuse =0 `;
    }
    let result = await pool
      .request()
      .query(`SELECT * FROM recrutement_info ${condition}`);
    return res.status(200).json(result.recordset);
  } catch (error) {
    // ////console.log("Erreur");
    return res.status(500).json(error.message);
  }
});
router.get("/temps-moyen-validation", async (req, res) => {
  try {
    let pool = await sql.connect(config);

    let result = await pool
      .request()
      .query(`SELECT * FROM recrutement_info where Valide=1 OR Refuse =1`);
    const data = result.recordset;
    const authHeader = req.headers["authorization"];
    let heures = [];
    for (const element of data) {
      await calculTemps_moyen(element, authHeader, heures);
     
    }
    
    
   

    if (heures.length === 0) {
      res.status(500).json("Le tableau est vide, impossible de calculer la moyenne.");
    } else {
      const sum = heures.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      const avg = sum / heures.length;
      const diffMinutes=Math.floor(avg / (1000 * 60*60));
      return res.status(200).json(diffMinutes);
    }

    
  } catch (error) {
    // ////console.log("Erreur");
    return res.status(500).json(error.message);
  }
});
router.get("/tendances/:societe",async (req, res) => {
  let societe=req.params.societe;

  let pool = await sql.connect(config);
    try {
      let result = await pool
      .request()
      .query(`Select TOP 5 CASE WHEN Poste_a_pourvoir_ IS NULL THEN Poste_a_pourvoir_creation ELSE Poste_a_pourvoir_ END AS Poste, SUM(Nombre_de_poste_a_pourvoir) AS nombre,Societe from Recrutement_info
          WHERE CASE WHEN Poste_a_pourvoir_ IS NULL THEN Poste_a_pourvoir_creation ELSE Poste_a_pourvoir_ END IS NOT NULL AND MONTH(Date_de_demande)=${(new Date()).getMonth()+1} AND Societe='${societe}'
          GROUP BY CASE WHEN Poste_a_pourvoir_ IS NULL THEN Poste_a_pourvoir_creation ELSE Poste_a_pourvoir_ END,Societe ORDER BY SUM(Nombre_de_poste_a_pourvoir) DESC`);
    const data = result.recordset
  return res.status(200).json(data);
    } catch (error) {
      return res.send(500).json(error.message);
    }
    
})
const calculTemps_moyen=async(element,authHeader,heures)=>{
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    await axios
      .post(
        "http://172.16.112.76:80/TheService/v0001/restun/GetLinkedWorkflowsForDoc",
        {
          DocNo: element.DocNo,
          WFDocLinkType: "1",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
        }
      )
      .then(async function (response) {
        // //console.log(response.data.InfoLists[0].InstanceNo);
        await axios
          .post(
            "http://172.16.112.76:80/TheService/v0001/restun/GetWorkflowHistory",
            {
              InstanceNo: response.data.InfoLists[0].InstanceNo,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: authHeader,
              },
            }
          )
          .then(function (response) {
            let data = response.data.HistoryEntries.filter(
              (history) => history.Type == 4
            );
            let counter = 0;
            while (counter < data.length - 1) {
              if (
                data[counter].UserNo == data[counter + 1].UserNo &&
                data[counter].UserName == "SYSTEM"
              ) {
                counter = counter + 2;
                continue;
              }
              

              heures.push(
                new Date(data[counter].ActionDateISO8601) -
                  new Date(data[counter + 1].ActionDateISO8601)
              );
              counter = counter + 2;
            }
            
          
          });
      })
     
  } else {
    // No valid token found
    throw new Error("No valid token found");
  }
}
module.exports = router;
