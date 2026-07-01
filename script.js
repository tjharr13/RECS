const people = [
  {
    name: "Warren Buffett",
    field: "Investing",
    bio: "Investor and CEO of Berkshire Hathaway known for long-term value investing."
  },
  {
    name: "Bill Simmons",
    field: "Sports & Media",
    bio: "Sportswriter, podcaster, and founder of The Ringer."
  },
  {
    name: "Marc Andreessen",
    field: "Startups & Technology",
    bio: "Venture capitalist, software founder, and technology thinker."
  },
  {
    name: "Oprah Winfrey",
    field: "Media & Culture",
    bio: "Media executive, interviewer, and influential book recommender."
  },
  {
    name: "LeBron James",
    field: "Sports & Business",
    bio: "Athlete, entrepreneur, producer, and cultural figure."
  },
  {
    name: "Christopher Nolan",
    field: "Film",
    bio: "Filmmaker known for ambitious, large-scale movies."
  }
];

const recommendations = [
  {
    id: 1,
    title: "The Intelligent Investor",
    type: "Book",
    category: "Investing",
    recommendedBy: ["Warren Buffett"],
    description: "A classic investing book focused on value investing and long-term thinking.",
    source: "Public interviews and investing discussions",
    externalUrl: "https://www.amazon.com/s?k=The+Intelligent+Investor"
  },
  {
    id: 2,
    title: "Business Adventures",
    type: "Book",
    category: "Business",
    recommendedBy: ["Warren Buffett"],
    description: "A collection of business stories about companies, markets, and decision-making.",
    source: "Public recommendation lists",
    externalUrl: "https://www.amazon.com/s?k=Business+Adventures+John+Brooks"
  },
  {
    id: 3,
    title: "Poor Charlie’s Almanack",
    type: "Book",
    category: "Investing",
    recommendedBy: ["Warren Buffett"],
    description: "A book about Charlie Munger’s thinking, business philosophy, and mental models.",
    source: "Investor reading lists",
    externalUrl: "https://www.amazon.com/s?k=Poor+Charlie%27s+Almanack"
  },
  {
    id: 4,
    title: "Hoop Dreams",
    type: "Movie",
    category: "Sports",
    recommendedBy: ["Bill Simmons"],
    description: "A legendary basketball documentary about ambition, talent, and opportunity.",
    source: "Sports media discussions",
    externalUrl: "https://www.imdb.com/find/?q=Hoop%20Dreams"
  },
  {
    id: 5,
    title: "The Rewatchables",
    type: "Podcast",
    category: "Movies",
    recommendedBy: ["Bill Simmons"],
    description: "A movie podcast about films people love to rewatch and debate.",
    source: "The Ringer podcast network",
    externalUrl: "https://open.spotify.com/search/The%20Rewatchables"
  },
  {
    id: 6,
    title: "Friday Night Lights",
    type: "Movie",
    category: "Sports",
    recommendedBy: ["Bill Simmons"],
    description: "A sports story about football, pressure, community, and ambition.",
    source: "Sports and film commentary",
    externalUrl: "https://www.imdb.com/find/?q=Friday%20Night%20Lights"
  },
  {
    id: 7,
    title: "Acquired",
    type: "Podcast",
    category: "Business",
    recommendedBy: ["Marc Andreessen"],
    description: "A business podcast breaking down great companies, founders, and deals.",
    source: "Startup and technology discussions",
    externalUrl: "https://open.spotify.com/search/Acquired%20Podcast"
  },
  {
    id: 8,
    title: "The Hard Thing About Hard Things",
    type: "Book",
    category: "Startups",
    recommendedBy: ["Marc Andreessen"],
    description: "A startup book about leadership, crisis, management, and building companies.",
    source: "Founder reading lists",
    externalUrl: "https://www.amazon.com/s?k=The+Hard+Thing+About+Hard+Things"
  },
  {
    id: 9,
    title: "Why Software Is Eating the World",
    type: "Article",
    category: "Technology",
    recommendedBy: ["Marc Andreessen"],
    description: "A famous essay about how software changes industries and the economy.",
    source: "Published essay",
    externalUrl: "https://www.google.com/search?q=Why+Software+Is+Eating+the+World"
  },
  {
    id: 10,
    title: "Beloved",
    type: "Book",
    category: "Literature",
    recommendedBy: ["Oprah Winfrey"],
    description: "A powerful novel by Toni Morrison about memory, history, trauma, and identity.",
    source: "Book club discussions",
    externalUrl: "https://www.amazon.com/s?k=Beloved+Toni+Morrison"
  },
  {
    id: 11,
    title: "The Power of Now",
    type: "Book",
    category: "Self-Improvement",
    recommendedBy: ["Oprah Winfrey"],
    description: "A book about mindfulness, presence, and personal awareness.",
    source: "Public media discussions",
    externalUrl: "https://www.amazon.com/s?k=The+Power+of+Now"
  },
  {
    id: 12,
    title: "Oprah’s Super Soul",
    type: "Podcast",
    category: "Culture",
    recommendedBy: ["Oprah Winfrey"],
    description: "A podcast featuring conversations about purpose, meaning, and personal growth.",
    source: "Podcast platform",
    externalUrl: "https://open.spotify.com/search/Oprah%20Super%20Soul"
  },
  {
    id: 13,
    title: "The Last Dance",
    type: "Movie",
    category: "Sports",
    recommendedBy: ["LeBron James"],
    description: "A documentary series about Michael Jordan and the Chicago Bulls dynasty.",
    source: "Public sports commentary",
    externalUrl: "https://www.imdb.com/find/?q=The%20Last%20Dance"
  },
  {
    id: 14,
    title: "More Than an Athlete",
    type: "Article",
    category: "Sports & Business",
    recommendedBy: ["LeBron James"],
    description: "A theme and media idea around athlete identity, business, and influence.",
    source: "Public athlete media discussions",
    externalUrl: "https://www.google.com/search?q=LeBron+James+More+Than+an+Athlete"
  },
  {
    id: 15,
    title: "Mind the Game",
    type: "Podcast",
    category: "Basketball",
    recommendedBy: ["LeBron James"],
    description: "A basketball podcast focused on strategy, decision-making, and the game itself.",
    source: "Podcast platform",
    externalUrl: "https://open.spotify.com/search/Mind%20the%20Game%20LeBron"
  },
  {
    id: 16,
    title: "2001: A Space Odyssey",
    type: "Movie",
    category: "Film",
    recommendedBy: ["Christopher Nolan"],
    description: "A major science-fiction film that influenced generations of filmmakers.",
    source: "Film interviews",
    externalUrl: "https://www.imdb.com/find/?q=2001%20A%20Space%20Odyssey"
  },
  {
    id: 17,
    title: "Heat",
    type: "Movie",
    category: "Crime",
    recommendedBy: ["Christopher Nolan"],
    description: "A crime film known for tension, atmosphere, and large-scale filmmaking.",
    source: "Film discussions",
    externalUrl: "https://www.imdb.com/find/?q=Heat%201995"
  },
  {
    id: 18,
    title: "Blade Runner",
    type: "Movie",
    category: "Science Fiction",
    recommendedBy: ["Christopher Nolan"],
    description: "A visually influential science-fiction film about identity, memory, and humanity.",
    source: "Film influence discussions",
    externalUrl: "https://www.imdb.com/find/?q=Blade%20Runner"
  }
];

let currentFilter = "all";

const peopleGrid = document.getElementById("peopleGrid");
const recommendationsGrid = document.getElementById("recommendationsGrid");
const savedGrid = document.getElementById("savedGrid");
const followingGrid = document.getElementById("followingGrid");
const personProfileSection = document.getElementById("personProfileSection");
const personProfile = document.getElementById("personProfile");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const filterButtons = document.querySelectorAll(".filter-btn");

function getSavedRecs() {
  return JSON.parse(localStorage.getItem("savedRecs")) || [];
}

function saveRecs(saved) {
  localStorage.setItem("savedRecs", JSON.stringify(saved));
}

function getFollowedPeople() {
  return JSON.parse(localStorage.getItem("followedPeople")) || [];
}

function saveFollowedPeople(followed) {
  localStorage.setItem("followedPeople", JSON.stringify(followed));
}

function isFollowing(personName) {
  return getFollowedPeople().includes(personName);
}

function getRecommendationsForPerson(personName) {
  return recommendations.filter(rec => rec.recommendedBy.includes(personName));
}

function renderPeople(list) {
  peopleGrid.innerHTML = "";

  list.forEach(person => {
    const following = isFollowing(person.name);

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <span class="badge">${person.field}</span>
      <h3>${person.name}</h3>
      <p>${person.bio}</p>
      <div class="card-actions">
        <button onclick="showPersonProfile('${person.name}')">View Profile</button>
        <button class="${following ? "following-btn" : ""}" onclick="toggleFollow('${person.name}')">
          ${following ? "Following" : "Follow"}
        </button>
      </div>
    `;

    peopleGrid.appendChild(card);
  });
}

function renderRecommendations(list) {
  recommendationsGrid.innerHTML = "";

  if (list.length === 0) {
    recommendationsGrid.innerHTML = `<div class="empty">No recommendations found. Try another search.</div>`;
    return;
  }

  list.forEach(rec => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <span class="badge">${rec.type}</span>
      <h3>${rec.title}</h3>
      <p>${rec.description}</p>
      <div class="meta">
        Recommended by: <strong>${rec.recommendedBy.join(", ")}</strong><br>
        Category: ${rec.category}<br>
        Source: ${rec.source}
      </div>
      <div class="card-actions">
        <button onclick="saveRecommendation(${rec.id})">Save REC</button>
        <a class="link-btn" href="${rec.externalUrl}" target="_blank">Open Link</a>
      </div>
    `;

    recommendationsGrid.appendChild(card);
  });
}

function renderSaved() {
  const savedIds = getSavedRecs();
  const savedRecommendations = recommendations.filter(rec => savedIds.includes(rec.id));

  savedGrid.innerHTML = "";

  if (savedRecommendations.length === 0) {
    savedGrid.innerHTML = `<div class="empty">You have not saved any RECS yet.</div>`;
    return;
  }

  savedRecommendations.forEach(rec => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <span class="badge">${rec.type}</span>
      <h3>${rec.title}</h3>
      <p>${rec.description}</p>
      <div class="meta">
        Recommended by: <strong>${rec.recommendedBy.join(", ")}</strong><br>
        Category: ${rec.category}
      </div>
      <div class="card-actions">
        <button onclick="removeSavedRecommendation(${rec.id})">Remove</button>
        <a class="link-btn" href="${rec.externalUrl}" target="_blank">Open Link</a>
      </div>
    `;

    savedGrid.appendChild(card);
  });
}

function renderFollowing() {
  const followed = getFollowedPeople();

  followingGrid.innerHTML = "";

  if (followed.length === 0) {
    followingGrid.innerHTML = `<div class="empty">You are not following anyone yet.</div>`;
    return;
  }

  const followedPeople = people.filter(person => followed.includes(person.name));

  followedPeople.forEach(person => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <span class="badge">${person.field}</span>
      <h3>${person.name}</h3>
      <p>${person.bio}</p>
      <div class="card-actions">
        <button onclick="showPersonProfile('${person.name}')">View Profile</button>
        <button class="following-btn" onclick="toggleFollow('${person.name}')">Following</button>
      </div>
    `;

    followingGrid.appendChild(card);
  });
}

function showPersonProfile(personName) {
  const person = people.find(p => p.name === personName);
  const personRecs = getRecommendationsForPerson(personName);
  const following = isFollowing(personName);

  if (!person) return;

  personProfileSection.style.display = "block";

  personProfile.innerHTML = `
    <div class="profile-panel">
      <div class="profile-header">
        <div>
          <span class="badge">${person.field}</span>
          <h2>${person.name}</h2>
          <p>${person.bio}</p>
          <p><strong>${personRecs.length}</strong> recommendations on RECS</p>
        </div>
        <div class="profile-actions">
          <button class="${following ? "following-btn" : ""}" onclick="toggleFollow('${person.name}')">
            ${following ? "Following" : "Follow"}
          </button>
        </div>
      </div>

      <div class="profile-recs">
        ${personRecs.map(rec => `
          <div class="profile-rec-card">
            <span class="badge">${rec.type}</span>
            <h3>${rec.title}</h3>
            <p>${rec.description}</p>
            <div class="meta">
              Category: ${rec.category}<br>
              Source: ${rec.source}
            </div>
            <div class="card-actions">
              <button onclick="saveRecommendation(${rec.id})">Save REC</button>
              <a class="link-btn" href="${rec.externalUrl}" target="_blank">Open Link</a>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  window.location.href = "#personProfileSection";
}

function toggleFollow(personName) {
  let followed = getFollowedPeople();

  if (followed.includes(personName)) {
    followed = followed.filter(name => name !== personName);
  } else {
    followed.push(personName);
  }

  saveFollowedPeople(followed);

  renderPeople(people);
  renderFollowing();

  if (personProfileSection.style.display === "block") {
    showPersonProfile(personName);
  }
}

function saveRecommendation(id) {
  const saved = getSavedRecs();

  if (!saved.includes(id)) {
    saved.push(id);
    saveRecs(saved);
  }

  renderSaved();
  alert("Saved to your RECS.");
}

function removeSavedRecommendation(id) {
  const saved = getSavedRecs().filter(savedId => savedId !== id);
  saveRecs(saved);
  renderSaved();
}

function runSearch() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  let filtered = recommendations.filter(rec => {
    const matchesSearch =
      rec.title.toLowerCase().includes(searchTerm) ||
      rec.type.toLowerCase().includes(searchTerm) ||
      rec.category.toLowerCase().includes(searchTerm) ||
      rec.recommendedBy.join(" ").toLowerCase().includes(searchTerm) ||
      rec.description.toLowerCase().includes(searchTerm);

    const matchesFilter = currentFilter === "all" || rec.type === currentFilter;

    return matchesSearch && matchesFilter;
  });

  renderRecommendations(filtered);
  window.location.href = "#recommendations";
}

searchButton.addEventListener("click", runSearch);

searchInput.addEventListener("keyup", event => {
  if (event.key === "Enter") {
    runSearch();
  }
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    currentFilter = button.dataset.filter;
    runSearch();
  });
});

renderPeople(people);
renderRecommendations(recommendations);
renderSaved();
renderFollowing();