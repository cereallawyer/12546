import { db, ref, get, child } from './firebase.js';

async function fetchGroupData() {
  const animalsSnap = await get(child(ref(db), "animals"));
  const weightsSnap = await get(child(ref(db), "weights"));

  if (!animalsSnap.exists() || !weightsSnap.exists()) {
    document.getElementById("groupStats").innerHTML = "<p>No data available.</p>";
    return;
  }

  const animals = animalsSnap.val();
  const weights = weightsSnap.val();

  const groupMap = {};

  for (const animalId in animals) {
    const animal = animals[animalId];
    const group = animal.group || "Ungrouped";
    if (!groupMap[group]) groupMap[group] = [];

    if (weights[animalId]) {
      const wList = Object.values(weights[animalId]).sort((a, b) => new Date(a.date) - new Date(b.date));
      if (wList.length < 2) continue;

      const first = wList[0];
      const last = wList[wList.length - 1];
      const gain = last.weight - first.weight;
      const days = (new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24);
      const dailyGain = gain / days;

      groupMap[group].push({
        start: first.weight,
        end: last.weight,
        dailyGain
      });
    }
  }

  renderGroupStats(groupMap);
}

function renderGroupStats(groups) {
  const container = document.getElementById("groupStats");
  container.innerHTML = "";

  for (const group in groups) {
    const data = groups[group];
    if (data.length === 0) continue;

    const avgStart = (data.reduce((a, b) => a + b.start, 0) / data.length).toFixed(1);
    const avgEnd = (data.reduce((a, b) => a + b.end, 0) / data.length).toFixed(1);
    const avgGain = (data.reduce((a, b) => a + b.dailyGain, 0) / data.length).toFixed(2);

    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${group}</h3>
      <p><strong>Animals:</strong> ${data.length}</p>
      <p><strong>Avg Start Weight:</strong> ${avgStart} kg</p>
      <p><strong>Avg Final Weight:</strong> ${avgEnd} kg</p>
      <p><strong>Avg Daily Gain:</strong> ${avgGain} kg/day</p>
    `;
    container.appendChild(div);
  }
}

document.addEventListener("DOMContentLoaded", fetchGroupData);
