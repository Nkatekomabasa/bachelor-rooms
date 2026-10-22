const listings = [
  { id: 1, title: "Sunny bachelor in Morningside", location: "Morningside, Durban", price: 4200, people: 2, rating: "4.92", type: "Bachelor", image: "assets/sns-mamelodi-bedroom.jpeg", badge: "Great value", description: "A light-filled, self-contained bachelor space close to cafes, transport and the city centre. The secure building has a shared garden and laundry area." },
  { id: 2, title: "Private room near UCT", location: "Observatory, Cape Town", price: 3800, people: 1, rating: "4.87", type: "Private room", image: "assets/sns-simple-bedroom.jpeg", badge: "Popular", description: "A calm furnished room in a friendly shared home, an easy walk to campus and the local market. Utilities and uncapped Wi-Fi are included." },
  { id: 3, title: "Compact city studio", location: "Braamfontein, Johannesburg", price: 5100, people: 2, rating: "4.96", type: "Bachelor", image: "assets/sns-mamelodi-bedroom.jpeg", badge: "New listing", description: "A clever city studio with secure access, a well-equipped kitchenette and a bright work nook. Close to Gautrain links and daily essentials." },
  { id: 4, title: "Shared home with a garden", location: "Hatfield, Pretoria", price: 3200, people: 1, rating: "4.81", type: "Shared", image: "assets/sns-shared-twin-room.jpeg", badge: "Room to share", description: "A comfortable private room in a relaxed shared home with a sunny garden. Water, electricity and a weekly common-area clean are included." },
  { id: 5, title: "Four-share student flat", location: "Glenwood, Durban", price: 2900, people: 4, rating: "4.89", type: "Shared", image: "assets/sns-shared-twin-room.jpeg", badge: "Sleeps 4", description: "Made for sharing, this four-bedroom flat has a generous common room, a furnished kitchen and secure parking. Each room is leased separately." },
  { id: 6, title: "Quiet room in Rosebank", location: "Rosebank, Johannesburg", price: 4600, people: 2, rating: "4.90", type: "Private room", image: "assets/sns-simple-bedroom.jpeg", badge: "Move-in ready", description: "A well-kept room with a private bathroom in a secure, well-connected neighbourhood. The monthly rent includes Wi-Fi and water." }
];

const routes = { home: "index.html", rooms: "rooms.html", property: "property.html", login: "login.html", register: "register.html", tenant: "tenant.html", landlord: "landlord.html" };
const searchParams = new URLSearchParams(window.location.search);
const pageName = document.body.dataset.page || "home";
const requestedType = searchParams.get("type") || "Any room";
const typeFilters = { "Any room": "All rooms", "Bachelor room": "Bachelor rooms", "Private room": "Private rooms", "Shared accommodation": "Shared accommodation" };
const budgetValue = Number(searchParams.get("budget")) || Infinity;

function readSavedRooms() {
  try {
    const value = window.localStorage.getItem("room-to-rent-saved");
    return new Set(value ? JSON.parse(value) : [2]);
  } catch {
    return new Set([2]);
  }
}

const state = {
  view: pageName,
  selected: listings.find(item => item.id === Number(searchParams.get("id"))) || listings[0],
  filter: typeFilters[requestedType] || "All rooms",
  search: searchParams.get("where") || "",
  city: searchParams.get("where") || "",
  budget: budgetValue,
  saved: readSavedRooms(),
  mobileOpen: false
};
const app = document.querySelector("#app");
const logo = "assets/room-to-rent-logo.svg";
const money = value => `R${value.toLocaleString("en-ZA")}`;
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

function brand() {
  return `<a class="brand" href="index.html" aria-label="Room to Rent home"><img src="${logo}" alt=""><span class="brand-copy"><span class="brand-name">Room <span>to</span> Rent</span><span class="brand-tag">Find your perfect room today</span></span></a>`;
}

function header() {
  return `<header class="topbar">${brand()}<nav class="nav-links" aria-label="Main navigation"><a class="nav-link ${state.view === "rooms" ? "active" : ""}" href="rooms.html">Explore rooms</a><a class="nav-link" href="index.html#how">How it works</a><a class="nav-link" href="tenant.html">For tenants</a><a class="nav-link" href="sns-bachelor-rooms.html">SNS Mamelodi rooms</a></nav><div class="nav-actions"><a class="button button-quiet" href="login.html">Log in</a><a class="button button-primary" href="landlord.html">List your place ↗</a></div><button class="icon-button mobile-menu" data-action="menu" aria-label="Open menu" aria-expanded="${state.mobileOpen}">☰</button>${state.mobileOpen ? `<nav class="mobile-panel" aria-label="Mobile navigation"><button data-view="rooms">Explore rooms</button><a href="index.html#how">How it works</a><button data-view="tenant">Tenant dashboard</button><a href="sns-bachelor-rooms.html">SNS Mamelodi rooms</a><button data-view="login">Log in</button><button data-view="register">Create account</button><button data-view="landlord">List your place</button></nav>` : ""}</header>`;
}

function searchForm() {
  return `<form class="search-bar" id="search-form"><div class="search-field"><label for="where">WHERE</label><input id="where" name="where" placeholder="City, suburb or university" value="${escapeHtml(state.city)}"></div><div class="search-field"><label for="room-type">ROOM TYPE</label><select id="room-type" name="type">${["Any room", "Bachelor room", "Private room", "Shared accommodation"].map(type => `<option ${requestedType === type ? "selected" : ""}>${type}</option>`).join("")}</select></div><div class="search-field"><label for="budget">MONTHLY BUDGET</label><select id="budget" name="budget"><option value="Any budget" ${state.budget === Infinity ? "selected" : ""}>Any budget</option><option value="3500" ${state.budget === 3500 ? "selected" : ""}>Under R3,500</option><option value="5000" ${state.budget === 5000 ? "selected" : ""}>Under R5,000</option><option value="7000" ${state.budget === 7000 ? "selected" : ""}>Under R7,000</option></select></div><button class="button button-primary" type="submit">⌕ Search rooms</button></form>`;
}

function filteredListings() {
  return listings.filter(item => {
    const searchable = `${item.title} ${item.location} ${item.type}`.toLowerCase();
    const matchesSearch = !state.search || searchable.includes(state.search.toLowerCase());
    const matchesCity = !state.city || item.location.toLowerCase().includes(state.city.toLowerCase());
    const matchesBudget = item.price < state.budget;
    const matchesType = state.filter === "All rooms" || (state.filter === "Bachelor rooms" ? item.type === "Bachelor" : state.filter === "Shared accommodation" ? item.type === "Shared" : item.type === "Private room");
    return matchesSearch && matchesCity && matchesBudget && matchesType;
  });
}

function card(item) {
  const propertyUrl = `property.html?id=${item.id}`;
  const saved = state.saved.has(item.id);
  return `<article class="listing-card"><div class="listing-image"><a href="${propertyUrl}" aria-label="View ${escapeHtml(item.title)}"><img src="${item.image}" alt="Interior of ${escapeHtml(item.title)}" loading="lazy"><span class="badge">${item.badge}</span></a><button class="save-button ${saved ? "saved" : ""}" data-save="${item.id}" aria-label="${saved ? "Remove saved listing" : "Save listing"}">${saved ? "♥" : "♡"}</button></div><div class="listing-meta"><h3><a href="${propertyUrl}">${escapeHtml(item.title)}</a></h3><span class="rating">★ ${item.rating}</span></div><p class="listing-location">${escapeHtml(item.location)} · ${item.type}</p><div class="listing-bottom"><span><strong>${money(item.price)}</strong> <small>/ month</small></span><span>Up to ${item.people} ${item.people === 1 ? "tenant" : "tenants"}</span></div></article>`;
}

function listingGrid(items = filteredListings()) {
  return items.length ? items.map(card).join("") : `<div class="empty-state" style="grid-column:1/-1"><strong>No rooms match those filters yet.</strong>Try another suburb or room type.</div>`;
}

function filterButtons() {
  return `<div class="filters">${["All rooms", "Bachelor rooms", "Private rooms", "Shared accommodation"].map(value => `<button class="filter-chip ${state.filter === value ? "active" : ""}" data-filter="${value}">${value}</button>`).join("")}</div>`;
}

function homePage() {
  return `<main class="fade-in"><section class="page hero"><div class="hero-copy"><span class="eyebrow">A better way to find your space</span><h1>Good rooms.<br>Good people.<br><em>Good living.</em></h1><p class="hero-description">Find a place that feels right, at a price that makes sense. From private rooms to bachelor spaces for up to four.</p><a class="button button-dark" href="rooms.html">Find a room ↓</a><div class="hero-note"><span class="avatar-stack"><span>NM</span><span>ZT</span><span>LK</span></span><span>Rooms found by real South Africans, for real life.</span></div></div><div class="hero-art"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=90" alt="Warm, sunlit apartment living space"><div class="hero-stamp">YOUR NEXT<br>CHAPTER<br>STARTS HERE</div><div class="hero-label"><strong>Space for your next chapter</strong><span>Thoughtful rooms across South Africa</span></div></div></section><div class="search-wrap">${searchForm()}</div><div class="page"><div class="trust-row"><div class="trust-item"><span class="trust-icon">⌂</span> Rooms that feel like home</div><div class="trust-item"><span class="trust-icon">✓</span> Verified listings</div><div class="trust-item"><span class="trust-icon">R</span> Prices in rand</div><div class="trust-item"><span class="trust-icon">♡</span> Space for up to four</div></div><section class="section" id="listings"><div class="section-heading"><div><span class="eyebrow">A good place to start</span><h2>Rooms worth coming home to</h2><p>Browse a few favourites from around the country.</p></div><a class="text-button" href="rooms.html">Explore all rooms →</a></div>${filterButtons()}<div class="listing-grid">${listingGrid()}</div></section></div><section class="how-section" id="how"><div class="page section"><div class="section-heading"><div><span class="eyebrow">From search to settled</span><h2>Finding a room, made simpler</h2><p>A little less scrolling. A lot more feeling at home.</p></div></div><div class="how-grid"><article class="how-step"><span class="step-num">01 / FIND</span><h3>Search your way</h3><p>Choose your city, budget and room type. Browse honest details and photos before you reach out.</p></article><article class="how-step"><span class="step-num">02 / CONNECT</span><h3>Meet your future space</h3><p>Message the landlord, ask the practical questions and arrange a viewing that works for you.</p></article><article class="how-step"><span class="step-num">03 / SETTLE IN</span><h3>Make it yours</h3><p>Find a place that fits your life today, whether moving solo or sharing with friends.</p></article></div><div class="cta-band"><div><h2>A room to rent? Make it a home.</h2><p>Reach thoughtful tenants looking for a place just like yours.</p></div><a class="button button-dark" href="landlord.html">List your place ↗</a></div></div></section>${footer()}</main>`;
}

function roomsPage() {
  return `<main class="page subpage fade-in"><div class="subpage-top"><div><span class="eyebrow">South Africa, find your space</span><h1>Rooms to rent</h1><p class="subpage-intro">Browse bachelor rooms, private rooms and shared accommodation.</p></div></div><div class="search-wrap">${searchForm()}</div><section class="section"><div class="section-heading"><div><h2>${filteredListings().length} places to explore</h2><p>Rent shown monthly in South African rand.</p></div></div>${filterButtons()}<div class="listing-grid">${listingGrid()}</div></section>${footer()}</main>`;
}

function footer() {
  return `<footer class="footer">${brand()}<span class="footer-note">Made for finding your place in South Africa. · © 2026 Room to Rent</span></footer>`;
}

function authPage(register = false) {
  return `<main class="auth-page fade-in"><aside class="auth-aside">${brand()}<div><span class="eyebrow">Room to Rent</span><h1>${register ? "Your next chapter starts here." : "A good room changes everything."}</h1><p>${register ? "Create an account to save rooms, message landlords and find a place that fits." : "Come back to the search that feels a little more like you."}</p></div><div class="auth-quote">“It took one viewing to know. The whole process felt easy, honest and human.”<br><strong>— Thandi, new tenant in Cape Town</strong></div></aside><section class="auth-form-wrap"><form class="auth-form" id="auth-form"><h2>${register ? "Create your account" : "Welcome back"}</h2><p>${register ? "Join Room to Rent and find a place to call your own." : "Log in to pick up where you left off."}</p>${register ? `<div class="form-field"><label for="full-name">Full name</label><input id="full-name" required placeholder="Your name"></div>` : ""}<div class="form-field"><label for="email">Email address</label><input id="email" type="email" required placeholder="you@example.com"></div><div class="form-field"><label for="password">Password</label><input id="password" type="password" required minlength="6" placeholder="At least 6 characters"></div>${register ? `<div class="form-field"><label for="account-type">I am joining as</label><select id="account-type"><option>Tenant</option><option>Landlord</option></select></div>` : `<button class="text-button" type="button" data-action="forgot">Forgot password?</button>`}<button class="button button-primary" type="submit">${register ? "Create account" : "Log in"}</button><p class="auth-switch">${register ? "Already have an account?" : "New to Room to Rent?"} <a href="${register ? "login.html" : "register.html"}">${register ? "Log in" : "Create an account"}</a></p><a class="text-button" href="index.html" style="display:block;text-align:center;margin:15px auto 0">← Back to exploring</a></form></section></main>`;
}

function dashboardPage(kind) {
  const landlord = kind === "landlord";
  return `<main class="page subpage fade-in"><div class="subpage-top"><div><span class="eyebrow">${landlord ? "Landlord space" : "Your room journey"}</span><h1>${landlord ? "Landlord dashboard" : "Tenant dashboard"}</h1><p class="subpage-intro">${landlord ? "Keep listings, enquiries and next steps in one place." : "Your saved rooms and rental conversations, all together."}</p></div><button class="button button-primary" data-action="${landlord ? "new-listing" : "browse"}">${landlord ? "+ Add a listing" : "Browse rooms"}</button></div><div class="dashboard-layout"><aside class="side-nav"><button class="active">▦ Overview</button><button data-action="dashboard-listings">⌂ ${landlord ? "My listings" : "Saved rooms"}</button><button data-action="messages">✉ Messages <span class="status pending">2 new</span></button><button data-action="settings">⚙ Account settings</button><button data-view="rooms">↗ Explore rooms</button></aside><section class="dashboard-content"><div class="welcome-line"><div><h2>${landlord ? "Good morning, Sipho" : "Welcome back, Naledi"}</h2><p>${landlord ? "Here's how your spaces are doing this week." : "Pick up where you left off."}</p></div><span class="status">● Account verified</span></div><div class="stat-grid">${landlord ? `<div class="stat-card"><span>ACTIVE LISTINGS</span><strong>3</strong><small>↑ 1 new enquiry this week</small></div><div class="stat-card"><span>OPEN ENQUIRIES</span><strong>8</strong><small>2 need a reply</small></div><div class="stat-card"><span>PROFILE VIEWS</span><strong>124</strong><small>↑ 18% this month</small></div>` : `<div class="stat-card"><span>SAVED ROOMS</span><strong>${state.saved.size}</strong><small>Across 3 cities</small></div><div class="stat-card"><span>VIEWINGS BOOKED</span><strong>2</strong><small>Next one: Thursday</small></div><div class="stat-card"><span>NEW MESSAGES</span><strong>2</strong><small>From your saved listings</small></div>`}</div><div class="panel"><div class="panel-heading"><h3>${landlord ? "Recent enquiries" : "Your recent activity"}</h3><button class="text-button" data-action="messages">View all →</button></div><div class="table-wrap"><table><thead><tr><th>${landlord ? "TENANT" : "ROOM"}</th><th>${landlord ? "LISTING" : "LOCATION"}</th><th>UPDATED</th><th>STATUS</th></tr></thead><tbody>${landlord ? `<tr><td>Amara Dlamini</td><td>Sunny bachelor · Morningside</td><td>Today, 09:42</td><td><span class="status pending">New enquiry</span></td></tr><tr><td>Ryan Jacobs</td><td>City studio · Glenwood</td><td>Yesterday</td><td><span class="status">Viewing booked</span></td></tr><tr><td>Leila Khan</td><td>Garden room · Berea</td><td>Mon, 14:20</td><td><span class="status">Replied</span></td></tr>` : `<tr><td>Sunny bachelor in Morningside</td><td>Durban, KwaZulu-Natal</td><td>Today, 09:42</td><td><span class="status pending">New message</span></td></tr><tr><td>Private room near UCT</td><td>Cape Town, Western Cape</td><td>Yesterday</td><td><span class="status">Viewing booked</span></td></tr><tr><td>Quiet room in Rosebank</td><td>Johannesburg, Gauteng</td><td>Monday</td><td><span class="status">Saved</span></td></tr>`}</tbody></table></div></div>${landlord ? `<div class="panel"><div class="panel-heading"><h3>Listing performance</h3><button class="text-button">This month⌄</button></div><div style="height:110px;display:flex;align-items:end;gap:10px;padding:12px 8px 0;border-bottom:1px solid var(--line)">${[35,54,42,74,61,88,69,100,81,92,75,108].map((height, index) => `<span style="height:${height}px;flex:1;background:${index === 7 ? "var(--sun)" : "#e8e8e1"};border-radius:4px 4px 0 0"></span>`).join("")}</div></div>` : `<div class="panel"><div class="panel-heading"><h3>Saved for later</h3><a class="text-button" href="rooms.html">Find more →</a></div><div class="listing-grid">${listingGrid(listings.filter(item => state.saved.has(item.id)).slice(0, 2))}</div></div>`}</section></div></main>`;
}

function propertyPage(item) {
  return `<main class="page property-layout fade-in"><section><a class="property-back" href="rooms.html">← Back to rooms</a><div class="property-gallery"><img src="${item.image}" alt="${escapeHtml(item.title)} living space"><img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=85" alt="Bright room interior"><img src="https://images.unsplash.com/photo-1615874694520-474822394e73?auto=format&fit=crop&w=800&q=85" alt="Comfortable bedroom"></div><div class="property-title-row"><div><h1>${escapeHtml(item.title)}</h1><p>${escapeHtml(item.location)} · ★ ${item.rating} · ${item.type}</p></div><button class="button button-quiet button-small" data-save="${item.id}">${state.saved.has(item.id) ? "♥ Saved" : "♡ Save"}</button></div><div class="property-features"><span>⌂ ${item.type}</span><span>♙ Up to ${item.people} ${item.people === 1 ? "tenant" : "tenants"}</span><span>◷ Available now</span><span>✓ Verified listing</span></div><div class="property-description"><h3>About this space</h3><p>${item.description}</p></div><div class="property-description"><h3>What this place offers</h3><p>Furnished options · Secure access · Nearby public transport · Flexible viewing times · South African rand pricing</p></div><div class="property-description"><h3>Where you'll be</h3><p>${escapeHtml(item.location)}. Close to local shops, transport and everyday essentials.</p></div></section><aside class="booking-box"><div class="booking-price"><strong>${money(item.price)}</strong><span>per month</span></div><p class="listing-location">No booking fee to enquire</p><button class="button button-primary" data-action="enquire">Message the landlord</button><p class="booking-note">You can ask questions before making a decision.</p><div class="property-description"><h3>Good to know</h3><p>Confirm utilities, deposit and lease terms directly with the landlord before signing.</p></div></aside></main>`;
}

function localizePhotoUrls(markup) {
  const photos = ["assets/sns-shared-twin-room.jpeg", "assets/sns-mamelodi-bedroom.jpeg", "assets/sns-simple-bedroom.jpeg"];
  const galleryPhotos = state.view === "property" ? photos.filter(photo => photo !== state.selected.image) : photos;
  let photoIndex = 0;
  return markup.replace(/https:\/\/images\.unsplash\.com\/[^"\s]+/g, () => galleryPhotos[photoIndex++ % galleryPhotos.length]);
}

function render() {
  const page = state.view === "login" ? authPage() : state.view === "register" ? authPage(true) : state.view === "tenant" || state.view === "landlord" ? dashboardPage(state.view) : state.view === "property" ? propertyPage(state.selected) : state.view === "rooms" ? roomsPage() : homePage();
  app.innerHTML = `<div class="shell">${header()}${localizePhotoUrls(page)}</div>`;
}

function navigate(view) {
  window.location.href = routes[view] || routes.home;
}

function toast(message) {
  const root = document.querySelector("#toast-root");
  root.innerHTML = `<div class="toast">${message}</div>`;
  window.setTimeout(() => { root.innerHTML = ""; }, 3000);
}

app.addEventListener("click", event => {
  const target = event.target.closest("[data-view],[data-filter],[data-save],[data-action]");
  if (!target) return;
  if (target.dataset.save) {
    const listingId = Number(target.dataset.save);
    state.saved.has(listingId) ? state.saved.delete(listingId) : state.saved.add(listingId);
    try { window.localStorage.setItem("room-to-rent-saved", JSON.stringify([...state.saved])); } catch {}
    render();
    toast(state.saved.has(listingId) ? "Room saved for later" : "Room removed from saved rooms");
  } else if (target.dataset.view) {
    navigate(target.dataset.view);
  } else if (target.dataset.filter) {
    state.filter = target.dataset.filter;
    render();
    document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
  } else if (target.dataset.action) {
    const action = target.dataset.action;
    if (action === "menu") { state.mobileOpen = !state.mobileOpen; render(); }
    else if (action === "browse" || action === "show-all") navigate("rooms");
    else if (action === "enquire") toast("Log in or create an account to message this landlord.");
    else if (action === "new-listing") toast("Sign in to start a new property listing.");
    else if (action === "messages") toast("Your latest messages are shown in recent activity.");
    else if (action === "settings") toast("Account settings are coming soon.");
    else if (action === "dashboard-listings") toast("Your saved rooms or active listings are shown in the overview.");
    else if (action === "forgot") toast("Password recovery is not connected in this prototype.");
  }
});

app.addEventListener("submit", event => {
  if (event.target.id === "search-form") {
    event.preventDefault();
    const data = new FormData(event.target);
    const params = new URLSearchParams();
    const city = String(data.get("where") || "").trim();
    const type = String(data.get("type") || "Any room");
    const budget = String(data.get("budget") || "Any budget");
    if (city) params.set("where", city);
    if (type !== "Any room") params.set("type", type);
    if (budget !== "Any budget") params.set("budget", budget);
    window.location.href = `${routes.rooms}${params.size ? `?${params}` : ""}`;
  } else if (event.target.id === "auth-form") {
    event.preventDefault();
    const nextPage = state.view === "register" && document.querySelector("#account-type")?.value === "Landlord" ? "landlord" : "tenant";
    toast(state.view === "register" ? "Account details received. Welcome to Room to Rent!" : "You're signed in. Welcome back!");
    window.setTimeout(() => navigate(nextPage), 900);
  }
});

render();