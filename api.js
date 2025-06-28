const baseUrl = "https://dummyjson.com";

function getCategoryListApi() {
  return fetch(`${baseUrl}/products/category-list`).then((res) => res.json());
}

function getProductsListApi(category, limit, skip, sort, search) {
  if (search) {
    return fetch(`${baseUrl}/products/search?q=${search}`).then((res) =>
      res.json()
    );
  } else if (category) {
    return fetch(
      `${baseUrl}/products/category/${category}?limit=${limit}&skip=${skip}&sortBy=${sort.sortBy}&order=${sort.order}`
    ).then((res) => res.json());
  } else {
    return fetch(
      `${baseUrl}/products?limit=${limit}&skip=${skip}&sortBy=${sort.sortBy}&order=${sort.order}`
    ).then((res) => res.json());
  }
}
