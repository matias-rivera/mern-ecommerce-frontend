import React, {useState, useEffect} from 'react';
import Layout from '../core/Layout'
import { isAuthenticated } from './../auth/index';
import { Link } from 'react-router-dom';
import { listOrders, getStatusValues, updateOrderStatus  } from './apiAdmin';
import moment from 'moment';

const Orders = () => {
    

    const [orders, setOrders] = useState([]); //orders from db
    const [statusValues, setStatusValues] = useState([]); //all possibles status values for a product


    const {user, token} = isAuthenticated();

    //get all orders
    const loadOrders = () => {
        listOrders(user._id,token)
            .then(data => {
                if(data.error) {
                    console.log(data.error)
                } else{
                    setOrders(data)
                }
            })
    }

    //get all status values
    const loadStatusValues = () => {
        getStatusValues(user._id,token)
            .then(data => {
                if(data.error) {
                    console.log(data.error)
                } else{
                    setStatusValues(data)
                }
            })
    }

    //it load all orders and status values at start
    useEffect( () => {
        loadOrders();
        loadStatusValues();
    }, [])

    //Show how manu order are
    const showOrdersLength = () => {
        if(orders && orders.length > 0){
            return (
                <h1 className="text-danger display-2">Total orders: {orders.length}</h1>
            )
        }else{
            return <h1 className="text-danger">No orders found</h1>
        }
    }

    //Show data of each product
    const showInput = (key, value) => (
        <div className="input-group mb-2 mr-sm-2">
            <div className="input-group-prepend">
                <div className="input-group-text">
                    {key}
                </div>
                <input 
                    type="text"
                    value={value}
                    className="form-control"
                    readOnly
                />
            </div>
        </div>
    );

    //handle status order, when it changes it load all orders again
    const handleStatusChange = (event, orderId) => {
        updateOrderStatus(user._id, token, orderId, event.target.value)
            .then(data => {
                if(data.error){
                    console.log('Status update failed');
                }else{
                    loadOrders();
                }
            })
    }

    //show status for each order
    const showStatus = (order) => (
        <div className="form-group">
            <h3 className="mark mb-4">
                Status: {order.status}
            </h3>
            <select 
                className="form-control" 
                onChange={(e) => handleStatusChange(e,order._id)}>
                    <option>Update Status</option>
                    {statusValues.map((status, index) => (
                        <option 
                            key={index} 
                            value={status}>
                            {status}
                        </option>
                    ))}
            </select>
        </div>
    )

    return ( 
        <Layout
            title="Orders"
            description={"Orders management"}
        >
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showOrdersLength()}
                    {orders.map((order, oIndex) => {
                        return (
                            <div
                                className="mt-5"
                                key={oIndex}
                                style={{borderBottom: '5px solid indigo'}}
                            > 
                                <h2 className="mb-5">
                                    <span className="bg-primary">
                                        Order ID: {order._id}
                                    </span>
                                </h2>

                                <ul className="list-group mb-2">
                                    <li className="list-group-item">
                                        {showStatus(order)}
                                    </li>
                                    <li className="list-group-item">
                                        Transaction ID: {order.transaction_id}
                                    </li>
                                    <li className="list-group-item">
                                        Amount: {order.amount}
                                    </li>
                                    <li className="list-group-item">
                                        Orderer by: {order.user.name}
                                    </li>
                                    <li className="list-group-item">
                                        Orderer on: {moment(order.createdAt).fromNow()}
                                    </li>
                                    <li className="list-group-item">
                                        Delivery address: {order.address}
                                    </li>
                                </ul>

                                <h3 className="mt-4 mb-4 font-italic">
                                    Total product in the order: {order.products.length}
                                </h3>
                                {/* Products of each order */}
                                {order.products.map((product, pIndex) => (
                                    <div 
                                        className="mb-4" 
                                        key={pIndex}
                                        style={{padding: '20px', border: '1px solid indigo'}}
                                    >
                                        {showInput('Product name', product.name)}
                                        {showInput('Product price', product.price)}        
                                        {showInput('Product total', product.count)}        
                                        {showInput('Product id', product._id)}        
       
        
                                    </div>
                                ))}

                            </div>
                        )
                    }) }
                </div>
            </div>

        </Layout>
     );
}
 
export default Orders;