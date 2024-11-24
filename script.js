const generateButton = document.getElementById("generate-button");
const responseOutput = document.getElementById("response-output");
const modeToggle = document.getElementById("mode-toggle");

modeToggle.addEventListener("click", () => {
  if (modeToggle.textContent.includes("Sérieux")) {
    modeToggle.textContent = "Mode : FUN";
  } else {
    modeToggle.textContent = "Mode : Sérieux";
  }
});

generateButton.addEventListener("click", async () => {
  const userInput = document.getElementById("user-input").value.trim();

  if (!userInput) {
    alert("Merci d'écrire un problème pour générer une excuse.");
    return;
  }

  const mode = document.getElementById("mode-toggle").textContent.includes("FUN") ? "FUN" : "Sérieux";

  responseOutput.textContent = "Génération en cours...";

  try {
    const response = await fetch("http://localhost:3000/generate-excuse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput, mode }),
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
