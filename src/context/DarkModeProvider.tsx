import React, { createContext, useState } from "react";

// Créez un contexte DarkModeContext en utilisant createContext.
export const DarkModeContext = createContext<{ darkMode: boolean; toggleDarkMode: () => void }>({
  darkMode: false,
  toggleDarkMode: () => {}, // Une fonction par défaut qui ne fait rien.
});

// Créez votre composant DarkModeProvider qui prend des enfants (children) en tant que props.
export default function DarkModeProvider({ children }: { children: React.ReactNode }) {
  // Déclarez un état local "darkMode" et une fonction "setDarkMode" pour le gérer.
  const [darkMode, setDarkMode] = useState(false);

  // Créez une fonction "toggleDarkMode" pour basculer entre le mode sombre et le mode clair.
  function toggleDarkMode() {
    setDarkMode(!darkMode);
  }

  // Renvoyez un composant DarkModeContext.Provider avec la valeur du contexte.
  // Ici, nous passons un objet contenant à la fois "darkMode" et "toggleDarkMode".
  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}