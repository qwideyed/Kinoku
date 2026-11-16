const STORAGE_KEY = "kinoku_listings_v1";

const DEFAULT_LISTINGS = [
  {
    id: "p1",
    type: "pitch",
    author: "@DevonTechLab",
    category: "Tech & Gaming",
    timeline: "Uploading in 9 days",
    title: "Building a Silent Mini-ITX Gaming PC Under $850",
    details:
      "Full parts breakdown, thermal benchmarks, and cable management guide. Looking for a 45-second mid-roll sponsor (VPN, desk gear, or PC utility software). Previous hardware builds average 65K views.",
    amount: 500
  },
  {
    id: "p2",
    type: "pitch",
    author: "@MayaDailyStudy",
    category: "Education",
    timeline: "Uploading in 5 days",
    title: "How I Organize My Entire College Semester in One Weekend",
    details:
      "Walkthrough of my note-taking workflow, study timers, and weekly reset routine. Ideal fit for productivity apps, digital planners, or focus drinks. Audience is 78% college students.",
    amount: 320
  },
  {
    id: "p3",
    type: "pitch",
    author: "@CityBiteVlogs",
    category: "Lifestyle & Vlog",
    timeline: "Uploading in 14 days",
    title: "24 Hours Eating Only Hidden Spot Food in NYC",
    details:
      "Fast-paced street food tour across 5 neighborhoods. Open to a 30-second integrated shoutout for a travel card, delivery app, or mobile carrier.",
    amount: 400
  },
  {
    id: "c1",
    type: "campaign",
    author: "KeyPulse Gear",
    category: "Tech & Gaming",
    timeline: "Flexible (next 30 days)",
    title: "Sponsor Our Wireless Low-Profile Mechanical Keyboard",
    details:
      "We ship you a free review unit plus flat sponsorship payout. Looking for tech, coding, or gaming creators making setup tours, desk upgrades, or workflow videos.",
    amount: 600
  },
  {
    id: "c2",
    type: "campaign",
    author: "VaultNote App",
    category: "Finance & Business",
    timeline: "Within 2 weeks",
    title: "30-Second Mid-Roll for Personal Expense Tracker",
    details:
      "Seeking creators talking about budgeting, side hustles, freelancing, or college money tips. Show a quick screen recording of our receipt scanner in action.",
    amount: 350
  },
  {
    id: "c3",
    type: "campaign",
    author: "Kanso Brew",
    category: "Entertainment",
    timeline: "Next 21 days",
    title: "Creator Integration for Cold Brew Concentrate",
    details:
      "Fun, casual 30-second intro or mid-roll integration for commentary, gaming, or day-in-the-life creators. Full creative freedom on how you pitch it.",
    amount: 280
  }
];

let state = {
  role: "creator",
  board: "campaign",
  category: "All",
  search: "",
  postType: "pitch",
  listings: []
};

function loadListings() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      state.listings = JSON.parse(saved);
      return;
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  state.listings = [...DEFAULT_LISTINGS];
  saveListings();
}

function saveListings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.listings));
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function updateRoleUI() {
  const isCreator = state.role === "creator";

  document.getElementById("roleCreatorBtn").classList.toggle("active", isCreator);
  document.getElementById("roleCompanyBtn").classList.toggle("active", !isCreator);

  const heroBadge = document.getElementById("heroBadge");
  const heroTitle = document.getElementById("heroTitle");
  const heroSubtitle = document.getElementById("heroSubtitle");
  const primaryCreateBtn = document.getElementById("primaryCreateBtn");

  if (isCreator) {
    heroBadge.textContent = "Creator Mode • Keep 100% of your rate";
    heroTitle.textContent = "Find brands ready to sponsor your next video.";
    heroSubtitle.textContent =
      "Browse active product campaigns from companies looking for creators, or pitch the exact video you are working on right now.";
    primaryCreateBtn.textContent = "+ Pitch Upcoming Video";
  } else {
    heroBadge.textContent = "Company Mode • Zero-risk escrow protection";
    heroTitle.textContent = "Sponsor upcoming videos before they drop.";
    heroSubtitle.textContent =
      "See the exact video concepts creators are filming right now, lock in a Safe Deal, and only release funds once the video goes live.";
    primaryCreateBtn.textContent = "+ Post Product Campaign";
  }
}

function updateBoardTabs() {
  const pitchCount = state.listings.filter((item) => item.type === "pitch").length;
  const campaignCount = state.listings.filter((item) => item.type === "campaign").length;

  document.getElementById("pitchCount").textContent = pitchCount;
  document.getElementById("campaignCount").textContent = campaignCount;

  document.getElementById("tabPitches").classList.toggle("active", state.board === "pitch");
  document.getElementById("tabCampaigns").classList.toggle("active", state.board === "campaign");
}

function renderFeed() {
  updateBoardTabs();

  const feedGrid = document.getElementById("feedGrid");
  const emptyState = document.getElementById("emptyState");
  const query = state.search.trim().toLowerCase();

  const filtered = state.listings.filter((item) => {
    const matchesBoard = item.type === state.board;
    const matchesCat = state.category === "All" || item.category === state.category;
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.details.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);
    return matchesBoard && matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    feedGrid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  feedGrid.innerHTML = filtered
    .map((item) => {
      const isPitch = item.type === "pitch";
      const badgeClass = isPitch ? "badge-pitch" : "badge-campaign";
      const badgeText = isPitch ? "Video Pitch" : "Sponsor Campaign";
      const priceLabel = isPitch ? "Creator Rate" : "Campaign Budget";
      const actionLabel = isPitch ? "Inspect & Sponsor" : "Inspect & Pitch";

      return `
        <article class="card">
          <div>
            <div class="card-top">
              <span class="badge-type ${badgeClass}">${badgeText}</span>
              <span class="badge-cat">${escapeHTML(item.category)}</span>
            </div>
            <h3 class="card-title">${escapeHTML(item.title)}</h3>
            <p class="card-desc">${escapeHTML(item.details)}</p>
          </div>

          <div>
            <div class="card-meta">
              <span class="card-author">${escapeHTML(item.author)}</span>
              <span>${escapeHTML(item.timeline)}</span>
            </div>
            <div class="card-footer" style="margin-top: 12px;">
              <div class="price-box">
                <span class="price-label">${priceLabel}</span>
                <span class="price-value">$${Number(item.amount).toLocaleString()}</span>
              </div>
              <button class="btn btn-secondary" data-inspect-id="${escapeHTML(item.id)}">${actionLabel}</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function setPostTypeForm(type) {
  state.postType = type;
  const isPitch = type === "pitch";

  document.getElementById("postTypePitch").classList.toggle("active", isPitch);
  document.getElementById("postTypeCompany").classList.toggle("active", !isPitch);

  document.getElementById("authorLabel").textContent = isPitch
    ? "Creator Name / Channel Handle"
    : "Company / Brand Name";
  document.getElementById("inputAuthor").placeholder = isPitch ? "e.g., @AlexBuilds" : "e.g., NovaVPN";

  document.getElementById("titleLabel").textContent = isPitch
    ? "Working Video Title"
    : "Campaign Headline";
  document.getElementById("inputTitle").placeholder = isPitch
    ? "e.g., Testing 5 Budget Gadgets Under $50"
    : "e.g., Looking for Tech Creators for App Launch";

  document.getElementById("detailsLabel").textContent = isPitch
    ? "Video Concept & Sponsor Integration Idea"
    : "Product Details & Ideal Creator";

  document.getElementById("amountLabel").textContent = isPitch
    ? "Asking Sponsorship Rate ($ USD)"
    : "Campaign Budget ($ USD)";
}

function openCreateModal(defaultType) {
  setPostTypeForm(defaultType);
  document.getElementById("createModal").classList.remove("hidden");
}

function closeCreateModal() {
  document.getElementById("createModal").classList.add("hidden");
  document.getElementById("createForm").reset();
}

function openPreviewModal(id) {
  const item = state.listings.find((entry) => entry.id === id);
  if (!item) return;

  const rate = Number(item.amount);
  const fee = Math.round(rate * 0.05 * 100) / 100;
  const totalEscrow = rate + fee;

  document.getElementById("previewModalTitle").textContent = item.title;
  document.getElementById("previewContent").innerHTML = `
    <p style="color: var(--muted); font-size: 0.85rem; margin-bottom: 10px;">
      Posted by <strong style="color: var(--text);">${escapeHTML(item.author)}</strong> • ${escapeHTML(item.category)} • ${escapeHTML(item.timeline)}
    </p>
    <p style="font-size: 0.92rem; margin-bottom: 14px;">${escapeHTML(item.details)}</p>

    <div class="preview-box">
      <div style="font-weight: 700; margin-bottom: 8px; font-size: 0.85rem; color: #a5b4fc;">
        Safe Deal Escrow Breakdown
      </div>
      <div class="fee-row">
        <span>Creator Payout (100% kept by creator)</span>
        <span>$${rate.toFixed(2)}</span>
      </div>
      <div class="fee-row">
        <span>Kinoku Safe Deal Protection Fee (5%)</span>
        <span>$${fee.toFixed(2)}</span>
      </div>
      <div class="fee-row">
        <span>Total Company Escrow Lock (Refunded in full if missed)</span>
        <span>$${totalEscrow.toFixed(2)}</span>
      </div>
    </div>

    <p style="font-size: 0.8rem; color: var(--muted);">
      Next layers will add the creator's past completed videos showcase and live Deal Chat + Escrow Lock button right inside this drawer.
    </p>
  `;

  document.getElementById("previewModal").classList.remove("hidden");
}

function initEvents() {
  document.getElementById("roleCreatorBtn").addEventListener("click", () => {
    state.role = "creator";
    state.board = "campaign";
    updateRoleUI();
    renderFeed();
  });

  document.getElementById("roleCompanyBtn").addEventListener("click", () => {
    state.role = "company";
    state.board = "pitch";
    updateRoleUI();
    renderFeed();
  });

  document.getElementById("tabPitches").addEventListener("click", () => {
    state.board = "pitch";
    renderFeed();
  });

  document.getElementById("tabCampaigns").addEventListener("click", () => {
    state.board = "campaign";
    renderFeed();
  });

  document.getElementById("searchInput").addEventListener("input", (e) => {
    state.search = e.target.value;
    renderFeed();
  });

  document.getElementById("categoryFilters").addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-pill");
    if (!btn) return;
    document.querySelectorAll(".cat-pill").forEach((pill) => pill.classList.remove("active"));
    btn.classList.add("active");
    state.category = btn.dataset.category;
    renderFeed();
  });

  document.getElementById("primaryCreateBtn").addEventListener("click", () => {
    openCreateModal(state.role === "creator" ? "pitch" : "campaign");
  });

  document.getElementById("postTypePitch").addEventListener("click", () => setPostTypeForm("pitch"));
  document.getElementById("postTypeCompany").addEventListener("click", () => setPostTypeForm("campaign"));
  document.getElementById("closeCreateModal").addEventListener("click", closeCreateModal);

  document.getElementById("createModal").addEventListener("click", (e) => {
    if (e.target.id === "createModal") closeCreateModal();
  });

  document.getElementById("createForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const newListing = {
      id: "item_" + Date.now(),
      type: state.postType,
      author: document.getElementById("inputAuthor").value.trim(),
      category: document.getElementById("inputCategory").value,
      timeline: document.getElementById("inputTimeline").value.trim(),
      title: document.getElementById("inputTitle").value.trim(),
      details: document.getElementById("inputDetails").value.trim(),
      amount: Number(document.getElementById("inputAmount").value)
    };

    state.listings.unshift(newListing);
    saveListings();
    state.board = newListing.type;
    closeCreateModal();
    renderFeed();
  });

  document.getElementById("feedGrid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-inspect-id]");
    if (btn) openPreviewModal(btn.dataset.inspectId);
  });

  document.getElementById("closePreviewModal").addEventListener("click", () => {
    document.getElementById("previewModal").classList.add("hidden");
  });

  document.getElementById("previewModal").addEventListener("click", (e) => {
    if (e.target.id === "previewModal") {
      document.getElementById("previewModal").classList.add("hidden");
    }
  });

  document.getElementById("resetDemoBtn").addEventListener("click", () => {
    state.listings = [...DEFAULT_LISTINGS];
    saveListings();
    renderFeed();
  });
}

loadListings();
updateRoleUI();
renderFeed();
initEvents();
