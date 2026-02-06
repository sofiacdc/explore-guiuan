let guests = {
  adults: 1,
  children: 0,
  infant: 0,
  pwd: 0
};

// Disable past dates
(function disablePastDates() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("startDate").setAttribute("min", today);
  document.getElementById("endDate").setAttribute("min", today);
})();

function toggleDropdown(id) {
  document.querySelectorAll('.dropdown').forEach(d => {
    if (d.id !== id) d.style.display = 'none';
  });
  const el = document.getElementById(id);
  el.style.display = el.style.display === 'block' ? 'none' : 'block';
}

function updateGuests(type, value) {
  guests[type] = Math.max(0, guests[type] + value);
  if (type === 'adults' && guests.adults === 0) guests.adults = 1;

  document.getElementById(type).innerText = guests[type];
  document.getElementById('guestSummary').innerText =
    Object.values(guests).reduce((a,b)=>a+b,0) + ' guests';

  calculatePrice();
}

// Adventure selection
document.querySelectorAll('#adventureDrop input').forEach(cb => {
  cb.addEventListener('change', calculatePrice);
});

// Calculate nights
function getNights() {
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;

  if (!start || !end) return 1;

  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
}

// PRICE = clusters × guests × nights
function calculatePrice() {
  let total = 0;

  document.querySelectorAll('#adventureDrop input:checked').forEach(cb => {
    total += parseInt(cb.value);
  });

  const guestCount = Object.values(guests).reduce((a,b)=>a+b,0);
  const nights = getNights();

  total = total * guestCount * nights;

  document.getElementById('totalPrice').innerText =
    total > 0 ? '₱' + total.toLocaleString() : '₱0';
}

// Night count display
function updateNightCount() {
  const nights = getNights();
  document.getElementById("nightCount").innerText =
    `${nights} night${nights > 1 ? "s" : ""}`;
}

// Recalculate on date change
document.getElementById("startDate").addEventListener("change", () => {
  updateNightCount();
  calculatePrice();
});

document.getElementById("endDate").addEventListener("change", () => {
  updateNightCount();
  calculatePrice();
});

// Click outside to close dropdowns
document.addEventListener("click", () => {
  document.querySelectorAll(".dropdown").forEach(d => d.style.display = "none");
});

document.querySelectorAll(".pill-btn, .dropdown").forEach(el => {
  el.addEventListener("click", e => e.stopPropagation());
});
