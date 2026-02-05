const budgetEl = document.getElementById("budget");

function calculateBudget() {
  let min = 0, max = 0;
  const pax = Number(document.getElementById("pax").value);

  document.querySelectorAll(".cluster input:checked").forEach(c => {
    min += Number(c.dataset.min);
    max += Number(c.dataset.max);
  });

  const boodle = document.getElementById("boodle");
  if (boodle.checked) {
    min += Number(boodle.dataset.min);
    max += Number(boodle.dataset.max);
  }

  min *= pax;
  max *= pax;

  budgetEl.textContent =
    min ? `₱${min.toLocaleString()} – ₱${max.toLocaleString()}` :
    "Select options to calculate";
}

/* Auto-recommend based on days */
document.getElementById("days").addEventListener("change", e => {
  document.querySelectorAll(".cluster").forEach(c => c.classList.remove("highlight"));

  if (e.target.value === "short") {
    document.querySelector(".rec-relax").classList.add("highlight");
    document.querySelector(".rec-culture").classList.add("highlight");
  }
  if (e.target.value === "mid") {
    document.querySelector(".rec-surf").classList.add("highlight");
    document.querySelector(".rec-island").classList.add("highlight");
  }
  if (e.target.value === "long") {
    document.querySelectorAll(".cluster").forEach(c => c.classList.add("highlight"));
  }
});

/* Weather-based suggestion (simple logic) */
const weatherTip = document.getElementById("weatherTip");
const hour = new Date().getHours();

if (hour < 10) {
  weatherTip.textContent = "🌤️ Morning is best for beaches & island trips";
} else if (hour > 15) {
  weatherTip.textContent = "🌅 Late afternoon is ideal for heritage & viewpoints";
}

/* Listeners */
document.querySelectorAll("input, select").forEach(el =>
  el.addEventListener("change", calculateBudget)
);

