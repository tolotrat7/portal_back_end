const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const app = express();
const port = 8001;
const ldapjs = require("ldapjs");

app.use(cors());
app.use(express.json());
const config = {
  server: "172.16.112.76",
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
      userName: "Joastin", // Leave empty for the current Windows user
      password: "joastin", // Leave empty for the current Windows user
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
      //domain: 'SMTP-GROUP', // Domain or machine name (or leave as an empty string for local auth)
      userName: "recap", // Leave empty for the current Windows user
      password: "PaieConsult1234", // Leave empty for the current Windows user
    },
  },
};

app.get("/validations/:id_user", async (req, res) => {
  try {
    console.log("Je suis là");

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
    console.log("Je suis là");

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
    const result = await pool.request()
      .input("id_user", sql.Int, id_user)
      .query(`
        SELECT TOP (1) [idsociete]
        FROM [dbo].[Rattachement_Societe]
        WHERE [iduser] = @id_user
      `);

    if (result.recordset.length > 0) {
      res.status(200).json({ societe: result.recordset[0].idsociete });
    } else {
      res.status(404).json({ message: "Société non trouvée pour cet utilisateur." });
    }
  } catch (err) {
    console.error("Erreur dans la récupération des données:", err);
    res.status(500).send("Erreur serveur.");
  }
});

app.get("/postes", async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query(
        "SELECT [POSTE] from [Therefore].[dbo].[societe_postes] where [SOCIETE]= 'FLY_TECHNOLOGIES' "
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
  //   res.send('Hello World!')
});
app.get("/directions", async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .query("SELECT [NOM] FROM [Therefore].[dbo].[departement]");
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(500).send("Database error");
    console.error(err);
  }
  //   res.send('Hello World!')
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

app.post("/ldap",  (req, res) => {
    console.log(req.body);
    
  const client = ldapjs.createClient({
    url: "ldap://ad-server-1.smtp-group.mg",
    reconnect: true,
  });
  const userDn = `SMTP-GROUP\\FT161`; // DN de l'utilisateur
  const userPassword = "FUwK38bc"; // Mot de passe de l'utilisateur
  const searchBase = "dc=smtp-group,dc=mg";
  const usernameAttribute = "samaccountname"; // Attribut utilisé pour identifier l'utilisateur
  const userIdentifier = req.body.username; // Identifiant LDAP de l'utilisateur
  let val = null;
  const searchOptions = {
    filter: `(${usernameAttribute}=${userIdentifier})`, // Filtre LDAP
    scope: "sub", // Portée de la recherche
    attributes: ["DisplayName", "Office", "mail", "samaccountname", "Description","distinguishedName"], // Attributs à récupérer
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
        //   console.log('Entrée trouvée :', entry.attributes);
        let element = {};
        entry.attributes.forEach(attribute => {
            element[attribute.type]=attribute.values[0]
            
        });
        try {
          let pool = await sql.connect(config);
          let result = await pool
            .request()
            .query(
              "SELECT [POSTE] from [Therefore].[dbo].[societe_postes] where [SOCIETE]= 'FLY_TECHNOLOGIES' "
            );
          // res.status(200).send(result.recordset);
        } catch (err) {
          // res.status(500).send("Database error");
          console.error(err);
        }
        res.status(200).json(element);
        // val=entry.attributes
      });

      ldapRes.on("end", (result) => {
        console.log("Recherche terminée avec statut :", result.status);
        client.unbind();
      });
    });
  });
//   console.log(val);
});

app.listen(port, () => {
  console.log("Mande express");
  // console.log(`Example app listening on port ${port}`)
});
