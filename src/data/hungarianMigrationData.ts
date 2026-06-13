export interface MigrationPoint {
  name: string
  lat: number
  lon: number
  year: number
}

export const hungarianMigration = [
  { index: 0, name: "Ural Mountains", lat: 60, lon: 60, year: -2000 },
  { index: 1, name: "West Siberian Plain", lat: 57, lon: 70, year: -1500 },
  { index: 2, name: "Pontic-Caspian Steppe", lat: 48, lon: 40, year: 500 },
  { index: 3, name: "Etelköz", lat: 47, lon: 30, year: 850 },
  { index: 4, name: "Carpathian Basin", lat: 47, lon: 19, year: 895 }
];