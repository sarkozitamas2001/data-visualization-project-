export interface TreeNode {
  id: string;
  name: string;
  parent: string | null;
}

export const indoEuropeanData: TreeNode[] = [

{ id: "PIE", name: "Proto-Indo-European", parent: null },

// GERMANIC
{ id: "PG", name: "Proto-Germanic", parent: "PIE" },
{ id: "OE", name: "Old English", parent: "PG" },
{ id: "ME", name: "Middle English", parent: "OE" },
{ id: "EN", name: "English", parent: "ME" },
{ id: "OHG", name: "Old High German", parent: "PG" },
{ id: "DE", name: "German", parent: "OHG" },
{ id: "NL", name: "Dutch", parent: "PG" },
{ id: "SV", name: "Swedish", parent: "PG" },
{ id: "NO", name: "Norwegian", parent: "PG" },
{ id: "DA", name: "Danish", parent: "PG" },
{ id: "IS", name: "Icelandic", parent: "PG" },

// ITALIC / ROMANCE
{ id: "PI", name: "Proto-Italic", parent: "PIE" },
{ id: "LA", name: "Latin", parent: "PI" },
{ id: "ES", name: "Spanish", parent: "LA" },
{ id: "FR", name: "French", parent: "LA" },
{ id: "IT", name: "Italian", parent: "LA" },
{ id: "PT", name: "Portuguese", parent: "LA" },
{ id: "RO", name: "Romanian", parent: "LA" },

// SLAVIC
{ id: "PS", name: "Proto-Slavic", parent: "PIE" },
{ id: "RU", name: "Russian", parent: "PS" },
{ id: "PL", name: "Polish", parent: "PS" },
{ id: "SR", name: "Serbian", parent: "PS" },
{ id: "HR", name: "Croatian", parent: "PS" },
{ id: "BG", name: "Bulgarian", parent: "PS" },
{ id: "CZ", name: "Czech", parent: "PS" },
{ id: "SK", name: "Slovak", parent: "PS" },
{ id: "UA", name: "Ukrainian", parent: "PS" },

// CELTIC
{ id: "PC", name: "Proto-Celtic", parent: "PIE" },
{ id: "GA", name: "Irish", parent: "PC" },
{ id: "SCG", name: "Scottish Gaelic", parent: "PC" },
{ id: "CY", name: "Welsh", parent: "PC" },
{ id: "BR", name: "Breton", parent: "PC" },

// BALTIC
{ id: "PB", name: "Proto-Baltic", parent: "PIE" },
{ id: "LT", name: "Lithuanian", parent: "PB" },
{ id: "LV", name: "Latvian", parent: "PB" },

// GREEK
{ id: "GR", name: "Greek", parent: "PIE" },

// ALBANIAN
{ id: "AL", name: "Albanian", parent: "PIE" }



];
