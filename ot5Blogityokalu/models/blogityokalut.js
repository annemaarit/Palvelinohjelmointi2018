const fs = require("fs");
const tiedosto = "./models/kirjoitukset.json";

module.exports = {
    "haeKaikki" : (cb) => {
        fs.readFile(tiedosto,"utf-8",(err,data) => {
            if (err) throw err;
            return cb(JSON.parse(data));
        });
    },
    "lisaaUusi" : (uusi,cb) => {
        fs.readFile(tiedosto,"utf-8",(err,data) => {
            if (err) throw err;
            let kirjoitukset = JSON.parse(data);
            kirjoitukset.unshift(uusi);             //lisätään ensimmäiseksi
            fs.writeFile(tiedosto,JSON.stringify(kirjoitukset,null,2), (err) => {
                if (err) throw err;
                cb();
            });
        });
    },
    "lisaaTykkays" : (kirjoitettu,cb) => {
        fs.readFile(tiedosto,"utf-8",(err,data) => {
            if (err) throw err;
            let tiedot=JSON.parse(data);
            tiedot.forEach(tieto => {
                if (tieto.aikaleima==kirjoitettu){      //jos sama aikaleima
                    tieto.hyva++;
                }
            });
            fs.writeFile(tiedosto,JSON.stringify(tiedot,null,2), (err) => {
                if (err) throw err;
                cb();
            });
        });      
    },
    "lisaaHuono" : (kirjoitettu,cb) => {
        fs.readFile(tiedosto,"utf-8",(err,data) => {
            if (err) throw err;
            let tiedot=JSON.parse(data);
            tiedot.forEach(tieto => {
                if (tieto.aikaleima==kirjoitettu){
                    tieto.huono++;
                }
            });
            fs.writeFile(tiedosto,JSON.stringify(tiedot,null,2), (err) => {
                if (err) throw err;
                cb();
            });
        });      
    },
    "poistaKirjoitus" : (kirjoitettu,cb) => {
        fs.readFile(tiedosto,"utf-8",(err,data) => {
            if (err) throw err;
            let tiedot=JSON.parse(data);
            let i=0;
            tiedot.forEach(tieto => {
                if (tieto.aikaleima==kirjoitettu){
                    tiedot.splice(i,1);             //tietueen poisto taulukosta
                }
                i++;
            });
            fs.writeFile(tiedosto,JSON.stringify(tiedot,null,2), (err) => {
                if (err) throw err;
                cb();
            });
        });      
    }  

};