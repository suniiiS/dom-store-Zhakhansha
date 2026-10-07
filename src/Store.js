export class Store {
  #items = [];
  #nextId = 1;

  add({ name, price, qty }) {
    this.#items.push({ id: this.#nextId++, name, price, qty });
    return this;
  }
  remove(id) { this.#items = this.#items.filter((x) => x.id !== id); return this; }
  find(id) { return this.#items.find((x) => x.id === id); }
  updateQty(id, qty) {
    const item = this.find(id);
    if (item) item.qty = Math.max(0, qty);
    return this;
  }
  total() { return this.#items.reduce((s, { price, qty }) => s + price * qty, 0); }
  list() { return [...this.#items]; }
}
