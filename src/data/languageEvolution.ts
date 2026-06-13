export interface LanguageStage {
  language: string;
  stage: string;
  start: number;
  end: number;
}

export const languageEvolution: LanguageStage[] = [

  // 🇬🇧 English
  { language: "English", stage: "Old English", start: 450, end: 1100 },
  { language: "English", stage: "Middle English", start: 1100, end: 1500 },
  { language: "English", stage: "Early Modern English", start: 1500, end: 1700 },
  { language: "English", stage: "Modern English", start: 1700, end: 2025 },

  // 🇩🇪 German
  { language: "German", stage: "Old High German", start: 500, end: 1050 },
  { language: "German", stage: "Middle High German", start: 1050, end: 1350 },
  { language: "German", stage: "Early New High German", start: 1350, end: 1650 },
  { language: "German", stage: "Modern German", start: 1650, end: 2025 },

  // 🇫🇷 French
  { language: "French", stage: "Old French", start: 800, end: 1400 },
  { language: "French", stage: "Middle French", start: 1400, end: 1600 },
  { language: "French", stage: "Modern French", start: 1600, end: 2025 },
];