/*  
    file: sqlpalvelut.js
    desc: OT8, elokuvahaku tietokantamodulit
            - yhteyden muodostaminen
            - haku- ja kyselymodulit
    date: 14.1.2019
    auth: Maarit Parkkonen
*/

//tietokantayhteyden määrittely
const mysql = require("mysql");
const yhteys = mysql.createConnection({
    "host":"localhost",
    "user": "root",
    "password": "",
    "database":"elokuvatietokanta"
});

//avataan tietokanta yhteys
yhteys.connect((err)=>{
    if (!err){
        console.log("Yhteys avattu");
    }else{
        throw `Virhe tietokannan yhdistämisessä: ${err}`;
    }
});

module.exports = {
    //muodostaa hakutiedoista sql -kyselyn ja suorittaa sen
    //  - palauttaa hakutuloksena hakutietoja vastaavat elokuvatiedot taulukossa tai tyhjän taulukon
    "haeElokuvat": (hakutiedot,cb) => {
        let ehdot = [];
        let hakusanaehdot = "";
        let jarjestys= "";

        let hakusana = mysql.escape(`%${hakutiedot.hakusana}%`);        //estetään sql-injektio

        switch (hakutiedot.kohde) {                                     //mihin sarakkeeseen hakusana kohdennetaan
            case "Elokuvan nimi":
                hakusanaehdot =`nimi LIKE ${hakusana}`;
                break;
            case "Ohjaajan nimi":
                hakusanaehdot= `ohjaajat LIKE ${hakusana}`;
                break;
            case "Näyttelijä":
                hakusanaehdot =`nayttelijat LIKE ${hakusana}`;
                break;
            default: hakusanaehdot =`nimi LIKE ${hakusana}`;
        }
        ehdot.push(`(${hakusanaehdot})`);                                //lisätään hakuehtoihin

        
        if (hakutiedot.kategorianimi){                                   //jos kategorioiden valintaruutuja valittu 
            let kategoriaehdot;
            
            if (Array.isArray(hakutiedot.kategorianimi)){                //onko valittu useampi ruutu           
                let nimet = hakutiedot.kategorianimi.map((nimi)=>{       //tarkistetaan kaikki valinnat SQL-injektion varalta
                    return mysql.escape(nimi);                     
                });             
                kategoriaehdot = nimet.join(" OR kategoria= ");          //liitetään valinnat yhteen TAI -liitoksella
            }else{                                                       //vain yksi ruutu valittu
                kategoriaehdot = mysql.escape(hakutiedot.kategorianimi); //sql-injektion tarkistus
            }
            ehdot.push (`(kategoria = ${kategoriaehdot})`);              //lisätään kategoriaehdot ehdot -taulukkoon  
        }
        
        switch (hakutiedot.jarjestys) {                                  //miten tulostaulukko järjestetään
            case "Nimen mukaan nousevasti":
                jarjestys =`nimi ASC`;
                break;
            case "Nimen mukaan laskevasti":
                jarjestys = `nimi DESC`;
                break;
            case "Uusin ensin":
                jarjestys =`valmistumisvuosi DESC`;
                break;
            case "Vanhin ensin":
                jarjestys =`valmistumisvuosi ASC`;
                break;
            default:
                jarjestys = `nimi DESC`;
        }

        //muodostetaan sql -lause
        let sql =`SELECT elokuvat.*, kategoriat.kategoria FROM elokuvat LEFT OUTER JOIN kategoriat ON elokuvat.kategoria_id=kategoriat.kategoria_id WHERE ${ehdot.join(" AND ")} ORDER BY ${jarjestys};`;
        //console.log(sql);
        //kyselyn suoritus ja tuloksen palautus
        yhteys.query(sql, (err,elokuvat)=>{
            cb(err,elokuvat);
        });
    },
    //hakee kaikki elokuvakategoriat
    "haeKategoriat": (cb) => {                                             
        let sql ="SELECT kategoria FROM kategoriat";
        yhteys.query(sql, (err,kategoriat)=>{
            cb(err,kategoriat);
        });
    }
};