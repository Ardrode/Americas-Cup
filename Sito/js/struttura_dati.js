class Node {
    constructor(name, lat, len, dir) {
        this.name = name;
        this.lat = lat;
        this.len = len;
        this.dir = dir;
        this.next = [];
    }

    addNext(nodo) {
        this.next.push(nodo);
    }

    getRandomNext() {

        if(this.next.length === 0) {
            return null;
        }

        let index = Math.floor(Math.random() * this.next.length);
        return this.next[index];
    }
}

let punti = {};

punti.p1_1_0 = new Node("p1_1_0", "45.4029349", "12.5400118", 270);
punti.p1_1_1 = new Node("p1_1_1", "45.4012953", "12.5300494", 270);
punti.p1_1_2 = new Node("p1_1_2", "45.3966708", "12.5286442", 180);
punti.p1_1_3 = new Node("p1_1_3", "45.3948160", "12.5330682", 135);
punti.p1_1_4 = new Node("p1_1_4", "45.3923290", "12.5404467", 135);
punti.p1_1_5 = new Node("p1_1_5", "45.3905467", "12.5505874", 90);
punti.p1_1_6 = new Node("p1_1_6", "45.3901574", "12.5629946", 90);
punti.p1_1_7 = new Node("p1_1_7", "45.3890001", "12.5757937", 90);
punti.p1_1_8 = new Node("p1_1_8", "45.3884422", "12.5889599", 90);
punti.p2_1_0 = new Node("p2_1_0", "45.3871804", "12.6005995", 90);
punti.p2_1_1 = new Node("p2_1_1", "45.3880293", "12.6086574", 90);
punti.p2_1_2 = new Node("p2_1_2", "45.3869909", "12.6195027", 90);

punti.p1_2_0 = new Node("p1_2_0", "45.4093644", "12.5471006", 315);
punti.p1_2_1 = new Node("p1_2_1", "45.4166514", "12.5468178", 0);
punti.p1_2_2 = new Node("p1_2_2", "45.4212060", "12.5558287", 45);
punti.p1_2_3 = new Node("p1_2_3", "45.4197958", "12.5630251", 90);
punti.p1_2_4 = new Node("p1_2_4", "45.4175064", "12.5697243", 90);
punti.p1_2_5 = new Node("p1_2_5", "45.4131279", "12.5744265", 135);
punti.p1_2_6 = new Node("p1_2_6", "45.4081621", "12.5809448", 135);
punti.p1_2_7 = new Node("p1_2_7", "45.4035158", "12.5872470", 135);
punti.p1_2_8 = new Node("p1_2_8", "45.3997797", "12.5969739", 135);
punti.p2_2_0 = new Node("p2_2_0", "45.3956876", "12.6080784", 135);
punti.p2_2_1 = new Node("p2_2_1", "45.3932777", "12.6131598", 135);
punti.p2_2_2 = new Node("p2_2_2", "45.3899625", "12.6214867", 135);

punti.p3_0   = new Node("p3_0  ", "45.3860390", "12.6341864", 90);
punti.p3_1   = new Node("p3_1  ", "45.3844910", "12.6404530", 135);
punti.p3_2   = new Node("p3_2  ", "45.3822565", "12.6492400", 135);
punti.p3_3   = new Node("p3_3  ", "45.3810609", "12.6571228", 135);
punti.p3_4   = new Node("p3_4  ", "45.3778003", "12.6652389", 135);
punti.p3_5   = new Node("p3_5  ", "45.3758995", "12.6727898", 135);
punti.p4     = new Node("p4    ", "45.3739087", "12.6831793", 135);

punti.p5_1_0 = new Node("p5_1_0", "45.3674419", "12.6876278", 135);
punti.p5_1_1 = new Node("p5_1_1", "45.3622017", "12.6892052", 90);
punti.p5_1_2 = new Node("p5_1_2", "45.3587476", "12.6822640", 225);
punti.p5_1_3 = new Node("p5_1_3", "45.3587557", "12.6724777", 270);
punti.p5_1_4 = new Node("p5_1_4", "45.3617877", "12.6642766", 315);
punti.p5_1_5 = new Node("p5_1_5", "45.3656664", "12.6570098", 315);
punti.p5_1_6 = new Node("p5_1_6", "45.3690769", "12.6468963", 315);
punti.p5_1_7 = new Node("p5_1_7", "45.3747680", "12.6380925", 315);
punti.p5_1_8 = new Node("p5_1_8", "45.3792070", "12.6308117", 315);
punti.p6_1_0 = new Node("p6_1_0", "45.3830953", "12.6242017", 315);
punti.p6_1_1 = new Node("p6_1_1", "45.3863903", "12.6145374", 315);
punti.p6_1_2 = new Node("p6_1_2", "45.3899211", "12.6031742", 315);

punti.p5_2_0 = new Node("p5_2_0", "45.3788903", "12.6948803", 45);
punti.p5_2_1 = new Node("p5_2_1", "45.3836401", "12.7009740", 45);
punti.p5_2_2 = new Node("p5_2_2", "45.3879764", "12.6965600", 315);
punti.p5_2_3 = new Node("p5_2_3", "45.3919340", "12.6900069", 315);
punti.p5_2_4 = new Node("p5_2_4", "45.3922895", "12.6812767", 225);
punti.p5_2_5 = new Node("p5_2_5", "45.3911453", "12.6719423", 225);
punti.p5_2_6 = new Node("p5_2_6", "45.3905641", "12.6611448", 225);
punti.p5_2_7 = new Node("p5_2_7", "45.3904833", "12.6529593", 225);
punti.p5_2_8 = new Node("p5_2_8", "45.3906647", "12.6418890", 225);
punti.p6_2_0 = new Node("p6_2_0", "45.3907528", "12.6304801", 270);
punti.p6_2_1 = new Node("p6_2_1", "45.3914334", "12.6175668", 270);
punti.p6_2_2 = new Node("p6_2_2", "45.3929810", "12.6059663", 270);

punti.p7_0   = new Node("p7_0"  , "45.3934749", "12.5981627", 270);
punti.p7_1   = new Node("p7_1"  , "45.3945795", "12.5928148", 270);
punti.p7_2   = new Node("p7_2"  , "45.3960130", "12.5865470", 315);
punti.p7_3   = new Node("p7_3"  , "45.3975139", "12.5809515", 315);
punti.p7_4   = new Node("p7_4"  , "45.3993337", "12.5735494", 315);
punti.p7_5   = new Node("p7_5"  , "45.4005646", "12.5675369", 315);
punti.p8     = new Node("p8"    , "45.4020825", "12.5622123", 315);

// da punto 1_1 a punto 2_1
punti.p1_1_0.addNext(punti.p1_1_1);
punti.p1_1_1.addNext(punti.p1_1_2);
punti.p1_1_2.addNext(punti.p1_1_3);
punti.p1_1_3.addNext(punti.p1_1_4);
punti.p1_1_4.addNext(punti.p1_1_5);
punti.p1_1_5.addNext(punti.p1_1_6);
punti.p1_1_6.addNext(punti.p1_1_7);
punti.p1_1_7.addNext(punti.p1_1_8);
punti.p1_1_8.addNext(punti.p2_1_0);

// da punto 2_1 a punto 3_0
punti.p2_1_0.addNext(punti.p2_1_1);
punti.p2_1_1.addNext(punti.p2_1_2);
punti.p2_1_2.addNext(punti.p3_0);

// da punto 1_2 a punto 2_2
punti.p1_2_0.addNext(punti.p1_2_1);
punti.p1_2_1.addNext(punti.p1_2_2);
punti.p1_2_2.addNext(punti.p1_2_3);
punti.p1_2_3.addNext(punti.p1_2_4);
punti.p1_2_4.addNext(punti.p1_2_5);
punti.p1_2_5.addNext(punti.p1_2_6);
punti.p1_2_6.addNext(punti.p1_2_7);
punti.p1_2_7.addNext(punti.p1_2_8);
punti.p1_2_8.addNext(punti.p2_2_0);

// da punto 2_2 a punto 3_0
punti.p2_2_0.addNext(punti.p2_2_1);
punti.p2_2_1.addNext(punti.p2_2_2);
punti.p2_2_2.addNext(punti.p3_0);

// da punto 3_0 a punto 4
punti.p3_0.addNext(punti.p3_1);
punti.p3_1.addNext(punti.p3_2);
punti.p3_2.addNext(punti.p3_3);
punti.p3_3.addNext(punti.p3_4);
punti.p3_4.addNext(punti.p3_5);
punti.p3_5.addNext(punti.p4);

// da punto 4 a punto 6_1
punti.p4.addNext(punti.p5_1_1);
punti.p5_1_1.addNext(punti.p5_1_2);
punti.p5_1_2.addNext(punti.p5_1_3);
punti.p5_1_3.addNext(punti.p5_1_4);
punti.p5_1_4.addNext(punti.p5_1_5);
punti.p5_1_5.addNext(punti.p5_1_6);
punti.p5_1_6.addNext(punti.p5_1_7);
punti.p5_1_7.addNext(punti.p5_1_8);
punti.p5_1_8.addNext(punti.p6_1_0);

// da punto 6_1 a punto 7_0
punti.p6_1_0.addNext(punti.p6_1_1);
punti.p6_1_1.addNext(punti.p6_1_2);
punti.p6_1_2.addNext(punti.p7_0);

// da punto 4 a punto 6_2
punti.p4.addNext(punti.p5_2_1);
punti.p5_2_1.addNext(punti.p5_2_2);
punti.p5_2_2.addNext(punti.p5_2_3);
punti.p5_2_3.addNext(punti.p5_2_4);
punti.p5_2_4.addNext(punti.p5_2_5);
punti.p5_2_5.addNext(punti.p5_2_6);
punti.p5_2_6.addNext(punti.p5_2_7);
punti.p5_2_7.addNext(punti.p5_2_8);
punti.p5_2_8.addNext(punti.p6_2_0);

// da punto 6_2 a punto 7_0
punti.p6_2_0.addNext(punti.p6_2_1);
punti.p6_2_1.addNext(punti.p6_2_2);
punti.p6_2_2.addNext(punti.p7_0);

// da punto 7_0 a punto 8
punti.p7_0.addNext(punti.p7_1);
punti.p7_1.addNext(punti.p7_2);
punti.p7_2.addNext(punti.p7_3);
punti.p7_3.addNext(punti.p7_4);
punti.p7_4.addNext(punti.p7_5);
punti.p7_5.addNext(punti.p8);

// da punto 8 a 1_0 e 1_1
punti.p8.addNext(punti.p1_1_0);
punti.p8.addNext(punti.p1_2_0);


/*
let nodoAttuale = punti.p1_1_0;

function gira () {

    console.log(nodoAttuale.name);

    nodoAttuale = nodoAttuale.getRandomNext();
    
    return 0;
}

setInterval(gira, 1000);
*/

