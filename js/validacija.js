// Vlastito pravilo: naziv mora biti jedinstven i imati barem 2 znaka bez razmaka na rubovima.
export function checkUniqueTitle(titleInput, equipment) {
  const title = titleInput.value.trim().toLowerCase();
  const exists = equipment.some((item) => item.title.toLowerCase() === title);

  if (titleInput.value !== "" && title.length < titleInput.minLength) {
    titleInput.setCustomValidity(`Upiši barem ${titleInput.minLength} znaka.`);
  } else {
    titleInput.setCustomValidity(exists ? "Oprema s tim nazivom već postoji." : "");
  }
}

function errorMessage(field) {
  const v = field.validity;

  if (v.badInput) return "Upiši broj.";
  if (v.valueMissing) return "Ovo polje je obavezno.";
  if (v.tooShort) return `Upiši barem ${field.minLength} znaka.`;
  if (v.rangeUnderflow) return `Najmanja cijena je ${field.min} €.`;
  if (v.rangeOverflow) return `Najveća cijena je ${field.max} €.`;
  if (v.stepMismatch) return "Upiši cijeli broj eura.";
  if (v.customError) return field.validationMessage;

  return v.valid ? "" : field.validationMessage;
}

export function checkField(field) {
  const text = errorMessage(field);
  document.querySelector(`#${field.id}-error`).textContent = text;
  field.setAttribute("aria-invalid", text !== "");
  field.classList.toggle("invalid", text !== "");
  return text === "";
}
