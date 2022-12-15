export const saveOnStorage = (key, value) => {
  const stringValue = JSON.stringify(value);
  localStorage.setItem(key, stringValue);
};

export const getFromLocal = (key) => {
  const item = localStorage.getItem(key);
  const newItem = item ? JSON.parse(item) : `Não foi encontrada a chave ${key}`;
  return newItem;
};
