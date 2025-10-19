/**************** VARIABILI GLOBALI ****************/

let map;                                    // variabile in cui verrà salvata la mappa

let datiBarche;                             // array in cui arriverranno i dati delle barche
let gameArea;                               // array in cui arriverranno i dati della gameArea 

let markersBarche = [];                     // array in cui verranno salvati i markers delle barche
let markersGameArea = [];                   // array in cui verranno salvati i markers della gameArea
let markersFreccia = [];                    // array in cui verranno salvati i markers delle freccie intorno alle barche

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

/**************** FUNZIONI ****************/

/* Carica la mappa e centrala in un punto centrale all'area di gioco */
function loadMap () {

    // crea mappa centrata e salvala
    map = L.map('map').setView([gameArea[4].lat, gameArea[4].len], 12);

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

    // aggiungi le descrizioni ai popup dei markers della game area
    for (let i = 0; i < 4; i++) {
        
        markersGameArea[i]
        .setPopupContent(
            `
            <h2>${gameArea[i].name}</h2> 
            <p>
                <strong>Longitudine: </strong> ${gameArea[i].len} <br>
                <strong>Latitudine: </strong> ${gameArea[i].lat} <br>
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
                <strong>Speed:</strong> ${datiBarche[i].speed.toFixed(1)} km/h<br>
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
            <strong>Speed:</strong> ${datiBarche[i].speed.toFixed(1)} km/h<br>
            <strong>Direction:</strong> ${datiBarche[i].direction} <br>
        </p>
        `;
    
        markersBarche[i].setPopupContent(content);
    }

}

/* Aggiorna i dati del vincitore e la distanza tra le barche */
function updateWinner() {

    let vincitore;

    // decide il vincitore
    if (datiBarche[0].winner == "true") {
        vincitore = datiBarche[0].name;
    }

    if (datiBarche[1].winner == "true") {
        vincitore = datiBarche[1].name;
    }

    // ottiene la distanza in metri, la approssima a 3 numeri dopo la virgola e sostituisce il '.' con la ','
    let distanzaM = (parseFloat(datiBarche[2].distanza).toFixed(3)).toString().replace('.', ',');

    // aggiorna il contenuto della card con i dati
    let str = 
    `
    <h1> Dati della gara </h1>
    <p>
        <strong>Vincitore: </strong>${vincitore} <br>
        <strong>Distanza tra le due barche: </strong>${distanzaM} m
    </p>
    `;

    document.getElementById("dati").innerHTML = str;

}

/* Ritorna una nuova icona leaflet */
function getNewIcon(iconName, size = [45, 60], anchor = [35, 60]) {

    return L.icon({
        iconUrl: "../Photo/" + iconName,
        iconSize: size,
        iconAnchor: anchor,
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
function getFrecciaIcon(direction, anchor = [30, 80]) {

    return L.divIcon({
        className: 'freccia-marker',
        iconSize: [30, 30],
        iconAnchor: anchor,
        html: `
            <img src="../Photo/freccia.png" style="width: 100%; height: 100%; transform: rotate(${direction}deg);" />
        `
    });
}

/* Aggiorna i dati delle barche e della card degli output... */
function update() {
    updateWinner();
    updateBarche();
}

/* ...ogni 500ms */
setInterval(() => getDatiBarche(update), 500);                  // Faccio ripetere la funzione (non il risultato) più volte

/* Carico la mappa dopo aver richiesto i dati della gameArea */
getGameArea(loadMap);