/*  
    file: main.js
    desc: OT11, Käyttäjärekisteri (REST API), lisäominaisuuksia
            - ohjelman ohjaus ja käyttöoikeuksien tarkistus
    date: 19.1.2019
    auth: Maarit Parkkonen
*/
const restify = require("restify");
const server = restify.createServer();
const portti = 3111;

const jwt = require("restify-jwt-community");
const jwtDecode = require("jsonwebtoken");
const sqlPalvelut = require("./models/sqlpalvelut");

//annetaan clientille lupa käyttää tätä palvelinta
const corsMiddleWare = require("restify-cors-middleware");
const cors = corsMiddleWare({ 
                             "origins" : ["*"],
                             "allowHeaders" : ["Authorization"]
                            });

//vakiofunktio, joka pyytää hakemaan kaikkien käyttäjien tiedot tietokannasta
const kaikkiKayttajat = (cb) => {
    sqlPalvelut.haeKayttajat((err,kayttajat)=>{    
        if (!err) {                                     //jos haku onnistui
            cb(200,kayttajat);                          //palauttaa ok -statuksen ja käyttäjien tiedot json -rakenteessa
        }else{                                          //jos haku epäonnistui eli virhe
            cb(500,{"virhe":"Käyttäjätietojen lukeminen tietokannasta epäonnistui."}); //palauttaa virhetiedot
        }
    });
};

//vakiofunktio, joka palauttaa nykyhetken muodossa pp.kk.vvvv hh:min:sek
const aikaleima = (cb) => {
    let aika = new Date();
    let vvvv = aika.getFullYear();
    let kk = aika.getMonth()+1;
    let pp = aika.getDate();
    let tunnit =  aika.getHours();
    let min = ('0'+aika.getMinutes()).slice(-2);
    let sek = ('0'+aika.getMinutes()).slice(-2);
    cb(pp+"."+kk+"."+vvvv+" "+tunnit+":"+min+":"+sek);
};

//huolehtii lokiin kirjoittamisesta
function kirjaaLokiin(req){
    let token = req.headers.authorization.split(' ')[1];        //poimitaan token headereista
    let decoded = jwtDecode.decode(token, {complete: true});    //muutetaan token json muotoon
    let kayttajanimi=decoded.payload.kayttajanimi;              //poimitaan käyttäjänimi payload osasta
    aikaleima((aika) => {                                       //pyydetään aika muodossa pp.kk.vvvv hh:min:sek
        let uusiLokitieto = {                                   //lokiin tallennettavat tiedot
            "kayttajanimi" : kayttajanimi?kayttajanimi:"anonyymi",  //jos tokenissa ei ole käyttäjänimiä tallennetaan anonyymi
            "aika": aika,
            "metodi": req.method
        };
        sqlPalvelut.lisaaLokiin(uusiLokitieto, (err) =>{        //pyydetään loki -tiedostoon tallennusta
            if (err){                                           //jos virhe
                console.log(err);                               //virhe ei kaada ohjelmaa, vain ilmoitus konsoliin 
            }else{
                console.log(`Loki onnistui`);
            }
        });
    });
};

//esityöt ennen reittejä
server.pre(restify.pre.sanitizePath());                  //liikojen /-poisto
server.pre(cors.preflight);

//middlewaret
server.use(restify.plugins.bodyParser());                //parsija
server.use(cors.actual);                                 //middleware cors
server.use(jwt({"secret":"kissakala"}).unless({"method":"GET"}),(err,req,res,next)=>{  //käyttöoikeuksien tarkistus reitteihin, huom! GET pois lukien
    if (err){                                            //ei käyttöoikeutta
        res.send(401,{"virhe":"Käyttöoikeudet eivät riitä tämän toiminnon suorittamiseen."});
    }else{        
        return next();                                  //on oikeus jatkaa eteenpäin                   
    }
});

//kaikki käyttäjätiedot
server.get("/api/kayttajat",(req,res,next)=>{
    kaikkiKayttajat((err,tulos)=>{                       //pyydetään kaikki käyttäjätiedot
        if (err!=500){
            kirjaaLokiin(req);                           //lisätään lokiin GET -merkintä (vain onnistuneet pyynnöt kirjataan)
        }
        res.send(err,tulos);                             //lähetetään käyttäjä- tai virhetiedot
    });
    return next();
});


//uuden käyttäjän lisääminen
server.post("/api/kayttajat",(req,res,next)=>{
    let uusiKayttaja = req.body;                        //clientin lähettämät käyttäjätiedot
    console.log(uusiKayttaja);

    sqlPalvelut.tarkistaKayttajatiedot(uusiKayttaja,true,(virheet)=>{   //puuttuuko tietoja?
        if (virheet!=""){                                       //tietoja puuttuu
            res.send(400,{"virhe":`Tietoja puuttuu kentistä: ${virheet}. Kirjoita tiedot.`})
        }
        else{                                                   //tiedot ok
            sqlPalvelut.lisaaKayttaja(uusiKayttaja, (err) =>{   //lisäyspyyntö
                if (!err){                                      //jos lisäys onnistui
                    kirjaaLokiin(req);                          //lisätään lokiin POST -merkintä
                    kaikkiKayttajat((err,tulos)=>{              
                        res.send(err,tulos);                    //palautustiedot
                    });
                }else{                                          //jos lisäys epäonnistui   
                    console.log("lisäys epäonnistui");
                    res.send(500,{"virhe":"Käyttäjän lisäys tietokantaan epäonnistui."}); //virheen palautustiedot
                }
            });
        }
    });

    return next();
});

//käyttäjän tietojen päivittäminen, id määrittelee
server.put("/api/kayttajat/:id",(req,res,next)=>{
    let uudetTiedot = req.body;                         //clientin lähettämät muutostiedot

    sqlPalvelut.tarkistaKayttajatiedot(uudetTiedot,false,(virheet)=>{ //puuttuuko tietoja?
        if (virheet!=""){                                       //tietoja puuttuu
            res.send(400,{"virhe":`Tietoja puuttuu kentistä: ${virheet}. Kirjoita tiedot.`})
        }
        else{
            sqlPalvelut.paivitaKayttaja(req.params.id,uudetTiedot,(err)=>{   //päivityspyyntö 
                if (!err) {                                     //jos päivitys onnistui
                    kirjaaLokiin(req);                          //lisätään lokiin PUT -merkintä
                    kaikkiKayttajat((err,tulos)=>{
                        res.send(err,tulos);
                    }); 
                }else{                                          //jos päivitys epäonnistui
                    res.send(500,{"virhe":"Käyttäjätietojen päivittäminen tietokantaan epäonnistui."}); 
                }
            });
        }
    });
    return next();
});

//käyttäjän tietojen poistaminen, id määrittelee
server.del("/api/kayttajat/:id",(req,res,next)=>{
    sqlPalvelut.poistaKayttaja(req.params.id,(err)=>{   //poistamispyyntö
        if (!err){                                      //jos poistaminen onnistui
            kirjaaLokiin(req);                          //lisätään lokiin DELETE -merkintä            
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