import { db, ref, push, set } from './firebase.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addAnimalForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const animalData = {
        name: document.getElementById("name").value.trim(),
        eartag: document.getElementById("eartag").value.trim(),
        sex: document.getElementById("sex").value.trim(),
        dob: document.getElementById("dob").value,
        breed: document.getElementById("breed").value.trim(),
        sire: document.getElementById("sire").value.trim(),
        dam: document.getElementById("dam").value.trim(),
        createdAt: new Date().toISOString()
      };
      try {
        const newRef = push(ref(db, "animals"));
        await set(newRef, animalData);
        document.getElementById("statusMsg").textContent = "Animal saved successfully!";
        form.reset();
      } catch (err) {
        console.error(err);
        document.getElementById("statusMsg").textContent = "Error saving animal.";
      }
    });
  }
}
)