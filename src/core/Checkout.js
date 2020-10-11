import React,{useState, useEffect} from 'react';
import Layout from './Layout';
import {getProducts, getBraintreeClientToken, processPayment, createOrder} from './apiCore';
import Card from './Card';
import DropIn from 'braintree-web-drop-in-react';
import { isAuthenticated } from './../auth/index';
import { Link } from 'react-router-dom';
import { emptyCart } from './cartHelpers';


const Checkout = ({products, setRun = f => f, run = undefined}) => {

    const [data, setData] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: ''
    });

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;
        
    //get client token from server
    const getToken = (userId, token) => {
        getBraintreeClientToken(userId, token).then(data => {
            if(data.error){
                setData({...data, error: data.error})
            }else {
                setData({ clientToken: data.clientToken});
            }
        })
    }

    useEffect(() => {
        getToken(userId, token);
    }, []);

    //total price
    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        },0)
    };

    //Show checkout button
    const showCheckout = () => {
        return isAuthenticated() 
            ? <div>{showDropIn()}</div>
            : (<Link to="/signin">
                <button className="btn btn-primary">
                    Sign in to Checkout
                    </button>
                    </Link>
                );
    };

    //address
    let deliveryAddress = data.address;

    const buy = () => {
        //send the payment method to server
        setData({ loading: true});
        let nonce;
        let getNonce = data.instance.requestPaymentMethod()
            .then(data => {
                //console.log(data);
                nonce = data.nonce;
                //nonce  = card type and card number
                //nonce is sent as pyamentmethod
                //total is sent to be charged
                //console.log('send nonce and total: ',nonce,getTotal(products))
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getTotal(products)
                }

                //call to API to process payment
                processPayment(userId, token, paymentData)
                    .then(response => {
                        //create order structure
                        const createOrderData = {
                            products: products,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount,
                            address: deliveryAddress
                        }

                        //call to API to create order
                        createOrder(userId, token, createOrderData)
                            .then(response => {
                                //empty cart
                                emptyCart(() => {
                                    setRun(!run); // run useEffect in parent Cart
                                    console.log('payment success and empty cart');
                                    setData({
                                        loading: false,
                                        success: true
                                });
                                
                            })
                   
                        }) 
                    .catch(error => {
                        //console.log(error)
                        setData({loading: false})
                        
                    });
            })
            .catch(error => {
                //console.log('dropin error: ',error);
                setData({ loading: false});
            });
        }) .catch(error => {
            // console.log("dropin error: ", error);
            setData({ ...data, error: error.message });
        });

    }

    //set address on state
    const handleAddress = event => {
        setData({...data, address: event.target.value})
    }

    //show braintree ui
    const showDropIn = () => (
        <div onBlur={() => setData({...data, error:""})}>
            {data.clientToken !== null 
            && products.length > 0
            ? (<div>
            {/* Delivery input */}
            <div className="gorm-group mb-3">
                <label className="text-muted">Delivery address:</label>
                <textarea
                    onChange={handleAddress}
                    className="form-control"
                    value={data.address}
                    placeholder="Type your delivery address here..."
                />
            </div>
           {/* Braintree component */}
            <DropIn 
                options={{
                    authorization: data.clientToken,
                    paypal: {
                        flow: "vault"
                    }
                }}
                onInstance= {instance => (data.instance = instance)}/> 
                <button onClick={buy} className="btn btn-success btn-block">Pay</button>
            </div>) 
            : null
            }
        </div>
    );

    //return the error when payment process fail
    const showError = error => (
        <div 
            className="alert alert-danger" 
            style={{display: error ? '' : 'none'}}
        >
            {error}
        </div>
    )

    //return a message when the payment was successfully
    const showSuccess = success => (
        <div 
            className="alert alert-info" 
            style={{display: success ? '' : 'none'}}
        >
            Thanks! Your payment was successfull!
        </div>
    );

    //it show when is loading the payment process
    const showLoading = (loading) => (
        loading && <h2>Loading...</h2>

    )

    return ( 
    <div>

        <h2>Total: ${getTotal()}</h2>
        {showLoading(data.loading)}
        {showSuccess(data.success)}
        {showError(data.error)}
        {showCheckout()}
    </div>
     );
}
 
export default Checkout;