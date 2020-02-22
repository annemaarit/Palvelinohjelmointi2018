/*  
    file: rssPalvelut.js
    desc: OT9, uutiskerääjä
            - ohjelman toiminnallisuus
                    ->rss-syötteiden haku, käsittely ja 10 uusimman uutisen taulukon muodostus
    date: 16.1.2019
    auth: Maarit Parkkonen
*/
const request = require("request");     //rss:n käsittely
const xml2js = require("xml2js");       //parsija
const maxKpl = 10;                      //näytettävien uutisten määrä

//rss-syötteen haku, parsiminen ja uutisolioiden muodostus
//    - palauttaa promisen, jonka tuloksena joko virheilmoitus tai uutisoliotaulukko
let haeUutiset = (url,toimitus)=>{
    return new Promise((resolve,reject)=>{                  //luo uuden promisen, jonka funktio palauttaa
        request(url,(err,response)=>{                       //rss -syötteen haku
            if (err){                                       //rss -syötteen haku epäonnistui
                reject("Palvelimeen ei saatu yhteyttä.");   //palautetaan virhe
            } else {                                        //rss -syötteen haku onnistui
                let data = response.body;                   //xml-dokumentin runko
                xml2js.parseString(data,(err,result)=>{     //parsitaan json -muotoon
                    if (err){                               //parsiminen epäonnistui
                        reject("Haettu data ei xml-muotoista.")
                    }else{                                  //parsiminen onnistui
                        let kaikkiUutiset = [];             //taulukko uutisolioille
                        result.rss.channel[0].item.forEach((item) => {  //käydään läpi kaikki xml -dokumentin item:t
                          let uutisOlio = { "toimitus": toimitus,       //uusi json -muotoinen uutisOlio
                                            "otsikko":item.title[0],
                                            "sisalto": item.description[0],
                                            "linkki": item.link[0],
                                            "aika":item.pubDate[0],
                                            "kuva": (item.enclosure)?item.enclosure[0].$.url:"img/eikuvaa.png"}; 
                           //console.log(uutisOlio);
                           kaikkiUutiset.push(uutisOlio);   //lisätään uutisolio taulukkoon
                        });
                        resolve(kaikkiUutiset.slice(0,maxKpl)); //palautetaan taulukko, jossa 10 ensimmäistä uutista
                    }
                });
            }
        });  
    });
};

module.exports = {
    //hakee 10 uusinta uutista Ylen, Helsingin sanomien ja Iltalehden rss -syötteistä
    "uusimmatUutiset":(cb) => {
        //urlit
        let Yle = "https://feeds.yle.fi/uutiset/v1/recent.rss?publisherIds=YLE_UUTISET";
        let HS = "https://www.hs.fi/rss/tuoreimmat.xml";
        let IL = "https://www.iltalehti.fi/rss/uutiset.xml";
        
        //jokaiselle rss-syötteen haulle luodaan oma promise
        let promise1 = haeUutiset(Yle,"Yle");
        let promise2 = haeUutiset(HS,"HS");
        let promise3 = haeUutiset(IL,"Iltalehti");

        Promise.all([promise1, promise2, promise3])     //odotetaan kaikkien promisejen valmistumista
        .then((kaikkiUutiset) =>{                       //rss-haut onnistuivat, käsitellään taulukkoa, joka sisältää promisien palauttamat uutisoliotaulukot
            
            //järjestetään uutisoliotaulukoiden uutiset aikajärjestykseen taulukkokohtaiseti
            kaikkiUutiset.forEach(taulukko => {
                taulukko.sort(function(a, b){return Date.parse(b.aika) - Date.parse(a.aika)}); //uusin uutinen ekaksi
            });

            let yle = kaikkiUutiset[0];                 
            let hs = kaikkiUutiset[1];
            let il = kaikkiUutiset[2];

            let uudetUutiset=[];                        //uusimmat uutiset taulukko
            for (i=0;i<10;i++){                         //etsitään kymmenen uusinta uutista uutisoliotaulukoista
                if (yle[0].aika > hs[0].aika){          //verrataan taulukkojen ensimmäisten olioiden aika-arvoja (taulukot ovat aikajärjestyksessä)
                    if (yle[0].aika>il[0].aika){        
                        uudetUutiset.push(yle[0]);      //lisätään uusin uutinen taulukkoon
                        yle.shift();                    //poistetaan lisätty olio omasta taulukostaan
                    }
                } else if (hs[0].aika>il[0].aika) {
                    uudetUutiset.push(hs[0]);
                    hs.shift();
                } else {
                    uudetUutiset.push(il[0]);
                    il.shift();
                }
            }
            //console.log(uudetUutiset);
            cb(null,uudetUutiset);                      //palautetaan uusimmat uutiset
        }).catch((virhe)=>{                             //jos rss-syötteiden haussa virhe
            cb(virhe,null);                             //palautetaan virhe
        });
    }

};