/*  
    file: main.js
    desc: Kumppari Oy
            - ohjelman kontrolli
    date: 11-21.8.2019
    auth: Maarit Parkkonen
*/

const express = require("express");
const app = express();
const portti = 3110;

//tietokantamoduli
const sqlpalvelut = require("./models/sqlpalvelut");

//miten vastaanotettuja tietoja kohdellaan:
const bodyParser = require("body-parser");              //olio lomakkeen tietojen poimintaan
app.use(bodyParser.json());                             // käsittele tiedot JSON-muodossa
app.use(bodyParser.urlencoded( { extended : true } ));  // Määritelee käytetyn formin lähetystavan

//näkymät
app.set("views","./views");
app.set("view engine","ejs");

//kumisaappaiden ominaisuudet
let ominaisuudet = {
    "mallit":["basic","premium","hard","special"],
    "varit":["musta","valkoinen","sininen","punainen","vihrea"],
    "koot":[36,37,38,39,40,41,42,43,44,45,46,47,48]
    }

//staattisten sivujen polku
app.use(express.static("./public"));


//REITIT---------------------------------------------------------------

//juurireitti, ohjaus etusivulle
app.get("/",(req,res) =>{ 
    res.render("index");      
});

//Uusi tuote ---------------------------------

app.get("/uusi/",(req,res) =>{          //uuden tuotteen lisäyssivun muodostus
    res.render("uusi", {"ominaisuudet" : ominaisuudet,"tallennettu":false, "tiedot": null});      
});

app.post("/lisaaUusi/", (req, res) => { //uuden tuotteen lomaketietojen käsittely
    let kpl=req.body.kpl;               //montako tuotetta lisätään samoilla ominaisuuksilla
    for(let i=0; i<kpl;i++){            
        sqlpalvelut.lisaaTuote(req.body, (err) =>{  //tietokantaan tallennuspyyntö
            if (err) throw err;                     //virhe kaataa
        });  
    }
    res.render("uusi", {"ominaisuudet" : ominaisuudet,"tallennettu":true, "tiedot": req.body}); 
});

//Tuotteen muokkaus----------------------------

app.get("/muokkaa/:id/:sivu", (req, res) => {       //muokkaussivun muodostus
    sqlpalvelut.haeTuote(req.params.id,(err,tuote)=>{
        if (err) throw err;
        res.render("muokkaa",{"ominaisuudet" : ominaisuudet,"tuote":tuote,"sivu":req.params.sivu});
    });
});

app.post("/tallenna/:id/:sivu", (req, res) => {     //muokkaustietolomakkeen tietojen käsittely
    let tiedot={"id":req.params.id,                 //muokatun tuotteen tiedot
                "malli":req.body.malli,
                "vari": req.body.vari,
                "koko": req.body.koko};
    sqlpalvelut.muokkaaTuote(tiedot,(err)=>{        //muokattujen tietojen tallennuspyyntö
        if (err) throw err;
        let sivu=req.params.sivu;                   //miltä sivulta muokkauspyyntö lähtöisin
        res.redirect(`/${sivu}/`);                  //ohjaus takaisin lähettävälle sivulle (haku,idHaku tai varasto)
    });
});

app.get("/poisto/:id/:sivu", (req, res) => {        //poistamispyynnön käsittely
    sqlpalvelut.poistaTuote(req.params.id,(err,tuote)=>{    //poistamispyyntö tietokannasta
        if (err) throw err;
        let sivu=req.params.sivu;                   //miltä sivulta poistopyyntö lähtöisin
        res.redirect(`/${sivu}/`);                  //ohjaus takaisin lähettävälle sivulle (haku,idHaku tai varasto)
    });
});

//Tuotehaku id:llä---------------------------

app.get("/idHaku/",(req,res) =>{                    //tyhjän tuotehakusivun muodostus
    res.render("idHaku", {"tuotteet": null,"id": null,"sivu":"idHaku"});      
});

app.post("/idHaku/",(req,res) =>{                   //id hakulomakkeen tietojen käsittely
    let id= req.body.id;                            //haettava id
    sqlpalvelut.haeTuote(id,(err,tuote)=>{          //tietokannasta hakupyyntö
        if (err) throw err;
        res.render("idHaku", {"tuotteet": tuote,"id": id,"sivu":"idHaku"}); //tuotehakusivun muodostus hakutuloksen kanssa
    });
         
});

//Tuotteiden haku ominaisuuksilla-------------------------------

app.get("/haku/",(req,res) =>{                      //hakusivun muodostus
    res.render("haku", {"ominaisuudet" : ominaisuudet, "tuotteet": null,"valinnat":null,"sivu":"haku"});      
});

app.post("/haku/",(req,res) =>{                     //hakutietolomakkeen tietojen käsittely
    if ((req.body.malli==null)&&(req.body.vari==null)&&(req.body.koko==null)){  //jos yhtään ominaisuutta ei ole valittu
        res.render("haku", {"ominaisuudet" : ominaisuudet, "tuotteet": null,"valinnat":"tyhja","sivu":"haku"});   
    } else {                                        //haettavia ominaisuuksia on valittu
        sqlpalvelut.haeTuotteet(req.body,(err,tuotteet)=>{  //hakupyyntö tietokannasta
            if (err) throw err;
            res.render("haku", {"ominaisuudet" : ominaisuudet, "tuotteet":tuotteet,"valinnat":req.body,"sivu":"haku"}); //hakusivun muodostus hakutuloksen kanssa     
        });
    }
});

//Varastotilanne---------------------------------------------

app.get("/varasto/",(req,res) =>{                       //koko varaston tilanne
    sqlpalvelut.ryhmitteleTuotteet((err,tuotteet)=>{    //tuoteryhmien hakupyyntö tietokannasta
        if (err) throw err;
        res.render("varasto",{"tuotteet": tuotteet,"ryhma":null,"sivu":"varasto"}); //varastosivun muodostus tuoteryhmillä
    });
});

app.get("/varasto/:malli/:vari/:koko",(req,res) =>{     //tuoteryhmän varastotilanne
    let ryhma = {                                       //tuoteryhmän tiedot
        "malli": req.params.malli,
        "vari":req.params.vari,
        "koko":req.params.koko
    }; 
    sqlpalvelut.haeRyhma(ryhma,(err,tuotteet)=>{        //ryhmän tuotteiden hakupyyntö
        if (err) throw err;
        res.render("varasto",{"tuotteet": tuotteet,"ryhma":ryhma,"sivu":"varasto"}); //varastosivun muodostus yhdellä tuoteryhmällä
    });

});

//palvelimen käynnistys
app.listen(portti, () =>{
    console.log(`Palvelin käynnistetty porttiin: ${portti}`);
});