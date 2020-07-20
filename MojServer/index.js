const cors = require('cors');
const express = require('express')
const app = express();
app.use(cors());


var fs = require('fs');
var sviPodaci = fs.readFileSync("recept.json")
var bazaPodataka = JSON.parse(sviPodaci);


app.get('/', function (req,res) {
    res.send('Helena Volim te')
})

app.listen(4000, function() {
    console.log('Server je podignut!')
})

//Ucitavanje podataka iz baze na stranicu recepti.js

//let baza = require('./recept.json')
app.get('/recepti', (req, res) => {
    //res.send(JSON.stringify(baza.podaci)); -> Ne može ovako, neće osvježit dok je server upaljen, fs.readFile will
    //always re read the file, and pick up changes.
    let sve = fs.readFileSync("recept.json")
    let baza = JSON.parse(sve)
    res.send(JSON.stringify(baza.podaci))
})

//This will ensure that the body-parser will run before our route, 
//which ensures that our route can then access the parsed HTTP POST body.

const body_parser = require("body-parser");
app.use(body_parser.json());

//POST ruta za dodavanje novih podataka
app.post("/", (req, res) => {

    const novi = req.body;
    bazaPodataka.podaci.push(novi)
    console.log(bazaPodataka)
    fs.writeFile("recept.json", JSON.stringify(bazaPodataka),function(err) {
        if (err) throw err;
        console.log('Dodano!');
        }
    );

});