/*  
    file: main.js
    desc: OT9, uutiskerääjä
            - ohjelman ohjaus 
    date: 16.1.2019
    auth: Maarit Parkkonen
*/

const express = require("express");
const app = express();
const portti = 3130;

const rssPalvelut = require("./models/rssPalvelut");

//näkymät
app.set("views","./views");
app.set("view engine","ejs");

//staattisten sivujen polku
app.use(express.static("./public"));

//juurireitti, hakee tarvittavat tiedot ja pyytää pääsivun muodostamista
app.get("/",(req,res) =>{ 
    rssPalvelut.uusimmatUutiset((virhe,uutiset)=>{
            res.render("index", {"uutiset": uutiset,
            "virhe": virhe});   
        });       
});

//palvelimen käynnistys
app.listen(portti, () =>{
    console.log(`Palvelin käynnistetty porttiin: ${portti}`);
});