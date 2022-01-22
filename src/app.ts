const DARK_MODE_KEY = 'theme';

// Initialize dark mode before the page is rendered.
initDarkMode();

window.addEventListener('load', () => {
  initDarkModeToggle();
  initPhotographHover();
});

/**
 * Enables dark mode on document.documentElement (<html>), if applicable.
 */
function initDarkMode(): void {
  if (localStorage[DARK_MODE_KEY]) {
    if (localStorage[DARK_MODE_KEY] === 'dark') {
      document.documentElement.classList.toggle('dark');
    }
  } else {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.toggle('dark');
    }
  }
}

/**
 * Enables the dark mode toggle.
 */
function initDarkModeToggle(): void {
  const darkModeToggle = document.getElementById('darkModeToggle')!;

  darkModeToggle.onclick = toggleDarkMode;
}

/**
 * Toggles dark mode and saves the current preference.
 */
function toggleDarkMode(): void {
  const setDarkMode = document.documentElement.classList.toggle('dark');

  if (setDarkMode) {
    localStorage[DARK_MODE_KEY] = 'dark';
  } else {
    localStorage[DARK_MODE_KEY] = 'light';
  }
}

/**
 * Scales up and saturates the photograph
 */
function initPhotographHover(): void {
  // TODO? scale might lower quality? Use width, bottom, mb and mr instead?
  // 'w-56', 'bottom-48', '-mb-56'
  const className = 'transition-all';

  const durationIn = 'duration-1000';
  const durationOut = 'duration-300';

  /** Tailwind JIT requires full class names in source code, so we calculate
   * the number from the full class name above. */
  const delay = parseInt(durationOut.split('-')[1]);

  const container = document.querySelector<HTMLElement>('#photograph')!;

  const photograph = container.children[0] as HTMLElement;

  container.onmouseenter = () => {
    // Remove durationOut, if still present.
    container.classList.remove(durationOut);

    // Add transition classes and duration
    container.classList.add(className, durationIn);
    photograph.classList.add(durationIn);
  };

  container.onmouseleave = () => {
    // Replace durationIn class with durationOut class
    container.classList.remove(durationIn);
    photograph.classList.remove(durationIn);
    container.classList.add(durationOut);
    photograph.classList.add(durationOut);

    // After delay (durationOut) millisecondes, remove durationOut class
    setTimeout(() => {
      container.classList.remove(durationOut);
      photograph.classList.remove(durationOut);
    }, delay);

    // Remove transition classes
    container.classList.remove(className);
  };
}
