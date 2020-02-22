const express = require("express");
const app = express();
const portti = 3105;

const bodyParser= require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended":true}));

app.use(express.static("./public"));

const blogityokalut=require("./models/blogityokalut");
const vakiobloggari = "Anselmi Tonttu";

app.set("views","./views");
app.set("view engine","ejs");

app.get("/",(req,res) =>{
    let kirjoitukset = blogityokalut.haeKaikki((kirjoitukset)=>{
        res.render("index",{"kirjoitukset": kirjoitukset});
        //console.log(kirjoitukset);
    }); 
});

app.get("/yllapito/",(req,res) =>{
    //res.render("yllapito");
    let kirjoitukset = blogityokalut.haeKaikki((kirjoitukset)=>{
        res.render("yllapito",{"kirjoitukset": kirjoitukset});
    });    
});

app.get("/tykatty/:leima",(req,res) =>{
    blogityokalut.lisaaTykkays(req.params.leima, ()=>{
        res.redirect("/");
    });
});

app.get("/inhottu/:leima",(req,res) =>{
    blogityokalut.lisaaHuono(req.params.leima, ()=>{
        res.redirect("/");
    });
});

app.get("/poista/:leima",(req,res) =>{
    blogityokalut.poistaKirjoitus(req.params.leima, ()=>{
        res.redirect("/");
    });
});

app.post("/tallenna/",(req,res) =>{
    let aika = new Date().getTime();

    let uusiKirjoitus = {
                            "otsikko" : req.body.otsikko,
                            "aikaleima": aika,
                            "kirjoittaja": vakiobloggari,
                            "teksti": req.body.teksti,
                            "hyva":0,
                            "huono":0
                        };
    
                        blogityokalut.lisaaUusi(uusiKirjoitus, ()=>{
                            res.redirect("/yllapito/");
                        });

});

app.listen(portti, () =>{
    console.log(`Palvelin käynnistetty porttiin: ${portti}`);
});