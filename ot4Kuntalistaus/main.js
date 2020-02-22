/*  file: main.js
    desc: ot4
    date: 16.12.2018 AIKA LOPPUI KESKEN....
    auth: Maarit Parkkonen*/

const express = require("express");
const fs = require("fs");

const app = express();

app.set("views", "./views");                //näkymien kansio
app.set("view engine", "ejs");              //käytetään ejs -templeittejä

const portti = 3104;

let kunnat = [];
let kaupungit = [];
let maakunnat = [];
let kaikkiKunnat = true;

fs.readFile("./data/kunnat.json", "utf-8", (err, data1) => {
    if (err) throw err;
    kunnat = JSON.parse(data1);
});

fs.readFile("./data/kaupungit.json", "utf-8", (err, data2) => {
    if (err) throw err;
    kaupungit = JSON.parse(data2);
});

fs.readFile("./data/maakunnat.json", "utf-8", (err, data3) => {
    if (err) throw err;
    maakunnat = JSON.parse(data3);
});

app.use(express.static("./public"));

app.get("/", (req, res) => {
    if (kaikkiKunnat==false){
        let otsikko = "Kaikki kaupungit";
        let painiketeksti = "Näytä kaikki kunnat";
        res.render("index", { "datat" : kaupungit, "otsikko" : otsikko, "painiketeksti" : painiketeksti });
    }
    else{
        let otsikko = "Kaikki kunnat";
        let painiketeksti = "Näytä vain kaupungit";
        res.render("index", { "datat" : kunnat, "otsikko" : otsikko, "painiketeksti" : painiketeksti  });
    }
    kaikkiKunnat = !kaikkiKunnat;
});

app.get("/maakunta/:id", (req, res) => {
    let nimi=maakunnat[req.params.id].nimi;
    let otsikko = nimi;
    let painiketeksti = "Pääsivulle";
    let kuvaosoite = "/images/"+nimi+".svg.png";
    res.render("maakunta", { "datat" : kunnat, "otsikko" : otsikko, "painiketeksti" : painiketeksti, "maakunnan_nimi" : nimi, "kuva" : kuvaosoite });
});

app.listen(portti, () => {
    console.log(`Palvelin käynnistyi porttiin: ${portti}`);
});