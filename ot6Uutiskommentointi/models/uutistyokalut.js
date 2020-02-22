const fs = require("fs");
const uutiset = "./models/uutiset.json";
const kayttajat = "./models/kayttajat.json";
const kommentit = "./models/kommentit.json"

module.exports = {
    "haeUutiset" : (cb) => {
        fs.readFile(uutiset,"utf-8",(err,data) => {
            if (err) throw err;
            return cb(JSON.parse(data));
        });
    },
    "haeKommentit" : (cb) => {
        fs.readFile(kommentit,"utf-8",(err,data) => {
            if (err) throw err;
            return cb(JSON.parse(data));
        });
    },
    "lisaaUusiKommentti" : (uusi,cb) => {
        fs.readFile(kommentit,"utf-8",(err,data) => {
            if (err) throw err;
            let kaikki = JSON.parse(data);
            kaikki.unshift(uusi);             //lisätään ensimmäiseksi
            fs.writeFile(kommentit,JSON.stringify(kaikki,null,2), (err) => {
                if (err) throw err;
                cb();
            });
        });
    },
    "lisaaUusiKayttaja" : (uusi,cb) => {
        fs.readFile(kayttajat,"utf-8",(err,data) => {
            if (err) throw err;
            let henkilot = JSON.parse(data);
            henkilot.unshift(uusi);             //lisätään ensimmäiseksi
            fs.writeFile(kayttajat,JSON.stringify(henkilot,null,2), (err) => {
                if (err) throw err;
                cb();
            });
        });
    },
    "haeKayttaja" : (tunnus,cb)=>{
        fs.readFile(kayttajat,"utf-8",(err,data) => {
            if (err) throw err;
            let kayttajia = JSON.parse(data); 
            let index = kayttajia.findIndex((kayttaja)=>{
                return kayttaja.tunnus==tunnus;
            });
            if (index>=0){
                cb(kayttajia[index]);
            } else {
                cb(null);
            }
        });
    },
    "poistaKommentti" : (kirjoitettu,cb) => {
        fs.readFile(kommentit,"utf-8",(err,data) => {
            if (err) throw err;
            let kaikki=JSON.parse(data);
            let i=0;
            kaikki.forEach(kommentti => {
                if (kommentti.aika==kirjoitettu){
                    kaikki.splice(i,1);             //tietueen poisto taulukosta
                }
                i++;
            });
            fs.writeFile(kommentit,JSON.stringify(kaikki,null,2), (err) => {
                if (err) throw err;
                cb();
            });
        });      
    } 
};