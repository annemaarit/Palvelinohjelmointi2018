/*  
    file: sqlpalvelut.js
    desc: OT11, tietokantamodulit
            - yhteyden muodostaminen
            - tietojen tarkistus
            - sql käsittely- ja kyselymodulit
            - lokitietojen tallennus tiedostoon
    date: 19.1.2019
    auth: Maarit Parkkonen
*/

//tietokantayhteyden määrittely
const mysql = require("mysql");
const yhteys = mysql.createConnection({
    "host":"localhost",
    "user": "root",
    "password": "",
    "database":"kayttajarekisteri"
});

//salaus
const crypto = require("crypto");

//avataan tietokanta yhteys
yhteys.connect((err)=>{
    if (!err){
        console.log("Yhteys avattu");
    }else{
        throw err;
    }
});

//tiedoston käsittely (loki)
const fs = require("fs");
const tiedosto = "./models/loki.json";

module.exports = {
    //kaikkien käyttäjien tietojen haku
    "haeKayttajat": (cb) => {
        let sql ="SELECT * FROM kayttajat";
        yhteys.query(sql, (err,rivit)=>{
            cb(err,rivit);
        });
    },
    //lokitietojen lisäys tiedostoon
    "lisaaLokiin":(uusi,cb)=>{
        fs.readFile(tiedosto,"utf-8",(err,data) => {
            if (!err){                                //tiedoston luku onnistui
                //console.log(data);
                let lokitiedot = JSON.parse(data);    //JS objektiksi
                lokitiedot.unshift(uusi);             //lisätään ensimmäiseksi
                fs.writeFile(tiedosto,JSON.stringify(lokitiedot,null,2), (err) => { //kirjoitetaan kaikki tiedostoon
                    cb(err);
                });
            } else {
                cb(err);
            }
        });
    },
    //puuttuuko tietoja
    "tarkistaKayttajatiedot":(kayttaja,uusi,cb)=>{
        let virheet=[];
        virheet.push((kayttaja.sukunimi)?"":{"kentta":"sukunimi"});             //jos puuttuu, lisätään kentän nimi virhetaulukkoon
        virheet.push((kayttaja.etunimi)?"":{"kentta":"etunimi"});
        virheet.push((kayttaja.sahkoposti)?"":{"kentta":"sähköposti"});
        virheet.push((kayttaja.kayttajatunnus)?"":{"kentta":"käyttäjätunnus"});
        if (uusi){                                                              //jos uuden käyttäjän tiedot
            virheet.push((kayttaja.salasana)?"":{"kentta":"salasana"});         //tarkistetaan myös salasana
        }
        let virhelista ="";
        virheet.forEach(virhe => {                                              //muodostetaan stringi virhetaulukosta
            if (virhe!=""){
                virhelista = virhelista +` *${virhe.kentta}`;
            }
        });
        cb(virhelista);                                                     //palautetaan virheellisten kenttien nimet tai tyhjä lista
    },
    //uuden käyttäjän lisääminen
    "lisaaKayttaja": (kayttaja,cb) => {                                    
        let sukunimi = mysql.escape(kayttaja.sukunimi);                     //käyttäjätietojen tarkistus sql-injektion varalta
        let etunimi = mysql.escape(kayttaja.etunimi);
        let sposti = mysql.escape(kayttaja.sahkoposti);
        let tunnus = mysql.escape(kayttaja.kayttajatunnus);
        let salasana = mysql.escape(kayttaja.salasana);
        let tiiviste = crypto.createHmac("SHA256","salaustaika")            //salasanan salaus
                             .update(salasana)
                             .digest("hex");
        let sql =`INSERT INTO kayttajat (sukunimi, etunimi, sahkoposti, kayttajatunnus, salasana) VALUES (${sukunimi},${etunimi},${sposti},${tunnus},?)`;
        //console.log(sql);
        yhteys.query(sql,[tiiviste],(err)=>{
            cb(err);
        });
    },
    //tietyn käyttäjän tietojen päivittäminen
    "paivitaKayttaja": (id,kayttaja,cb) => {                                           
        id=mysql.escape(id);                                                //käyttäjätietojen tarkistus sql-injektion varalta
        let sukunimi = mysql.escape(kayttaja.sukunimi);
        let etunimi = mysql.escape(kayttaja.etunimi);
        let sposti = mysql.escape(kayttaja.sahkoposti);
        let tunnus = mysql.escape(kayttaja.kayttajatunnus);
        if (kayttaja.salasana){                                             //jos salasanaa on muutettu
            let salasana = mysql.escape(kayttaja.salasana);
            let tiiviste = crypto.createHmac("SHA256","salaustaika")        //uuden salasanan salaus
                                 .update(salasana)
                                 .digest("hex"); 
            let sql =`UPDATE kayttajat SET sukunimi=${sukunimi}, etunimi=${etunimi}, sahkoposti=${sposti}, kayttajatunnus=${tunnus},salasana=? WHERE id=${id}`;
            //console.log(sql);
            yhteys.query(sql,[tiiviste],(err)=>{
                //console.log(err);
                cb(err);
            });                       
        }else{                                                              //salasanaa ei ole muutettu
            let sql =`UPDATE kayttajat SET sukunimi=${sukunimi}, etunimi=${etunimi}, sahkoposti=${sposti}, kayttajatunnus=${tunnus} WHERE id=${id}`;
            yhteys.query(sql,(err)=>{
                cb(err);
            }); 
        }
    },
    //tietyn käyttäjän tietojen poistaminen
    "poistaKayttaja": (id,cb) =>{
        id=mysql.escape(id);
        let sql=`DELETE FROM kayttajat WHERE id=${id}`;
        yhteys.query(sql,(err)=>{
            cb(err);
        }); 
    }
};