/*  file: main.js
    desc: Ottaa vastaan uutiskirjeen tilaustietoja verkkolomakkeelta ja tallentaa ne tekstitiedostoon.
    date: 10.12.2018
    auth: Maarit Parkkonen*/
const http = require("http");       //tarvittavat moduulit
const url = require("url");
const fs = require("fs");

const portti = 8088;                //käytettävä porttivakio
let kpl = 0;                        //tilaajien kappalemäärä

const palvelin = http.createServer((req, res) => {                  //luodaan palvelin olio

    if (req.url != "/favicon.ico") {                                //ohitetaan faviconin kutsu

        let tiedot = url.parse(req.url, true).query;                //luetaan url ja parsitaan sen querystring JSON -objektiksi
  
        let nimi = (tiedot.tilaajan_nimi)?tiedot.tilaajan_nimi:"";  //tilaajan_nimi -kentän tiedot
        let sposti = (tiedot.sahkoposti)?tiedot.sahkoposti:"";      //sahkoposti -kentan tiedot
        let ehdot = (tiedot.ehdot) ? true : false;                  //onko Hyväksyn ehdot -valittu

        
        //luodaan vastaus
        res.writeHead(200, { "Content-type" : "text/html; charset=utf-8" }); //vastauksen otsikkokentät
        if ((nimi!="")&&(sposti!="")&&(ehdot==true)){                        //tarkistus, onko tiedot annettu
            res.write(`<h2>Olet liittynyt postituslistalle. Kiitos!</h2>`);   //ok: vastauksen html -sisältö
            kpl++;                                                           //kasvatetaan tilaajien määrää
            console.log(`Tilaus vastaanotettu. Tilauksia yhteensä ${kpl} kpl`);

            fs.appendFile('tilaukset.txt', nimi+" "+sposti+"\n",'utf8', function (err) { //kirjoitetaan tiedot tiedostoon
                if (err) throw err
                //console.log('Saved!');
            });
        }
        else {
            res.write(`<h2>Anna nimesi sekä sähköpostiosoitteesi ja hyväksy käyttöehdot</h2>`); //tietoja puuttuu: vastauksen html -sisältö
        }
        res.end(); //päätetään vastaus

    }

});

palvelin.listen(portti, () => {             //palvelimen käynnistys porttivakioon

    console.log(`Palvelin käynnistyi porttiin ${portti}`);

});

