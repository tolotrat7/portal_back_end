const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const app = express();
const port = process.env.PORT;
// const port = 8001;
const ldapjs = require("ldapjs");
var DashboardRouter = require("./routes/dashboard");
var LoginRouter = require("./routes/login");
var SignatureRouter=require("./routes/signature")

app.use(cors());
app.use(express.json());
app.use("/dashboard", DashboardRouter);
app.use("/login", LoginRouter);
app.use("/signature", SignatureRouter);

const config = {
  server: "172.16.112.84",

  port: 1433,
  database: "Therefore",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  authentication: {
    type: "default",
    options: {
      //domain: 'SMTP-GROUP', // Domain or machine name (or leave as an empty string for local auth)
      userName: "sirh",
      password: "Sirh@2024",
    },
  },
};

const configSage = {
  server: "172.16.112.54",
  port: 1433,
  database: "RECAP_SALARIE",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  authentication: {
    type: "default",
    options: {
      userName: "recap",
      password: "PaieConsult1234",
    },
  },
};


app.post("/receive-username", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Aucun username reçu" });
  }

 

  res.json({ message: `Username ${username} bien reçu !` });
});

app.post("/SocieteByUsername", async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ message: "Aucun username reçu" });
    }

    let pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("username", sql.NVarChar, username).query(`
        SELECT societe_AD FROM TheSirh WHERE Login = @username
      `);

    if (result.recordset.length > 0) {
      res.status(200).json({ societe: result.recordset[0].societe_AD });
    } else {
      res
        .status(404)
        .json({ message: "Société non trouvée pour cet utilisateur." });
    }
  } catch (err) {
    console.error("Erreur lors de la récupération de la société:", err);
    res.status(500).send("Erreur serveur.");
  }
});

app.post("/getRattachementAD", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Aucun username reçu" });
    }

    let pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("username", sql.NVarChar, username).query(`
         SELECT S1.[Rattachement_AD],S2.name
        FROM [Therefore].[dbo].[TheSirh] as S1
		    JOIN [Therefore].[dbo].[TheSirh] as S2 on S2.Login=S1.Rattachement_AD
        WHERE S1.[Login] = @username
      `);

    if (result.recordset.length > 0) {
      res
        .status(200)
        .json({ rattachement: result.recordset[0].Rattachement_AD,rattachement_name:result.recordset[0].name});
    } else {
      res
        .status(404)
        .json({ message: "Aucun rattachement trouvé pour cet utilisateur." });
    }
  } catch (err) {
    console.error("Erreur lors de la récupération du rattachement:", err);
    res.status(500).send("Erreur serveur.");
  }
});

app.post("/getDGSociete", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Aucun username reçu" });
    }

    let pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("username", sql.NVarChar, username).query(`
       SELECT S1.[DG_Societe],S2.name
        FROM [Therefore].[dbo].[TheSirh] as S1
		JOIN [Therefore].[dbo].[TheSirh] as S2 on S2.Login=S1.DG_Societe
        WHERE S1.[Login] = @username
      `);

    if (result.recordset.length > 0) {
      res.status(200).json({ dgsociete: result.recordset[0].DG_Societe,dgsociete_name:result.recordset[0].name });
    } else {
      res
        .status(404)
        .json({ message: "Aucun rattachement trouvé pour cet utilisateur." });
    }
  } catch (err) {
    console.error("Erreur lors de la récupération du rattachement:", err);
    res.status(500).send("Erreur serveur.");
  }
});

app.get("/getLoginHistory", async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(`
                SELECT 
                    L.id AS LoginHistoryId,
                    U.Name,
                    L.date_connexion
                FROM 
                    [Therefore].[dbo].[LoginUserHistory] L
                INNER JOIN 
                    [Therefore].[dbo].[TheUser] U
                    ON L.idUser = U.UserNo
                WHERE 
                    L.date_connexion IS NOT NULL  
                ORDER BY 
                    L.date_connexion ASC
      `);
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(500).send("Database error");
    console.error(err);
  }
});
app.get("/validations/:id_user", async (req, res) => {
  try {

    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(
        `SELECT [Therefore].[dbo].[TheWFInstances].[InstanceNo],[TokenNo],[Therefore].[dbo].[TheWFTokens].[TaskNo],[TaskStartDate],[TaskDueDate],[TaskClaimDate],[OverdueMailSent],[LastUserNo],[TokenRows],[TokenTable],[ErrCode],[ErrInfo],[ErrTimeStamp],[ErrCount],[Therefore].[dbo].[TheWFInstances].[ProcessNo],[Therefore].[dbo].[TheWFDocuments].[DocNo],[Cabinet_de_recrutement_externe],[duree_Cdd],[Direction_de_rattachement],[Direction_des_Ressources_Humaines],[DG_Societe],[DAF_DG_Groupe],[Motif_de_recrutement],[Type_de_contrat],[Budgetise],[Date_de_demande],[Date_dembauche_souhaite],[Autre_motif_de_recrutement],[Poste_a_pourvoir_],[Societe],[Autre_type_de_contrat],[Effectif_actuel_au_poste],[Nombre_de_poste_a_pourvoir],[Motif_si_non],[Poste_a_pourvoir_creation],[Direction] FROM [Therefore].[dbo].[TheWFTokens] join [Therefore].[dbo].[TheWFChoices] on [Therefore].[dbo].[TheWFChoices].[TaskNo] = [Therefore].[dbo].[TheWFTokens].[TaskNo] join [Therefore].[dbo].[TheWFInstances] on [Therefore].[dbo].[TheWFInstances].[InstanceNo] = [Therefore].[dbo].[TheWFTokens].[InstanceNo] join [Therefore].[dbo].[TheWFProcesses] on [Therefore].[dbo].[TheWFProcesses].[ProcessNo] = [Therefore].[dbo].[TheWFInstances].[ProcessNo] join [Therefore].[dbo].[TheWFDocuments] on [Therefore].[dbo].[TheWFDocuments].[InstanceNo]= [Therefore].[dbo].[TheWFInstances].[InstanceNo]  join [Therefore].[dbo].[TheCat284] on [Therefore].[dbo].[TheCat284].[DocNo]=[Therefore].[dbo].[TheWFDocuments].[DocNo] where   [Therefore].[dbo].[TheWFChoices].[UserNo] = ${req.params.id_user} `
      );
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(500).send("Database error");
    console.error(err);
  }
  //   res.send('Hello World!')
});

app.get("/validation/:id_user", async (req, res) => {
  try {

    let pool = await sql.connect(config);
    let result = await pool.request()
      .query(`SELECT [Therefore].[dbo].[TheWFInstances].[InstanceNo],[TokenNo],[Therefore].[dbo].[TheWFTokens].[TaskNo],[TaskStartDate],[TaskDueDate],[TaskClaimDate],[OverdueMailSent],[LastUserNo],[TokenRows],[TokenTable],[ErrCode],[ErrInfo],[ErrTimeStamp],[ErrCount],[Therefore].[dbo].[TheWFInstances].[ProcessNo],[Therefore].[dbo].[TheWFDocuments].[DocNo],[Cabinet_de_recrutement_externe],[duree_Cdd],[Direction_de_rattachement],[Direction_des_Ressources_Humaines],[DG_Societe],[DAF_DG_Groupe],[Motif_de_recrutement],[Type_de_contrat],[Budgetise],[Date_de_demande],[Date_dembauche_souhaite],[Autre_motif_de_recrutement],[Poste_a_pourvoir_],[Societe],[Autre_type_de_contrat],[Effectif_actuel_au_poste],[Nombre_de_poste_a_pourvoir],[Motif_si_non],[Poste_a_pourvoir_creation],[Direction] FROM [Therefore].[dbo].[TheWFTokens] join [Therefore].[dbo].[TheWFChoices] on [Therefore].[dbo].[TheWFChoices].[TaskNo] = [Therefore].[dbo].[TheWFTokens].[TaskNo] join [Therefore].[dbo].[TheWFInstances] on [Therefore].[dbo].[TheWFInstances].[InstanceNo] = [Therefore].[dbo].[TheWFTokens].[InstanceNo] join [Therefore].[dbo].[TheWFProcesses] on [Therefore].[dbo].[TheWFProcesses].[ProcessNo] = [Therefore].[dbo].[TheWFInstances].[ProcessNo] join [Therefore].[dbo].[TheWFDocuments] on [Therefore].[dbo].[TheWFDocuments].[InstanceNo]= [Therefore].[dbo].[TheWFInstances].[InstanceNo]  join [Therefore].[dbo].[TheCat284] on [Therefore].[dbo].[TheCat284].[DocNo]=[Therefore].[dbo].[TheWFDocuments].[DocNo] where   [Therefore].[dbo].[TheWFChoices].[UserNo] =SELECT [Therefore].[dbo].[TheWFInstances].[InstanceNo],[TokenNo], [Therefore].[dbo].[TheWFTokens].[TaskNo], [TaskStartDate],[TaskDueDate],[TaskClaimDate], [OverdueMailSent],[LastUserNo],[TokenRows], [TokenTable],[ErrCode],[ErrInfo],[ErrTimeStamp], [ErrCount],[Therefore].[dbo].[TheWFInstances].[ProcessNo], [Therefore].[dbo].[TheWFDocuments].[DocNo], [Autre_motif_dembauche],[Condition_salariale], [Condition_salariale],[type_de_recrutement], [Nom_et_prenom],[DG_Societe],[DAF_Group],[DG_Societe],[D_Rattachement]
              FROM [Therefore].[dbo].[TheWFTokens] join [Therefore].[dbo].[TheWFChoices] on [Therefore].[dbo].[TheWFChoices].[TaskNo] = [Therefore].[dbo].[TheWFTokens].[TaskNo] join [Therefore].[dbo].[TheWFInstances] on [Therefore].[dbo].[TheWFInstances].[InstanceNo] = [Therefore].[dbo].[TheWFTokens].[InstanceNo] join [Therefore].[dbo].[TheWFProcesses] on [Therefore].[dbo].[TheWFProcesses].[ProcessNo] = [Therefore].[dbo].[TheWFInstances].[ProcessNo] join [Therefore].[dbo].[TheWFDocuments] on [Therefore].[dbo].[TheWFDocuments].[InstanceNo]= [Therefore].[dbo].[TheWFInstances].[InstanceNo]  join [Therefore].[dbo].[TheCat307] on [Therefore].[dbo].[TheCat307].[DocNo]=[Therefore].[dbo].[TheWFDocuments].[DocNo] where   [Therefore].[dbo].[TheWFChoices].[UserNo] =  ${req.params.id_user} `);
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(500).send("Database error");
    console.error(err);
  }
  //   res.send('Hello World!')
});

app.get("/getSociete/:id_user", async (req, res) => {
  try {
    const { id_user } = req.params;
    let pool = await sql.connect(config);

    // Requête pour récupérer la société rattachée à l'utilisateur connecté
    const result = await pool.request().input("id_user", sql.Int, id_user)
      .query(`
        SELECT TOP (1) [idsociete]
        FROM [dbo].[Rattachement_Societe]
        WHERE [iduser] = @id_user
      `);

    if (result.recordset.length > 0) {
      res.status(200).json({ societe: result.recordset[0].idsociete });
    } else {
      res
        .status(404)
        .json({ message: "Société non trouvée pour cet utilisateur." });
    }
  } catch (err) {
    console.error("Erreur dans la récupération des données:", err);
    res.status(500).send("Erreur serveur.");
  }
});
app.get("/postes/:societe", async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let societe = req.params.societe;
    let result = await pool
      .request()
      .query(
        `SELECT [POSTE] from [Therefore].[dbo].[societe_postes] where [SOCIETE]= '${societe}' `
      );
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(500).send("Database error");
    console.error(err);
  }
});

app.get("/societes", async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query("SELECT [nom] from [Therefore].[dbo].[Societe] ");
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(500).send("Database error");
    console.error(err);
  }
});
app.get("/directions/:societe", async (req, res) => {
  try {
    const societe=req.params.societe;
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(`SELECT [NOM] FROM [Therefore].[dbo].[departement] WHERE [SOCIETE]= '${societe}'`);
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(500).send("Database error");
    console.error(err);
  }
});

app.get("/get-validators", async (req, res) => {
  try {
    let pool = await sql.connect("config");
    let query = "SELECT * FROM Rattachement_Societe where idsociete=17";
    let result = await pool.request().query(query);
    res.status(200).send(result.recordset);
  } catch (error) {
    res.status(500).send(`Error ${error}`);
  }
});

app.post("/ldap", (req, res) => {

  const client = ldapjs.createClient({
    url: "ldap://ad-server-1.smtp-group.mg",
    reconnect: true,
  });
  const userDn = `SMTP-GROUP\\FT161`;
  const userPassword = "FUwK38bc";
  const searchBase = "dc=smtp-group,dc=mg";
  const usernameAttribute = "samaccountname";
  const userIdentifier = req.body.username;
  let val = null;
  const searchOptions = {
    filter: `(${usernameAttribute}=${userIdentifier})`,
    scope: "sub",
    attributes: [
      "DisplayName",
      "Office",
      "mail",
      "samaccountname",
      "Description",
      "distinguishedName",
    ],
  };
  client.bind(userDn, userPassword, (err) => {
    if (err) {
      return err;
    }
    const results = [];
    client.search(searchBase, searchOptions, (err, ldapRes) => {
      if (err) {
        console.error("Erreur lors de la recherche LDAP :", err);
        return;
      }

      ldapRes.on("searchEntry", async (entry) => {
        let element = {};
        entry.attributes.forEach((attribute) => {
          element[attribute.type] = attribute.values[0];
        });
        try {
          let pool = await sql.connect(config);
          let result = await pool
            .request()
            .query(
              "SELECT [POSTE] from [Therefore].[dbo].[societe_postes] where [SOCIETE]= 'FLY_TECHNOLOGIES' "
            );
        } catch (err) {
          console.error(err);
        }
        res.status(200).json(element);
      });

      ldapRes.on("end", (result) => {
        client.unbind();
      });
    });
  });
});
app.post("/log-login", async (req, res) => {
  const { idUser } = req.body;

  if (!idUser) {
    return res.status(400).json({ message: "idUser est requis." });
  }

  try {
    const pool = await sql.connect(config);
    await pool
      .request()
      .input("idUser", sql.Int, idUser)
      .query(
        "INSERT INTO [Therefore].[dbo].[LoginUserHistory] (idUser, date_connexion) VALUES (@idUser, GETDATE())"
      );

    res.status(200).json({ message: "Historique de connexion enregistré." });
  } catch (error) {
    console.error("Erreur SQL:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

app.post("/get-usernames", async (req, res) => {
  try {
    const { usernames } = req.body;
    

    let pool = await sql.connect(config);

    const result = await pool
      .request()
      .query(`
       SELECT LOGIN,name
        FROM [Therefore].[dbo].[TheSirh] 
        WHERE LOWER([Login]) IN (${usernames.map(word => `'${word.toLowerCase()}'`).join(',')})
      `);

    if (result.recordset.length > 0) {
      res.status(200).json({ data:result.recordset});
    } else {
      res
        .status(404)
        .json({ message: "Aucun rattachement trouvé pour cet utilisateur." });
    }
  } catch (err) {
    console.error("Erreur lors de la récupération du rattachement:", err);
    res.status(500).send("Erreur serveur.");
  }
});
app.listen(port, () => {
  
});
