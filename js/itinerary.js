document.addEventListener('DOMContentLoaded', () => {

let guests = {
  adults: 0,
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

function getSeasonMultiplier() {
  const month = new Date().getMonth() + 1;

  // Peak season: Dec–May
  if (month === 12 || month <= 5) {
    return 1.2;
  }

  // Rainy season: Jun–Oct
  if (month >= 6 && month <= 10) {
    return 1.1;
  }

  return 1;
}

function toggleDropdown(id) {
  document.querySelectorAll('.dropdown').forEach(d => {
    if (d.id !== id) d.style.display = 'none';
  });
  const el = document.getElementById(id);
  el.style.display = el.style.display === 'block' ? 'none' : 'block';
}

function updateGuests(type, value) {
  guests[type] = Math.max(0, guests[type] + value);
  document.getElementById(type).innerText = guests[type];

  updateGuestSummary();
  calculatePrice();
}

// Adventure selection
document.querySelectorAll('#adventureDrop input').forEach(cb => {
  cb.addEventListener('change', () => {
    updateAdventureSummary();
    calculatePrice();
  });
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

const CLUSTERS = {
  surf: {
    title: "Surf & Raw Pacific Coast (Calicoan Route)",
    theme: "Surf, scenery, raw Pacific views",
    bestTime: "Morning to late afternoon",
    food: "🟢 Boodle fight / shared seaside meal",

    destinations: [
      {
        name: "Calicoan Island",
        duration: "2–3 hours",
        note: "Surf watching, beach walks, photos"
      },
      {
        name: "ABCD Surf Beach",
        duration: "1.5–2 hours",
        note: "Surf sessions or viewing, relaxed vibe"
      },
      {
        name: "Moroboro",
        duration: "1–1.5 hours",
        note: "Swimming, soft sand, rest stop"
      },
      {
        name: "View Deck Calicoan",
        duration: "30–45 minutes",
        note: "Scenic lookout, quick stop for photos"
      }
    ],

    foodExperience: {
      title: "Boodle fight–style lunch",
      note: "Best done after ABCD Surf Beach or Moroboro"
    },

    cost: [
      "Transport (van/motorbike): ₱300 – ₱600",
      "Beach/entrance fees: ₱50 – ₱150",
      "Boodle fight meal (shared): ₱250 – ₱400"
    ],

    totalEstimate: "₱600 – ₱1,150",
    websiteNote:
      "Many travelers choose to stay overnight in Calicoan to enjoy sunset and sunrise without rushing."
  },

  relax: {
    title: "Relaxed Beaches & Easy Swims",
    theme: "Calm waters, easy pace",
    bestTime: "Late morning or afternoon",
    food: "🟢 Boodle fight / casual group meal",

    destinations: [
      {
        name: "Sulangan & La Luna Beach",
        duration: "2–3 hours",
        note: "Swimming, family-friendly beach time"
      },
      {
        name: "Moroboro (optional overlap)",
        duration: "1 hour",
        note: "Chill swim or sunset stop"
      }
    ],

    foodExperience: {
      title: "Beachside boodle fight or casual shared lunch",
      note: "Ideal for families and groups"
    },

    cost: [
      "Transport: ₱150 – ₱300",
      "Entrance fees: ₱50 – ₱100",
      "Food: ₱250 – ₱350"
    ],

    totalEstimate: "₱450 – ₱750",
    websiteNote:
      "This cluster is perfect if you want a slow, no-pressure beach day."
  },

  island: {
    title: "Islands, Caves & Water Adventure",
    theme: "Snorkeling, history, nature",
    bestTime: "Early morning to mid-afternoon",
    food: "🟢 Boodle fight / packed island meal",

  destinations: [
    {
      name: "Pearl (Kantican) Island",
      duration: "2–3 hours",
      note: "Snorkeling, marine sanctuary"
    },
    {
      name: "Handig Beach (Homonhon Island)",
      duration: "1.5–2 hours",
      note: "Historic site, quiet beach"
    },
    {
      name: "Linao Cave",
      duration: "30–45 minutes",
      note: "Cave swim, quick adventure stop"
    }
  ],

  foodExperience: {
    title: "Island-style boodle fight",
    note: "Usually done between island stops"
  },

  websiteNote:
    "You don’t need to visit all stops in one day. Choose 1–2 highlights and enjoy them longer."
},

heritage: {
  title: "Heritage, Faith & Reflection",
  theme: "Culture, history, quiet moments",
  bestTime: "Morning or late afternoon",
  food: "🔵 Local eateries (no boodle fight)",

  destinations: [
    {
      name: "Immaculate Concepcion Church",
      duration: "30–45 minutes",
      note: "Quiet visit, architecture, reflection"
    },
    {
      name: "Sulangan Church",
      duration: "30 minutes",
      note: "Coastal shrine, peaceful stop"
    },
    {
      name: "Kaunan ni Sangkay",
      duration: "45 minutes–1 hour",
      note: "Cultural stories, traditions, heritage"
    },
    {
      name: "Veterans Park",
      duration: "30–45 minutes",
      note: "Cliffside views, sunrise or sunset walk"
    }
  ],

  foodExperience: {
    title: "Local carinderia or café nearby",
    note: "Light meals or snacks only"
  },

  websiteNote:
    "This cluster is best enjoyed slowly and respectfully."
},

};

// PRICE = clusters × guests × nights
function calculatePrice() {
  const guestCount = Object.values(guests).reduce((a, b) => a + b, 0);

  // ✅ Guard: no guests → no estimate
  if (guestCount === 0) {
    document.getElementById('totalPrice').innerText = '₱0';
    return;
  }

  let total = 0;

  document.querySelectorAll('#adventureDrop input:checked').forEach(cb => {
    total += parseInt(cb.value);
  });

  const nights = getNights();
  const seasonMultiplier = getSeasonMultiplier();

  total = total * guestCount * nights * seasonMultiplier;

  document.getElementById('totalPrice').innerText =
    total > 0 ? '₱' + total.toLocaleString() : '₱0';
}


// Night count display
function updateNightCount() {
  const nights = getNights();
  document.getElementById("nightCount").innerText =
    `${nights} night${nights > 1 ? "s" : ""}`;
}

function updateDaysHint() {
  const nights = getNights();
  const hint = document.getElementById("daysHint");

  if (nights >= 3 && nights <= 4) {
    hint.innerText = "Most travelers choose 3–4 days";
    hint.classList.add("show");
  } else {
    hint.classList.remove("show");
  }
}

document.getElementById("startDate").addEventListener("change", () => {
  updateNightCount();
  updateDaysHint();
  updateDaysSummary();
  calculatePrice();
});

document.getElementById("endDate").addEventListener("change", () => {
  updateNightCount();
  updateDaysHint();
  updateDaysSummary();
  calculatePrice();
});

// Click outside to close dropdowns
document.addEventListener("click", () => {
  document.querySelectorAll(".dropdown").forEach(d => d.style.display = "none");
});

document.querySelectorAll(".pill-btn, .dropdown").forEach(el => {
  el.addEventListener("click", e => e.stopPropagation());
});

function setActivePill(clickedBtn) {
  // remove active state from all pills
  document.querySelectorAll('.pill-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // activate the clicked pill
  clickedBtn.classList.add('active');
}

function updateAdventureSummary() {
  const checked = document.querySelectorAll(
    '#adventureDrop input[type="checkbox"]:checked'
  );

  const summary = document.getElementById('adventureSummary');
  if (!summary) return;

  // update pill text
  if (checked.length === 0) {
    summary.textContent = 'Choose experiences';
  } else if (checked.length === 1) {
    summary.textContent = checked[0].parentElement.textContent.trim();
  } else {
    summary.textContent = `${checked.length} experiences`;
  }

  // collect selected clusters
  const clusterKeys = Array.from(checked).map(cb => cb.dataset.cluster);

  // render itinerary cards
  renderItineraryPreview(clusterKeys);

  // ✅ THIS is where the disclaimer call goes
  updateItineraryDisclaimer();

  // optional auto-move to Days
  setTimeout(() => toggleDropdown('daysDrop'), 300);
}

function renderItineraryPreview(clusterKeys) {
  const container = document.getElementById('itineraryPreview');
  if (!container) return;

  if (clusterKeys.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = clusterKeys.map(key => {
    const c = CLUSTERS[key];
    if (!c) return '';

    return `
      <div class="itinerary-card animate-in">
        <h3>${c.title}</h3>

        <p><strong>Theme:</strong> ${c.theme}</p>
        <p><strong>Best time:</strong> ${c.bestTime}</p>
        <p><strong>Food style:</strong> ${c.food}</p>

        <h4>Destinations & Suggested Duration</h4>
        <ul>
          ${c.destinations.map(d => `
            <li>
              <strong>${d.name}</strong> – ${d.duration}<br>
              <span>${d.note}</span>
            </li>
          `).join('')}
        </ul>

        <h4>Food Experience</h4>
        <p>${c.foodExperience.title}</p>
        <small>${c.foodExperience.note}</small>
      </div>
    `;
  }).join('');
}

function updateDaysSummary() {
  const start = document.getElementById('startDate').value;
  const end = document.getElementById('endDate').value;
  const summary = document.getElementById('DaysSummary');
  const nightCount = document.getElementById('nightCount');
  const daysHint = document.getElementById('daysHint');

  if (!start || !end) {
    summary.textContent = 'Select dates';
    nightCount.textContent = '';
    daysHint.classList.remove('show');
    return;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);
  const nights = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));

  const format = d =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  summary.textContent = `${format(startDate)} – ${format(endDate)}`;
  nightCount.textContent = `${nights} night${nights > 1 ? 's' : ''}`;

  if (nights >= 3 && nights <= 4) {
    daysHint.textContent = 'Perfect length for a relaxed Guiuan trip ✨';
    daysHint.classList.add('show');
  } else {
    daysHint.classList.remove('show');
  }
  updateItineraryDisclaimer();
}


function updateGuestSummary() {
  const adults = parseInt(document.getElementById('adults').textContent);
  const children = parseInt(document.getElementById('children').textContent);
  const infant = parseInt(document.getElementById('infant').textContent);
  const pwd = parseInt(document.getElementById('pwd').textContent);

  const total = adults + children + infant + pwd;
  const summary = document.getElementById('GuestSummary');

  if (!summary) return;

  summary.textContent = total === 1 ? '1 guest' : `${total} guests`;
}
function updateItineraryDisclaimer() {
  const checked = document.querySelectorAll(
    '#adventureDrop input[type="checkbox"]:checked'
  );

  const note = document.getElementById('itineraryNote');
  if (!note) return;

  const nights = getNights();

  // Show disclaimer ONLY if 1 cluster + multiple nights
  if (checked.length === 1) {
    const adventureName =
      checked[0].parentElement.textContent.trim();

    note.innerHTML = `
  <strong>About your stay</strong><br>
  You selected <strong>${adventureName}</strong>${
    nights > 1
      ? ` for <strong>${nights} nights</strong>. We’ll thoughtfully spread these activities across your stay.`
      : `. Once you select your dates, we’ll adjust this plan to fit your stay.`
  }
`;
    note.classList.add('show');
  } else {
    note.classList.remove('show');
    note.innerHTML = '';
  }
}
  
  window.toggleDropdown = toggleDropdown;
  window.updateGuests = updateGuests;
  window.setActivePill = setActivePill;
  window.updateAdventureSummary = updateAdventureSummary;
  
});
