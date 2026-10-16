export const SAVED_PRODUCTS_EVENT = "saved-products-changed";
const STORAGE_KEY = "savedProducts";

export function getSavedProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function toggleSavedProduct(product) {
  const saved = getSavedProducts();
  const id = String(product._id || product.id);
  const exists = saved.some((item) => String(item._id || item.id) === id);
  const updated = exists
    ? saved.filter((item) => String(item._id || item.id) !== id)
    : [...saved, product];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event(SAVED_PRODUCTS_EVENT));
  return !exists;
}
