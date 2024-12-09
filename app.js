const express = require('express')
const cors = require('cors')
const sql = require('mssql');
const app = express()
const port = 8001
app.use(cors());

const config = {
    server: '172.16.112.76',
    port:1433,
    database: 'Therefore',
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
    authentication: {
        type: 'default',
        options: {
            //domain: 'SMTP-GROUP', // Domain or machine name (or leave as an empty string for local auth)
            userName: 'Joastin', // Leave empty for the current Windows user
            password: 'joastin', // Leave empty for the current Windows user
        }
    }
};


app.get('/validations/:id_user', async (req, res) => {
    try {

        
        console.log("Je suis là");
        
        let pool = await sql.connect(config);
        let result = await pool.request().query(`SELECT [Therefore].[dbo].[TheWFInstances].[InstanceNo],[TokenNo],[Therefore].[dbo].[TheWFTokens].[TaskNo],[TaskStartDate],[TaskDueDate],[TaskClaimDate],[OverdueMailSent],[LastUserNo],[TokenRows],[TokenTable],[ErrCode],[ErrInfo],[ErrTimeStamp],[ErrCount],[Therefore].[dbo].[TheWFInstances].[ProcessNo],[Therefore].[dbo].[TheWFDocuments].[DocNo],[Cabinet_de_recrutement_externe],[duree_Cdd],[Direction_de_rattachement],[Direction_des_Ressources_Humaines],[DG_Societe],[DAF_DG_Groupe],[Motif_de_recrutement],[Type_de_contrat],[Budgetise],[Date_de_demande],[Date_dembauche_souhaite],[Autre_motif_de_recrutement],[Poste_a_pourvoir_],[Societe],[Autre_type_de_contrat],[Effectif_actuel_au_poste],[Nombre_de_poste_a_pourvoir],[Motif_si_non],[Poste_a_pourvoir_creation],[Direction] FROM [Therefore].[dbo].[TheWFTokens] join [Therefore].[dbo].[TheWFChoices] on [Therefore].[dbo].[TheWFChoices].[TaskNo] = [Therefore].[dbo].[TheWFTokens].[TaskNo] join [Therefore].[dbo].[TheWFInstances] on [Therefore].[dbo].[TheWFInstances].[InstanceNo] = [Therefore].[dbo].[TheWFTokens].[InstanceNo] join [Therefore].[dbo].[TheWFProcesses] on [Therefore].[dbo].[TheWFProcesses].[ProcessNo] = [Therefore].[dbo].[TheWFInstances].[ProcessNo] join [Therefore].[dbo].[TheWFDocuments] on [Therefore].[dbo].[TheWFDocuments].[InstanceNo]= [Therefore].[dbo].[TheWFInstances].[InstanceNo]  join [Therefore].[dbo].[TheCat284] on [Therefore].[dbo].[TheCat284].[DocNo]=[Therefore].[dbo].[TheWFDocuments].[DocNo] where   [Therefore].[dbo].[TheWFChoices].[UserNo] = ${req.params.id_user} `);
        res.status(200).send(result.recordset)
        
    } catch (err) {
        res.status(500).send('Database error');
        console.error(err);
    }
//   res.send('Hello World!')
})

app.get('/validation/:id_user', async (req, res) => {
    try {

        
        console.log("Je suis là");
        
        let pool = await sql.connect(config);
        let result = await pool.request().query(`SELECT [Therefore].[dbo].[TheWFInstances].[InstanceNo],[TokenNo],[Therefore].[dbo].[TheWFTokens].[TaskNo],[TaskStartDate],[TaskDueDate],[TaskClaimDate],[OverdueMailSent],[LastUserNo],[TokenRows],[TokenTable],[ErrCode],[ErrInfo],[ErrTimeStamp],[ErrCount],[Therefore].[dbo].[TheWFInstances].[ProcessNo],[Therefore].[dbo].[TheWFDocuments].[DocNo],[Cabinet_de_recrutement_externe],[duree_Cdd],[Direction_de_rattachement],[Direction_des_Ressources_Humaines],[DG_Societe],[DAF_DG_Groupe],[Motif_de_recrutement],[Type_de_contrat],[Budgetise],[Date_de_demande],[Date_dembauche_souhaite],[Autre_motif_de_recrutement],[Poste_a_pourvoir_],[Societe],[Autre_type_de_contrat],[Effectif_actuel_au_poste],[Nombre_de_poste_a_pourvoir],[Motif_si_non],[Poste_a_pourvoir_creation],[Direction] FROM [Therefore].[dbo].[TheWFTokens] join [Therefore].[dbo].[TheWFChoices] on [Therefore].[dbo].[TheWFChoices].[TaskNo] = [Therefore].[dbo].[TheWFTokens].[TaskNo] join [Therefore].[dbo].[TheWFInstances] on [Therefore].[dbo].[TheWFInstances].[InstanceNo] = [Therefore].[dbo].[TheWFTokens].[InstanceNo] join [Therefore].[dbo].[TheWFProcesses] on [Therefore].[dbo].[TheWFProcesses].[ProcessNo] = [Therefore].[dbo].[TheWFInstances].[ProcessNo] join [Therefore].[dbo].[TheWFDocuments] on [Therefore].[dbo].[TheWFDocuments].[InstanceNo]= [Therefore].[dbo].[TheWFInstances].[InstanceNo]  join [Therefore].[dbo].[TheCat284] on [Therefore].[dbo].[TheCat284].[DocNo]=[Therefore].[dbo].[TheWFDocuments].[DocNo] where   [Therefore].[dbo].[TheWFChoices].[UserNo] =SELECT [Therefore].[dbo].[TheWFInstances].[InstanceNo],[TokenNo], [Therefore].[dbo].[TheWFTokens].[TaskNo], [TaskStartDate],[TaskDueDate],[TaskClaimDate], [OverdueMailSent],[LastUserNo],[TokenRows], [TokenTable],[ErrCode],[ErrInfo],[ErrTimeStamp], [ErrCount],[Therefore].[dbo].[TheWFInstances].[ProcessNo], [Therefore].[dbo].[TheWFDocuments].[DocNo], [Autre_motif_dembauche],[Condition_salariale], [Condition_salariale],[type_de_recrutement], [Nom_et_prenom],[DG_Societe],[DAF_Group],[DG_Societe],[D_Rattachement]
                                                 FROM [Therefore].[dbo].[TheWFTokens] join [Therefore].[dbo].[TheWFChoices] on [Therefore].[dbo].[TheWFChoices].[TaskNo] = [Therefore].[dbo].[TheWFTokens].[TaskNo] join [Therefore].[dbo].[TheWFInstances] on [Therefore].[dbo].[TheWFInstances].[InstanceNo] = [Therefore].[dbo].[TheWFTokens].[InstanceNo] join [Therefore].[dbo].[TheWFProcesses] on [Therefore].[dbo].[TheWFProcesses].[ProcessNo] = [Therefore].[dbo].[TheWFInstances].[ProcessNo] join [Therefore].[dbo].[TheWFDocuments] on [Therefore].[dbo].[TheWFDocuments].[InstanceNo]= [Therefore].[dbo].[TheWFInstances].[InstanceNo]  join [Therefore].[dbo].[TheCat307] on [Therefore].[dbo].[TheCat307].[DocNo]=[Therefore].[dbo].[TheWFDocuments].[DocNo] where   [Therefore].[dbo].[TheWFChoices].[UserNo] =  ${req.params.id_user} `);
        res.status(200).send(result.recordset)
        
    } catch (err) {
        res.status(500).send('Database error');
        console.error(err);
    }
//   res.send('Hello World!')
})
app.get('/postes', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query("SELECT [POSTE] from [Therefore].[dbo].[societe_postes] where [SOCIETE]= 'FLY_TECHNOLOGIES' ");
        res.status(200).send(result.recordset)
    } catch (err) {
        res.status(500).send('Database error');
        console.error(err);
    }
//   res.send('Hello World!')
})
app.get('/directions', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query("SELECT [NOM] FROM [Therefore].[dbo].[departement]");
        res.status(200).send(result.recordset)     
    } catch (err) {
        res.status(500).send('Database error');
        console.error(err);
    }
//   res.send('Hello World!')
})

app.listen(port, () => {
    console.log("Mande express")
 // console.log(`Example app listening on port ${port}`)
})