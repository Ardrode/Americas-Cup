/**************** IMPORTAZIONE MODULI ****************/

const express = require('express');
const cors = require('cors');

// modulo personalizzato
const geo = require('./geometria');

/**************** COSTANTI ****************/

const app = express();
const PORT = 3000;

/* Utilizzo API in locale */
app.use(cors());

/**************** DATI ****************/

/* Coordinate area di gioco */
// x,y per i calcoli - lat, len per la mappa
let gameArea = [
    {name: 'Start 1', lat: '45.4132508', len: '12.5621144', y: "", x: ""},          // 0
    {name: 'Finish 1', lat: '45.384070', len: '12.686046', y: "", x: ""},           // 1
    {name: 'Start 2', lat: '45.395084', len: '12.543462', y: "", x: ""},            // 2
    {name: 'Finish 2', lat: '45.362034', len: '12.673213', y: "", x: ""},           // 3
    {name: 'centralPoint', lat: '45.381414', len: '12.617993', y: "", x: ""},       // 4 -> per centrare la visuale
];

/* Dati barche */
// x,y per i calcoli - lat, len per la mappa
let barche = [
    {name: 'barca 1', lat: '45.413651', len: '12.561714', y: "", x: "", speed: '1', direction: '0', distanzaFine: "", winner: ""},
    {name: 'barca 2', lat: '45.395484', len: '12.543062', y: "", x: "", speed: '1', direction: '0', distanzaFine: "", winner: ""},
    {distanza: ""},
];

/* Trasforma le lat e lon in x e y per i calcoli */
// central point in numero per conversioni su basso raggio

const lat0 = parseFloat(gameArea[4].lat);
const len0 = parseFloat(gameArea[4].len);

/* Conversione delle cordinate lat e len in Y e X */
function latLenToXY(lat, len, lat0, len0) {

    // Raggio medio terrestre in metri
    const R = 6371000; 

    // Trasformazione gradi -> radianti
    const deg2rad = Math.PI / 180;

    // x varia in base alla latitudine (ai poli diminuisce)
    const x = R * (len - len0) * deg2rad * Math.cos(lat0 * deg2rad);

    // y è indipendente, 1 grado = 111km
    const y = R * (lat - lat0) * deg2rad;

    // ritorna x & y
    return {x, y};
}

/* Aggiorna le cordinate degli array di dati */
function aggiornaCoordinate(array) {

    array.forEach(point => {
        const lat = parseFloat(point.lat);
        const len = parseFloat(point.len);
        const xy = latLenToXY(lat, len, lat0, len0);
        point.x = xy.x;
        point.y = xy.y;
    });
}

// Aggiorna gameArea e barche
aggiornaCoordinate(gameArea);
aggiornaCoordinate(barche);

/**************** API ****************/

/* Abilita il parsing JSON */
app.use(express.json());

/* Ritorna gameArea */
app.get('/gameArea', function(req, res) {

    // risposta: file JSON dell'array 'gameArea'
    return res.json(gameArea);
});

/* Passa coordinate di tutte le barche */
app.get('/barche', function(req, res) {

    // risposta: dati in JSON dell'array 'barche'
    return res.json(barche);
});

/* Passa coordinate di tutte le barche */
app.put('/reset', function(req, res) {

    // resetta valori delle barche
    barche = [
        {name: 'barca 1', lat: '45.413651', len: '12.561714', y: "", x: "", speed: '1', direction: '0', distanzaFine: "", winner: ""},
        {name: 'barca 2', lat: '45.395484', len: '12.543062', y: "", x: "", speed: '1', direction: '0', distanzaFine: "", winner: ""},
        {distanza: ""},
    ];

    aggiornaCoordinate(barche);
    
    return res.json({ success: true });
});

/* Riceve input dal client */
app.put('/controlloBarche/:numero', function(req, res) {

    // prende il campo 'numero' dall'url e lo salva in barca come intero
    const barca = parseInt(req.params.numero);

    // prende i campi dal body della richiesta fatta dal client
    const {direction} = req.body;
    barche[barca].direction = direction;

    // in base alla direzione, aggiunge 0.001 gradi in una o due direzioni
    if(direction === 0 || direction === 45 || direction === 315 ) {
        let newY = parseFloat(barche[barca].lat) + 0.001;
        barche[barca].lat = newY.toString();
    }

    if(direction === 270 || direction === 315 || direction === 225 ) {
        let newX = parseFloat(barche[barca].len) - 0.001;
        barche[barca].len = newX.toString();
    }

    if(direction === 90 || direction === 45 || direction === 135 ) {
        let newX = parseFloat(barche[barca].len) + 0.001;
        barche[barca].len = newX.toString();
    }

    if(direction === 180 || direction === 135 || direction === 225 ) {
        let newY = parseFloat(barche[barca].lat) - 0.001;
        barche[barca].lat = newY.toString();
    }

    // dopo l'aggiornamento delle coordinate, aggiorna x & y della barca
    const updatedXY = latLenToXY(parseFloat(barche[barca].lat), parseFloat(barche[barca].len), lat0, len0);
    barche[barca].x = updatedXY.x.toString();
    barche[barca].y = updatedXY.y.toString();

    // restituisce una risposta per chiudere la chiamata
    return res.json(barche[barca]);
});

/* Ricevi le posizioni della barca */ 
app.put('/controlloAutonomo', function(req, res) {
    const {newlat, newlen, barca, dir} = req.body;

    // aggiorna la posizione della barca
    barche[barca].lat = newlat;
    barche[barca].len = newlen;

    // aggiorna la direzione
    barche[barca].direction = dir;

    // dopo l'aggiornamento delle coordinate, aggiorna x & y della barca
    const updatedXY = latLenToXY(parseFloat(barche[barca].lat), parseFloat(barche[barca].len), lat0, len0);
    barche[barca].x = updatedXY.x.toString();
    barche[barca].y = updatedXY.y.toString();

    return res.json({ success: true });


});

/**************** FUNZIONI ****************/

/* Ritorna distanza tra due punti */
function distanza(p1, p2) {

    // teorema di pitagora
    return Math.sqrt(Math.pow(parseFloat(p1.x) - parseFloat(p2.x), 2) + Math.pow(parseFloat(p1.y) - parseFloat(p2.y), 2));
}

/* Aggiorna dati in tempo reale */
function aggiornaDati () {
    
    //aggiornaCoordinate(barche.slice(0, barche.length - 1));

    // calcolo della distanza tra le due barche 
    barche[2].distanza = distanza(barche[0], barche[1]);

    // calcola la distanza dalla fine di entrambe le barche
    barche[0].distanzaFine = distanzaTraguardo(0);
    barche[1].distanzaFine = distanzaTraguardo(1);
    
    // stabilisce chi è il vincitore:
    if (barche[0].distanzaFine < barche[1].distanzaFine) {
        barche[0].winner = "true";
        barche[1].winner = "false";
    }

    if (barche[0].distanzaFine > barche[1].distanzaFine) {
        barche[0].winner = "false";
        barche[1].winner = "true";
    }

}

/* Aggirna dati ogni 500ms */
setInterval(aggiornaDati, 500);

/* Calcolo dei dati del traguardo */

// salva endpoint del segmento della linea del traguardo come oggetti Punto
const finishP1 = new geo.Punto(gameArea[1].x, gameArea[1].y);
const finishP2 = new geo.Punto(gameArea[3].x, gameArea[3].y);

// calcola la m della retta finale
const mTraguardo = (parseFloat(gameArea[1].y) - parseFloat(gameArea[3].y)) / (parseFloat(gameArea[1].x) - parseFloat(gameArea[3].x));

// trova la retta del traguardo
const rettaTraguardo = new geo.Retta();
rettaTraguardo.perUnPunto(finishP1, mTraguardo);

// trova le rette limite
const limite1 = new geo.Retta();
limite1.perUnPunto(finishP1, rettaTraguardo.m_reciproco);

const limite2 = new geo.Retta();
limite2.perUnPunto(finishP2, rettaTraguardo.m_reciproco);

/* Ritorna la distanza dal traguardo per una determinata barca */
function distanzaTraguardo(barcaIndex) {

    const barca = barche[barcaIndex];

    // crea un oggetto Punto per la posizione attuale della barca
    const boatP = new geo.Punto(barca.x, barca.y);

    // calcola la linea perpendicolare alla linea del traguardo, passante per la posizione attuale della barca
    let rettaBarcaPerpendicular = new geo.Retta();
    rettaBarcaPerpendicular.perUnPunto(boatP, rettaTraguardo.m_reciproco);

    // calcola il punto di intersezione tra la linea perpendicolare passante per la barca e la linea del traguardo
    const ptIncontro = rettaBarcaPerpendicular.intersezione(rettaTraguardo);

    // controllo rette parallele
    if (!ptIncontro) {
        return Infinity;
    }

    // il punto di intersezione appartine obbligatoriamente alla rettaTraguardo
    // controllo se è tra una determinata x e una determinata y -> gli endpoint del traguardo
    const minX_segment = Math.min(finishP1.x, finishP2.x);
    const maxX_segment = Math.max(finishP1.x, finishP2.x);
    const minY_segment = Math.min(finishP1.y, finishP2.y);
    const maxY_segment = Math.max(finishP1.y, finishP2.y);

    // piccolo epsilon: per i confronti in virgola mobile per gestire le imprecisioni
    const epsilon = 1e-6; // Un valore più comune per epsilon

    if (ptIncontro.x >= minX_segment - epsilon && ptIncontro.x <= maxX_segment + epsilon &&
        ptIncontro.y >= minY_segment - epsilon && ptIncontro.y <= maxY_segment + epsilon) {
        // Se il punto di intersezione è all'interno del segmento, restituisci la distanza da questo
        // console.log(`Barca ${barcaIndex + 1}: Intersezione perpendicolare nel segmento.`);
        return distanza(barca, ptIncontro);
    } else {
        // Se il punto di intersezione è al di fuori del segmento, restituisci la distanza all'endpoint più vicino
        // console.log(`Barca ${barcaIndex + 1}: Intersezione perpendicolare fuori dal segmento, controllo gli endpoint.`);
        const dis_punto1 = distanza(barca, gameArea[1]);
        const dis_punto2 = distanza(barca, gameArea[3]);

        if (dis_punto1 < dis_punto2) {
            // console.log(`Barca ${barcaIndex+1}: Più vicino all'endpoint 1.`);
            return dis_punto1;
        } else {
            // console.log(`Barca ${barcaIndex+1}: Più vicino all'endpoint 2.`);
            return dis_punto2;
        }
    }
}

/* Inizia la misurazione della velocità delle barche in tempo reale */
function avviaMonitoraggioVelocita(barca, callback) {

    // slava una copia di lat e len iniziali di una barca 
    let posPrecedente = {
        x: parseFloat(barche[barca].x),
        y: parseFloat(barche[barca].y)
    };

    // ogni quanto prende la posizione delle barche
    let intervallo = 1000;

    const timer = setInterval(() => {
        // slava una copia di lat e len finali di una barca 
        let posAttuale = {
            x: parseFloat(barche[barca].x),
            y: parseFloat(barche[barca].y)
        };

        // calcola lo spostamento
        let spazio = distanza(posPrecedente, posAttuale); // in metri

        // calcola la velocità
        let velocitaMS = spazio;                        // spazio / 1s -> spazio, in m/s
        let velocitaKMH = velocitaMS * 3.6;             // conversione in Km/h

        // Callback per aggiornare la velocità solo dopo che è stata calcolata 
        callback(velocitaKMH);

        // Aggiorna posizione iniziale per ricominciare il giro
        posPrecedente = posAttuale;

    }, intervallo);

    return 0;
}

// inizio misurazione su barca 1
avviaMonitoraggioVelocita(0, function(velocita) {
    barche[0].speed = velocita;
});

// inizio misurazione su barca 2
avviaMonitoraggioVelocita(1, function(velocita) {
    barche[1].speed = velocita;
});

/**************** AVVIO SERVER ****************/

/* Avvia il server in ascolto su una determinata porta */
app.listen(PORT, function() {

    // messaggio di avvio nel terminale
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});