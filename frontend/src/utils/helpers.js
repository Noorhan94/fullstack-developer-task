// utils/helpers.js

export function generateCartKey(product_id, selectedAttributes) {
  return `${product_id}-${JSON.stringify(selectedAttributes)}`;
}

export  function kebabCase(str) {
  return str
    .replace(/\s+/g, '-')
    .replace(/[A-Z]/g, match => '-' + match.toLowerCase())
    .replace(/^-/, '')
    .toLowerCase();
}

