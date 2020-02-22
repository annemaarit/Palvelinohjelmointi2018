/*  
    file: main.js
    desc: OT8, elokuvahaku
            - ohjelman toiminnanohjaus ja virheiden käsittely
    date: 14.1.2019
    auth: Maarit Parkkonen
*/

const express = require("express");
const app = express();
const portti = 3120;
const minimiHakusana = 2;       //hakusanan merkkien vähimmäismäärä
const maxTulosKpl = 10;         //hakutuloksen elokuvien maksimimäärä

//tietokantamoduli
const sqlpalvelut = require("./models/sqlpalvelut");

//näkymät
app.set("views","./views");
app.set("view engine","ejs");

//json -tiedon parsija
const bodyParser= require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended":true}));

//staattisten sivujen polku
app.use(express.static("./public"));

//hakulomakkeen tietojen käsittely:
//      - hakupyyntö, tuloksen virheiden tarkistus, pääsivun uudelleen muodostuspyyntö
app.post("/haku/",(req,res)=>{
    sqlpalvelut.haeElokuvat(req.body,(err,data)=>{          //hakuehdot täyttävien elokuvien tiedot
        let elokuvat = data;
        let virhe = null;

        //tyhjä tulos 
        if (elokuvat.length==0){
            virhe = "Haku ei tuottanut tuloksia. Muuta hakuehtoja."
            elokuvat = null;
        }

        //hakutuloksen suorituksessa tietokantamoduulissa virhetapahtuma
        if (err) {
            virhe = "Virhe tietokantayhteydessä. Yritä myöhemmin uudelleen.";
            elokuvat = null;
        }  

        sqlpalvelut.haeKategoriat((err,kategoriat)=>{       //kaikki kategoriat valintaruutuja varten
            if (err) {
                virhe = "Virhe tietokantayhteydessä. Yritä myöhemmin uudelleen.";
                elokuvat = null;
                kategoriat = null;
            }   

            let lomaketiedot = req.body;                    //hakulomakkeelta lähetetyt tiedot
            let hakusananPituus = lomaketiedot.hakusana.length;

            if ((hakusananPituus != 0) && (hakusananPituus < minimiHakusana)) { //annettu liian lyhyt hakusana
                virhe = "Hakusana on liian lyhyt. Hakusanan on oltava vähintään kaksi merkkiä pitkä.";
                elokuvat = null;
            } else if (elokuvat==null){         //annettu ok hakusana, jolle tyhjä hakutulos
                switch (lomaketiedot.kohde) {   //mikä hakukohde
                    case "Elokuvan nimi":
                        virhe = `elokuvan`;
                        break;
                    case "Ohjaajan nimi":
                        virhe = `ohjaajan`;
                        break;
                    case "Näyttelijä":
                        virhe = `näyttelijän`;
                        break;
                }
                virhe = `Hakusanalla ${lomaketiedot.hakusana} ei löytynyt yhtään ${virhe} nimeä tai nimen osaa. Anna uusi hakusana.`
            }

            //hakusanaa ei ole annettu, eikä yhtään kategoriaa valittu
            if ((hakusananPituus == 0) && (lomaketiedot.kategorianimi == null)) {
                virhe = "Hakuehdot ovat puutteelliset. Anna vähintään hakusana tai valitse kategoria.";
                elokuvat = null
            }

            //tutkitaan onko hakutulos liian iso (liian monta elokuvaa)
            let ylitys=false;
            if (virhe==null){
                if (elokuvat.length>maxTulosKpl){
                    elokuvat=elokuvat.slice(0,maxTulosKpl);
                    ylitys=true;
                }
            }

            //pääsivun muodostuspyyntö ja tietojen välitys
            res.render("index",{"elokuvat":elokuvat,
                                "lomaketiedot":lomaketiedot,
                                "kategoriat":kategoriat,
                                "virhe": virhe,
                                "ylitys": ylitys});      
        });            
    }); 
});

//juurireitti, hakee tarvittavat tiedot tai käyttää oletusarvoja joilla pyytää pääsivun muodostamista
app.get("/",(req,res) =>{ 
    sqlpalvelut.haeKategoriat((err,kategoriat)=>{          //kaikki kategoriat
        if (err) throw `Virhe kategorioiden hakemisessa: ${err}`;  
        let oletustiedot = {"nimi":null,
                            "kohde": "Elokuvan nimi",
                            "jarjestys":"Nimen mukaan nousevasti"};
        res.render("index",{"elokuvat":null,
                            "lomaketiedot":oletustiedot,
                            "kategoriat":kategoriat,
                            "virhe" : null,
                            "ylitys": false}); 
    });   
});

//palvelimen käynnistys
app.listen(portti, () =>{
    console.log(`Palvelin käynnistetty porttiin: ${portti}`);
});