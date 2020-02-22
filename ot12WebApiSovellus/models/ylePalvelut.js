/*  
    file: sqlpalvelut.js
    desc: OT12, Yle Areena API
            - APIN käsittelymodulit
    date: 20.1.2019
    auth: Maarit Parkkonen
*/
const restify=require("restify-clients");

const apiUrl="https://external.api.yle.fi";             //apin osoite
let app_id="f5d438c9";                                  //käyttäjäID
let app_key="177f3d82a94e8acbe9d49825e699ba9e";         //käyttäjäAvain

let client=restify.createJSONClient({"url" : apiUrl});  //apin asiakasolio

module.exports = {
    "haeAineisto": (hakusana) =>{                       //hakee hakusanan mukaisia aineistoja (hyväksyy vain yhden hakusanan)
        return new Promise((resolve,reject)=>{
            let kysely=`/v1/programs/items.json?q=${hakusana}&limit=5&app_key=${app_key}&app_id=${app_id}`; //api polku ja parametrit
            client.get(kysely,(err,req,res,data)=>{     //kyselyn suoritus
            //console.log(err);
            if (!err){                                  //haku onnistui
                    resolve(data);  
                }else{                                  //haussa virhe
                    reject(err);
                }            
            });
        });
    },
    "nytSoi": () =>{                                    //hakee ylellä radiossa juuri nyt soivan soittolistan kappaleet
        return new Promise((resolve,reject)=>{      
            let kysely=`/v1/programs/nowplaying/yle-radio-1.json?start=0&stop=0&app_key=${app_key}&app_id=${app_id}`; //api polku ja parametrit
            client.get(kysely,(err,req,res,data)=>{     //kyselyn suoritus
            //console.log(err);
            if (!err){                                  //haku onnistui
                    resolve(data);
                }else{                                  //haussa virhe
                    reject(err);
                }            
            });
        });        
    }
};