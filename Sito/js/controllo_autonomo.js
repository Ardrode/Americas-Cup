let posBarche = [
    {name: "barca1", lat: "", len: "", dir: ""},
    {name: "barca2", lat: "", len: "", dir: ""}
];

let nodoAttuale1 = punti.p1_1_0;
let nodoAttuale2 = punti.p1_2_0;

function updateBarca() {
    
    let speed1 = Math.floor((Math.random() * 2) + 1)

    for(let i = 0; i < speed1; i++) {
        nodoAttuale1 = nodoAttuale1.getRandomNext();
    }

    let speed2 = Math.floor((Math.random() * 2) + 1)

    for(let i = 0; i < speed2; i++) {
        nodoAttuale2 = nodoAttuale2.getRandomNext();
    }
    
    posBarche[0].lat = nodoAttuale1.lat;
    posBarche[0].len = nodoAttuale1.len;
    posBarche[0].dir = nodoAttuale1.dir;

    posBarche[1].lat = nodoAttuale2.lat;
    posBarche[1].len = nodoAttuale2.len;
    posBarche[1].dir = nodoAttuale2.dir;

    sendNewData(0, posBarche[0].lat, posBarche[0].len, posBarche[0].dir);
    sendNewData(1, posBarche[1].lat, posBarche[1].len, posBarche[1].dir);

}

setInterval(updateBarca, 1000);

function sendNewData(barca, lat, len, direction) {

    fetch('https://americas-cup.onrender.com/controlloAutonomo', {
            // seleziono il tipo di metodo
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // cosa viene passato nel body della richiesta
                newlat: lat,
                newlen: len,
                barca: barca,
                dir: direction,
            })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Errore:', error));
}
