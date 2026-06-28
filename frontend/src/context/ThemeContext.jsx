import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const ThemeContext = createContext(null);

const THEMES = {
  dark: {
    bg:'#070d1a', bg2:'#0d1528', bg3:'#111d35',
    border:'rgba(99,130,255,0.12)', border2:'rgba(99,130,255,0.22)',
    text1:'#f0f4ff', text2:'#94a3b8', text3:'#4a5a7a',
    cardBg:'linear-gradient(135deg, rgba(13,21,40,0.9), rgba(11,17,32,0.95))',
  },
  light: {
    bg:'#f8fafc', bg2:'#ffffff', bg3:'#f1f5f9',
    border:'#e2e8f0', border2:'#c7d2fe',
    text1:'#0f172a', text2:'#475569', text3:'#94a3b8',
    cardBg:'#ffffff',
  }
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem('tt_theme') || 'dark');

  useEffect(() => {
    const t = THEMES[theme];
    const root = document.documentElement.style;
    root.setProperty('--bg', t.bg);
    root.setProperty('--bg2', t.bg2);
    root.setProperty('--bg3', t.bg3);
    root.setProperty('--border', t.border);
    root.setProperty('--border2', t.border2);
    root.setProperty('--text1', t.text1);
    root.setProperty('--text2', t.text2);
    root.setProperty('--text3', t.text3);
    document.body.style.background = t.bg;
    document.body.style.color = t.text1;
    localStorage.setItem('tt_theme', theme);

    // update glass card background dynamically
    const styleTag = document.getElementById('theme-glass-override') || document.createElement('style');
    styleTag.id = 'theme-glass-override';
    styleTag.innerHTML = `.glass { background: ${t.cardBg} !important; }`;
    document.head.appendChild(styleTag);
  }, [theme]);

  const setTheme = async (t) => {
    setThemeState(t);
    try { await api.patch('/settings/theme', { theme: t }); } catch {}
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
