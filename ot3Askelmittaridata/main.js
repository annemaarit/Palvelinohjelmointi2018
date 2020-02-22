/*  file: main.js
    desc: Askelmittaridata
            - lukee vain json- ja csv -muotoisia tiedostoja  multer -modulin avulla
            - tarkistaa json -tiedostojen rakenteellisen eheyden try -catch rakenteella
            - muodostaa html -taulukon tiedoston tiedoista
            - poistaa luetun tiedoston kopion
    date: 14.12.2018
    auth: Maarit Parkkonen*/

//tarvittavat moduulit
const express = require("express");
const multer = require("multer");                           
const fs = require("fs");                                   
const csv = require("csv-parser");

const app = express();                                      
const upload = multer({ dest : "./tmp/" });                 //tiedostojen lukuolio

const portti = 3103;                                        //mitä porttia kuunnellaan
const taulukotTiedosto = "./taulukot.json";                 //onnistuneesti luettujen taulukkojen tiedot

app.use(express.static("./public/"));                       //staattisten tiedostojen juurihakemisto

//tiedostojen luku ja käsittely taulukon muodostusta varten
app.post("/upload/", upload.single("tiedosto"), (req, res) => {     //tiedoston lataus
    let tiedostonimi=req.file.originalname;                 //alkuperäinen nimi

    if (!tiedostonimi.match(/\.(json|csv)$/)) {             //tiedostopäätteen tarkistus
        fs.unlinkSync(`./tmp/${req.file.filename}`);        //väärän tyyppinen tiedosto tuhotaan
        res.redirect("virhetiedosto.html");                 //virheilmoitus -sivulle
    }
    else{                                                   
        if (tiedostonimi.search(".csv")!=-1){               //jos csv -tiedosto
                let csvTulos=[];
                fs.createReadStream(`./tmp/${req.file.filename}`)   //tiedoston avaus tietovirtana
                    .pipe(csv({ separator: ';' }))                  //ohjaus parsijalle, erottimena ;
                    .on('data', function(data){                     //parsitun tiedon käsittely
                        csvTulos.push(data);                        //lisätään taulukkoon
                        /*csvTulos.forEach(rivi => {                //muutetaan arvot kokonaisluvuiksi
                            rivi.pp=parseInt(rivi.pp);              
                            rivi.kk=parseInt(rivi.kk);
                            rivi.vvvv=parseInt(rivi.vvvv);
                            rivi.askeleet=parseInt(rivi.askeleet);
                        })*/                     
                    })
                    .on('end', () => {                              //kaikki tiedot parsittu
                        //console.log(csvTulos);                
                        csvTulos.forEach(rivi => {                  //muutetaan arvot kokonaisluvuiksi
                            rivi.pp=parseInt(rivi.pp);
                            rivi.kk=parseInt(rivi.kk);
                            rivi.vvvv=parseInt(rivi.vvvv);
                            rivi.askeleet=parseInt(rivi.askeleet);
                        })
                        //console.log(csvTulos); 
                        tallennaHTMLTauluksi(csvTulos,req.body.nimi);   //tallennetaan HTML -taulukoksi
                        fs.unlinkSync(`./tmp/${req.file.filename}`);    //tuhotaan tiedoston kopio
                        res.redirect("/");                              //aloitussivulle
                    });
        }
        else{                                                          //jos JSON -tiedosto
                     
            fs.readFile(`./tmp/${req.file.filename}`, (err, kktiedot) => {      //tiedoston avaus
                if (!err){                         
                    let kkDatat =parsiJSON(kktiedot);                           //js- objektiksi + tiedoston eheyden tarkistusta
                    if (kkDatat==null){                                         //ei eheä, parsiminen epäonnistui
                        fs.unlinkSync(`./tmp/${req.file.filename}`);            //tuhotaan kopio
                        res.redirect("korruptoitunut.html");                    //virheilmoitus -sivulle
                    }
                    else{                                                       //js -objektiksi parsiminen onnistui
                        //console.log(kkDatat);
                        tallennaHTMLTauluksi(kkDatat,req.body.nimi);            //tallennetaan HTML -taulukoksi
                        fs.unlinkSync(`./tmp/${req.file.filename}`);            //tuhotaan kopio
                        res.redirect("/");                                      //aloitussivulle
                    }
                }
            });    
        }
    }
});

//muuttaa json -stringin js -objektiksi
//  -jos epäonnistuu on rakenteessa vikaa
function parsiJSON(data){
    try {
      return JSON.parse(data);      //onnistuessa palauttaa objektin
    } catch(ex){
      return null;                  //epäonnistuessa vain null
    }
};

//muodostaa kuukausitiedoista  JSON -tietueen ja tallentaa sen tietoja ylläpitävään tiedostoon
//      - talletettavat tiedot: kuukauden nimi, HTML-muotoinen taulukko, 
//        askelien yhteissumma ja päivien lukumäärä
function tallennaHTMLTauluksi(Datat,kk){
    let tiedotHTML="";
    tiedotHTML=`${tiedotHTML}<table><tr><th>Pvm</th><th>Askeleet</th></tr>`;      //HTML-taulukon otsikot
    
    let askelSumma=0;
    let kpl=0;

    //taulukon rivit
    Datat.forEach(Data => {
        tiedotHTML = 
        `${tiedotHTML}<tr><td>${Data.pp}.${Data.kk}.${Data.vvvv}</td><td>${Data.askeleet}</td></tr>`; 
        askelSumma += Data.askeleet;
        kpl++;
    });
    tiedotHTML=`${tiedotHTML}</table>` //taulukko valmis

    //lisätään tiedot kuukausien ylläpitotiedostoon
    fs.readFile(taulukotTiedosto, (err, data3) => {

        if (!err) {

            let tiedot = JSON.parse(data3);                 //'vanhat' tiedot
            
            let uusitieto = { 
                            "kuukausi" : kk,
                            "taulukkoHTML" : tiedotHTML, 
                            "askelsumma" : askelSumma,
                            "paiviaKpl": kpl
                           };

            tiedot.push(uusitieto);                         //vanhat ja uudet tiedot yhteen
            
            fs.writeFileSync(taulukotTiedosto, JSON.stringify(tiedot, null, 2));      //kaikki tiedot tiedostoon
        }
    }); 
};

//juurireitti, joka muodostaa sovelluksen päänäkymän
app.get("/", (req, res) => {
            fs.readFile(taulukotTiedosto, (err, data4) => {     //luetaan tallessa olevat kuukausitiedot
              if (!err){
               let taulukot = JSON.parse(data4);                //js -objektiksi
               //console.log(taulukot);
               //koko HTML -sivun muodostus, sivun alku
               let sivualku = `                                 
                <!DOCTYPE html>
                <html lang="fi">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
                    <title>Askeldata</title>
                    <style>
                    table, th, td {
                        border: 1px solid black;
                      }
                    table {
                        margin: 20px;
                    }
                    td {
                        width: 200px;
                    }
                    </style>
                </head>
                <body>
                
                <div class="container">
            
                <h1 class="mb-4">Lähetä askelmittarin tiedot</h1>
            
                <form method="POST" action="/upload" enctype="multipart/form-data" class="mb-4">
            
                    <div class="form-group">
                        <label for="nimi">Nimi:</label>
                        <input class="form-control" type="text" name="nimi" id="nimi" required>
                        <label for="tiedosto">Tiedot:</label>
                        <input class="form-control-file" type="file" accept=".json,.csv" name="tiedosto" id="tiedosto" required>
                    </div>
            
                    <input type="submit" class="btn btn-success mb-4" name="laheta" value="Lähetä">
                    <a href="/" class="btn btn-primary mb-4">Peruuta</a>
                    
                    <h2 class="mb-4">Kaikki tallennetut tiedot:</h2>
                </form>`;
                
                //sivun taulukkotiedot
                let taulukotHTML="";
                let kuukausi="";
                let keskiarvo=0;

                //muodostetaan yksi taulukko kerrallaan
                taulukot.forEach(taulukko => {
                    keskiarvo=Math.round(taulukko.askelsumma/taulukko.paiviaKpl);
                    kuukausi=`<h3>${taulukko.kuukausi}</h3>
                              <p>Yhteensä ${taulukko.askelsumma} askelta. Keskimäärin ${keskiarvo} askelta päivässä.</p>
                              ${taulukko.taulukkoHTML}`;
                    taulukotHTML=kuukausi+taulukotHTML;
                });

                //jos ei talletettuja taulukkoja
                if (taulukotHTML==""){
                    taulukotHTML="<p>Ei tallennettuja tietoja</p>"
                }

                //sivun loppuosa
                let sivuloppu=`
                </div>
                </body>
                </html>
                `;

                //lähetetään kokonainen HTML -sivu vastaukseksi
                res.send(sivualku+taulukotHTML+sivuloppu);
              }
            });                  
});

//palvelimen käynnistäminen
app.listen(portti, () =>  {
   console.log(`Palvelin käynnistyi porttiin: ${portti}`); 
});