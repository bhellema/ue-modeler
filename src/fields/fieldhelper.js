export function notImage(url) {
  const validImageExtensions = ['jpg', 'png', 'gif', 'jpeg'];
  return !validImageExtensions.includes(url.split('.').pop());
}

export function isImage(url) {
  return !notImage(url);
}


