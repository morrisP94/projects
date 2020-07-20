window.onload = function () {
    $("#dohvati").on("click", Dohvati );
    $("#dohvatiRecepte").on("click", DohvatiRecept);
    $("#pogledajRecept").on("click", PogledajRecept);
    $("#spremi").on("click", SpremiRecept);
    $("#spremi2").on("click", SpremiRecept2);
    $("#spremljeno").on("click",Spremljeno);
    $("#prikaziRecept").on("click", PrikaziRecept)
    $("#obrisi").on("click", Izbrisi);
    $("#reset").on("click",Reset);
    $("#reset2").on("click", Reset2);
    $("#posaljiOcjenu").on("click", PosaljiNaServer);

}

function PosaljiNaServer () {

    if(document.getElementById("nadimak").value == "") 
    {
        alert("Morate upisati ime!");
        return;
    }

    var ime = document.getElementById("nadimak").value;
    var recept = document.getElementById("imeRecepta").value;
    var ocjena = document.getElementById("listaOcjena");
    var odabranaOcjena = "";
    
    for (i = 0; i < ocjena.options.length; i++)
    {
        if (ocjena.options[i].selected)
        {
            odabranaOcjena = ocjena.options[i].text;
        }
    }
    
    var podatakOcjenjivaca = { 

        "ime": ime,
        "nazivJela": recept,
        "ocjena": odabranaOcjena
    }

    var zahtjev = new XMLHttpRequest();
    zahtjev.open("POST", "http://192.168.0.16:4000" , true);
    zahtjev.onreadystatechange = function () {}
    zahtjev.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    zahtjev.send(JSON.stringify(podatakOcjenjivaca));

    //ocisti textbox
    document.getElementById("nadimak").value = "";

}
function Reset2 () {
    document.getElementById('prikaz').style.display = 'none';
    document.getElementById('prikaz1').style.display = 'none';
}
function Reset () {
    document.getElementById("resetForm1").reset();
}
function Izbrisi () {
    var b = document.getElementById("receptSpremljeno").value;
    localStorage.removeItem(b);
}

function SpremiRecept2 () {

    var spremiNaziv = document.getElementById("spremiIme").value;
    var spremikat = document.getElementById("spremiKategoriju");
    var kats = "";
    var spremidrzava = document.getElementById("spremiPodrijetlo").value;
    var spremiPripremu = document.getElementById("spremiPriprema").value;
    var spremiSastojak = document.getElementById("spremiSastojci").value;
    var spremiMjeru = document.getElementById("spremiMjere").value;

    if(spremiNaziv == ""  || spremidrzava == "" || spremiPripremu == "" || 
        spremiSastojak == "" || spremiMjeru == "")
        {
            alert ("Morate popuniti sva polja");
            return;
        }
    
    for (i = 0; i < spremikat.options.length; i++)
    {
        if (spremikat.options[i].selected)
        {
            kats = spremikat.options[i].text;
            console.log(kats);
        }
    }
    

    var receptPodatak = { 
        "kategorija": kats, 
        "drzava": spremidrzava, 
        "priprema" : spremiPripremu,
        "sastojci" : spremiSastojak,
        "mjere" : spremiMjeru
       }
       
    localStorage.setItem (spremiNaziv, JSON.stringify(receptPodatak))

    document.getElementById("resetForm1").reset();

}

function Spremljeno () {

    document.getElementById("prikazi3").style.display= 'none';
    document.getElementById("resetForm2").reset();
    $("#listaSpremljeni").empty();

    for (i = 0; i < localStorage.length; i++)
    {
        console.log(localStorage.key(i));
        document.getElementById("listaSpremljeni").innerHTML +=
        "<option value = " + localStorage.key(i) + ">" + localStorage.key(i) + "</option>;";
    }
}

function PrikaziRecept () {

    document.getElementById('prikazi3').style.display = 'inline-block';
    
    var odabraniRecept = document.getElementById("listaSpremljeni");
    var recept1 = "";

    for (i = 0; i < odabraniRecept.options.length; i++)
    {
        if (odabraniRecept.options[i].selected)
        {
            recept1 = odabraniRecept.options[i].text;
        }
    }


    var podaci = JSON.parse(localStorage.getItem(recept1))

    document.getElementById("receptSpremljeno").value = recept1;
    document.getElementById("receptKategorija").value = podaci.kategorija;
    document.getElementById("receptPodrijetlo").value = podaci.drzava;
    document.getElementById("receptPriprema").value = podaci.priprema;
    document.getElementById("receptSastojci").value = podaci.sastojci;
    document.getElementById("receptMjere").value = podaci.mjere;   

}



function SpremiRecept() {

    var nazivRecepta = document.getElementById("imeRecepta").value;
    var kat = document.getElementById("kategorijaRecepta").value;
    var drzava = document.getElementById("podrijetloRecepta").value;
    var priprema = document.getElementById("pripremaRecepta").value;
    var sastojci = document.getElementById("sastojciRecepta").value;
    var mjereRecepta = document.getElementById("mjere").value;


    var zahtjev = new XMLHttpRequest();
    zahtjev.onreadystatechange = function () 
    {

        if(this.status == 200 && this.readyState == 4)
        {
            var podaci4 = JSON.parse(zahtjev.responseText);

            var receptPodaci = { 
                                "kategorija": kat, 
                                "drzava": drzava, 
                                "priprema" : priprema,
                                "sastojci" : sastojci,
                                "mjere" : mjereRecepta
                               }
                               
            localStorage.setItem (nazivRecepta, JSON.stringify(receptPodaci))
                       
        }   
            
    }
    zahtjev.open("GET", "https://www.themealdb.com/api/json/v1/1/search.php?s=", true);
    zahtjev.send();


}

function PogledajRecept () {

    var sviRecepti = document.getElementById("recipes");
    var recept = "";

    for (i = 0; i < sviRecepti.options.length; i++)
    {
        if (sviRecepti.options[i].selected)
        {
            recept = sviRecepti.options[i].text;
            console.log(recept);
        }
    }

    var zahtjev = new XMLHttpRequest();
    zahtjev.onreadystatechange = function () 
    {

        if(this.status == 200 && this.readyState == 4)
        {
            var podaci3 = JSON.parse(zahtjev.responseText);

            for (i = 0; i < podaci3.meals.length; i++)
            {
                if(recept == podaci3.meals[i].strMeal)
                {
                   document.getElementById("rec").innerHTML = "RECEPT: " + podaci3.meals[i].strMeal;
                   document.getElementById("imeRecepta").value = podaci3.meals[i].strMeal;
                   document.getElementById("kategorijaRecepta").value = podaci3.meals[i].strCategory;
                   document.getElementById("podrijetloRecepta").value = podaci3.meals[i].strArea;
                   document.getElementById("pripremaRecepta").value = podaci3.meals[i].strInstructions;
                   var url =  podaci3.meals[i].strYoutube;
                   var url_pravi = url.replace('watch?v=','embed/');
                   $("#video").attr("src", url_pravi);
                    
                   var podatak = podaci3.meals[i];
                   
                   for(var k of Object.keys(podatak))
                   {
                       if(k.includes("strIngredient"))
                       {
                           if(podatak[k] != ""  && podatak[k] != null)
                           {
                            //console.log(podatak[k]);
                            document.getElementById("sastojciRecepta").value += podatak[k] + "," ;                          
                           }
                        }

                        if(k.includes("strMeasure"))
                        {
                            if (podatak[k] != " " && podatak[k] != null && podatak[k] != "")
                            {
                                document.getElementById("mjere").value += podatak[k] + "," 
                            }
                        }
                   }


                }
            }
            
                    
        }   
            
    }
    zahtjev.open("GET", "https://www.themealdb.com/api/json/v1/1/search.php?s=", true);
    zahtjev.send();

    //spajanje na poslužitelj i dohvaćanje prosječne ocjene

    var zahtjev2 = new XMLHttpRequest();
    zahtjev2.onreadystatechange = function () {
        if(this.status == 200 && this.readyState == 4)
        {
            var podaciBaza = JSON.parse(zahtjev2.responseText);
            //console.log(podaciBaza);
            var br = 0;
            var zbroji = 0;
            for(i=0 ; i < podaciBaza.length; i++)
            {
                if(podaciBaza[i].nazivJela == recept)
                {
                    br = br + 1;
                    zbroji = zbroji + parseInt(podaciBaza[i].ocjena)
                    //console.log(podaciBaza[i].nazivJela);
                }
            }
            if(br == 0)
            {
                document.getElementById("ubaci").innerHTML = "PROSJEČNA OCJENA RECEPTA JE: Recept nema dovoljno ocjena";
            }
            else
            {
                document.getElementById("ubaci").innerHTML = "PROSJEČNA OCJENA RECEPTA JE: " + zbroji/br;
            }
            
        }

    }
    zahtjev2.open("GET", "http://192.168.0.16:4000/recepti" , true);
    zahtjev2.send();

    
}

function DohvatiRecept () {

    $('#recipes > option').remove();
    document.getElementById('prikaz1').style.display = 'inline-block';
    var vrsta = document.getElementById("listOfItems");
    var vr = "";

    for (i = 0; i < vrsta.options.length; i++)
    {
        if (vrsta.options[i].selected)
        {
            vr = vrsta.options[i].text;
            console.log(vr);
        }
    }

    var zahtjev = new XMLHttpRequest();
    zahtjev.onreadystatechange = function () 
    {

        if(this.status == 200 && this.readyState == 4)
        {
            var podaci2 = JSON.parse(zahtjev.responseText);

            for (i = 0; i < podaci2.meals.length; i++)
            {
                if(vr == podaci2.meals[i].strArea || vr == podaci2.meals[i].strCategory)
                {
                    document.getElementById("recipes").innerHTML += 
                    "<option value = " + podaci2.meals[i].strMeal + ">" + podaci2.meals[i].strMeal + "</option>;";   
                }
            }
            $("#recipes").trigger("create");
                    
        }   
            
    }
    zahtjev.open("GET", "https://www.themealdb.com/api/json/v1/1/search.php?s=", true);
    zahtjev.send();
    
}

function Dohvati () {
  
    $('#listOfItems > option').remove();
    var categories = document.getElementsByName("category");
    var checkedCategory = ""
    var listaDrzave = [];
    var listaKategorije = [];

    for (i = 0; i < categories.length; i++)
    {
        if (categories[i].checked)
        {
            checkedCategory = categories[i].value;
        }
    }

    if (checkedCategory == "") 
    {   alert ("Ako želite nastaviti morate odabrati kategoriju"); 
        return ; 
    }

    document.getElementById('prikaz').style.display = 'inline-block';

    var zahtjev = new XMLHttpRequest();
    zahtjev.onreadystatechange = function () 
    {
        if(this.status == 200 && this.readyState == 4)
        {
            var podaci = JSON.parse(zahtjev.responseText);
            console.log(podaci);

            if (checkedCategory == "BY COUNTRY")
            {     
                document.getElementById("opis").innerHTML = "Lista prema podrijetlu hrane:"   
                for (i = 0; i < podaci.meals.length; i++ )
                {         
                    if (!listaDrzave.includes(podaci.meals[i].strArea))
                    {
                        document.getElementById("listOfItems").innerHTML += 
                        "<option value = " + podaci.meals[i].strArea + ">" + podaci.meals[i].strArea + "</option>;";

                        listaDrzave.push(podaci.meals[i].strArea);
                    }
                }
                $("#listOfItems").trigger("create");
            }
                        
            else
            {
                document.getElementById("opis").innerHTML = "Lista prema tipu hrane:" 
                for (i = 0; i < podaci.meals.length; i++ )
                {
                    if (!listaKategorije.includes(podaci.meals[i].strCategory))
                    {
                        document.getElementById("listOfItems").innerHTML += 
                        "<option value = " + podaci.meals[i].strCategory + ">" + podaci.meals[i].strCategory + "</option>;";

                        listaKategorije.push(podaci.meals[i].strCategory);
                    }
                }
            }
            $("#listOfItems").trigger("create");

        }
    }
                      
    zahtjev.open("GET", "https://www.themealdb.com/api/json/v1/1/search.php?s=", true);
    zahtjev.send();

     
}
     
        
    

   


    