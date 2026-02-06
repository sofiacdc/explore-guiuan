let guests = {
  adults: 1,
  children: 0,
  infant: 0,
  pwd: 0
};

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

document.querySelectorAll('#adventureDrop input').forEach(cb => {
  cb.addEventListener('change', calculatePrice);
});

function calculatePrice() {
  let total = 0;
  document.querySelectorAll('#adventureDrop input:checked').forEach(cb => {
    total += parseInt(cb.value);
  });

  const guestCount = Object.values(guests).reduce((a,b)=>a+b,0);
  total *= guestCount;

  document.getElementById('totalPrice').innerText = '₱' + total.toLocaleString();
}

function updateNightCount() {
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;

  if (!start || !end) {
    document.getElementById("nightCount").innerText = "";
    return;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate - startDate;
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  document.getElementById("nightCount").innerText =
    nights > 0 ? `${nights} night${nights > 1 ? "s" : ""}` : "";
}

document.getElementById("startDate").addEventListener("change", updateNightCount);
document.getElementById("endDate").addEventListener("change", updateNightCount);
