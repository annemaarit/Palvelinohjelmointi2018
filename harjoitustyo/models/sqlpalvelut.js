/*  
    file: sqlpalvelut.js
    desc: Kumppari oy 
            - tietokantamoduli
    date: 16-20.8.2019
    auth: Maarit Parkkonen
*/

//tietokantayhteyden määrittely
const mysql = require("mysql");
const yhteys = mysql.createConnection({
    "host":"localhost",
    "user": "root",
    "password": "",
    "database":"kumpparioy"
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
    haeTuotteet: (tiedot,cb) => {       //hakee hakuehtoja vastaavat tuotteet
        let ehdot=[];
        
        if (tiedot.malli!=null){        //jos malleja on valittu
            ehdot.push(teeEhto(tiedot.malli,"malli")); //lisätään malleista muodostettu ehto ehtotauluun
        } 

        if (tiedot.vari!=null){         //jos värejä on valittu
            ehdot.push(teeEhto(tiedot.vari,"vari")); //lisätään väreistä muodostettu ehto ehtotauluun
        } 
        
        if (tiedot.koko!=null){         //jos kokoja on valittu
            ehdot.push(teeEhto(tiedot.koko,"koko")); //lisätään kokoista muodostettu ehto ehtotauluun
        } 

        let sql = `SELECT * FROM tuote WHERE ${ehdot.join(" AND ")} ORDER BY malli, vari, koko;`; //liitetään ehdot yhteen ja annetaan järjestyssääntö
        //console.log(sql);

        yhteys.query(sql, (err,tuotteet)=>{ //kyselyn suorittaminen
            cb(err,tuotteet);
        });

        //muodostaa sql ehdon parametrina saadun ominaisuuden arvoista
        function teeEhto(arvot,ominaisuus){
            let ehto =`${ominaisuus}=`;                             //ominaisuuden nimi
            if (Array.isArray(arvot)){                              //jos arvoja > 1 eli taulukossa
                let tarkistettu = arvot.map((arvo)=>{               //injektion esto
                    return mysql.escape(arvo);
                })
                ehto=ehto+tarkistettu.join(` OR ${ominaisuus}=`);
            } else {                                                //vain yksi arvo
                ehto=ehto+mysql.escape(arvot);                      //injektion esto
            }
            ehto="("+ehto+")";
            return ehto;
        }
    },
    ryhmitteleTuotteet: (cb) => {                       //ryhmittelee ja laskee ryhmien tuotteet koko tietokannasta
        let sql ="SELECT COUNT(id) AS kpl, malli, vari, koko FROM tuote GROUP BY malli, vari, koko";
        yhteys.query(sql, (err,tuotteet)=>{
            cb(err,tuotteet);
        });
    },
    haeRyhma: (tiedot,cb) => {                          //hakee yhden tuoteryhmän tuotteet id:n mukaisessa järjestyksessä
        let sql = "SELECT * FROM tuote WHERE malli=? AND vari=? AND koko=? ORDER BY id";
        yhteys.query(sql,[tiedot.malli,tiedot.vari,tiedot.koko], (err,tuotteet)=>{
            cb(err,tuotteet);
        });
    },
    haeTuote: (id,cb) => {                             //hakee yhden tuotteen tiedot id:n perusteella
        let sql ="SELECT * FROM tuote WHERE id=?";
        yhteys.query(sql,[id], (err,tuote)=>{
            cb(err,tuote);
        });
    },
    lisaaTuote: (tiedot,cb) => {                       //uuden tuotteen lisäys tuote -tauluun
        let sql ="INSERT INTO tuote (malli,vari,koko) VALUES (?,?,?)";
        yhteys.query(sql,[tiedot.malli,tiedot.vari,tiedot.koko], (err)=>{
            cb(err);
        });
    },
    muokkaaTuote : (tiedot, cb) => {                    //tuotteen tietojen muokkaus tuote -taulussa
        let sql = "UPDATE tuote SET malli=?, vari=?, koko=? WHERE id=?";
        yhteys.query(sql, [tiedot.malli, tiedot.vari, tiedot.koko, tiedot.id], (err) => {
            cb(err);            
        });
    },
    poistaTuote: (id,cb) => {                           //tuotteen poisto tuote -taulusta
        let sql ="DELETE FROM tuote WHERE id=?";
        yhteys.query(sql,[id], (err)=>{
            cb(err);
        });
    }
};
