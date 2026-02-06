const defaultWords = [
  "Космос",
  "Путешествие",
  "Звезда",
  "Микрофон",
  "Кинотеатр",
  "Самокат",
  "Витамины",
  "Кофеварка",
  "Сюрприз",
  "Календарь",
  "Пингвин",
  "Гитара",
  "Фейерверк",
  "Экспедиция",
  "Фонарь",
  "Арбуз",
  "Робот",
  "Подкаст",
  "Пикник",
  "Библиотека"
];

const builtInSectionDecks = typeof SECTION_DICTIONARIES !== "undefined"
  ? SECTION_DICTIONARIES
  : [];

const defaultDecks = [
  { name: "Базовый", words: [...defaultWords] },
  ...builtInSectionDecks.map((section) => ({
    name: `Раздел: ${section.name}`,
    words: [...section.words],
    builtIn: true,
    sectionId: section.id
  }))
];

const state = {
  teams: [
    { id: crypto.randomUUID(), name: "Команда А", color: "#6d5efc", score: 0 },
    { id: crypto.randomUUID(), name: "Команда Б", color: "#4bd2c8", score: 0 }
  ],
  roundTime: 60,
  targetScore: 30,
  pointsCorrect: 1,
  pointsSkip: 0,
  round: 1,
  teamIndex: 0,
  timer: 60,
  timerId: null,
  isRunning: false,
  words: [...defaultWords],
  usedWords: [],
  history: [],
  decks: [...defaultDecks],
  selectedSections: []
};

const elements = {
  startGame: document.getElementById("startGame"),
  resetGame: document.getElementById("resetGame"),
  skipWord: document.getElementById("skipWord"),
  correctWord: document.getElementById("correctWord"),
  pauseRound: document.getElementById("pauseRound"),
  nextRound: document.getElementById("nextRound"),
  currentWord: document.getElementById("currentWord"),
  timerValue: document.getElementById("timerValue"),
  timerDisplay: document.getElementById("timerDisplay"),
  timerRing: document.getElementById("timerRing"),
  roundDisplay: document.getElementById("roundDisplay"),
  teamDisplay: document.getElementById("teamDisplay"),
  scoreDisplay: document.getElementById("scoreDisplay"),
  teams: document.getElementById("teams"),
  teamName: document.getElementById("teamName"),
  teamColor: document.getElementById("teamColor"),
  addTeam: document.getElementById("addTeam"),
  roundTime: document.getElementById("roundTime"),
  targetScore: document.getElementById("targetScore"),
  pointsCorrect: document.getElementById("pointsCorrect"),
  pointsSkip: document.getElementById("pointsSkip"),
  wordInput: document.getElementById("wordInput"),
  deckName: document.getElementById("deckName"),
  saveDeck: document.getElementById("saveDeck"),
  deckSelect: document.getElementById("deckSelect"),
  deleteDeck: document.getElementById("deleteDeck"),
  sectionList: document.getElementById("sectionList"),
  mixSections: document.getElementById("mixSections"),
  shuffleWords: document.getElementById("shuffleWords"),
  saveSettings: document.getElementById("saveSettings"),
  roundHistory: document.getElementById("roundHistory")
};

const saveState = () => {
  localStorage.setItem("aliasState", JSON.stringify({
    teams: state.teams,
    roundTime: state.roundTime,
    targetScore: state.targetScore,
    pointsCorrect: state.pointsCorrect,
    pointsSkip: state.pointsSkip,
    round: state.round,
    teamIndex: state.teamIndex,
    words: state.words,
    usedWords: state.usedWords,
    history: state.history,
    decks: state.decks,
    selectedSections: state.selectedSections
  }));
};

const loadState = () => {
  const stored = localStorage.getItem("aliasState");
  if (!stored) return;
  try {
    const data = JSON.parse(stored);
    state.teams = data.teams || state.teams;
    state.roundTime = data.roundTime ?? state.roundTime;
    state.targetScore = data.targetScore ?? state.targetScore;
    state.pointsCorrect = data.pointsCorrect ?? state.pointsCorrect;
    state.pointsSkip = data.pointsSkip ?? state.pointsSkip;
    state.round = data.round ?? state.round;
    state.teamIndex = data.teamIndex ?? state.teamIndex;
    state.words = data.words?.length ? data.words : [...defaultWords];
    state.usedWords = data.usedWords || [];
    state.history = data.history || [];
    state.decks = data.decks?.length ? data.decks : [...defaultDecks];
    state.selectedSections = data.selectedSections || [];
    state.timer = state.roundTime;
  } catch (error) {
    console.error(error);
  }
};

const shuffle = (items) => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getNextWord = () => {
  if (!state.words.length) {
    state.words = shuffle([...state.usedWords]);
    state.usedWords = [];
  }
  const next = state.words.shift();
  state.usedWords.push(next);
  return next;
};

const updateHero = () => {
  elements.roundDisplay.textContent = state.round;
  elements.teamDisplay.textContent = state.teams[state.teamIndex]?.name ?? "—";
  const scores = state.teams.map((team) => team.score).join(" : ");
  elements.scoreDisplay.textContent = scores || "0 : 0";
};

const updateTimer = () => {
  elements.timerValue.textContent = state.timer;
  elements.timerDisplay.textContent = state.timer;
  const progress = (state.timer / state.roundTime) * 100;
  elements.timerRing.style.background =
    `conic-gradient(#6d5efc ${progress}%, #f8f7ff ${progress}% 100%)`;
};

const renderTeams = () => {
  elements.teams.innerHTML = "";
  state.teams.forEach((team, index) => {
    const container = document.createElement("div");
    container.className = "team";
    container.style.borderColor =
      index === state.teamIndex ? team.color : "transparent";
    container.innerHTML = `
      <div class="team-name">
        <span class="team-color" style="--team-color:${team.color}"></span>
        ${team.name}
      </div>
      <div class="team-actions">
        <span>${team.score} очков</span>
        <button class="ghost" data-action="minus" data-id="${team.id}">-1</button>
        <button class="ghost" data-action="plus" data-id="${team.id}">+1</button>
      </div>
    `;
    elements.teams.appendChild(container);
  });
};

const renderHistory = () => {
  elements.roundHistory.innerHTML = "";
  if (!state.history.length) {
    elements.roundHistory.innerHTML =
      "<li>История пока пуста — начни раунд.</li>";
    return;
  }
  state.history.slice(-6).reverse().forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    elements.roundHistory.appendChild(li);
  });
};

const renderDecks = () => {
  elements.deckSelect.innerHTML = "";
  state.decks.forEach((deck, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${deck.name} (${deck.words.length})`;
    elements.deckSelect.appendChild(option);
  });
};

const renderSections = () => {
  if (!elements.sectionList) return;
  elements.sectionList.innerHTML = "";
  builtInSectionDecks.forEach((section) => {
    const id = `section-${section.id}`;
    const wrapper = document.createElement("label");
    wrapper.className = "section-item";
    wrapper.innerHTML = `
      <input type="checkbox" value="${section.id}" ${state.selectedSections.includes(section.id) ? "checked" : ""}/>
      <span>${section.name} (1000)</span>
    `;
    const input = wrapper.querySelector("input");
    input.id = id;
    wrapper.htmlFor = id;
    elements.sectionList.appendChild(wrapper);
  });
};

const setControls = (isActive) => {
  elements.skipWord.disabled = !isActive;
  elements.correctWord.disabled = !isActive;
  elements.pauseRound.disabled = !state.isRunning;
  elements.nextRound.disabled = state.isRunning || !isActive;
};

const startTimer = () => {
  if (state.timerId) clearInterval(state.timerId);
  state.isRunning = true;
  elements.pauseRound.textContent = "Пауза";
  state.timerId = setInterval(() => {
    state.timer -= 1;
    updateTimer();
    if (state.timer <= 0) {
      endRound();
    }
  }, 1000);
  setControls(true);
};

const pauseTimer = () => {
  if (!state.timerId) return;
  clearInterval(state.timerId);
  state.timerId = null;
  state.isRunning = false;
  elements.pauseRound.textContent = "Продолжить";
  setControls(true);
};

const resetTimer = () => {
  state.timer = state.roundTime;
  updateTimer();
};

const endRound = () => {
  clearInterval(state.timerId);
  state.timerId = null;
  state.isRunning = false;
  const team = state.teams[state.teamIndex];
  state.history.push(
    `Раунд ${state.round}: ${team?.name ?? "Команда"} — ${team?.score ?? 0} очков`
  );
  elements.currentWord.textContent = "Раунд завершен";
  elements.pauseRound.textContent = "Пауза";
  setControls(true);
  saveState();
};

const startRound = () => {
  if (!state.teams.length) return;
  state.timer = state.roundTime;
  updateTimer();
  elements.currentWord.textContent = getNextWord();
  updateHero();
  startTimer();
};

const nextTurn = () => {
  state.round += 1;
  state.teamIndex = (state.teamIndex + 1) % state.teams.length;
  resetTimer();
  elements.currentWord.textContent = "Готовы? Нажмите «Начать игру»";
  updateHero();
  renderTeams();
  saveState();
};

const handleWordAction = (delta) => {
  const team = state.teams[state.teamIndex];
  if (!team) return;
  team.score = Math.max(0, team.score + delta);
  elements.currentWord.textContent = getNextWord();
  updateHero();
  renderTeams();
  if (team.score >= state.targetScore) {
    state.history.push(`Победа: ${team.name} набрала ${team.score} очков!`);
    renderHistory();
    pauseTimer();
  }
  saveState();
};

const syncSettings = () => {
  elements.roundTime.value = state.roundTime;
  elements.targetScore.value = state.targetScore;
  elements.pointsCorrect.value = state.pointsCorrect;
  elements.pointsSkip.value = state.pointsSkip;
  elements.wordInput.value = state.words.concat(state.usedWords).join("\n");
};

const saveSettings = () => {
  const roundTime = Number(elements.roundTime.value);
  const targetScore = Number(elements.targetScore.value);
  const pointsCorrect = Number(elements.pointsCorrect.value);
  const pointsSkip = Number(elements.pointsSkip.value);
  const words = elements.wordInput.value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  state.roundTime = Number.isNaN(roundTime) ? 60 : roundTime;
  state.targetScore = Number.isNaN(targetScore) ? 30 : targetScore;
  state.pointsCorrect = Number.isNaN(pointsCorrect) ? 1 : pointsCorrect;
  state.pointsSkip = Number.isNaN(pointsSkip) ? 0 : pointsSkip;
  state.words = words.length ? shuffle(words) : shuffle([...defaultWords]);
  state.usedWords = [];
  resetTimer();
  updateTimer();
  saveState();
};

const resetGame = () => {
  state.round = 1;
  state.teamIndex = 0;
  state.teams.forEach((team) => {
    team.score = 0;
  });
  state.history = [];
  resetTimer();
  updateHero();
  renderTeams();
  renderHistory();
  elements.currentWord.textContent = "Нажми «Начать игру»";
  saveState();
};

const saveDeck = () => {
  const name = elements.deckName.value.trim();
  if (!name) return;
  const words = elements.wordInput.value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  if (!words.length) return;
  const existing = state.decks.find((deck) => deck.name === name && !deck.builtIn);
  if (existing) {
    existing.words = words;
  } else {
    state.decks.push({ name, words });
  }
  elements.deckName.value = "";
  renderDecks();
  saveState();
};

const loadDeck = (index) => {
  const deck = state.decks[index];
  if (!deck) return;
  state.words = shuffle(deck.words);
  state.usedWords = [];
  elements.wordInput.value = deck.words.join("\n");
  saveState();
};

const deleteDeck = () => {
  const index = Number(elements.deckSelect.value);
  if (Number.isNaN(index)) return;
  if (state.decks[index]?.builtIn) return;
  state.decks.splice(index, 1);
  if (!state.decks.length) {
    state.decks = [...defaultDecks];
  }
  renderDecks();
  saveState();
};

const addTeam = () => {
  const name = elements.teamName.value.trim();
  if (!name) return;
  state.teams.push({
    id: crypto.randomUUID(),
    name,
    color: elements.teamColor.value,
    score: 0
  });
  elements.teamName.value = "";
  renderTeams();
  updateHero();
  saveState();
};

const updateScore = (id, delta) => {
  const team = state.teams.find((item) => item.id === id);
  if (!team) return;
  team.score = Math.max(0, team.score + delta);
  updateHero();
  renderTeams();
  saveState();
};

const registerEvents = () => {
  elements.startGame.addEventListener("click", () => {
    if (state.isRunning) return;
    if (state.timer <= 0) resetTimer();
    startRound();
  });

  elements.resetGame.addEventListener("click", resetGame);

  elements.pauseRound.addEventListener("click", () => {
    if (state.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  elements.nextRound.addEventListener("click", nextTurn);

  elements.skipWord.addEventListener("click", () =>
    handleWordAction(state.pointsSkip)
  );
  elements.correctWord.addEventListener("click", () =>
    handleWordAction(state.pointsCorrect)
  );

  elements.addTeam.addEventListener("click", addTeam);

  elements.teams.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const id = target.dataset.id;
    const action = target.dataset.action;
    if (!id || !action) return;
    if (action === "minus") updateScore(id, -1);
    if (action === "plus") updateScore(id, 1);
  });

  elements.shuffleWords.addEventListener("click", () => {
    state.words = shuffle(state.words.concat(state.usedWords));
    state.usedWords = [];
    elements.wordInput.value = state.words.join("\n");
    saveState();
  });

  elements.saveDeck.addEventListener("click", saveDeck);
  elements.deckSelect.addEventListener("change", (event) => {
    loadDeck(Number(event.target.value));
  });
  elements.deleteDeck.addEventListener("click", deleteDeck);

  elements.sectionList.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.checked) {
      state.selectedSections = [...new Set([...state.selectedSections, target.value])];
    } else {
      state.selectedSections = state.selectedSections.filter((item) => item !== target.value);
    }
    saveState();
  });

  elements.mixSections.addEventListener("click", () => {
    const selected = builtInSectionDecks.filter((section) =>
      state.selectedSections.includes(section.id)
    );
    if (!selected.length) return;
    const words = selected.flatMap((section) => section.words);
    state.words = shuffle(words);
    state.usedWords = [];
    elements.wordInput.value = words.join("\n");
    saveState();
  });

  elements.saveSettings.addEventListener("click", () => {
    saveSettings();
  });
};

const init = () => {
  loadState();
  updateHero();
  updateTimer();
  renderTeams();
  renderHistory();
  renderDecks();
  renderSections();
  syncSettings();
  setControls(false);
  registerEvents();
};

init();
