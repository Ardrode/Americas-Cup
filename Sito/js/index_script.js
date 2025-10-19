/**************** VARIABILI GLOBALI ****************/

let map;                                    // variabile in cui verrà salvata la mappa

let datiBarche;                             // array in cui arriverranno i dati delle barche
let gameArea;                               // array in cui arriverranno i dati della gameArea 

let markersBarche = [];                     // array in cui verranno salvati i markers delle barche
let markersGameArea = [];                   // array in cui verranno salvati i markers della gameArea

/**************** RICHIESTA DATI ****************/

/* Richiedi dati gameArea */
function getGameArea(callback) {

    fetch('http://localhost:3000/gameArea')
        .then(response => {return response.json();})                  
        .then(data => {
            // slava i dati di game area nella variabile golbale.
            gameArea = data;

            // avvia la funzione passata come argomento, solo dopo aver ricevuto i dati
            callback();
        })
        .catch(error => {
            console.log(`Errore Ritorno Game Area: ${error}`);
        });
}

/* Richiedi dati barche */
function getDatiBarche(callback) {

    fetch('http://localhost:3000/barche')
        .then(response => {return response.json();})                  
        .then(data => {
            // slava i dati di game area nella variabile golbale.
            datiBarche = data;

            // avvia la funzione passata come argomento, solo dopo aver ricevuto i dati
            callback();
        })
        .catch(error => {
            console.log(error);
        });
}

function reset() {

    fetch('http://localhost:3000/reset', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            })
        })
        .then(response => {return response.json();})                  
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        });
}

/**************** FUNZIONI ****************/

/* Carica la mappa e centrala in un punto centrale all'area di gioco */
function loadMap () {

    // crea mappa centrata e salvala
    map = L.map('map', {
        zoomControl: false,      // Nasconde i controlli +/-
        scrollWheelZoom: false,  // Disabilita zoom con la rotella del mouse
        doubleClickZoom: false,  // Disabilita zoom con doppio click
        dragging: false,         // blocca il drag
        boxZoom: false           // disabilita zoom con selezione box

    }).setView([gameArea[4].lat, gameArea[4].len], 11);

    // prendi i dati mappa da openstreetmap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    
    // carica i dati della gameArea: dati già richiesti per la generazione dela mappa
    loadGameArea();

    // carica i dati delle barche dopo averli richiesti
    getDatiBarche(loadBarche);

}

/* Carica markers della gameArea e salvali nell'array 'markersGameArea' */
function loadGameArea() {

    for (let i = 0; i < 4; i++) {

        // crea i markers solo per i 4
        let marker = L.marker([gameArea[i].lat, gameArea[i].len])
        .addTo(map)
        .bindPopup(gameArea[i].name);
        
        // salva i marker nell'array
        markersGameArea.push(marker);
    }

    // cambia icona ai marker di fine.
    markersGameArea[1].setIcon(getNewIcon("Traguardo.png"));
    markersGameArea[3].setIcon(getNewIcon("Traguardo.png"));

    // cambia icona ai marker di inizio.
    markersGameArea[0].setIcon(getNewIcon("Partenza.png", [45, 60] , [15, 55]));
    markersGameArea[2].setIcon(getNewIcon("Partenza.png", [45, 60] , [15, 55]));

    // crea linea di traguardo sulla mappa
    L.polyline([markersGameArea[1].getLatLng(), markersGameArea[3].getLatLng()], {
        color: 'red',
        weight: 2,
        dashArray: '5, 10'                  // linea tratteggiata
    }).addTo(map);

    // crea linea di un lato (scopo solo grafico)
    L.polyline([markersGameArea[1].getLatLng(), markersGameArea[0].getLatLng()], {
        color: 'blue',
        weight: 1,
        dashArray: '5, 10' // linea tratteggiata
    }).addTo(map);

    // crea linea dell'altro lato (scopo solo grafico)
    L.polyline([markersGameArea[3].getLatLng(), markersGameArea[2].getLatLng()], {
        color: 'blue',
        weight: 1,
        dashArray: '5, 10' // linea tratteggiata
    }).addTo(map);

}

/* Carica i markers delle barche */
function loadBarche() {

    // funzione eseguita solo dopo aver richiesto i dati

    for (let i = 0; i < 2; i++) {
        
        // crea i marker per le barche
        let marker = L.marker([datiBarche[i].lat, datiBarche[i].len], {
        })
        .addTo(map)
        
        markersBarche.push(marker);

    }

    // cambia le icone delle barche, fatto in post perchè icone diverse
    markersBarche[0].setIcon(getNewIcon("barchetta_blu.png"));
    markersBarche[1].setIcon(getNewIcon("barchetta_verde.png"));

}

/* Aggiorna i dati sulle barche */
function updateBarche() {

    for(let i = 0; i < 2; i++) {

        // aggiorna la posizione dei markers delle barche sulla mappa
        markersBarche[i].setLatLng([datiBarche[i].lat, datiBarche[i].len]);

    }

}

/* Ritorna una nuova icona leaflet */
function getNewIcon(iconName, size = [45, 60], anchor = [35, 60]) {

    return L.icon({
        iconUrl: "Photo/" + iconName,
        iconSize: size,
        iconAnchor: anchor,
        popupAnchor: [0, -40]
    });
}

/* Aggiorna i dati delle barche e della card degli output... */
function update() {
    //updateWinner();
    updateBarche();
}

/* ...ogni 5000ms */
setInterval(() => getDatiBarche(update), 5000);                  // Faccio ripetere la funzione (non il risultato) più volte

/* Carico la mappa dopo aver richiesto i dati della gameArea */
getGameArea(loadMap);

