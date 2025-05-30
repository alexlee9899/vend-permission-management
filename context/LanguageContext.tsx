import React, { createContext, useContext, useState, useEffect } from "react";

type Lang = "zh" | "en";
interface LanguageContextProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextProps>({
  lang: "en",
  setLang: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("lang");
    if (stored === "en" || stored === "zh") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};
