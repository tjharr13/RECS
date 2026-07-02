const SUPABASE_URL = "https://mishldytiwowlveohrlo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_teT_pb-wcoGJgRH87ftrxw_3-aBqn2H";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const appState = {
  user: null,
  profile: null,
  people: [],
  recommendations: [],
  savedIds: new Set(),
  followedIds: new Set(),
  lists: [],
  listItems: [],
  currentFilter: "all",
  verifiedOnly: false
};

const elements = {
  authSection: document.getElementById("authSection"),
  dashboardSection: document.getElementById("dashboardSection"),
  signupForm: document.getElementById("signupForm"),
  loginForm: document.getElementById("loginForm"),
  logoutButton: document.getElementById("logoutButton"),
  authMessage: document.getElementById("authMessage"),
  userGreeting: document.getElementById("userGreeting"),
  statSaved: document.getElementById("statSaved"),
  statFollowing: document.getElementById("statFollowing"),
  statLists: document.getElementById("statLists"),
  statRecs: document.getElementById("statRecs"),
  searchInput: document.getElementById("searchInput"),
  searchButton: document.getElementById("searchButton"),
  filterButtons: document.querySelectorAll(".filter-btn[data-filter]"),
  verifiedOnlyButton: document.getElementById("verifiedOnlyButton"),
  peopleGrid: document.getElementById("peopleGrid"),
  recommendationsGrid: document.getElementById("recommendationsGrid"),
  personProfileSection: document.getElementById("personProfileSection"),
  personProfile: document.getElementById("personProfile"),
  followingGrid: document.getElementById("followingGrid"),
  savedGrid: document.getElementById("savedGrid"),
  listsGrid: document.getElementById("listsGrid"),
  createListForm: document.getElementById("createListForm"),
  submissionForm: document.getElementById("submissionForm"),
  submissionMessage: document.getElementById("submissionMessage")
};

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[character];
  });
}

function normalizeStatus(status) {
  return String(status || "needs_source").replaceAll("_", "-");
}

function statusLabel(status) {
  const labels = {
    verified: "Verified",
    needs_source: "Needs Source",
    manual_entry: "Manual Entry",
    user_submitted: "User Submitted"
  };

  return labels[status] || "Needs Source";
}

function requireLogin() {
  if (!appState.user) {
    elements.authMessage.textContent = "Please log in or create an account first.";
    window.location.href = "#authSection";
    return false;
  }

  return true;
}

function setMessage(message) {
  elements.authMessage.textContent = message || "";
}

async function init() {
  const { data } = await db.auth.getSession();
  appState.user = data.session?.user || null;

  await loadAllData();
  updateAuthUI();
  renderAll();

  db.auth.onAuthStateChange(async (_event, session) => {
    appState.user = session?.user || null;
    await loadAllData();
    updateAuthUI();
    renderAll();
  });
}

async function loadAllData() {
  await Promise.all([
    loadPeople(),
    loadRecommendations()
  ]);

  if (appState.user) {
    await Promise.all([
      loadProfile(),
      loadSavedRecommendations(),
      loadFollows(),
      loadLists()
    ]);
  } else {
    appState.profile = null;
    appState.savedIds = new Set();
    appState.followedIds = new Set();
    appState.lists = [];
    appState.listItems = [];
  }
}

async function loadProfile() {
  const { data, error } = await db
    .from("profiles")
    .select("*")
    .eq("id", appState.user.id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return;
  }

  if (data) {
    appState.profile = data;
    return;
  }

  const fallbackName = appState.user.user_metadata?.full_name || appState.user.email;

  const { data: createdProfile, error: createError } = await db
    .from("profiles")
    .insert({
      id: appState.user.id,
      full_name: fallbackName
    })
    .select()
    .single();

  if (createError) {
    console.error(createError);
    return;
  }

  appState.profile = createdProfile;
}

async function loadPeople() {
  const { data, error } = await db
    .from("people")
    .select("*")
    .order("name");

  if (error) {
    console.error(error);
    elements.peopleGrid.innerHTML = `<div class="empty">Could not load people.</div>`;
    return;
  }

  appState.people = data || [];
}

async function loadRecommendations() {
  const { data, error } = await db
    .from("person_recommendations")
    .select(`
      id,
      quote,
      context,
      person:people (
        id,
        name,
        slug,
        field,
        bio,
        image_url
      ),
      recommendation:recommendations (
        id,
        title,
        slug,
        type,
        category,
        description,
        image_url,
        external_url,
        verification_status,
        created_at
      ),
      source:sources (
        id,
        source_title,
        source_type,
        source_url,
        notes
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    elements.recommendationsGrid.innerHTML = `<div class="empty">Could not load recommendations.</div>`;
    return;
  }

  const grouped = {};

  (data || []).forEach(row => {
    if (!row.recommendation) return;

    const rec = row.recommendation;

    if (!grouped[rec.id]) {
      grouped[rec.id] = {
        ...rec,
        recommenders: [],
        sources: [],
        links: []
      };
    }

    if (row.person) {
      grouped[rec.id].recommenders.push(row.person);
    }

    if (row.source) {
      grouped[rec.id].sources.push(row.source);
    }

    grouped[rec.id].links.push({
      person: row.person,
      source: row.source,
      quote: row.quote,
      context: row.context
    });
  });

  appState.recommendations = Object.values(grouped);
}

async function loadSavedRecommendations() {
  const { data, error } = await db
    .from("saved_recommendations")
    .select("recommendation_id")
    .eq("user_id", appState.user.id);

  if (error) {
    console.error(error);
    return;
  }

  appState.savedIds = new Set((data || []).map(row => row.recommendation_id));
}

async function loadFollows() {
  const { data, error } = await db
    .from("follows")
    .select("person_id")
    .eq("user_id", appState.user.id);

  if (error) {
    console.error(error);
    return;
  }

  appState.followedIds = new Set((data || []).map(row => row.person_id));
}

async function loadLists() {
  const { data: lists, error: listsError } = await db
    .from("user_lists")
    .select("*")
    .eq("user_id", appState.user.id)
    .order("created_at", { ascending: false });

  if (listsError) {
    console.error(listsError);
    return;
  }

  appState.lists = lists || [];

  if (appState.lists.length === 0) {
    appState.listItems = [];
    return;
  }

  const listIds = appState.lists.map(list => list.id);

  const { data: listItems, error: itemsError } = await db
    .from("user_list_items")
    .select("*")
    .in("list_id", listIds)
    .order("created_at", { ascending: false });

  if (itemsError) {
    console.error(itemsError);
    return;
  }

  appState.listItems = listItems || [];
}

function updateAuthUI() {
  const authOnlySections = document.querySelectorAll(".auth-only");

  authOnlySections.forEach(section => {
    section.style.display = appState.user ? "" : "none";
  });

  elements.authSection.style.display = appState.user ? "none" : "block";

  if (appState.user) {
    const name =
      appState.profile?.full_name ||
      appState.user.user_metadata?.full_name ||
      appState.user.email;

    elements.userGreeting.textContent = `Welcome back, ${name}.`;
  }
}

function renderAll() {
  renderPeople(appState.people);
  renderRecommendations(getFilteredRecommendations());
  renderFollowing();
  renderSaved();
  renderLists();
  renderDashboardStats();
}

function renderDashboardStats() {
  elements.statSaved.textContent = appState.savedIds.size;
  elements.statFollowing.textContent = appState.followedIds.size;
  elements.statLists.textContent = appState.lists.length;
  elements.statRecs.textContent = appState.recommendations.length;
}

function renderPeople(people) {
  elements.peopleGrid.innerHTML = "";

  if (people.length === 0) {
    elements.peopleGrid.innerHTML = `<div class="empty">No people found yet.</div>`;
    return;
  }

  people.forEach(person => {
    const following = appState.followedIds.has(person.id);

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <span class="badge">${escapeHTML(person.field || "Expert")}</span>
      <h3>${escapeHTML(person.name)}</h3>
      <p>${escapeHTML(person.bio || "No bio added yet.")}</p>
      <div class="card-actions">
        <button onclick="showPersonProfile('${person.id}')">View Profile</button>
        <button class="${following ? "following-btn" : ""}" onclick="toggleFollow('${person.id}')">
          ${following ? "Following" : "Follow"}
        </button>
      </div>
    `;

    elements.peopleGrid.appendChild(card);
  });
}

function getFilteredRecommendations() {
  const searchTerm = elements.searchInput.value.toLowerCase().trim();

  return appState.recommendations.filter(rec => {
    const recommenderNames = rec.recommenders.map(person => person.name).join(" ");
    const sourceTitles = rec.sources.map(source => source.source_title).join(" ");

    const matchesSearch =
      rec.title.toLowerCase().includes(searchTerm) ||
      rec.type.toLowerCase().includes(searchTerm) ||
      String(rec.category || "").toLowerCase().includes(searchTerm) ||
      String(rec.description || "").toLowerCase().includes(searchTerm) ||
      recommenderNames.toLowerCase().includes(searchTerm) ||
      sourceTitles.toLowerCase().includes(searchTerm);

    const matchesFilter =
      appState.currentFilter === "all" || rec.type === appState.currentFilter;

    const matchesVerified =
      !appState.verifiedOnly || rec.verification_status === "verified";

    return matchesSearch && matchesFilter && matchesVerified;
  });
}

function renderRecommendations(recommendations) {
  elements.recommendationsGrid.innerHTML = "";

  if (recommendations.length === 0) {
    elements.recommendationsGrid.innerHTML = `<div class="empty">No recommendations found. Try another search.</div>`;
    return;
  }

  recommendations.forEach(rec => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = recommendationCardHTML(rec);
    elements.recommendationsGrid.appendChild(card);
  });
}

function recommendationCardHTML(rec) {
  const source = rec.sources?.[0];
  const recommendedBy = rec.recommenders?.map(person => person.name).join(", ") || "Unknown";
  const isSaved = appState.savedIds.has(rec.id);

  const sourceButton = source?.source_url
    ? `<a class="link-btn" href="${escapeHTML(source.source_url)}" target="_blank" rel="noopener">View Source</a>`
    : "";

  const openButton = rec.external_url
    ? `<a class="link-btn" href="${escapeHTML(rec.external_url)}" target="_blank" rel="noopener">Open Link</a>`
    : "";

  const saveButton = appState.user
    ? `<button class="${isSaved ? "saved-btn" : ""}" onclick="toggleSave('${rec.id}')">${isSaved ? "Saved" : "Save REC"}</button>`
    : `<button onclick="requireLogin()">Log in to Save</button>`;

  const listButton = appState.user
    ? `<button onclick="addRecommendationToList('${rec.id}')">Add to List</button>`
    : "";

  return `
    <span class="badge">${escapeHTML(rec.type)}</span>
    <span class="badge status-${normalizeStatus(rec.verification_status)}">${statusLabel(rec.verification_status)}</span>
    <h3>${escapeHTML(rec.title)}</h3>
    <p>${escapeHTML(rec.description || "No description added yet.")}</p>
    <div class="meta">
      Recommended by: <strong>${escapeHTML(recommendedBy)}</strong><br>
      Category: ${escapeHTML(rec.category || "Uncategorized")}<br>
      Source: ${escapeHTML(source?.source_title || "Source needed")}
    </div>
    <div class="card-actions">
      ${saveButton}
      ${listButton}
      ${openButton}
      ${sourceButton}
    </div>
  `;
}

function renderFollowing() {
  if (!appState.user) return;

  const followedPeople = appState.people.filter(person => appState.followedIds.has(person.id));

  elements.followingGrid.innerHTML = "";

  if (followedPeople.length === 0) {
    elements.followingGrid.innerHTML = `<div class="empty">You are not following anyone yet.</div>`;
    return;
  }

  followedPeople.forEach(person => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <span class="badge">${escapeHTML(person.field || "Expert")}</span>
      <h3>${escapeHTML(person.name)}</h3>
      <p>${escapeHTML(person.bio || "No bio added yet.")}</p>
      <div class="card-actions">
        <button onclick="showPersonProfile('${person.id}')">View Profile</button>
        <button class="following-btn" onclick="toggleFollow('${person.id}')">Following</button>
      </div>
    `;

    elements.followingGrid.appendChild(card);
  });
}

function renderSaved() {
  if (!appState.user) return;

  const savedRecommendations = appState.recommendations.filter(rec => appState.savedIds.has(rec.id));

  elements.savedGrid.innerHTML = "";

  if (savedRecommendations.length === 0) {
    elements.savedGrid.innerHTML = `<div class="empty">You have not saved any RECS yet.</div>`;
    return;
  }

  savedRecommendations.forEach(rec => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = recommendationCardHTML(rec);
    elements.savedGrid.appendChild(card);
  });
}

function renderLists() {
  if (!appState.user) return;

  elements.listsGrid.innerHTML = "";

  if (appState.lists.length === 0) {
    elements.listsGrid.innerHTML = `<div class="empty">You have not created any lists yet.</div>`;
    return;
  }

  appState.lists.forEach(list => {
    const items = appState.listItems.filter(item => item.list_id === list.id);

    const card = document.createElement("div");
    card.className = "list-card";

    card.innerHTML = `
      <span class="badge">${list.is_public ? "Public" : "Private"}</span>
      <h3>${escapeHTML(list.title)}</h3>
      <p>${escapeHTML(list.description || "No description added.")}</p>
      <div class="meta">${items.length} items</div>
      <div class="list-items">
        ${
          items.length === 0
            ? `<div class="list-item">No RECS added yet.</div>`
            : items.map(item => {
                const rec = appState.recommendations.find(r => r.id === item.recommendation_id);
                return `
                  <div class="list-item">
                    <strong>${escapeHTML(rec?.title || "Unknown recommendation")}</strong>
                    <br>
                    <small>${escapeHTML(rec?.type || "")}</small>
                    <br>
                    <button onclick="removeFromList('${item.id}')">Remove</button>
                  </div>
                `;
              }).join("")
        }
      </div>
    `;

    elements.listsGrid.appendChild(card);
  });
}

function showPersonProfile(personId) {
  const person = appState.people.find(p => p.id === personId);
  if (!person) return;

  const personRecs = appState.recommendations.filter(rec => {
    return rec.recommenders.some(recommender => recommender.id === personId);
  });

  const following = appState.followedIds.has(personId);

  elements.personProfileSection.style.display = "block";

  elements.personProfile.innerHTML = `
    <div class="profile-panel">
      <div class="profile-header">
        <div>
          <span class="badge">${escapeHTML(person.field || "Expert")}</span>
          <h2>${escapeHTML(person.name)}</h2>
          <p>${escapeHTML(person.bio || "No bio added yet.")}</p>
          <p><strong>${personRecs.length}</strong> recommendations on RECS</p>
        </div>

        <div class="card-actions">
          ${
            appState.user
              ? `<button class="${following ? "following-btn" : ""}" onclick="toggleFollow('${person.id}')">${following ? "Following" : "Follow"}</button>`
              : `<button onclick="requireLogin()">Log in to Follow</button>`
          }
        </div>
      </div>

      <div class="profile-recs">
        ${
          personRecs.length === 0
            ? `<div class="empty">No recommendations added for this person yet.</div>`
            : personRecs.map(rec => `
                <div class="profile-rec-card">
                  ${recommendationCardHTML(rec)}
                </div>
              `).join("")
        }
      </div>
    </div>
  `;

  window.location.href = "#personProfileSection";
}

async function toggleSave(recommendationId) {
  if (!requireLogin()) return;

  if (appState.savedIds.has(recommendationId)) {
    const { error } = await db
      .from("saved_recommendations")
      .delete()
      .eq("user_id", appState.user.id)
      .eq("recommendation_id", recommendationId);

    if (error) {
      alert("Could not remove saved REC.");
      console.error(error);
      return;
    }
  } else {
    const { error } = await db
      .from("saved_recommendations")
      .insert({
        user_id: appState.user.id,
        recommendation_id: recommendationId
      });

    if (error) {
      alert("Could not save REC.");
      console.error(error);
      return;
    }
  }

  await loadSavedRecommendations();
  renderAll();
}

async function toggleFollow(personId) {
  if (!requireLogin()) return;

  if (appState.followedIds.has(personId)) {
    const { error } = await db
      .from("follows")
      .delete()
      .eq("user_id", appState.user.id)
      .eq("person_id", personId);

    if (error) {
      alert("Could not unfollow.");
      console.error(error);
      return;
    }
  } else {
    const { error } = await db
      .from("follows")
      .insert({
        user_id: appState.user.id,
        person_id: personId
      });

    if (error) {
      alert("Could not follow.");
      console.error(error);
      return;
    }
  }

  await loadFollows();
  renderAll();
}

async function addRecommendationToList(recommendationId) {
  if (!requireLogin()) return;

  if (appState.lists.length === 0) {
    alert("Create a list first.");
    window.location.href = "#lists";
    return;
  }

  const listChoices = appState.lists
    .map((list, index) => `${index + 1}. ${list.title}`)
    .join("\n");

  const choice = prompt(`Choose a list number:\n\n${listChoices}`);

  if (!choice) return;

  const selectedIndex = Number(choice) - 1;
  const selectedList = appState.lists[selectedIndex];

  if (!selectedList) {
    alert("Invalid list number.");
    return;
  }

  const { error } = await db
    .from("user_list_items")
    .insert({
      list_id: selectedList.id,
      recommendation_id: recommendationId
    });

  if (error) {
    alert("Could not add REC to list. It may already be in that list.");
    console.error(error);
    return;
  }

  await loadLists();
  renderLists();
  alert("Added to list.");
}

async function removeFromList(listItemId) {
  if (!requireLogin()) return;

  const { error } = await db
    .from("user_list_items")
    .delete()
    .eq("id", listItemId);

  if (error) {
    alert("Could not remove item.");
    console.error(error);
    return;
  }

  await loadLists();
  renderLists();
}

async function handleSignup(event) {
  event.preventDefault();

  const fullName = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  setMessage("Creating account...");

  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });

  if (error) {
    setMessage(error.message);
    return;
  }

  if (!data.session) {
    setMessage("Account created. Check your email to confirm your account, then log in.");
  } else {
    setMessage("Account created. You are now logged in.");
  }

  elements.signupForm.reset();
}

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  setMessage("Logging in...");

  const { error } = await db.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    setMessage(error.message);
    return;
  }

  setMessage("");
  elements.loginForm.reset();
}

async function handleLogout() {
  await db.auth.signOut();
  setMessage("You have been logged out.");
  window.location.href = "#authSection";
}

async function handleCreateList(event) {
  event.preventDefault();

  if (!requireLogin()) return;

  const title = document.getElementById("listTitle").value.trim();
  const description = document.getElementById("listDescription").value.trim();
  const isPublic = document.getElementById("listPublic").value === "true";

  const { error } = await db
    .from("user_lists")
    .insert({
      user_id: appState.user.id,
      title,
      description,
      is_public: isPublic
    });

  if (error) {
    alert("Could not create list.");
    console.error(error);
    return;
  }

  elements.createListForm.reset();
  await loadLists();
  renderAll();
}

async function handleSubmission(event) {
  event.preventDefault();

  if (!requireLogin()) return;

  const submission = {
    user_id: appState.user.id,
    person_name: document.getElementById("submitPersonName").value.trim(),
    person_field: document.getElementById("submitPersonField").value.trim(),
    person_bio: document.getElementById("submitPersonBio").value.trim(),
    recommendation_title: document.getElementById("submitRecTitle").value.trim(),
    recommendation_type: document.getElementById("submitRecType").value,
    category: document.getElementById("submitCategory").value.trim(),
    description: document.getElementById("submitDescription").value.trim(),
    source_title: document.getElementById("submitSourceTitle").value.trim(),
    source_url: document.getElementById("submitSourceUrl").value.trim(),
    external_url: document.getElementById("submitExternalUrl").value.trim(),
    image_url: document.getElementById("submitImageUrl").value.trim()
  };

  const { error } = await db
    .from("recommendation_submissions")
    .insert(submission);

  if (error) {
    elements.submissionMessage.textContent = "Could not submit recommendation.";
    console.error(error);
    return;
  }

  elements.submissionForm.reset();
  elements.submissionMessage.textContent = "Recommendation submitted for review.";
}

function runSearch() {
  renderRecommendations(getFilteredRecommendations());
  window.location.href = "#recommendations";
}

elements.signupForm.addEventListener("submit", handleSignup);
elements.loginForm.addEventListener("submit", handleLogin);
elements.logoutButton.addEventListener("click", handleLogout);
elements.createListForm.addEventListener("submit", handleCreateList);
elements.submissionForm.addEventListener("submit", handleSubmission);

elements.searchButton.addEventListener("click", runSearch);

elements.searchInput.addEventListener("keyup", event => {
  if (event.key === "Enter") {
    runSearch();
  }
});

elements.filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    elements.filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    appState.currentFilter = button.dataset.filter;
    runSearch();
  });
});

elements.verifiedOnlyButton.addEventListener("click", () => {
  appState.verifiedOnly = !appState.verifiedOnly;
  elements.verifiedOnlyButton.classList.toggle("active", appState.verifiedOnly);
  runSearch();
});

init();
