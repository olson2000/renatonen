"use strict";

const frekvA1 = 440;
const frekvEttstrukna = [];
let frekvFaktor = [];
let nuvGrundton = 0;
let nuvOktav = 1;
let frekvGrundton = 0;
let grundtonSpelar = false;
let grundtonCheck = false;
let oscList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let oscType = "triangle";
let aktivTon = [];
let tonNamn = [];
let extraTonInt = [];
let extraTonBar = [];
let extraTonText = [];
let extraTonCheck = [];
let kvintIntonation = 0;

//10: A =440 * Math.pow(2, 0/12)
//Beräkna frekvenserna i ettstrukna oktaven utifrån a1 (som har nr 10)
for (let i = 0; i < 12; i++) {
    frekvEttstrukna[i] = frekvA1 * Math.pow(2, (i - 9) / 12);
}
/* 261.6255653005986
> 277.1826309768721
> 293.6647679174076
> 311.12698372208087
> 329.6275569128699
> 349.2282314330039
> 369.9944227116344
> 391.99543598174927
> 415.3046975799451
> 440
> 466.1637615180899
> 493.8833012561241
*/

frekvFaktor = [1, 17 / 16, 9 / 8, 19 / 16, 5 / 4, 4 / 3, 45 / 32, 3 / 2, 8 / 5, 5 / 3, 7 / 4, 15 / 8];

tonNamn = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"]

for (let i = 0; i < 12; i++) {
    aktivTon[i] = false;
}

const playBtn = document.querySelector(".btnSpela");

//const grundtonBar = document.querySelector("input[name='grundton']");

const oktavBar = document.getElementById("oktav");
const grundtonBar = document.getElementById("grundton");
//const testen = document.getElementById("textis");
const grundtonText = document.getElementById("grundtonp");
grundtonCheck = document.getElementById("grundtonCheck");
extraTonBar[1] = document.getElementById("lSekundInt");
extraTonText[1] = document.getElementById("lSekundp");
extraTonCheck[1] = document.getElementById("lSekundCheck");
extraTonBar[2] = document.getElementById("sSekundInt");
extraTonText[2] = document.getElementById("sSekundp");
extraTonCheck[2] = document.getElementById("sSekundCheck");
extraTonBar[3] = document.getElementById("lTersInt");
extraTonText[3] = document.getElementById("lTersp");
extraTonCheck[3] = document.getElementById("lTersCheck");
extraTonBar[4] = document.getElementById("sTersInt");
extraTonText[4] = document.getElementById("sTersp");
extraTonCheck[4] = document.getElementById("sTersCheck");
extraTonBar[5] = document.getElementById("kvartInt");
extraTonText[5] = document.getElementById("kvartp");
extraTonCheck[5] = document.getElementById("kvartCheck");
extraTonBar[6] = document.getElementById("tritInt");
extraTonText[6] = document.getElementById("tritp");
extraTonCheck[6] = document.getElementById("tritCheck");
extraTonBar[7] = document.getElementById("kvintInt");
extraTonText[7] = document.getElementById("kvintp");
extraTonCheck[7] = document.getElementById("kvintCheck");


nuvOktav = oktavBar.value;
nuvGrundton = grundtonBar.value;

for (let i = 1; i < 8; i++) {
    extraTonInt[i] = Math.pow(2, extraTonBar[i].value / 1200);
    extraTonText[i].textContent = extraTonBar[i].value;
}

frekvGrundton = Math.pow(2, nuvOktav) * frekvEttstrukna[nuvGrundton];

grundtonText.textContent = tonNamn[nuvGrundton];

oktavBar.addEventListener("change", function () {
    nuvOktav = oktavBar.value;
    frekvGrundton = Math.pow(2, nuvOktav) * frekvEttstrukna[nuvGrundton];
    uppdateraFrekvens();
});

grundtonBar.addEventListener("change", function () {
    nuvGrundton = grundtonBar.value;
    frekvGrundton = Math.pow(2, nuvOktav) * frekvEttstrukna[nuvGrundton];
    /*oscList[0].frequency.value = frekvGrundton;
    oscList[7].frequency.value = kvintIntonation * frekvFaktor[7] * frekvGrundton;*/
    uppdateraFrekvens();
    grundtonText.textContent = tonNamn[nuvGrundton];
});

for (let i = 1; i < 8; i++) {
    extraTonBar[i].addEventListener("change", function () {
        extraTonInt[i] = Math.pow(2, extraTonBar[i].value / 1200);
        if (oscList[i] != 0) {
            oscList[i].frequency.value = extraTonInt[i] * frekvFaktor[i] * frekvGrundton;
        }
        extraTonText[i].textContent = extraTonBar[i].value;
    });
}

// create web audio api context
//const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const audioCtx = new AudioContext;

function uppdateraFrekvens() {
    oscList[0].frequency.value = frekvGrundton;
    for (let i = 1; i < 8; i++) {
        extraTonInt[i] = Math.pow(2, extraTonBar[i].value / 1200);
        if (oscList[i] != 0) {
            oscList[i].frequency.value = extraTonInt[i] * frekvFaktor[i] * frekvGrundton;
        }
        extraTonText[i].textContent = extraTonBar[i].value;
    }
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

playBtn.addEventListener("click", () => {
    //Om stoppad, spela
    if (!grundtonSpelar) {
        if (grundtonCheck.checked) {
            oscList[0] = playTone(frekvGrundton);
            //aktivTon[0] = true;
        }

        for (let i = 1; i < 8; i++) {
            if (extraTonCheck[i].checked) {
                oscList[i] = playTone(extraTonInt[i] * frekvFaktor[i] * frekvGrundton);
            }
        }
        playBtn.textContent = "Stoppa";
        grundtonSpelar = true;
    }

    else {
        for (let i = 0; i < 8; i++) {
            if (oscList[i] != 0) {
                oscList[i].stop();
            }
        }

        playBtn.textContent = "Spela";
        grundtonSpelar = false;
    }
});
