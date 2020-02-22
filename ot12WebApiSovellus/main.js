/*  
    file: main.js
    desc: OT12, Yle areena API
            - ohjaus (HEIKKO VIRHEIDEN TAI TYHJIEN TARKISTUS)
    date: 20.1.2019
    auth: Maarit Parkkonen
*/

const express = require("express");
const app = express();
const portti = 3012;

//apimoduli
const ylePalvelut = require("./models/ylePalvelut");

//näkymät
app.set("views","./views");
app.set("view engine","ejs");

//json -tiedon parsija
const bodyParser= require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended":true}));

//staattisten sivujen polku
app.use(express.static("./public"));

//aineiston hakupyyntö lomakkeelta vastaanotetulla salasanalla
app.post("/hae",(req,res) => {
    let hakusana=req.body.hakusana;
    ylePalvelut.haeAineisto(hakusana)               //hakupyyntö
         .then((data)=>{                            //haku onnistui
            res.render("index",{"datat":data.data,  //pääsivun uudelleen renderöinti
                                "haku":true});
         })
         .catch((err)=>{                            //haku epäonnistui
            res.json(err);                          
         });   
});

//juurireitti, pyytää pääsivun muodostamista
app.get("/",(req,res) =>{ 
    res.render("index",{"datat":[],
                        "haku":false});
});

//soittolistan hakupyyntö
app.get("/nytSoi/",(req,res) =>{ 
    ylePalvelut.nytSoi()                            //hakupyyntö
         .then((data)=>{                            //haku onnistui
            res.render("index",{"datat":data.data,  //pääsivun uudelleen renderöinti
                                "haku":false});
         })
         .catch((err)=>{                            //haku epäonnistui
            res.json(err);
         });    
});

//palvelimen käynnistys
app.listen(portti, () =>{
    console.log(`Palvelin käynnistetty porttiin: ${portti}`);
});