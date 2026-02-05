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

/* === Shareable Link === */
function copyItineraryLink() {
  const params = new URLSearchParams();

  params.set("days", document.getElementById("days").value);
  params.set("pax", document.getElementById("pax").value);
  params.set("boodle", document.getElementById("boodle").checked ? 1 : 0);

  document.querySelectorAll(".cluster input").forEach((c, i) => {
    params.set("c" + i, c.checked ? 1 : 0);
  });

  const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  navigator.clipboard.writeText(url);

  alert("Itinerary link copied!");
}

/* Load from URL if present */
(function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("days")) return;

  document.getElementById("days").value = params.get("days");
  document.getElementById("pax").value = params.get("pax");
  document.getElementById("boodle").checked = params.get("boodle") === "1";

  document.querySelectorAll(".cluster input").forEach((c, i) => {
    c.checked = params.get("c" + i) === "1";
  });

  calculateBudget();
})();
/* === PDF Export === */
function downloadPDF() {
  const content = `
Explore Guiuan – Free-Flow Itinerary

Days: ${document.getElementById("days").value}
PAX: ${document.getElementById("pax").value}

Destinations:
${Array.from(document.querySelectorAll(".cluster input"))
  .map((c, i) => c.checked ? `- Option ${i + 1}` : "")
  .join("\n")}

Boodle fight: ${document.getElementById("boodle").checked ? "Yes" : "No"}

Estimated Budget:
${document.getElementById("budget").innerText}

Note: This itinerary is flexible and weather-dependent.
`;

  const blob = new Blob([content], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Explore-Guiuan-Itinerary.pdf";
  link.click();
}

