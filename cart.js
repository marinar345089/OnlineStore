const cartTemplate = document.querySelector(".cart__template");
const cartProducts = document.querySelector(".cart__products");
const subtotalPrice = document.querySelector(".subtotal__price");
const totalPrice = document.querySelector(".total__price");

let cartArray = getCart();

renderCart();

function saveCart() {
  localStorage.setItem("cartArray", JSON.stringify(cartArray));
}

function getCart() {
  const cart = localStorage.getItem("cartArray");
  if (cart) {
    return JSON.parse(cart);
  } else {
    return [];
  }
}

function renderCart() {
  cartProducts.innerHTML = null;
  cartArray.forEach((product) => {
    const clone = cartTemplate.content.cloneNode(true);
    const itemImg = clone.querySelector(".item__img");
    const itemTitle = clone.querySelector(".item__title");
    const itemPrice = clone.querySelector(".price");
    const itemCount = clone.querySelector(".count");
    const btnAdd = clone.querySelector(".add");
    const btnDelete = clone.querySelector(".delete__item");
    const btnRemove = clone.querySelector(".remove");
    btnAdd.onclick = () => plusCount(product);
    btnRemove.onclick = () => minusCount(product);
    btnDelete.onclick = () => removeItem(product);
    itemImg.src = product.images[0];
    itemTitle.innerHTML = product.title;
    itemPrice.innerHTML = product.price + " $";
    itemCount.innerHTML = product.count;
    cartProducts.append(clone);
  });
  calcFullPrice();
}

function plusCount(product) {
  const cartProduct = cartArray.find((el) => el.id == product.id);
  cartProduct.count++;
  console.log(cartArray);
  saveCart();
  renderCart();
}

function minusCount(product) {
  const cartProduct = cartArray.find((el) => el.id == product.id);
  if (cartProduct.count > 1) {
    cartProduct.count--;
    saveCart();
    renderCart();
  }
  console.log(cartArray);
}

function removeItem(product) {
  cartArray = cartArray.filter((el) => el.id !== product.id);
  saveCart();
  renderCart();
}

function calcFullPrice() {
  let subtotal = 0;
  cartArray.forEach((el) => (subtotal += el.price * el.count));
  subtotalPrice.innerHTML = `$ ${subtotal.toFixed(2)}`;
  totalPrice.innerHTML = `$ ${+subtotal.toFixed(2) + 3}`;
}
