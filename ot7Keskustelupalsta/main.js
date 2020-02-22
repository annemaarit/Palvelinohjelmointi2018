/*  
    file: main.js
    desc: OT7, keskustelupalsta
            - päätiedosto, joka ohjaa ohjelman toiminnan
    date: 12.1.2019
    auth: Maarit Parkkonen
*/

const express = require("express");
const app = express();
const portti = 3110;

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

//uuden keskustelun tallennuspyyntö ja ohjaus pääsivulle
app.post("/tallennaUusiKeskustelu/", (req, res) => {
    sqlpalvelut.lisaaKeskustelu(req.body, (err) =>{
        if (err) throw err;
        res.redirect("/");

    });   
});

//uuden viestin tallennuspyyntö tiettyyn keskusteluun
//ja ohjaus takaisin yksittäisen keskustelun sivulle
app.post("/tallennaVastaus/", (req, res) => {
    sqlpalvelut.lisaaVastaus(req.body, (err) =>{
        if (err) throw err;
        sqlpalvelut.haeKeskustelu(req.body.id,(err,rivit)=>{
            if (err) throw err;
            let asc=true;
            sqlpalvelut.haeVastaukset(req.body.id,asc,(err,vastaukset)=>{ //keskustelun kaikki vastaukset nousevaan järjestykseen
                if (err) throw err;
                res.render("keskustelu",{"keskustelu": rivit[0],
                                         "vastaukset": vastaukset});
            });
        });    
    });   

});

//juurireitti, hakee tarvittavat tiedot ja pyytää pääsivun muodostamista
app.get("/",(req,res) =>{ 
    sqlpalvelut.haeKeskustelutKpl((err,keskustelut)=>{          //kaikkien keskustelujen tiedot sekä niiden vastausten kpl
        if (err) throw err;     
        sqlpalvelut.haeUusimmatViestit((err,uusinTaulukko)=>{   //jokaisen keskustelun uusimman vastauksen aika laskevassa järjestyksessä
            if (err) throw err;                                 //     - jos vastauksia ei ole aikana käytetään keskustelun aloitusaikaa!
            //console.log(uusinTaulukko);
            keskustelut=jarjestaTaulukko(uusinTaulukko,keskustelut);    //keskustelut järjestetään uusimman vastauksen mukaisesti
            res.render("index",{"keskustelut":keskustelut,      //ohjaus pääsivun muodostukseen
                                "uusin":uusinTaulukko});
        });
    });   
});

//järjestää tauluB:n samaan järjestykseen tauluA:n kanssa keskusteluId:n perusteella
//- ei kovin tehokas ratkaisu mutta toimii
function jarjestaTaulukko(tauluA, tauluB){
    let tauluC=[];
    tauluA.forEach(riviA => {
        tauluB.forEach(riviB => {
            if (riviA.keskusteluId==riviB.keskusteluId){
                tauluC.push(riviB);
                //break;  ei toimi tässä..
            }
        });
    });
    return tauluC;
};

//pyytää uuden keskustelun aloitussivun muodostamista
app.get("/uusiKeskustelu/",(req,res) =>{ 
    res.render("uusiKeskustelu",{});
});

//hakee tietyn keskustelun tiedot ja vastaukset,
//pyytää yksittäisen keskustelun sivun muodostamista
app.get("/naytaKeskustelu/:id",(req,res) =>{ 
    sqlpalvelut.haeKeskustelu(req.params.id,(err,rivit)=>{
        if (err) throw err;
        let asc=true;
        sqlpalvelut.haeVastaukset(req.params.id,asc,(err,rivit2)=>{
            if (err) throw err;
            res.render("keskustelu",{"keskustelu": rivit[0],
                                     "vastaukset": rivit2});
        });
    });
});

//palvelimen käynnistys
app.listen(portti, () =>{
    console.log(`Palvelin käynnistetty porttiin: ${portti}`);
});