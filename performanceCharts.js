import { db, ref, push, set, get, child } from './firebase.js';

let chart;

function renderChart(data) {
  const ctx = document.getElementById("weightChart").getContext("2d");
  if (chart) chart.destroy();

  const labels = data.map(entry => entry.date);
  const weights = data.map(entry => entry.weight);
  const gains = [];

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      gains.push(null);
    } else {
      const gain = ((data[i].weight - data[i - 1].weight) /
        ((new Date(data[i].date) - new Date(data[i - 1].date)) / (1000 * 60 * 60 * 24))).toFixed(2);
      gains.push(parseFloat(gain));
    }
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Weight (kg)',
          data: weights,
          borderColor: 'blue',
          borderWidth: 2,
          fill: false,
          tension: 0.3
        },
        {
          label: 'Daily Gain (kg/day)',
          data: gains,
          borderColor: 'green',
          borderWidth: 2,
          fill: false,
          tension: 0.3,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Weight (kg)'
          }
        },
        y1: {
          beginAtZero: true,
          position: 'right',
          grid: {
            drawOnChartArea: false
          },
          title: {
            display: true,
            text: 'Daily Gain (kg/day)'
          }
        }
      }
    }
  });
}

function displaySummary(data) {
  const summary = document.getElementById("summary");
  if (data.length < 2) {
    summary.innerHTML = "Not enough data for analysis.";
    return;
  }

  const first = data[0];
  const last = data[data.length - 1];
  const totalGain = last.weight - first.weight;
  const days = (new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24);
  const avgGain = (totalGain / days).toFixed(2);

  summary.innerHTML = `
    <p><strong>First Weight:</strong> ${first.weight} kg on ${first.date}</p>
    <p><strong>Last Weight:</strong> ${last.weight} kg on ${last.date}</p>
    <p><strong>Total Gain:</strong> ${totalGain.toFixed(1)} kg</p>
    <p><strong>Average Daily Gain:</strong> ${avgGain} kg/day</p>
  `;
}

async function loadWeights(animalId) {
  const snapshot = await get(child(ref(db), `weights/${animalId}`));
  if (!snapshot.exists()) return [];

  const weights = Object.values(snapshot.val()).sort((a, b) => new Date(a.date) - new Date(b.date));
  renderChart(weights);
  displaySummary(weights);
  return weights;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("weightForm");
  const params = new URLSearchParams(window.location.search);
  const animalIdInput = document.getElementById("animalId");

  const autoId = params.get("id");
  if (autoId) {
    animalIdInput.value = autoId;
    loadWeights(autoId);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const animalId = animalIdInput.value.trim();
    const weight = parseFloat(document.getElementById("weight").value);
    const date = document.getElementById("date").value;

    const newRef = push(ref(db, `weights/${animalId}`));
    await set(newRef, { weight, date });

    loadWeights(animalId);
    form.reset();
  });

  document.getElementById("exportCSV").addEventListener("click", async () => {
    const animalId = animalIdInput.value.trim();
    const snapshot = await get(child(ref(db), `weights/${animalId}`));
    if (!snapshot.exists()) {
      alert("No data to export.");
      return;
    }

    const data = Object.values(snapshot.val()).sort((a, b) => new Date(a.date) - new Date(b.date));
    let csv = "Date,Weight (kg),Daily Gain (kg/day)\n";

    for (let i = 0; i < data.length; i++) {
      const date = data[i].date;
      const weight = data[i].weight;
      let gain = "";
      if (i > 0) {
        const diff = weight - data[i - 1].weight;
        const days = (new Date(date) - new Date(data[i - 1].date)) / (1000 * 60 * 60 * 24);
        gain = (diff / days).toFixed(2);
      }
      csv += `${date},${weight},${gain}\n`;
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${animalId}_weights.csv`;
    a.click();
  });
});
