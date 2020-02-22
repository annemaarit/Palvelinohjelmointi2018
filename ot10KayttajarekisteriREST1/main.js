/*  
    file: main.js
    desc: OT10, Käyttäjärekisteri (REST API)
            - ohjelman ohjaus 
    date: 17.1.2019
    auth: Maarit Parkkonen
*/
const restify = require("restify");
const server = restify.createServer();
const portti = 3110;

const sqlPalvelut = require("./models/sqlpalvelut");

//annetaan clientille lupa käyttää tätä palvelinta
const corsMiddleWare = require("restify-cors-middleware");
const cors = corsMiddleWare({ 
                             "origins" : ["http://t10client.herokuapp.com"]
                            });

//vakiofunktio, joka pyytää hakemaan kaikkien käyttäjien tiedot tietokannasta
const kaikkiKayttajat = (cb) => {
    sqlPalvelut.haeKayttajat((err,kayttajat)=>{    
        if (!err) {                                     //jos haku onnistui
            cb(200,kayttajat);                          //palauttaa ok -statuksen ja käyttäjien tiedot json -rakenteessa
        }else{                                          //jos haku epäonnistui eli virhe
            cb(500,{"virhe":"Käyttäjätietojen lukeminen tietokannasta epäonnistui."}); //palauttaa virhetiedot (joita client ei oikeastaan lue)
        }
    });
};

//esityöt ennen reittejä
server.pre(restify.pre.sanitizePath());                  //liikojen /-poisto
server.pre(cors.preflight);

server.use(restify.plugins.bodyParser());                //parsija
server.use(cors.actual);                                 //middleware cors

//kaikki käyttäjätiedot
server.get("/api/kayttajat",(req,res,next)=>{
    kaikkiKayttajat((err,tulos)=>{
        res.send(err,tulos);                             //käyttäjä- tai virhetiedot
    });
    return next();
});

//uuden käyttäjän lisääminen
server.post("/api/kayttajat",(req,res,next)=>{
    let uusiKayttaja = req.body;                        //clientin lähettämät käyttäjätiedot
    console.log(uusiKayttaja);

    sqlPalvelut.lisaaKayttaja(uusiKayttaja, (err) =>{   //lisäyspyyntö
        if (!err){                                      //jos lisäys onnistui
            kaikkiKayttajat((err,tulos)=>{              
                res.send(err,tulos);                    //palautustiedot
            });
        }else{                                          //jos lisäys epäonnistui   
            console.log("lisäys epäonnistui");
            res.send(500,{"virhe":"Käyttäjän lisäys tietokantaan epäonnistui."}); //virheen palautustiedot
        }
    });
    return next();
});

//käyttäjän tietojen päivittäminen, id määrittelee
server.put("/api/kayttajat/:id",(req,res,next)=>{
    let uudetTiedot = req.body;                         //clientin lähettämät muutostiedot
    sqlPalvelut.paivitaKayttaja(req.params.id,uudetTiedot,(err)=>{   //päivityspyyntö 
        if (!err) {                                     //jos päivitys onnistui
            kaikkiKayttajat((err,tulos)=>{
                res.send(err,tulos);
            }); 
        }else{                                          //jos päivitys epäonnistui
            res.send(500,{"virhe":"Käyttäjätietojen päivittäminen tietokantaan epäonnistui."}); 
        }
    });
    return next();
});

//käyttäjän tietojen poistaminen, id määrittelee
server.del("/api/kayttajat/:id",(req,res,next)=>{
    sqlPalvelut.poistaKayttaja(req.params.id,(err)=>{   //poistamispyyntö
        if (!err){                                      //jos poistaminen onnistui
            kaikkiKayttajat((err,tulos)=>{
                res.send(err,tulos);
            });
        } else {                                        //jos poistaminen epäonnistui
            res.send(500,{"virhe":"Käyttäjätietojen poistaminen tietokannasta epäonnistui."}); 
        }
    });
    return next();
});

//palvelimen käynnistys
server.listen(portti, () =>{
    console.log(`Palvelin käynnistetty porttiin: ${portti}`);
});