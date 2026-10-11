const TOTAL_VOTES = 9;
const STORAGE_KEY = "buRevisionVotes";

const defaultVotes = {
  saint: 0,
  luminy: 0,
  total: 0,
};

let votes = loadVotes();

const voteButtons = document.querySelectorAll(".vote-button");
const voteCount = document.getElementById("voteCount");
const voteStatus = document.getElementById("voteStatus");
const resultBox = document.getElementById("resultBox");
const resultSummary = document.getElementById("resultSummary");
const saintBar = document.getElementById("saintBar");
const luminyBar = document.getElementById("luminyBar");
const saintPercent = document.getElementById("saintPercent");
const luminyPercent = document.getElementById("luminyPercent");
const resetButton = document.getElementById("resetButton");

function loadVotes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { ...defaultVotes };

  try {
    const parsed = JSON.parse(raw);
    return {
      saint: Number(parsed.saint) || 0,
      luminy: Number(parsed.luminy) || 0,
      total: Number(parsed.total) || 0,
    };
  } catch {
    return { ...defaultVotes };
  }
}

function saveVotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
}

function getWinner() {
  if (votes.saint === votes.luminy) {
    return "Égalité parfaite 🩷";
  }

  return votes.saint > votes.luminy ? "BU saint charles a gagné ✨" : "BU luminy a gagné 💖";
}

function updateUI() {
  const saintPercentValue = votes.total === 0 ? 0 : (votes.saint / votes.total) * 100;
  const luminyPercentValue = votes.total === 0 ? 0 : (votes.luminy / votes.total) * 100;

  voteCount.textContent = `${votes.total} / ${TOTAL_VOTES}`;

  if (votes.total < TOTAL_VOTES) {
    const remaining = TOTAL_VOTES - votes.total;
    voteStatus.textContent = remaining === 1 ? "il reste 1 vote" : `il reste ${remaining} votes`;
    resultBox.classList.add("hidden");
  } else {
    voteStatus.textContent = "tout le monde a voté";
    resultBox.classList.remove("hidden");
    resultSummary.textContent = getWinner();
    saintPercent.textContent = `${Math.round(saintPercentValue)}%`;
    luminyPercent.textContent = `${Math.round(luminyPercentValue)}%`;
    saintBar.style.width = `${saintPercentValue}%`;
    luminyBar.style.width = `${luminyPercentValue}%`;
  }

  voteButtons.forEach((button) => {
    button.disabled = votes.total >= TOTAL_VOTES;
  });
}

voteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (votes.total >= TOTAL_VOTES) {
      return;
    }

    const choice = button.dataset.choice;

    if (choice === "saint") {
      votes.saint += 1;
    } else if (choice === "luminy") {
      votes.luminy += 1;
    }

    votes.total += 1;
    saveVotes();
    updateUI();
  });
});

resetButton.addEventListener("click", () => {
  votes = { ...defaultVotes };
  saveVotes();
  updateUI();
  resultSummary.textContent = "Le gagnant apparaît ici";
  saintPercent.textContent = "0%";
  luminyPercent.textContent = "0%";
  saintBar.style.width = "0%";
  luminyBar.style.width = "0%";
});

updateUI();
