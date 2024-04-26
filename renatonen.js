"use strict";

// Olof Lundqvist, 2024
// Ett litet program för att spela upp toner och justera intonationen.

const frekvA1 = 440;
//const frekvEttstrukna = [];
let oscList = new Array(12).fill(0); //[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let oscType = "triangle";
let spelaCheck = [];
let tonSlide = [];
let tonSlideTxt = [];
let tonFrekvTxt = [];
let tonLikTxt = [];
let tonFrekv = new Array(12).fill(0);
let tonLikFrekv = new Array(12).fill(0);
let tonInt = new Array(12).fill(0);
let oktavSlide = null;
let spelaLiksvavande = false;
const intervallNamn = ["Grundton", "L2", "S2", "L3", "S3", "R4", "F5", "R5", "L6", "S6", "L7", "S7"]
const tonNamn = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"]
const frekvFaktor = [1, 17 / 16, 9 / 8, 19 / 16, 5 / 4, 4 / 3, 45 / 32, 3 / 2, 8 / 5, 5 / 3, 7 / 4, 15 / 8];

//ton 10: A = 440 * Math.pow(2, 0/12)
//Beräkna frekvenserna i ettstrukna oktaven utifrån a1 (som har nr 10)
/*for (let i = 0; i < 12; i++) {
    frekvEttstrukna[i] = frekvA1 * Math.pow(2, (i - 9) / 12);
}*/

const tystBtn = document.querySelector(".btnTyst");
const likCheck = document.getElementById("lik");

skapaTonTabell();

andraAllaFrekvenser();
//andraAllaLikFrekvenser();

// create web audio api context
//const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const audioCtx = new AudioContext;

//------ LISTENERS ----------
oktavSlide.addEventListener("change", function () {
    andraAllaFrekvenser();
    //andraAllaLikFrekvenser();
});


//Grundtonens slider
tonSlide[0].addEventListener("change", function () {
    andraAllaFrekvenser();
    //andraAllaLikFrekvenser();
});

for (let i = 1; i < tonSlide.length; i++) {
    tonSlide[i].addEventListener("change", function () {
        andraFrekvens(i);
    });
}

for (let i = 0; i < tonFrekv.length; i++) {
    spelaCheck[i].addEventListener("change", function () {
        if (spelaCheck[i].checked) {
            if (spelaLiksvavande) {
                oscList[i] = playTone(tonLikFrekv[i]);
            }
            else {
                oscList[i] = playTone(tonFrekv[i]);
            }
        }
        else {
            if (oscList[i] != 0) {
                oscList[i].stop();
            }
        }
    });
}

likCheck.addEventListener("click", function () {
    spelaLiksvavande = !spelaLiksvavande;
    andraAllaFrekvenser();
    //andraAllaLikFrekvenser();
});

tystBtn.addEventListener("click", tystaAllt);
//--------------------------

function getLikFrekvens(skalton) {
    return frekvA1 * Math.pow(2, (skalton - 9) / 12);
}

function andraAllaFrekvenser() {
    for (let i = 0; i < tonFrekv.length; i++) {
        andraFrekvens(i);
    }
}



function andraFrekvens(tonNr) {
    if (tonNr > 0) {
        tonInt[tonNr] = Math.pow(2, tonSlide[tonNr].value / 1200);
        tonFrekv[tonNr] = tonInt[tonNr] * frekvFaktor[tonNr] * tonFrekv[0];
        tonSlideTxt[tonNr].textContent = tonSlide[tonNr].value;
        tonLikFrekv[tonNr] = Math.pow(2, oktavSlide.value) * getLikFrekvens(Number(tonSlide[0].value) + tonNr);
        tonLikTxt[tonNr].textContent = Number(tonLikFrekv[tonNr]).setPrecision(5) + " Hz";
    }
    else {
        //Grundtonen
        //tonFrekv[tonNr] = Math.pow(2, oktavSlide.value) * frekvEttstrukna[tonSlide[tonNr].value];
        tonFrekv[tonNr] = Math.pow(2, oktavSlide.value) * getLikFrekvens(tonSlide[tonNr].value);
        tonSlideTxt[tonNr].textContent = tonNamn[tonSlide[tonNr].value];
        tonLikFrekv[0] = tonFrekv[0];
    }
    tonFrekvTxt[tonNr].textContent = tonFrekv[tonNr].setPrecision(5).toString() + " Hz";
    andraOscFrekvens(tonNr);

}

function andraOscFrekvens(oscNr) {
    //Kolla att tonen är förkryssad och att oscillatorn existerar
    if (spelaCheck[oscNr].checked && oscList[oscNr] != 0) {
        if (spelaLiksvavande) {
            oscList[oscNr].frequency.value = tonLikFrekv[oscNr];
        }
        else {
            oscList[oscNr].frequency.value = tonFrekv[oscNr];
        }
    }
}

function skapaTonTabell() {
    const tonTab = document.getElementById("tonTab");
    const rubrikHead = tonTab.createTHead();
    const rubrikRad = rubrikHead.insertRow();
    rubrikRad.insertCell().innerHTML = "Spela";
    rubrikRad.insertCell().innerHTML = "Intervall";
    rubrikRad.insertCell().innerHTML = "Centavvikelse";
    rubrikRad.insertCell();
    rubrikRad.insertCell().innerHTML = "Frekvens";
    rubrikRad.insertCell().innerHTML = "Liksvävande";



    for (let i = 11; i >= 0; i--) {
        const row = document.createElement("tr");

        const checkCell = document.createElement("td");
        spelaCheck[i] = document.createElement("input");
        spelaCheck[i].setAttribute("type", "checkbox");
        checkCell.appendChild(spelaCheck[i]);
        row.appendChild(checkCell);

        const namnCell = document.createElement("td");
        const namnCellText = document.createTextNode(intervallNamn[i]);
        namnCell.appendChild(namnCellText);
        row.appendChild(namnCell);

        const intonCell = document.createElement("td");
        tonSlide[i] = document.createElement("input");
        tonSlide[i].setAttribute("type", "range");

        if (i == 0) {
            tonSlide[i].min = "0";
            tonSlide[i].max = "11";
            tonSlide[i].step = "1";
            tonSlide[i].value = "9";
        }
        else {
            tonSlide[i].min = "-100";
            tonSlide[i].max = "100";
            tonSlide[i].step = "1";
            tonSlide[i].value = "0";
            //intonSlide[i].list = "centsteg";
        }

        intonCell.appendChild(tonSlide[i]);
        row.appendChild(intonCell);

        const slideVardeCell = document.createElement("td");
        if (i == 0) {
            tonSlideTxt[i] = document.createTextNode(tonNamn[tonSlide[i].value]);
        }
        else {
            tonSlideTxt[i] = document.createTextNode(tonSlide[i].value);
        }
        slideVardeCell.appendChild(tonSlideTxt[i]);
        row.appendChild(slideVardeCell);

        const frekvCell = document.createElement("td");
        tonFrekvTxt[i] = document.createTextNode(tonFrekv[i].toPrecision(5) + " Hz");
        frekvCell.appendChild(tonFrekvTxt[i]);
        row.appendChild(frekvCell);

        if (i > 0) {
            const likFrekvCell = document.createElement("td");
            tonLikTxt[i] = document.createTextNode(tonLikFrekv[i].toPrecision(5) + " Hz");
            likFrekvCell.appendChild(tonLikTxt[i]);
            row.appendChild(likFrekvCell);
        }

        tonTab.appendChild(row);
    }
    const row = document.createElement("tr");
    const checkCell = document.createElement("td");
    row.appendChild(checkCell);

    const namnCell = document.createElement("td");
    const namnCellText = document.createTextNode("Oktav");
    namnCell.appendChild(namnCellText);
    row.appendChild(namnCell);

    const oktavSlideCell = document.createElement("td");
    oktavSlide = document.createElement("input");
    oktavSlide.setAttribute("type", "range");
    oktavSlide.min = -3;
    oktavSlide.max = 3;
    oktavSlide.step = 1;
    oktavSlide.value = 0;
    oktavSlideCell.appendChild(oktavSlide);
    row.appendChild(oktavSlideCell);

    tonTab.appendChild(row);
}

function playTone(freq) {
    const osc = audioCtx.createOscillator();
    //osc.connect(mainGainNode);
    osc.connect(audioCtx.destination);
    osc.type = oscType;
    osc.frequency.value = freq;
    osc.start();
    return osc;
}

function tystaAllt() {
    for (let i = 0; i < tonFrekv.length; i++) {
        if (oscList[i] != 0) {
            oscList[i].stop();
            spelaCheck[i].checked = false;
        }
    }
}
