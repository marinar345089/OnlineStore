const categoryTemplate = document.querySelector(".category__template");
const categoriesList = document.querySelector(".categories__list");
const filterTemplate = document.querySelector(".selected-filter__template");
const appliedFilters = document.querySelector(".applied__filters");
const productTemplate = document.querySelector(".product__template");
const productsGrid = document.querySelector(".products__grid");
const startCount = document.querySelector(".start__count");
const endCount = document.querySelector(".end__count");
const allCount = document.querySelector(".all__count");
const sortSelect = document.querySelector(".sort__select");
const searchSelect = document.querySelector(".search__select");
const searchTemplate = document.querySelector(".search__template");
const pages = document.querySelector(".pages");
const pageTemplate = document.querySelector(".page__template");
const nextPage = document.querySelector(".next__page");
const previousPage = document.querySelector(".previous__page");
const limitSelect = document.querySelector(".limit__select");
const searchInput = document.querySelector(".search__input");

let selectedCategory = null;
let limit = 15;
let skip = 0;
let searchValue = "";
let cartArray = getCart();

const sortValues = {
  1: { sortBy: "id", order: "asc" },
  2: { sortBy: "rating", order: "desc" },
  3: { sortBy: "title", order: "asc" },
  4: { sortBy: "price", order: "asc" },
  5: { sortBy: "price", order: "desc" },
};
let selectedSort = sortValues[1];

getProducts();

searchSelect.onchange = changeSearch;

limitSelect.onchange = changeLimit;

sortSelect.onchange = changeSort;

searchInput.onkeydown = handleSearch;

searchInput.oninput = clearSearch;

getCategoryListApi().then((data) => {
  const searchClone = searchTemplate.content.cloneNode(true);
  const option = searchClone.querySelector("option");
  option.innerHTML = "Category";
  option.value = "category";
  searchSelect.append(searchClone);
  data.forEach((category) => {
    const categoryClone = categoryTemplate.content.cloneNode(true);
    const listItem = categoryClone.querySelector(".list__item");
    const listCheck = categoryClone.querySelector(".list__check");
    listCheck.onclick = () => {
      handleSelectCategory(category, listCheck);
      getProducts();
    };
    listItem.innerHTML = category;
    categoriesList.append(categoryClone);
    const searchClone = searchTemplate.content.cloneNode(true);
    const option = searchClone.querySelector("option");
    option.innerHTML = category;
    option.value = category;
    searchSelect.append(searchClone);
  });
});

function getProducts() {
  getProductsListApi(
    selectedCategory,
    limit,
    skip,
    selectedSort,
    searchValue
  ).then((data) => {
    console.log(data);
    allCount.innerHTML = data.total;
    startCount.innerHTML = data.skip + 1;
    endCount.innerHTML = data.skip + limit;
    renderPagination(data.total, data.skip);
    productsGrid.innerHTML = null;
    data.products.forEach((product) => {
      const productClone = productTemplate.content.cloneNode(true);
      const productImg = productClone.querySelector(".product__image");
      const productTitle = productClone.querySelector(".product__title");
      const productStock = productClone.querySelector(".product__stock");
      const productPrice = productClone.querySelector(".product__price");
      const productBtn = productClone.querySelector(".product__btn");
      productBtn.onclick = () => addToCart(product);
      productImg.src = product.images[0];
      productTitle.innerHTML = product.title;
      productStock.innerHTML = product.availabilityStatus;
      productPrice.innerHTML = product.price + " $";
      productsGrid.append(productClone);
    });
  });
}

function handleSelectCategory(category, listCheck) {
  const selectedItem = document.querySelector(".selected");
  if (selectedItem) {
    selectedItem.classList.remove("selected");
  }
  if (category === "category") {
    selectedCategory = null;
    return;
  }
  if (selectedCategory === category) {
    selectedCategory = null;
    searchSelect.value = "category";
    listCheck.classList.remove("selected");
  } else {
    selectedCategory = category;
    searchSelect.value = category;
    listCheck.classList.add("selected");
  }
}

function renderPagination(total, skip) {
  const maxPages = Math.ceil(total / limit);
  console.log(maxPages);
  const currentPage = skip / limit + 1;
  console.log(currentPage);
  pages.innerHTML = null;
  if (maxPages > 10) {
    const array = [...new Array(maxPages)].map((_, i) => i + 1);
    const endArray = array.slice(-3);
    const maxEnd = endArray[0];
    const temp = array.slice(
      currentPage - 1,
      Math.min(currentPage + 2, maxEnd - 1)
    );
    const isEnd = temp[temp.length - 1] != maxEnd - 1;
    const startArray = array.slice(
      currentPage - 1,
      Math.min(currentPage + 2, maxEnd - 1)
    );
    startArray.forEach((i) => {
      const pageClone = pageTemplate.content.cloneNode(true);
      const pageBtn = pageClone.querySelector(".page");
      if (i === currentPage) {
        pageBtn.classList.add("page__active");
      }
      pageBtn.innerHTML = i;
      pageBtn.onclick = () => changePage(i);
      pages.append(pageClone);
    });
    if (isEnd) {
      const pageClone = pageTemplate.content.cloneNode(true);
      const pageBtn = pageClone.querySelector(".page");
      pageBtn.innerHTML = "...";
      pages.append(pageClone);
    }
    endArray.forEach((i) => {
      const pageClone = pageTemplate.content.cloneNode(true);
      const pageBtn = pageClone.querySelector(".page");
      if (i === currentPage) {
        pageBtn.classList.add("page__active");
      }
      pageBtn.innerHTML = i;
      pageBtn.onclick = () => changePage(i);
      pages.append(pageClone);
    });
    console.log(array);
  } else {
    for (let i = 1; i <= maxPages; i++) {
      const pageClone = pageTemplate.content.cloneNode(true);
      const pageBtn = pageClone.querySelector(".page");
      if (i === currentPage) {
        pageBtn.classList.add("page__active");
      }
      pageBtn.innerHTML = i;
      pageBtn.onclick = () => changePage(i);
      pages.append(pageClone);
    }
  }
  nextPage.onclick = () => {
    if (currentPage < maxPages) {
      changePage(currentPage + 1);
    }
  };
  previousPage.onclick = () => {
    if (currentPage > 1) {
      changePage(currentPage - 1);
    }
  };
}

function changePage(page) {
  const activePage = document.querySelector(".page__active");
  if (activePage) {
    activePage.classList.remove("page__active");
  }
  skip = (page - 1) * limit;
  getProducts();
}

function changeLimit() {
  const value = limitSelect.value;
  if (value !== "limit") {
    limit = +value;
  }
  getProducts();
}

function changeSearch() {
  const value = searchSelect.value;
  const items = Array.from(document.querySelectorAll(".list__item"));
  const selectedItem = items.find((item) => item.innerHTML === value);
  if (selectedItem) {
    handleSelectCategory(value, selectedItem.previousElementSibling);
  } else {
    handleSelectCategory(value, null);
  }
  getProducts();
}

function changeSort() {
  const value = sortValues[sortSelect.value];
  selectedSort = value;
  getProducts();
}

function handleSearch(event) {
  if (event.key == "Enter") {
    const value = searchInput.value;
    searchValue = value;
    getProducts();
  }
}

function clearSearch() {
  const value = searchInput.value;
  if (value == "") {
    searchValue = value;
    getProducts();
  }
}

function addToCart(product) {
  const cartProduct = cartArray.find((el) => el.id == product.id);
  if (cartProduct) {
    cartProduct.count++;
  } else {
    cartArray.push({ ...product, count: 1 });
  }
  console.log(cartArray);
  saveCart();
}

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
