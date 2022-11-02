export const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

export const setDarkClass = (darkMode: boolean) => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
