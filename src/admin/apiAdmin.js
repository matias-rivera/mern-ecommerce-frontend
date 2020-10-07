import { API } from './../config';


//create category call to api
export const createCategory = (userId, token, category) => {
    return fetch(`${API}/category/create/${userId}`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(category)
    })
    .then(response => {
        return response.json()
    })
    .catch(err => {
        console.log(err)
    })
    ;
};

//create product call to api
//product is a formData instance
export const createProduct = (userId, token, product) => {
    return fetch(`${API}/product/create/${userId}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        //send the formData
        body: product
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};


export const getCategories = () => {
    return fetch(`${API}/categories`,{
        method: "GET"

    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log)
}