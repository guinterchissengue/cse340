// ===============================
// PRODUCT DATA CLASS
// Loads products from JSON files
// ===============================

function convertToJson(res) {
  if (res.ok) return res.json();
  throw new Error('Bad Response');
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`;
  }

  // Get all products
  async getData() {
    return fetch(this.path).then(convertToJson);
  }

  // Find product by ID (SAFE)
  async findProductById(id) {
    const products = await this.getData();

    return products.find(
      (item) => String(item.Id) === String(id)
    );
  }
}