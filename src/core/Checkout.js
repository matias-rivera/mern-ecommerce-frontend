import React,{useState, useEffect} from 'react';
import Layout from './Layout';
import {getProducts, getBraintreeClientToken, processPayment} from './apiCore';
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

                processPayment(userId, token, paymentData)
                    .then(response => {
                        //console.log(response)
                        setData({...data, success: response.success});
                        emptyCart(() => {
                            setRun(!run); // run useEffect in parent Cart
                            console.log('payment success and empty cart');
                            setData({
                                loading: false,
                                success: true
                        });
                        }) ; 
                        //empty cart

                        //create order
                    })
                    .catch(error => {
                        //console.log(error)
                        
                    })
            })
            .catch(error => {
                //console.log('dropin error: ',error);
                setData({ loading: true});
            })
    }



    //show braintree ui
    const showDropIn = () => (
        <div onBlur={() => setData({...data, error:""})}>
            {data.clientToken !== null 
            && products.length > 0
            ? (<div>
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