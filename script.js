const STORAGE_KEYS = {
  user: "voxUser",
  settings: "voxSettings",
  coins: "voxCoins",
  stories: "voxStories",
  customChats: "voxCustomChats",
  friends: "voxFriends",
  quests: "voxQuests",
  chestHistory: "voxChestHistory",
  supportRequests: "voxSupportRequests"
};

const state = {
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || "null"),
  settings: JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || "{}"),
  coins: Number(localStorage.getItem(STORAGE_KEYS.coins) || 0),
  stories: JSON.parse(localStorage.getItem(STORAGE_KEYS.stories) || "[]"),
  customChats: JSON.parse(localStorage.getItem(STORAGE_KEYS.customChats) || "[]"),
  friends: JSON.parse(localStorage.getItem(STORAGE_KEYS.friends) || "[]"),
  quests: JSON.parse(localStorage.getItem(STORAGE_KEYS.quests) || "{}"),
  questActivity: JSON.parse(localStorage.getItem("voxQuestActivity") || "{}"),
  chatMessages: JSON.parse(localStorage.getItem("voxChatMessages") || "{}"),
  chestHistory: JSON.parse(localStorage.getItem(STORAGE_KEYS.chestHistory) || "[]")
};

const defaultUser = {
  name: "Пользователь",
  username: "@username",
  password: "",
  age: "teen"
};

const ageLabels = {
  child: "Ребёнок",
  teen: "Подросток",
  adult: "Взрослый"
};

const ageHintMap = {
  child: "⚡ Для тебя больше ярких и дружелюбных подсказок!",
  teen: "⚡ Выполняй квесты и улучшай маскота!",
  adult: "⚡ Взрослый режим — комфортный и спокойный интерфейс."
};

const mascots = {
  robot: {
    name: "Робот",
    image: "images/mascot-robot.png",
    description: "Умный и надёжный помощник. Всегда рядом, чтобы помочь!",
    tagline: "Вместе мы сильнее!",
    style: "Худи с синими деталями, наушники и кроссовки",
    palette: ["#71d8ff", "#4688ed", "#17152c", "#f7f3ff"]
  },
  wolf: {
    name: "Волк",
    image: "images/mascot-wolf.png",
    description: "Спокойный и решительный. Идёт к цели без лишних слов.",
    tagline: "Действуй!",
    style: "Худи, карго-штаны и кроссовки",
    palette: ["#938aa5", "#5a526d", "#211a35", "#f6f1ff"]
  },
  fox: {
    name: "Лиса",
    image: "images/mascot-fox.png",
    description: "Хитрая и смелая. Всегда найдёт выход из любой ситуации.",
    tagline: "Думай смело!",
    style: "Худи с принтом лисы, карго-штаны и кроссовки",
    palette: ["#f58157", "#ffae6d", "#211a35", "#fff3f4"]
  },
  rabbit: {
    name: "Заяц",
    image: "images/mascot-rabbit.png",
    description: "Весёлый и энергичный. Дарит хорошее настроение!",
    tagline: "Улыбайся!",
    style: "Худи, наушники, карго-штаны и кроссовки",
    palette: ["#b66aff", "#7d4ccc", "#211a35", "#fff3ff"]
  }
};

const defaultChatMessages = {
  alex: [
    { sender: "incoming", text: "Привет! Добро пожаловать в Vox 👋" },
    { sender: "incoming", text: "Уже выбрал своего маскота?" }
  ],
  mira: [{ sender: "incoming", text: "Классная история! Что ещё интересного расскажешь?" }],
  team: [{ sender: "incoming", text: "Добро пожаловать в команду Vox! 🌟" }],
  "mascot-robot": [{ sender: "incoming", text: "Привет! Все системы на связи ⚡ О чём поболтаем?" }],
  "mascot-wolf": [{ sender: "incoming", text: "Привет. Я рядом. Какая цель у нас сегодня?" }],
  "mascot-fox": [{ sender: "incoming", text: "О, ты заглянул! У меня уже есть пара хитрых идей 😉" }],
  "mascot-rabbit": [{ sender: "incoming", text: "Приве-е-ет! Я готов болтать, шутить и покорять день! 🐰" }]
};

const clothingColors = [
  { name: "Фиолетовый", value: "#8755ff" },
  { name: "Голубой", value: "#46c7f5" },
  { name: "Розовый", value: "#f16ca8" },
  { name: "Оранжевый", value: "#ff914d" },
  { name: "Зелёный", value: "#46c99a" },
  { name: "Чёрный", value: "#252338" }
];

const questDefinitions = [
  {
    id: "message",
    icon: "💬",
    title: "Первое сообщение",
    description: "Отправь любое сообщение в демо-чате. Разминаем пальцы, а не только кнопку!",
    reward: 50,
    goal: 1,
    progress: () => state.questActivity.messageCount || 0
  },
  {
    id: "story",
    icon: "📸",
    title: "Создатель историй",
    description: "Опубликуй историю с фото или текстом — пусть лента узнает твой вайб.",
    reward: 30,
    goal: 1,
    progress: () => (state.questActivity.storyCreated || state.stories.length > 0 ? 1 : 0)
  },
  {
    id: "mascot",
    icon: "🦊",
    title: "Новый образ",
    description: "Смени маскота на другого героя и выбери, кто сегодня в твоей команде.",
    reward: 20,
    goal: 1,
    progress: () => (state.questActivity.mascotChanged ? 1 : 0)
  },
  {
    id: "coop",
    icon: "🤝",
    title: "Связь с командой",
    description: "Добавь друга, а потом отправь привет в чат «Команда Vox». В демо это локальный челлендж.",
    reward: 40,
    goal: 2,
    progress: () => (state.questActivity.friendAdded ? 1 : 0) +
      (state.questActivity.friendAdded && state.questActivity.teamGreeting ? 1 : 0)
  },
  {
    id: "chatTrio",
    icon: "🗯️",
    title: "Три реплики до GG",
    description: "Отправь три сообщения в чат — разгони диалог до мини-комбо.",
    reward: 30,
    goal: 3,
    progress: () => state.questActivity.messageCount || 0
  },
  {
    id: "emojiCombo",
    icon: "🤣",
    title: "Эмодзи-комбо",
    description: "Собери в одном сообщении минимум три эмодзи. Слова сегодня на перезарядке.",
    reward: 25,
    goal: 1,
    progress: () => (state.questActivity.emojiCombo ? 1 : 0)
  },
  {
    id: "friendLink",
    icon: "🫂",
    title: "Свой в лобби",
    description: "Добавь друга в разделе «Друзья» — даже легендам нужна пати.",
    reward: 30,
    goal: 1,
    progress: () => (state.questActivity.friendAdded ? 1 : 0)
  },
  {
    id: "photoStory",
    icon: "🌆",
    title: "Обложка сезона",
    description: "Опубликуй историю с фотографией и подписью. Скрин заката тоже считается за арт.",
    reward: 35,
    goal: 1,
    progress: () => (state.questActivity.photoCaptionStory ? 1 : 0)
  },
  {
    id: "mascotColor",
    icon: "🎨",
    title: "Кутюрье Vox",
    description: "Поменяй цвет одежды любого маскота в разделе «Маскот». Фэшн-босс, выходи!",
    reward: 35,
    goal: 1,
    progress: () => ((state.questActivity.coloredMascots || []).length > 0 ? 1 : 0)
  },
  {
    id: "mascotTour",
    icon: "🧭",
    title: "Тур по зверобазе",
    description: "Переключись между всеми четырьмя маскотами и познакомься с отрядом целиком.",
    reward: 40,
    goal: 4,
    progress: () => (state.questActivity.visitedMascots || []).length
  },
  {
    id: "secretTap",
    icon: "🕵️",
    title: "Секретный сигнал",
    description: "Найди пасхалку: пять раз быстро нажми на логотип Vox в боковом меню.",
    reward: 50,
    goal: 1,
    progress: () => (state.questActivity.secretFound ? 1 : 0)
  },
  {
    id: "nightOwl",
    icon: "🌙",
    title: "Ночной дозор",
    description: "С 20:00 до 05:59 по местному времени отправь сообщение или опубликуй историю.",
    reward: 40,
    goal: 1,
    progress: () => (state.questActivity.nightActivity ? 1 : 0)
  },
  {
    id: "chatTour",
    icon: "🛰️",
    title: "Телепорт по чатам",
    description: "Отправь сообщения двум разным собеседникам — мини-экспедиция по лобби!",
    reward: 35,
    goal: 2,
    progress: () => Object.keys(state.questActivity.chatMessagesByPeer || {}).length
  },
  {
    id: "storyArc",
    icon: "✍️",
    title: "Лор-мастер",
    description: "Опубликуй историю с подписью от 60 символов. Пиши сюжетный поворот — мы верим.",
    reward: 35,
    goal: 1,
    progress: () => (state.questActivity.longStory ? 1 : 0)
  }
];

const mascotImageCache = new Map();
let mascotColorUpdateId = 0;
let secretLogoTaps = [];
let activeChatId = "alex";
let chestOpeningInProgress = false;
let activeChestButton = null;
let chestAudioContext;

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function setTheme(theme) {
  document.body.dataset.theme = theme || "dark";
  const toggleBtn = document.getElementById("toggle-theme-btn");
  if (toggleBtn) {
    toggleBtn.textContent = theme === "dark" ? "☀️ Светлая тема" : "🌙 Тёмная тема";
  }
  const settingsBtn = document.getElementById("settings-theme-btn");
  if (settingsBtn) {
    settingsBtn.textContent = theme === "dark" ? "Сменить тему" : "Сменить тему";
  }
  state.settings.theme = theme;
  saveJson(STORAGE_KEYS.settings, state.settings);
}

function setStyle(value) {
  document.body.dataset.style = value || "modern";
  state.settings.style = value;
  saveJson(STORAGE_KEYS.settings, state.settings);
}

function setAge(age) {
  const safeAge = age || "teen";
  document.body.dataset.ageGroup = safeAge;
  state.settings.age = safeAge;
  saveJson(STORAGE_KEYS.settings, state.settings);

  const hint = document.getElementById("age-hint-banner");
  if (hint) {
    hint.innerHTML = `<span>${ageHintMap[safeAge] || ageHintMap.teen}</span>`;
  }

  const badge = document.getElementById("display-age-badge");
  if (badge) {
    badge.textContent = ageLabels[safeAge] || "Подросток";
  }

  const chatAgeSelect = document.getElementById("chat-age-select");
  if (chatAgeSelect) chatAgeSelect.value = safeAge;

  const settingsAgeSelect = document.getElementById("settings-age-select");
  if (settingsAgeSelect) settingsAgeSelect.value = safeAge;
}

function renderCoins() {
  const coinBalance = document.getElementById("coin-balance");
  const chestBalance = document.getElementById("chest-coin-balance");
  if (coinBalance) coinBalance.textContent = String(state.coins);
  if (chestBalance) chestBalance.textContent = String(state.coins);
  localStorage.setItem(STORAGE_KEYS.coins, String(state.coins));
}

function addCoins(amount) {
  state.coins += Number(amount || 0);
  renderCoins();
}

function saveUser() {
  if (!state.user) return;
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(state.user));
}

function updateUserProfileUI() {
  const profile = state.user || defaultUser;
  const name = document.getElementById("display-name");
  const username = document.getElementById("display-username");
  const age = document.getElementById("display-age-badge");
  const avatar = document.getElementById("user-avatar");

  if (name) name.textContent = profile.name || defaultUser.name;
  if (username) username.textContent = profile.username || "@username";
  if (age) age.textContent = ageLabels[profile.age] || "Подросток";

  const savedAvatar = localStorage.getItem("voxAvatar");
  if (avatar) {
    avatar.src = savedAvatar || `https://placehold.co/120x120/302050/ffffff?text=${(profile.name || "V").charAt(0).toUpperCase()}`;
  }
}

function saveQuestActivity() {
  localStorage.setItem("voxQuestActivity", JSON.stringify(state.questActivity));
}

function countEmojis(text) {
  const emojiPattern = /\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?\p{Emoji_Modifier}?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?\p{Emoji_Modifier}?)*|\p{Regional_Indicator}{2}|[#*0-9]\uFE0F?\u20E3/gu;
  return [...text.matchAll(emojiPattern)].length;
}

function recordQuestAction(action, detail = {}) {
  const activity = state.questActivity;

  if (action === "message") {
    activity.messageCount = (activity.messageCount || 0) + 1;
    activity.chatMessagesByPeer = activity.chatMessagesByPeer || {};
    activity.chatMessagesByPeer[detail.peer] = (activity.chatMessagesByPeer[detail.peer] || 0) + 1;
    activity.emojiCombo = activity.emojiCombo || detail.emojiCount >= 3;
    activity.teamGreeting = activity.teamGreeting ||
      (activity.friendAdded && detail.peer === "Команда Vox");

    const hour = new Date().getHours();
    activity.nightActivity = activity.nightActivity || hour >= 20 || hour < 6;
  } else if (action === "friendAdded") {
    activity.friendAdded = true;
  } else if (action === "story") {
    activity.storyCreated = true;
    activity.photoCaptionStory = activity.photoCaptionStory || (detail.hasPhoto && detail.hasCaption);
    activity.longStory = activity.longStory || detail.captionLength >= 60;

    const hour = new Date().getHours();
    activity.nightActivity = activity.nightActivity || hour >= 20 || hour < 6;
  } else if (action === "mascot") {
    activity.mascotChanged = true;
    activity.visitedMascots = [...new Set([...(activity.visitedMascots || []), detail.mascot])];
  } else if (action === "mascotColor") {
    activity.coloredMascots = [...new Set([...(activity.coloredMascots || []), detail.mascot])];
  } else if (action === "secretFound") {
    activity.secretFound = true;
  }

  saveQuestActivity();
  renderQuestProgress();
}

function getQuestProgress(definition) {
  const value = Math.max(0, definition.progress());
  const current = state.quests[definition.id] ? definition.goal : Math.min(value, definition.goal);
  return {
    current,
    goal: definition.goal,
    percent: Math.round((current / definition.goal) * 100)
  };
}

function renderQuestProgress() {
  const container = document.getElementById("quest-list");
  if (!container) return;

  const cards = questDefinitions.map((definition) => {
    const progress = getQuestProgress(definition);
    const isDone = !!state.quests[definition.id];
    const isReady = progress.current >= progress.goal;

    const card = document.createElement("article");
    card.className = "quest-item panel";

    const symbol = document.createElement("div");
    symbol.className = "quest-symbol";
    symbol.textContent = definition.icon;

    const description = document.createElement("div");
    description.className = "quest-description";

    const title = document.createElement("h3");
    title.textContent = definition.title;
    const detail = document.createElement("p");
    detail.className = "muted";
    detail.textContent = definition.description;

    const track = document.createElement("div");
    track.className = "progress-track";
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", `Прогресс: ${definition.title}`);
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", String(definition.goal));
    track.setAttribute("aria-valuenow", String(progress.current));

    const bar = document.createElement("span");
    bar.style.width = `${progress.percent}%`;
    track.appendChild(bar);

    const progressLabel = document.createElement("small");
    progressLabel.className = "quest-progress-label muted";
    progressLabel.textContent = isDone ? "Квест выполнен" : `${progress.current} из ${definition.goal}`;

    description.append(title, detail, track, progressLabel);

    const button = document.createElement("button");
    button.className = "btn-secondary";
    button.type = "button";
    button.dataset.questId = definition.id;
    button.textContent = isDone ? "Получено ✅"
      : isReady ? `Забрать ${definition.reward} 🪙`
      : `${definition.reward} 🪙`;
    button.disabled = isDone || !isReady;

    card.append(symbol, description, button);
    return card;
  });

  container.replaceChildren(...cards);
}

function handleQuestButtonClick(event) {
  const button = event.target.closest("[data-quest-id]");
  if (!button) return;

  const questId = button.dataset.questId;
  if (!questId) return;

  if (state.quests[questId]) {
    showToast("Квест уже выполнен.");
    return;
  }

  const definition = questDefinitions.find((quest) => quest.id === questId);
  if (!definition || getQuestProgress(definition).current < definition.goal) {
    showToast("Сначала выполни условия квеста.");
    return;
  }

  state.quests[questId] = true;
  saveJson(STORAGE_KEYS.quests, state.quests);
  addCoins(definition.reward);
  renderQuestProgress();
  showToast(`Квест «${definition.title}» выполнен! +${definition.reward} 🪙`);
}

function renderStories() {
  const feed = document.getElementById("stories-feed");
  if (!feed) return;

  if (!state.stories.length) {
    feed.innerHTML = `
      <div class="story-card">
        <p class="muted">Пока нет историй — создай первую публикацию.</p>
      </div>
    `;
    return;
  }

  feed.innerHTML = state.stories
    .slice()
    .reverse()
    .map((story) => `
      <article class="story-card">
        ${story.image ? `<img src="${story.image}" alt="История">` : ""}
        <p>${story.text || "без подписи"}</p>
        <small>${new Date(story.createdAt).toLocaleString("ru-RU")}</small>
        <div class="story-actions">
          <button class="btn-secondary" type="button" data-story-delete="${story.id}">Удалить</button>
        </div>
      </article>
    `)
    .join("");
}

function clearStoryForm() {
  const imageInput = document.getElementById("story-image");
  const textInput = document.getElementById("story-text");
  const preview = document.getElementById("story-preview");

  if (imageInput) imageInput.value = "";
  if (textInput) textInput.value = "";
  if (preview) {
    preview.dataset.image = "";
    preview.innerHTML = '<span class="muted">Предпросмотр появится здесь</span>';
  }
}

function createStory() {
  const imageInput = document.getElementById("story-image");
  const textInput = document.getElementById("story-text");
  const preview = document.getElementById("story-preview");

  if (!imageInput || !textInput || !preview) return;

  const image = preview.dataset.image || "";
  const text = textInput.value.trim();

  if (!image && !text) {
    showToast("Добавь фото или описание.");
    return;
  }

  const story = {
    id: Date.now().toString(),
    image,
    text,
    createdAt: new Date().toISOString()
  };

  state.stories.push(story);
  saveJson(STORAGE_KEYS.stories, state.stories);
  renderStories();
}

const registerForm = document.getElementById("register-form");
const authScreen = document.getElementById("auth-screen");
const appScreen = document.getElementById("app-screen");

function showAppScreen() {
  authScreen.classList.remove("active");
  appScreen.classList.add("active");
}

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const usernameInput = document.getElementById("reg-username").value.trim();
  state.user = {
    name: document.getElementById("reg-name").value.trim(),
    username: usernameInput.startsWith("@") ? usernameInput : `@${usernameInput}`,
    age: document.getElementById("reg-age").value
  };

  saveUser();
  updateUserProfileUI();
  setAge(state.user.age);
  showAppScreen();
});

const navButtons = document.querySelectorAll(".nav-btn");
const tabContents = document.querySelectorAll(".tab-content");
const pageTitle = document.getElementById("page-title");

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.tab === "register") {
      registerForm.reset();
      document.getElementById("reg-name").value = state.user?.name || "";
      document.getElementById("reg-username").value = state.user?.username || "";
      document.getElementById("reg-age").value = state.user?.age || "teen";
      appScreen.classList.remove("active");
      authScreen.classList.add("active");
      return;
    }

    const selectedTab = document.getElementById(`tab-${button.dataset.tab}`);
    if (!selectedTab) return;

    tabContents.forEach((tab) => {
      tab.classList.toggle("active", tab === selectedTab);
    });

    navButtons.forEach((navButton) => {
      const isActive = navButton === button;
      navButton.classList.toggle("active", isActive);
      if (isActive) {
        navButton.setAttribute("aria-current", "page");
      } else {
        navButton.removeAttribute("aria-current");
      }
    });

    const label = button.querySelector("span");
    if (pageTitle && label) pageTitle.textContent = label.textContent.trim();
  });
});

const mascotChatReplies = {
  "mascot-robot": "Сообщение принято! ⚡ Чем ещё могу помочь?",
  "mascot-wolf": "Понял. Какой следующий шаг?",
  "mascot-fox": "Ха, интересная мысль! Давай придумаем план 😉",
  "mascot-rabbit": "Звучит здорово! Что ещё расскажешь? 🐰"
};

function getChatMessages(chatId) {
  if (!Array.isArray(state.chatMessages[chatId])) {
    state.chatMessages[chatId] = (defaultChatMessages[chatId] || []).map((message) => ({ ...message }));
  }
  return state.chatMessages[chatId];
}

function findChatItem(chatId) {
  return [...document.querySelectorAll(".chat-item[data-chat-id]")]
    .find((item) => item.dataset.chatId === chatId);
}

function updateChatPreview(chatId, text) {
  const chatItem = findChatItem(chatId);
  const preview = chatItem?.querySelector(".chat-item-text small");
  if (preview) preview.textContent = text;
}

function renderActiveChat() {
  const chatItem = findChatItem(activeChatId);
  const messagesList = document.getElementById("messages-list");
  const chatName = document.getElementById("current-chat-name");
  const chatStatus = document.getElementById("current-chat-status");
  if (!messagesList) return;

  if (chatName && chatItem) chatName.textContent = chatItem.dataset.chatName;
  if (chatStatus) {
    chatStatus.textContent = activeChatId.startsWith("mascot-")
      ? "Маскот отвечает в демо-режиме"
      : "Демонстрационный чат";
  }

  const messages = getChatMessages(activeChatId).map((message) => {
    const element = document.createElement("div");
    element.className = `message ${message.sender === "outgoing" ? "outgoing" : "incoming"}`;

    const text = document.createElement("span");
    text.className = "message-text";
    text.textContent = message.text;
    element.appendChild(text);

    if (message.sentAt) {
      const time = document.createElement("time");
      time.className = "message-time";
      time.dateTime = message.sentAt;
      time.textContent = new Date(message.sentAt).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit"
      });
      element.appendChild(time);
    }
    return element;
  });

  messagesList.replaceChildren(...messages);
  messagesList.scrollTop = messagesList.scrollHeight;
}

function addChatMessage(chatId, sender, text) {
  getChatMessages(chatId).push({ sender, text, sentAt: new Date().toISOString() });
  saveJson("voxChatMessages", state.chatMessages);
  updateChatPreview(chatId, text);
  if (chatId === activeChatId) renderActiveChat();
}

function createCustomChatItem(chat) {
  const button = document.createElement("button");
  button.className = "chat-item";
  button.type = "button";
  button.dataset.chatId = chat.id;
  button.dataset.chatName = chat.name;

  const avatar = document.createElement("span");
  avatar.className = "chat-avatar";
  avatar.textContent = "💬";

  const details = document.createElement("span");
  details.className = "chat-item-text";

  const name = document.createElement("strong");
  name.textContent = chat.name;
  const preview = document.createElement("small");
  const messages = state.chatMessages[chat.id] || [];
  preview.textContent = messages.length ? messages[messages.length - 1].text : "Новый чат";

  details.append(name, preview);
  button.append(avatar, details);
  return button;
}

const chatList = document.querySelector(".chat-list");
if (chatList) {
  const mascotLabel = chatList.querySelector(".chat-section-label");
  state.customChats.forEach((chat) => {
    const chatItem = createCustomChatItem(chat);
    if (mascotLabel) chatList.insertBefore(chatItem, mascotLabel);
    else chatList.appendChild(chatItem);
  });

  chatList.addEventListener("click", (event) => {
    const chatItem = event.target.closest(".chat-item[data-chat-id]");
    if (!chatItem) return;

    activeChatId = chatItem.dataset.chatId;
    chatList.querySelectorAll(".chat-item").forEach((item) => {
      item.classList.toggle("active", item === chatItem);
    });
    renderActiveChat();
  });
}

const chatSendForm = document.getElementById("chat-send-form");
if (chatSendForm) {
  chatSendForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = document.getElementById("chat-input-text");
    const text = input.value.trim();
    if (!text) return;

    const chatId = activeChatId;
    const chatItem = findChatItem(chatId);
    const peerName = chatItem?.dataset.chatName || chatId;
    addChatMessage(chatId, "outgoing", text);
    recordQuestAction("message", { peer: peerName, emojiCount: countEmojis(text) });
    input.value = "";

    const reply = mascotChatReplies[chatId];
    if (reply) {
      setTimeout(() => addChatMessage(chatId, "incoming", reply), 400);
    }
  });
}

const newChatButton = document.getElementById("new-chat-btn");
if (newChatButton && chatList) {
  newChatButton.addEventListener("click", () => {
    const name = window.prompt("Имя собеседника для демо-чата:");
    const cleanName = name?.trim();
    if (!cleanName) return;

    const chat = { id: `custom-${Date.now()}`, name: cleanName };
    state.customChats.push(chat);
    saveJson(STORAGE_KEYS.customChats, state.customChats);

    const chatItem = createCustomChatItem(chat);
    const mascotLabel = chatList.querySelector(".chat-section-label");
    if (mascotLabel) chatList.insertBefore(chatItem, mascotLabel);
    else chatList.appendChild(chatItem);
    chatItem.click();
  });
}

renderActiveChat();

if (state.user) {
  document.getElementById("reg-name").value = state.user.name || "";
  document.getElementById("reg-username").value = state.user.username || "";
  document.getElementById("reg-age").value = state.user.age || "teen";
}
