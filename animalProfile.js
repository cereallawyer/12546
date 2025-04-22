import { db, ref, get, child } from './firebase.js';

function getAnimalIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

document.addEventListener("DOMContentLoaded", async () => {
  const animalId = getAnimalIdFromURL();
  const detailsDiv = document.getElementById("animalDetails");

  if (!animalId) {
    detailsDiv.textContent = "No animal selected.";
    return;
  }

  try {
    const snapshot = await get(child(ref(db), `animals/${animalId}`));
    if (snapshot.exists()) {
      const animal = snapshot.val();
      detailsDiv.innerHTML = `
        <p><strong>Name:</strong> ${animal.name}</p>
        <p><strong>Eartag:</strong> ${animal.eartag}</p>
        <p><strong>Sex:</strong> ${animal.sex}</p>
        <p><strong>DOB:</strong> ${animal.dob}</p>
        <p><strong>Breed:</strong> ${animal.breed}</p>
        <p><strong>Sire:</strong> ${animal.sire}</p>
        <p><strong>Dam:</strong> ${animal.dam}</p>
      `;
    } else {
      detailsDiv.textContent = "Animal not found.";
    }
  } catch (error) {
    console.error(error);
    detailsDiv.textContent = "Error loading animal.";
  }
});
