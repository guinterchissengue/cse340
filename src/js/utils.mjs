// utils.mjs

// Save data to localStorage (always JSON)
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Get data from localStorage (safely parsed)
export function getLocalStorage(key) {
  const data = localStorage.getItem(key);

  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch (err) {
    console.error('Error parsing localStorage:', err);
    return null;
  }
}

// Small helper for click/touch events
export function setClick(selector, callback) {
  const element = document.querySelector(selector);

  if (!element) return;

  element.addEventListener('touchend', (event) => {
    event.preventDefault();
    callback(event);
  });

  element.addEventListener('click', callback);
}