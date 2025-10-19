/**************** VARIABILI GLOBALI ****************/

let map;                                    // variabile in cui verrà salvata la mappa

let datiBarche;                             // array in cui arriverranno i dati delle barche
let gameArea;                               // array in cui arriverranno i dati della gameArea 

let markersBarche = [];                     // array in cui verranno salvati i markers delle barche
let markersGameArea = [];                   // array in cui verranno salvati i markers della gameArea
let markersFreccia = [];                    // array in cui verranno salvati i markers delle freccie intorno alle barche

let barcaSelezionata;                       // selezionata nell'HTML

/**************** RICHIESTA DATI ****************/

/* Manda dati di spostamento */
function sendData(direzione) {

    fetch('http://localhost:3000/controlloBarche/' + barcaSelezionata, {
        // seleziono il tipo di metodo
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // cosa viene passato nel body della richiesta
            direction: direzione,
        })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Errore:', error));
}

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
            console.log(`Errore Ritorno Dati Barche: ${error}`);
        });
}

/**************** FUNZIONI ****************/

// Carica la mappa e centrala in un punto centrale all'area di gioco
function loadMap () {

    // crea mappa centrata rispetto alla barca, senza zoom e salvala
    map = L.map('map', {
        zoomControl: false,      // Nasconde i controlli +/-
        scrollWheelZoom: false,  // Disabilita zoom con la rotella del mouse
        doubleClickZoom: false,  // Disabilita zoom con doppio click
        dragging: true,          // opzionale, se vuoi bloccare anche il drag metti false
        boxZoom: false           // disabilita zoom con selezione box

    }).setView([datiBarche[barcaSelezionata].lat, datiBarche[barcaSelezionata].len], 13);

    // prendi i dati mappa da openstreetmap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // carica i deati della gameArea dopo averli richiesti
    getGameArea(loadGameArea);

    // carica i dati delle barche: dati già richiesti per la generazione dela mappa
    loadBarche();

}

/* Carica i markers della gameArea e salvali nell'array 'markersGameArea' */
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
    markersGameArea[0].setIcon(getNewIcon("Partenza.png"));
    markersGameArea[2].setIcon(getNewIcon("Partenza.png"));

    // crea linea di traguardo sulla mappa
    L.polyline([markersGameArea[1].getLatLng(), markersGameArea[3].getLatLng()], {
        color: 'red',
        weight: 2,
        dashArray: '5, 10'                  // linea tratteggiata
    }).addTo(map);

    // aggiungi le descrizioni ai popup dei markers della game area
    for (let i = 0; i < 4; i++) {
        
        markersGameArea[i]
        .setPopupContent(
            `
            <h2>${gameArea[i].name}</h2> 
            <p>
                <strong>X:</strong> ${gameArea[i].lat} <br>
                <strong>Y:</strong> ${gameArea[i].len} <br>
            </p>
            `
        );
    }
}

/* Carica i markers delle barche */
function loadBarche() {

    // funzione eseguita solo dopo aver richiesto i dati

    for (let i = 0; i < 2; i++) {
        
        // crea i marker per le barche
        let marker = L.marker([datiBarche[i].lat, datiBarche[i].len], { 
        })
        .addTo(map)
        .bindPopup(
            `
            <h2>${(datiBarche[i].name).toUpperCase()} </h2> 
            <p>
                <strong>Speed:</strong> ${datiBarche[i].speed.toFixed(1)} km/h <br>
                <strong>Direction:</strong> ${datiBarche[i].direction} <br>
            </p>
            `
        );

        // aggiungi i marker delle freccie
        let freccia = L.marker([datiBarche[i].lat, datiBarche[i].len], {
            icon: getFrecciaIcon(datiBarche[i].direction),          // anchor di partenza: nord
            interactive: false                                      // disabilita eventi mouse
        }).addTo(map);

        // aggiungi tutti i markers alla barca
        markersFreccia.push(freccia);
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

        // aggiorna la posizione dei markers delle freccie sulla mappa
        markersFreccia[i].setLatLng([datiBarche[i].lat, datiBarche[i].len]);
        markersFreccia[i].setIcon(setFrecciaDirection(datiBarche[i].direction));

        // aggiorna il popup delle barhce con i nuovi dati
        let content = 
        `
        <h2>${(datiBarche[i].name).toUpperCase()} </h2> 
        <p>
            <strong>Speed:</strong> ${datiBarche[i].speed.toFixed(1)} km/h <br>
            <strong>Direction:</strong> ${datiBarche[i].direction} <br>
        </p>
        `;

        markersBarche[i].setPopupContent(content);
    }

    // sposta la vista per centrarla sulla barca che si è mossa
    map.setView([datiBarche[barcaSelezionata].lat, datiBarche[barcaSelezionata].len]);

}

/* Ritorna una nuova icona leaflet */
function getNewIcon(iconName) {

    return L.icon({
        iconUrl: "../Photo/" + iconName,
        iconSize: [45, 60],
        iconAnchor: [35, 60],
        popupAnchor: [0, -40]
    });
}

/* Cambia l'icona della freccia in base alla direzione */
function setFrecciaDirection (dir) {

    switch (dir) {
        case 0:
            return getFrecciaIcon(dir, [30, 80]);
        case 45:
            return getFrecciaIcon(dir, [10, 75]);
        case 90:
            return getFrecciaIcon(dir, [0, 40]);
        case 135:
            return getFrecciaIcon(dir, [10, 10]);
        case 180:
            return getFrecciaIcon(dir, [30, 10]);
        case 225:
            return getFrecciaIcon(dir, [50, 10]);
        case 270:
            return getFrecciaIcon(dir, [60, 40]);
        case 315:
            return getFrecciaIcon(dir, [50, 75]);
        default:
            return getFrecciaIcon(dir, [30, 80]);
    }
}

/* Ritorna una nuova icona freccia che va ad sostituire la vecchia freccia */
function getFrecciaIcon(direction, anchor = [15, 15]) {

    return L.divIcon({
        className: 'freccia-marker',
        iconSize: [30, 30],
        iconAnchor: anchor,
        html: `
            <img src="../Photo/freccia.png" style="width: 100%; height: 100%; transform: rotate(${direction}deg);" />
        `
    });
}

/* Aggiorna i dati delle barche e della card degli output ogni 200ms */
setInterval(() => getDatiBarche(updateBarche), 200);            // Faccio ripetere la funzione (non il risultato) più volte

/* Carico la mappa dopo aver richiesto i dati delle barche*/
getDatiBarche(loadMap);