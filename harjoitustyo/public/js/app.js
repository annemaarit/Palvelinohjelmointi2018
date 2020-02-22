/*  
    file: main.js
    desc: Kumppari Oy
            - selainpäässä ajettavat skriptit (popup boxes)
    date: 18.8.2019
    auth: Maarit Parkkonen
*/


function vahvistaTallennus() {       
    alert(`Tuote on tallennettu.`);
}

function kysyPoisto() {      
    return confirm("Haluatko varmasti poistaa tuotteen?");
}

function kysyMuutostenTallennus() {       
    return confirm("Haluatko tallentaa muutokset?");
}

function edellinenSivu() {
    window.history.back();
    window.location=document.referrer;
}