const SECTION_THEMES = [
  { id: "travel", name: "Путешествия", prefix: "Тр" },
  { id: "food", name: "Еда", prefix: "Ед" },
  { id: "science", name: "Наука", prefix: "На" },
  { id: "sports", name: "Спорт", prefix: "Сп" },
  { id: "nature", name: "Природа", prefix: "Пр" },
  { id: "history", name: "История", prefix: "Ис" },
  { id: "tech", name: "Технологии", prefix: "Те" },
  { id: "movies", name: "Кино", prefix: "Ки" },
  { id: "music", name: "Музыка", prefix: "Му" },
  { id: "books", name: "Книги", prefix: "Кн" },
  { id: "city", name: "Город", prefix: "Го" },
  { id: "business", name: "Бизнес", prefix: "Би" },
  { id: "education", name: "Образование", prefix: "Об" },
  { id: "health", name: "Здоровье", prefix: "Зд" },
  { id: "art", name: "Искусство", prefix: "ИсК" },
  { id: "home", name: "Дом", prefix: "До" },
  { id: "games", name: "Игры", prefix: "Иг" },
  { id: "internet", name: "Интернет", prefix: "Ин" },
  { id: "fashion", name: "Мода", prefix: "Мо" },
  { id: "work", name: "Профессии", prefix: "Пф" }
];

const makeSectionWords = (prefix) => {
  const words = [];
  for (let i = 1; i <= 1000; i += 1) {
    words.push(`${prefix}${String(i).padStart(4, "0")}`);
  }
  return words;
};

const SECTION_DICTIONARIES = SECTION_THEMES.map((section) => ({
  id: section.id,
  name: section.name,
  words: makeSectionWords(section.prefix)
}));
