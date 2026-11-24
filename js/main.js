import { equipment, categories } from "./podaci.js";
import { checkField, checkUniqueTitle } from "./validacija.js";

const list = document.querySelector("#list");
const counter = document.querySelector("#counter");
const empty = document.querySelector("#empty");
const form = document.querySelector("#add-form");
const titleInput = form.elements.title;
const message = document.querySelector("#message");
const search = document.querySelector("#search");
const categoryFilter = document.querySelector("#category-filter");
const sort = document.querySelector("#sort");

const state = {
  query: "",
  category: "all",
  sort: "title"
};

let nextId = Math.max(...equipment.map((item) => item.id)) + 1;
let submitAttempted = false;
const fields = [...form.elements].filter((el) => el.willValidate && el.required);

// Izrada jedne stavke iz objekta.
function createItem(item) {
  const li = document.createElement("li");
  li.dataset.id = item.id;
  li.className = "item";
  li.classList.toggle("bought", item.bought);

  const text = document.createElement("div");
  text.className = "item-text";

  const name = document.createElement("strong");
  name.className = "item-name";
  name.textContent = item.title;

  const details = document.createElement("span");
  details.className = "details";
  details.textContent = `${categories[item.category]} · ${item.price} €`;

  const status = document.createElement("span");
  status.className = "status";
  status.textContent = item.bought ? "Kupljeno" : "Nije kupljeno";

  text.append(name, details, status);

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.dataset.action = "toggle";
  toggle.className = "toggle";
  toggle.textContent = item.bought ? "Vrati" : "Označi kupljeno";

  const remove = document.createElement("button");
  remove.type = "button";
  remove.dataset.action = "delete";
  remove.className = "delete";
  remove.textContent = "Obriši";

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(toggle, remove);

  li.append(text, actions);
  return li;
}

// Pretraga, kategorija i sortiranje djeluju zajedno.
function visibleEquipment() {
  const query = state.query.trim().toLowerCase();
  const filtered = equipment.filter((item) => {
    const matchesQuery = item.title.toLowerCase().includes(query);
    const matchesCategory = state.category === "all" || item.category === state.category;
    return matchesQuery && matchesCategory;
  });

  const comparisons = {
    title: (a, b) => a.title.localeCompare(b.title, "hr"),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price
  };

  return filtered.sort(comparisons[state.sort]);
}

function render() {
  const visible = visibleEquipment();
  list.replaceChildren(...visible.map(createItem));
  counter.textContent = `Prikazano ${visible.length} od ${equipment.length}`;
  empty.hidden = visible.length > 0;
}

// Jedan delegirani slušač za oba gumba svih stavki.
list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const id = Number(button.closest("li").dataset.id);
  const index = equipment.findIndex((item) => item.id === id);
  if (index === -1) return;

  if (button.dataset.action === "toggle") {
    equipment[index].bought = !equipment[index].bought;
  } else if (button.dataset.action === "delete") {
    equipment.splice(index, 1);
    checkUniqueTitle(titleInput, equipment);
    if (submitAttempted) checkField(titleInput);
  }

  render();
});

// Dodavanje opreme i validacija obrasca.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitAttempted = true;
  message.textContent = "";

  checkUniqueTitle(titleInput, equipment);
  const results = fields.map(checkField);
  const firstInvalid = fields[results.indexOf(false)];

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  equipment.push({
    id: nextId++,
    title: data.title.trim(),
    category: data.category,
    price: Number(data.price),
    bought: form.elements.bought.checked
  });

  render();
  message.textContent = `Dodano: ${data.title.trim()}`;
  form.reset();
  titleInput.setCustomValidity("");
  submitAttempted = false;
  titleInput.focus();
});

// Nakon prvog slanja poruke se ažuriraju pri svakoj promjeni unosa.
form.addEventListener("input", (event) => {
  if (event.target === titleInput) checkUniqueTitle(titleInput, equipment);
  if (submitAttempted && fields.includes(event.target)) checkField(event.target);
  message.textContent = "";
});

search.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

search.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    search.value = "";
    state.query = "";
    render();
  }
});

for (const [value, label] of Object.entries(categories)) {
  categoryFilter.append(new Option(label, value));
}

categoryFilter.addEventListener("change", (event) => {
  state.category = event.target.value;
  render();
});

sort.addEventListener("change", (event) => {
  state.sort = event.target.value;
  render();
});

render();
