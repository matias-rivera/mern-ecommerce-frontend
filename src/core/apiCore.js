import { API } from './../config';
import queryString from 'query-string';

//get products by parameters
export const getProducts = (sortBy) => {
    return fetch(`${API}/products?sortBy=${sortBy}&order=desc&limit=6`,{
        method: "GET"

    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err))
};

//get all categories
export const getCategories = () => {
    return fetch(`${API}/categories`,{
        method: "GET"

    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err))
};

//get products filtered
export const getFilteredProducts = (skip, limit, filters = {}) => {
    const data = {
        limit, skip, filters
    }
    return fetch(`${API}/products/by/search`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        return response.json()
    })
    .catch(err => {
        console.log(err)
    })
    ;
};

//get the list of products searched by name
export const list = params => {
    const query = queryString.stringify(params);
    return fetch(`${API}/products/search?${query}`,{
        method: "GET"

    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err))
};

// use ID to get product, used on product page
export const read = (productId) => {
    return fetch(`${API}/product/${productId}`,{
        method: "GET"

    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err))
};

// get related products
export const listRelated = (productId) => {
    return fetch(`${API}/products/related/${productId}`,{
        method: "GET"

    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err))
};

// get client token
export const getBraintreeClientToken = (userId, token) => {
    return fetch(`${API}/braintree/getToken/${userId}`,{
        method: "GET",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },

    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
};

//send the payment to server, it need the user auth id, token and the payment data
export const processPayment = (userId, token, paymentData) => {
    return fetch(`${API}/braintree/payment/${userId}`,{
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)

    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
};

//send order data to database, it need the user auth id, token and order data
export const createOrder = (userId, token, createOrderData) => {
    return fetch(`${API}/order/create/${userId}`,{
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({order: createOrderData})

    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
};