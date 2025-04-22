import { db, ref, get, child } from './firebase.js';

document.addEventListener("DOMContentLoaded", async () => {
  const animalList = document.getElementById("animalList");
  try {
    const snapshot = await get(child(ref(db), "animals"));
    if (snapshot.exists()) {
      const animals = snapshot.val();
      for (const id in animals) {
        const animal = animals[id];
        const li = document.createElement("li");
        li.innerHTML = `<a href="animalProfile.html?id=${id}">${animal.name} (${animal.eartag})</a>`;
        animalList.appendChild(li);
      }
    } else {
      animalList.innerHTML = "<li>No animals found.</li>";
    }
  } catch (error) {
    console.error(error);
    animalList.innerHTML = "<li>Error loading animals.</li>";
  }
});
