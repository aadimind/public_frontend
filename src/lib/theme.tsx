// Theme architecture simplified: permanent dark theme only.
// Previous ThemeProvider, useTheme, toggleTheme, persistence,
// and system-preference switching removed per product decision.
// Dark initialization is handled deterministically by index.html
// and CSS (always dark, no selectable light mode).

export {};