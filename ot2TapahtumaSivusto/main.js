/*  file: main.js
    desc: Tietojenkäsittelyn koulutuksen valtakunnalliset kehittämispäivien verkkosivuston:
            -ylläpito
            -uuden osallistujan tietojen tallentaminen tiedostoon
            -ilmoittautuneet -sivun luominen tiedostoon tallennetuista tiedoista
    date: 12.12.2018
    auth: Maarit Parkkonen*/

const express = require("express");                     //tarvittavat modulit
const fs = require("fs");
const bodyParser = require("body-parser");             

const portti = 3102;                                    //kuunneltava portti

const app = express();                                  //palvelin olio


app.use(bodyParser.json());                             //tiedot JSON-muotoon
app.use(bodyParser.urlencoded( { extended : true } ));  // lomakkeen lähetystapa

app.use(express.static("./public"));                    //juurikansio

//uuden osallistujan tallentaminen tiedostoon
app.post("/tallenna", (req, res) => {                   
    osallistujaLista = fs.readFileSync("./ilmoittautuneet.json"); //luetaan olemassa oleva tiedosto

    if (tiedotOk(req)==true){                           //jos tietoja ei puutu
        if (osallistujaLista=="") {                     //jos eka osallistuja
            let uusiHenkilo = JSON.stringify(req.body); //tiedot string JSON -muotoon tiedostoa varten
            fs.writeFileSync("./ilmoittautuneet.json", `{"henkilot":[${uusiHenkilo}]}`); //JSON rakenne taulukolla
        }
        else{
            osallistujaLista = JSON.parse(osallistujaLista);                    //tiedot JS objektiksi  
            osallistujaLista.henkilot.push(req.body);                           //osallistujan tiedot taulukkoon
            //console.log(osallistujaLista);
            osallistujaLista = JSON.stringify(osallistujaLista,null,2);         ///tiedot string JSON -muotoon tiedostoa varten
            fs.writeFileSync("./ilmoittautuneet.json", `${osallistujaLista}`);  //tiedostoon kirjoitus
        };
        res.redirect("/kiitos.html");                   //siirto kiitos -sivulle
    }
    else{                                               //tietoja puuttuu
        res.redirect("/virheellinen.html");             //siirto virhe -sivulle
    };
});

//tarkistaa puuttuuko tietoja (ei nätti)
// - palauttaa true, jos kaikki tiedot on annettu
// - palauttaa false heti jos yksikin tieto puuttuu
function tiedotOk(req){
    if (req.body.etunimi==""){
        return false;
    }
    if (req.body.sukunimi==""){
        return false;
    }
    if (req.body.titteli==""){
        return false;
    }
    if (req.body.organisaatio==""){
        return false;
    }
    if (req.body.katuosoite==""){
        return false;
    }
    if (req.body.postinumero==""){
        return false;
    }
    if (req.body.postiosoite==""){
        return false;
    }
    if (req.body.puhnro==""){
        return false;
    }
    if (req.body.sposti==""){
        return false;
    }
    return true;
}

//ilmoittautuneiden osallistujien lukeminen tiedostosta ja
//ilmoittautuneet.html sivun muodostus
app.get("/ilmoittautuneet", (req, res) => {

    let ilmoittautuneet = JSON.parse(fs.readFileSync("./ilmoittautuneet.json")); //muutos js -objekti muotoon
    //console.log(ilmoittautuneet);
    let kpl = ilmoittautuneet.henkilot.length;                                   //ilmoittautuneiden määrä
    //console.log(kpl);
    let taulukko="";                 //HTML -taulukko

    for (let i=0; i<kpl;i++){        //ilmoittautuneiden läpikäynti riveittäin ja tallennus HTML -taulukon riveiksi
        taulukko=taulukko+"<tr>";
        taulukko =`${taulukko} <td>${ilmoittautuneet.henkilot[i].etunimi}</td>`;
        taulukko =`${taulukko} <td>${ilmoittautuneet.henkilot[i].sukunimi}</td>`;
        taulukko =`${taulukko} <td>${ilmoittautuneet.henkilot[i].titteli}</td>`;
        taulukko =`${taulukko} <td>${ilmoittautuneet.henkilot[i].organisaatio}</td>`;
        taulukko =`${taulukko} <td>${ilmoittautuneet.henkilot[i].katuosoite}</td>`;
        taulukko =`${taulukko} <td>${ilmoittautuneet.henkilot[i].postinumero}</td>`;
        taulukko =`${taulukko} <td>${ilmoittautuneet.henkilot[i].postiosoite}</td>`;
        taulukko =`${taulukko} <td>${ilmoittautuneet.henkilot[i].puhnro}</td>`;
        taulukko =`${taulukko} <td>${ilmoittautuneet.henkilot[i].sposti}</td>`;
        taulukko =`${taulukko} <td>${ilmoittautuneet.henkilot[i].ruoka}</td>`;
        taulukko =`${taulukko} <td>${ilmoittautuneet.henkilot[i].terveiset}</td>`;
        taulukko=taulukko+"</tr>";
    };

    //console.log(taulukko);

    //HTML -sivun muodostus
    let sivu = `<!DOCTYPE html>     
    <html lang="en">
    
    <head>
    
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
        <title>Kehityspäivät: kiitos</title>
    
        <!-- Bootstrap core CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    
        <!-- Custom styles for this template ja omat lisäystyylit -->
        <link href="css/simple-sidebar.css" rel="stylesheet">
    
    </head>
    
    <body>
    
        <div id="wrapper">
    <img 	
            <!-- Sidebar -->
            <div id="sidebar-wrapper">
                <ul class="sidebar-nav">
                    <li>
                        <img src="images/xamk_logo.png" alt="XAMK"> 	
                    </li>
                    <li>
                        <a href="index.html">Tervetuloa</a>
                    </li>				
                    <li>
                        <a href="info.html">Info</a>
                    </li>
                    <li>
                        <a href="ohjelma.html">Ohjelma</a>
                    </li>
                    <li>
                        <a href="ilmoittautuminen.html">Ilmoittautuminen</a>
                    </li>
                    <li>
                        <a href="majoitus.html">Majoitus</a>
                    </li>
                </ul>
            </div>
            <!-- /#sidebar-wrapper -->      
            <!-- Page Content -->
            <div id="page-content-wrapper">
              <div class="container-fluid">
                        <h1>Ilmoittautuneet</h1>
                        <h3> Ilmoittautuneita ${kpl} kpl. </h3>
                        <table>
                        <tr>
                        <th>Etunimi</th>
                        <th>Sukunimi</th>
                        <th>Titteli</th>
                        <th>Organisaatio</th>
                        <th>Katuosoite</th>
                        <th>Postinumero</th>
                        <th>Postiosoite</th>
                        <th>Puhelinnumero</th>
                        <th>Sähköposti</th>
                        <th>Ruokarajoitukset</th>
                        <th>Terveiset</th>
                        </tr>  
                        ${taulukko}
                        </table>
                    <br>
              </div>
          </div>
          <!-- /#page-content-wrapper -->
        </div>
        <!-- /#wrapper -->
        
        </body>
        
        </html>
               `;

    res.send(sivu);         //sivun lähetys
});

//palvelimen käynnistys
app.listen(portti,() => {
    console.log(`Palvelin käynnistyi porttiin ${portti}`)
});