
CREATE VIEW recrutement_info AS
SELECT * 
    ,(CASE WHEN Direction_de_rattachement=1 AND DAF_DG_Groupe =1 AND Direction_des_Ressources_Humaines=1 AND DG_Societe=1 THEN 1 ELSE 0 END) AS Valide, 
    (CASE WHEN Direction_de_rattachement=2 OR DAF_DG_Groupe =2 OR Direction_des_Ressources_Humaines=2 OR DG_Societe=2 THEN 1 ELSE 0 END) AS Refuse
    
FROM TheCat284;