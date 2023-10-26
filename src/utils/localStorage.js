export const storeCompanyData = (data) => {
  localStorage.setItem("company-data", JSON.stringify(data));
};

export const getCustomerData = () => {
  return localStorage.getItem("company-data");
};

export const storeRecKeywordsData = (data) => {
  localStorage.setItem("recommended-kw-data", JSON.stringify(data));
};

export const getRecKeywordsData = () => {
  return localStorage.getItem("recommended-kw-data");
};

export const storeBlogTitlesData = (data) => {
  localStorage.setItem("blog-titles-data", JSON.stringify(data));
};

export const getBlogTitlesData = () => {
  return localStorage.getItem("blog-titles-data");
};
