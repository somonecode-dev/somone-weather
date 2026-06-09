const champSaisie = document.querySelector("#city-input");
const boutonRechercher = document.querySelector("#btn-search");
const blocResultat = document.querySelector("#weather-result");
const affichageVille = document.querySelector("#result-city");
const affichageTemp = document.querySelector("#result-temp");
const affichageDesc = document.querySelector("#result-desc");
const iconeMeteo = document.querySelector("#weather-icon");
const blocDetails = document.querySelector("#weather-details");
const affichageHumidite = document.querySelector("#detail-humidity");
const affichageVent = document.querySelector("#detail-wind");

const cleApi = "b8fd05c4d8aecd3ca85121e21c98708d"; 

async function recupererMeteo(ville) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${cleApi}&units=metric&lang=fr`;
    try {
        const reponse = await fetch(url);
        if (!reponse.ok) { declencherErreur("Ville introuvable"); return; }
        const donnees = await reponse.json();
        localStorage.setItem("derniereVille", ville);
        afficherDonneesMeteo(donnees);
    } catch (e) { declencherErreur("Connexion impossible"); }
}

function afficherDonneesMeteo(donnees) {
    affichageVille.textContent = `${donnees.name}, ${donnees.sys.country}`;
    affichageTemp.textContent = `${Math.round(donnees.main.temp)}°C`;
    affichageDesc.textContent = donnees.weather[0].description;
    iconeMeteo.src = `https://openweathermap.org/img/wn/${donnees.weather[0].icon}@2x.png`;
    affichageHumidite.textContent = `${donnees.main.humidity}%`;
    affichageVent.textContent = `${Math.round(donnees.wind.speed * 3.6)} km/h`;
    iconeMeteo.classList.add("visible");
    blocDetails.classList.add("visible");
}

function declencherErreur(message) {
    blocResultat.classList.add("erreur-animation");
    
    // 1. Mise à jour du message d'erreur
    affichageVille.textContent = "⚠️ " + message;
    
    // 2. Réinitialisation complète des affichages
    affichageTemp.textContent = "--°C";
    affichageDesc.textContent = ""; // <--- C'est ici que l'on vide la description
    iconeMeteo.classList.remove("visible");
    
    // 3. On cache la grille des détails (Humidité/Vent)
    blocDetails.classList.remove("visible");
    
    // Animation de secousse
    setTimeout(() => blocResultat.classList.remove("erreur-animation"), 300);
}

boutonRechercher.addEventListener("click", () => {
    const ville = champSaisie.value.trim();
    if (ville !== "") {
        recupererMeteo(ville);
    } else {
        // Le message pour le champ vide
        declencherErreur("Champ vide : veuillez saisir une ville, une localité ou une région.");
    }
});

// Ajout de l'événement sur le champ de saisie pour la touche "Entrée"
champSaisie.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const ville = champSaisie.value.trim();
        if (ville !== "") {
            recupererMeteo(ville);
        } else {
            declencherErreur("Champ vide : veuillez saisir une ville, une localité ou une région.");
        }
    }
});