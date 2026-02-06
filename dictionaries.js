const SECTION_THEMES = [
  { id: "travel", name: "Путешествия", noun: "маршрут" },
  { id: "food", name: "Еда", noun: "рецепт" },
  { id: "science", name: "Наука", noun: "эксперимент" },
  { id: "sports", name: "Спорт", noun: "тренировка" },
  { id: "nature", name: "Природа", noun: "ландшафт" },
  { id: "history", name: "История", noun: "эпоха" },
  { id: "tech", name: "Технологии", noun: "алгоритм" },
  { id: "movies", name: "Кино", noun: "сцена" },
  { id: "music", name: "Музыка", noun: "мелодия" },
  { id: "books", name: "Книги", noun: "сюжет" },
  { id: "city", name: "Город", noun: "квартал" },
  { id: "business", name: "Бизнес", noun: "стратегия" },
  { id: "education", name: "Образование", noun: "урок" },
  { id: "health", name: "Здоровье", noun: "привычка" },
  { id: "art", name: "Искусство", noun: "палитра" },
  { id: "home", name: "Дом", noun: "интерьер" },
  { id: "games", name: "Игры", noun: "миссия" },
  { id: "internet", name: "Интернет", noun: "пост" },
  { id: "fashion", name: "Мода", noun: "образ" },
  { id: "work", name: "Профессии", noun: "проект" }
];

const ADJECTIVES = [
  "быстрый", "гибкий", "смелый", "тихий", "яркий", "точный", "умный", "тёплый", "северный", "южный",
  "дальний", "редкий", "живой", "лёгкий", "сложный", "новый", "старый", "мягкий", "громкий", "модный",
  "честный", "добрый", "строгий", "крепкий", "резкий", "глубокий", "дружный", "сильный", "ловкий", "свежий"
];

const ACTIONS = [
  "поиск", "выбор", "сбор", "анализ", "обмен", "стартап", "прорыв", "разбор", "запуск", "финал",
  "прогноз", "контроль", "подход", "проект", "формат", "сигнал", "баланс", "тренд", "фокус", "ракурс"
];

const OBJECTS = [
  "команда", "идея", "система", "задача", "карта", "сервис", "шаблон", "ключ", "план", "сезон",
  "поток", "пункт", "метод", "файл", "маркер", "модель", "профиль", "курс", "список", "режим"
];

const makeSectionWords = (sectionName, themeNoun) => {
  const words = [];
  for (let i = 0; i < 1000; i += 1) {
    const adjective = ADJECTIVES[i % ADJECTIVES.length];
    const action = ACTIONS[Math.floor(i / ADJECTIVES.length) % ACTIONS.length];
    const object = OBJECTS[Math.floor(i / (ADJECTIVES.length * ACTIONS.length)) % OBJECTS.length];
    words.push(`${sectionName}: ${adjective} ${themeNoun} ${action} ${object} ${i + 1}`);
  }
  return words;
};

const SECTION_DICTIONARIES = SECTION_THEMES.map((section) => ({
  id: section.id,
  name: section.name,
  words: makeSectionWords(section.name, section.noun)
}));
