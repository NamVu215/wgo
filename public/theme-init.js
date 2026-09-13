// Applies the saved light/dark choice before the page paints.
try {
  var t = localStorage.getItem('wgo:theme');
  if (t === 'dark' || t === 'light') document.documentElement.dataset.theme = t;
} catch (e) {}
