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
  const transition = 'transition-all';
  const duration = 'duration-200';
  /** Tailwind JIT requires full class names in source code, so we calculate
   * the number from durationOutClass. */
  const delay = parseInt(duration.split('-')[1]);

  const body = document.body;
  const elems = [body, ...body.querySelectorAll('*')];

  body.classList.add(transition);
  elems.forEach((e) => e.classList.add(duration));

  const setDarkMode = document.documentElement.classList.toggle('dark');

  if (setDarkMode) {
    localStorage[DARK_MODE_KEY] = 'dark';
  } else {
    localStorage[DARK_MODE_KEY] = 'light';
  }

  setTimeout(() => {
    elems.forEach((e) => e.classList.remove(duration));
    body.classList.remove(transition);
  }, delay);
}

function initPhotographHover(): void {
  const div = document.querySelector<HTMLElement>('#photograph')!;
  initHoverTransition(div, ['transition-all'], 'duration-1000', 'duration-300');
}

/**
 * Transitions in and out of hover.
 */
function initHoverTransition(
  rootElement: HTMLElement,
  classes: string[],
  durationInClass: string,
  durationOutClass: string
): void {
  /** Tailwind JIT requires full class names in source code, so we calculate
   * the number from durationOutClass. */
  const delay = parseInt(durationOutClass.split('-')[1]);

  const elems = [rootElement, ...rootElement.querySelectorAll('*')];

  rootElement.onmouseenter = () => {
    // Remove durationOut, if still present.
    elems.forEach((e) => e.classList.remove(durationOutClass));

    // Add transition classes and duration
    elems.forEach((e) => e.classList.add(durationInClass));

    rootElement.classList.add(...classes);
  };

  rootElement.onmouseleave = () => {
    // Replace durationIn class with durationOut class
    elems.forEach((e) => e.classList.remove(durationInClass));
    elems.forEach((e) => e.classList.add(durationOutClass));

    // After delay (durationOut) millisecondes, remove durationOut class
    setTimeout(() => {
      elems.forEach((e) => e.classList.remove(durationOutClass));
      rootElement.classList.remove(...classes);
    }, delay);

    // Remove transition classes
  };
}
