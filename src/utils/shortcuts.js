export const quoteTabsNavigationShortcuts = [
  { name: "Go to Basic Information", combination: ["alt", "1"] },
  { name: "Go to Services", combination: ["alt", "2"] },
  { name: "Go to Itinerary", combination: ["alt", "3"] },
  { name: "Go to Export", combination: ["alt", "4"] },
  { name: "Go to Book", combination: ["alt", "5"] },
  { name: "Go to Pax Information", combination: ["alt", "6"] },
  { name: "Go to Home", combination: ["alt", "q"] },
];

export const basicInformationShortcuts = [
  {
    title: "Global",
    shortcuts: [
      { name: "Show or hide shortcuts", combination: ["shift", "?"] },
      ...quoteTabsNavigationShortcuts,
    ],
  },
  {
    title: "Information",
    shortcuts: [
      { name: "Save information", combination: ["alt", "s"] },
      {
        name: "Save information and go to Services",
        combination: ["alt", "enter"],
      },
      { name: "Return to Recent itineraries", combination: ["esc"] },
    ],
  },
];

export const homeQuoteTableShortcuts = [
  {
    title: "Global",
    shortcuts: [
      { name: "Show or hide shortcuts", combination: ["shift", "?"] },
    ],
  },
  {
    title: "Recent Itineraries",
    shortcuts: [
      { name: "New itinerary", combination: ["alt", "n"] },
      { name: "View all itineraries", combination: ["alt", "a"] },
      { name: "Search itineraries", combination: ["alt", "s"] },
    ],
  },
];

export const paxInfoFormShortcuts = [
  {
    title: "Global",
    shortcuts: [
      { name: "Show or hide shortcuts", combination: ["shift", "?"] },
      ...quoteTabsNavigationShortcuts,
    ],
  },
  {
    title: "Pax Information",
    shortcuts: [
      { name: "Ceate new pax", combination: ["alt", "n"] },
      { name: "Save information pax", combination: ["alt", "s"] },
      { name: "Delete pax or cancel", combination: ["supr"] },
      { name: "Toggle right", combination: ["alt", "->"] },
      { name: "Toggle left", combination: ["alt", "<-"] },
    ],
  },
];

export const quoteTableShortcuts = [
  {
    title: "Global",
    shortcuts: [
      { name: "Show or hide shortcuts", combination: ["shift", "?"] },
    ],
  },
  {
    title: "Quotes",
    shortcuts: [
      { name: "New itinerary", combination: ["alt", "n"] },
      { name: "Search itineraries", combination: ["alt", "s"] },
      { name: "Return to Recent Itineraries", combination: ["alt", "a"] },
      { name: "Return to Recent Itineraries", combination: ["esc"] },
    ],
  },
];

export const serviceTableShortcuts = [
  {
    title: "Global",
    shortcuts: [
      { name: "Show or hide shortcuts", combination: ["shift", "?"] },
      { name: "Expand/Collapse navbar", combination: ["ctrl", "o"] },
      ...quoteTabsNavigationShortcuts,
      { name: "Cancel new service operation", combination: ["supr"] },
    ],
  },
  {
    title: "Services",
    shortcuts: [
      { name: "New service", combination: ["alt", "n"] },
      { name: "New accommodation", combination: ["alt", "a"] },
      { name: "New excursion", combination: ["alt", "x"] },
      { name: "New transfer", combination: ["alt", "t"] },
      { name: "New transportation", combination: ["alt", "v"] },
      { name: "New entrance", combination: ["alt", "e"] },
      { name: "New guide", combination: ["alt", "g"] },
      { name: "New meal", combination: ["alt", "m"] },
      { name: "New package", combination: ["alt", "p"] },
      { name: "New flight", combination: ["alt", "f"] },
      { name: "New other", combination: ["alt", "o"] },
    ],
  },
  {
    title: "Search Services",
    shortcuts: [
      { name: "Search service", combination: ["alt", "s"] },
      { name: "Return to Service", combination: ["esc"] },
      {
        name: "Open/Close Service Sidebar",
        combination: ["ctrl", "m"],
      },
    ],
  },
];
