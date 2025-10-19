class Punto  {
    constructor(x, y) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    }
}

class Retta {
    // se non si impostano valori restituisce crea l'asse y
    constructor(m = 1, q = 0) {
        this.m = parseFloat(m);
        this.m_reciproco = (this.m === 0) ? Infinity : -1 / this.m;
        this.q = parseFloat(q);
    }

    perUnPunto(punto, m) {
        let x = parseFloat(punto.x);
        let y = parseFloat(punto.y);

        this.m = parseFloat(m);
        this.m_reciproco = (this.m === 0) ? Infinity : -1 / this.m;
        this.q = - (m * x) + y;
    }

    intersezione(retta2) {

        if (this.m === retta2.m) {
            return null; // Le rette parallele non si intersecano (o coincidono)
        }

        let xIntersezione = (retta2.q - this.q) / (this.m - retta2.m);
        let yIntersezione = this.m * xIntersezione + this.q;

        return new Punto(xIntersezione, yIntersezione);
    }

}

module.exports = {Punto, Retta};