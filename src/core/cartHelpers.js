export const addItem = (item, next) => {
    let cart = [];
    if(typeof window !== 'undefined'){
        //get cart
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
        }
        //push item in cart
        cart.push({
            ...item, 
            count: 1
        });

        // remove duplicates
        cart = Array.from(new Set(cart.map((p) => (p._id)))).map(id => {
            return cart.find(p=> p._id === id);
        });

        //save in storage
        localStorage.setItem('cart',JSON.stringify(cart));
        next()

    }
};

//get total items
export const itemTotal = () => {
    if(typeof window !== 'undefined'){
        if(localStorage.getItem('cart')){
            return JSON.parse(localStorage.getItem('cart')).length
        }
    }
    return 0;
}

//get cart
export const getCart = () => {
    if(typeof window !== 'undefined'){
        if(localStorage.getItem('cart')){
            return JSON.parse(localStorage.getItem('cart'));
        }
    }
    return [];
};

//update items quantity
export const updateItem = (productId, count)=>{
    let cart = [];
    if(typeof window !== 'undefined'){
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
        }

        //find product in cart
        cart.map((product, i) => {
            if(product._id === productId){
                //add product in cart, (quantity of the same product)
                cart[i].count = count;
            }
        });

        
        //save cart in local
        localStorage.setItem('cart',JSON.stringify(cart));
    }
};

//remove product from cart
export const removeItem = (productId)=>{
    let cart = [];
    if(typeof window !== 'undefined'){
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
        }

        //find product
        cart.map((product, i) => {
            if(product._id === productId){
                //remove from cart
                cart.splice(i,1);
            }
        });

        //save cart in local
        localStorage.setItem('cart',JSON.stringify(cart));
    }
    return cart;
};