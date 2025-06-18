export default function kebabCase(str) {
  return str
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/[A-Z]/g, (match) => '-' + match.toLowerCase()) // Convert camelCase to kebab-case
    .replace(/^-/, '')             // Remove leading hyphen if present
    .toLowerCase();                // Ensure lowercase
}
