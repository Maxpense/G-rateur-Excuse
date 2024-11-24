const generateButton = document.getElementById("generate-button");
const responseOutput = document.getElementById("response-output");

generateButton.addEventListener("click", async () => {
    const userInput = document.getElementById("user-input").value.trim();

    if (!userInput) {
        alert("Merci d'écrire un problème pour générer une excuse.");
        return;
    }

    responseOutput.textContent = "Génération en cours...";

    try {
      const response = await fetch("https://g-rateur-excuse.onrender.com/generate-excuse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userInput, mode: "FUN" }), // Remplace "FUN" par le mode souhaité
        });

        if (response.ok) {
            const data = await response.json();
            responseOutput.textContent = data.excuse;
        } else {
            responseOutput.textContent = "Une erreur est survenue lors de la génération de l'excuse.";
        }
    } catch (error) {
        console.error("Erreur de connexion au serveur :", error);
        responseOutput.textContent = "Erreur de connexion au serveur.";
    }
});
