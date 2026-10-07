import { Store } from './Store.js';

const store = new Store();
const form = document.getElementById('add-form');
const list = document.getElementById('list');
const totalEl = document.getElementById('total');

function render() {
  list.innerHTML = store.list().map(({ id, name, price, qty }) => `
    <tr data-id="${id}">
      <td>${name}</td>
      <td>${price}</td>
      <td>${qty}</td>
      <td>${price * qty}</td>
      <td>
        <button data-action="dec">−</button>
        <button data-action="inc">+</button>
        <button data-action="remove">Удалить</button>
      </td>
    </tr>`).join('');
  totalEl.textContent = store.total();
}

function validate({ name, price, qty }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Введите название';
  if (!(Number(price) > 0)) errors.price = 'Цена должна быть больше 0';
  if (qty.trim() === '' || !Number.isInteger(Number(qty))) errors.qty = 'Кол-во должно быть числом';
  return errors;
}

function showErrors(errors) {
  form.querySelectorAll('.error').forEach((el) => {
    el.textContent = errors[el.dataset.for] ?? '';
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const errors = validate(data);
  showErrors(errors);
  if (Object.keys(errors).length) return;

  store.add({ name: data.name.trim(), price: Number(data.price), qty: Number(data.qty) });
  form.reset();
  render();
});

// ОДИН слушатель на весь список (делегирование)
list.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = Number(btn.closest('tr').dataset.id);
  const item = store.find(id);

  if (btn.dataset.action === 'remove') store.remove(id);
  if (btn.dataset.action === 'inc') store.updateQty(id, item.qty + 1);
  if (btn.dataset.action === 'dec') store.updateQty(id, item.qty - 1);
  render();
});

render();
