/*  
    file: sqlpalvelut.js
    desc: OT7, keskustelupalstan tietokantamodulit
            - yhteyden muodostaminen
            - käsittely- ja kyselymodulit
    date: 12.1.2019
    auth: Maarit Parkkonen
*/

//tietokantayhteyden määrittely
const mysql = require("mysql");
const yhteys = mysql.createConnection({
    "host":"localhost",
    "user": "root",
    "password": "",
    "database":"keskustelupalsta"
});

//avataan tietokanta yhteys
yhteys.connect((err)=>{
    if (!err){
        console.log("Yhteys avattu");
    }else{
        throw err;
    }
});

module.exports = {
    /*"haeKeskustelut": (cb) => {
        let sql ="SELECT * FROM keskustelut ORDER BY aika DESC";
        yhteys.query(sql, (err,rivit)=>{
            cb(err,rivit);
        });
    },*/
    "haeKeskustelu": (id,cb) => {                                               //yksittäisen keskustelun tietojen hakeminen
        let sql ="SELECT * FROM keskustelut WHERE keskusteluId=?";
        yhteys.query(sql,[id], (err,rivit)=>{
            cb(err,rivit);
        });
    },
    "lisaaKeskustelu": (tiedot,cb) => {                                         //uuden keskustelun lisäys keskustelut tauluun
        let nimi = (tiedot.kirjoittaja)?tiedot.kirjoittaja:"anonyymi";          //jos ei nimimerkkiä merkitään anonyymiksi
        let sql ="INSERT INTO keskustelut (otsikko,aloitusTeksti,kirjoittaja) VALUES (?,?,?)";
        yhteys.query(sql,[tiedot.otsikko,tiedot.teksti,nimi], (err)=>{
            cb(err);
        });
    },
    "lisaaVastaus": (tiedot,cb) => {                                            //uuden vastauksen lisäys viestit tauluun
        let nimi = (tiedot.kirjoittaja)?tiedot.kirjoittaja:"anonyymi";  
        let sql ="INSERT INTO viestit (keskusteluId,kirjoittaja,teksti) VALUES (?,?,?)";
        yhteys.query(sql,[tiedot.id,nimi,tiedot.teksti], (err)=>{
            cb(err);
        });
    },
    "haeVastaukset": (id,asc,cb) => {                                           //yhden keskustelun kaikkien vastausten haku
        let sql;
        if (asc==true){
            sql ="SELECT * FROM viestit WHERE keskusteluId=? ORDER BY aika ASC";        //vanhin ensin
        }else{
            sql ="SELECT * FROM viestit WHERE keskusteluId=? ORDER BY aika DESC";       //uusin ensin
        }
        yhteys.query(sql,[id], (err,rivit2)=>{
            cb(err,rivit2);
        });
    },
    "haeKeskustelutKpl": (cb) => {         //hakee kaikkien keskustelujen tiedot sekä laskee jokaiselle keskustelulle vastausten määrän
        let sql ="SELECT keskustelut.*, COUNT (viestiId) AS kpl FROM keskustelut LEFT OUTER JOIN viestit ON keskustelut.keskusteluId=viestit.keskusteluId GROUP BY keskustelut.keskusteluId";
        yhteys.query(sql, (err,kplTaulukko)=>{
            cb(err,kplTaulukko);
        });
    },
    "haeUusimmatViestit": (cb) => {       //hakee kaikille keskuteluille uusimman vastauksen (jos ei vastauksia, ajaksi tallentuu aloitusviestin aika)
        let sql="SELECT keskusteluId, MAX(aika) as uusinAika FROM (SELECT keskusteluID, aika FROM keskustelut UNION ALL SELECT keskusteluID, aika FROM viestit) AS ajat GROUP BY ajat.keskusteluId ORDER BY uusinAika DESC";
        yhteys.query(sql, (err,uusinViestit)=>{
            cb(err,uusinViestit);
        });
    }
};