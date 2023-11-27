function applyDarkModeStyles() {
  const allElements = document.querySelectorAll("*");

  allElements.forEach((element) => {
    if (element.className.includes("dark:")) {
      element.style.backgroundColor = "rgba(52, 53, 65, 1)";
      element.style.color = "white";
    }
  });
}

function removeDarkModeStyles() {
  const allElements = document.querySelectorAll("*");

  allElements.forEach((element) => {
    try {
      if (element.className.includes("dark:")) {
        element.style.backgroundColor = "";
        element.style.color = "";
      }
    } catch (err) {}
  });
}

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
mediaQuery.addEventListener("change", (e) => {
  if (e.matches) {
    applyDarkModeStyles();
  } else {
    removeDarkModeStyles();
  }
});

if (mediaQuery.matches) {
  applyDarkModeStyles();
} else {
  removeDarkModeStyles();
}

function getSystemTheme() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  } else {
    return "light";
  }
}

function getCurrentTheme() {
  const theme = localStorage.getItem("theme");
  if (!theme === "system") {
    return theme;
  } else {
    return getSystemTheme();
  }
}
