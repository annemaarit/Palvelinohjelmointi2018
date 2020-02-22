const express = require("express");
const app = express();
const portti = 3111;
const session = require("express-session");
const uutistyokalut = require("./models/uutistyokalut");
const crypto = require("crypto");

app.set("views","./views");
app.set("view engine","ejs");

const bodyParser= require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended":true}));

app.use(express.static("./public"));

app.use(session({
    "secret" : "JotaKukaanE1PystyArvaamaan",
    "resave" : false,
    "saveUninitialized" : false
}));


app.post("/login/",(req,res) => {                                   //kirjautumistietojen tarkistaminen
    uutistyokalut.haeKayttaja(req.body.tunnus,(kayttajatiedot)=>{
        if (kayttajatiedot){

            let tiiviste = crypto.createHash("SHA512")
                                .update(req.body.salasana)
                                .digest("hex");

            if (kayttajatiedot.salasana==tiiviste){
                req.session.kommentoi=true;
                req.session.kayttaja=req.body.tunnus;
                res.redirect("/");
            } else {
                req.session.kommentoi=false;
                req.session.kayttaja="";
                res.render("login",{"virhe" : "Virheellinen käyttäjätunnus tai salasana."});  
            }

        } else {
            req.session.kommentoi=false;
            res.render("login",{"virhe" : "Virheellinen käyttäjätunnus tai salasana."});  
        }   
    });
});

app.post("/tallennaKommentti/",(req,res) =>{                           //uuden kommentin tallennus tiedostoon
    let aika = new Date().getTime();

    let uusiKommentti = {
        "kirjoittaja" : req.session.kayttaja,
        "aika" : aika,
        "uutisId" :1, //req.body.id,
        "teksti" : req.body.teksti
    };
    
    uutistyokalut.lisaaUusiKommentti(uusiKommentti, ()=>{
         res.redirect("/");
    });
});

app.post("/tallennaKayttaja/",(req,res) =>{                             //uuden käyttäjän tietojen tallennus
    let tiiviste = crypto.createHash("SHA512")                          //salasanan salaus
                         .update(req.body.salasana)
                         .digest("hex");
    let uusiKayttaja = {
        "tunnus" : req.body.tunnus,
        "salasana" : tiiviste
    };
    
    uutistyokalut.lisaaUusiKayttaja(uusiKayttaja, ()=>{
         res.redirect("/kirjaudu/");
    });
});

app.get("/kirjaudu/",(req,res)=>{                                       //ohjaus kirjautumissivun muodostukseen
    res.render("login",{"virhe" : null});
});

app.get("/",(req,res) =>{                                               //ohjaus pääsivun (index) muodostukseen
    uutistyokalut.haeKommentit((kommentit)=>{
        uutistyokalut.haeUutiset((uutiset)=>{
            res.render("index",{"uutiset": uutiset,                     //kaikki uutiset taulukoituna
                                "kommentit" : kommentit,                //kaikki kommentit taulukoituna
                                "kommentoi": req.session.kommentoi,     //onko lupa kommentoida (true/false)
                                "kayttaja" : req.session.kayttaja});    //kayttajan tunnus
        }); 
    });

});

app.get("/poista/:aikaleima",(req,res) =>{                          //kommentin poistaminen aikaleiman perusteella (parametri)
    uutistyokalut.poistaKommentti(req.params.aikaleima, ()=>{
        res.redirect("/");
    });
});

app.get("/uusiKayttaja/",(req,res)=>{                               //ohjaus rekisteröintisivulle
    res.render("rekisteroidy",{});
})

app.get("/logout/",(req,res)=>{                                     //käyttäjän ulos kirjautuminen
    req.session.kommentoi=false;
    req.session.kayttaja="";
    res.redirect("/");
})

app.listen(portti, () =>{
    console.log(`Palvelin käynnistetty porttiin: ${portti}`);
});