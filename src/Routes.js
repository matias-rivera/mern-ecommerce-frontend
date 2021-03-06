import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Signup from './user/Signup';
import Signin from './user/Signin';
import Home from './core/Home';
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';
import Dashboard from './user/UserDashboard';
import AdminDashboard from './user/AdminDashboard';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';
import Shop from './core/Shop';
import Product from './core/Product';
import Cart from './core/Cart';
import Orders from './admin/Orders';
import Profile from './user/Profile';




const Routes = () => {
    return (
    <BrowserRouter>
 
        <Switch>
            <Route path="/signin" exact component={Signin}/>
            <Route path="/signup" exact component={Signup}/>
            <Route path="/shop" exact component={Shop}/>
            <PrivateRoute path="/user/dashboard" exact component={Dashboard} />
            <PrivateRoute path="/profile/:userId" exact component={Profile} />
            <AdminRoute path="/admin/dashboard" exact component={AdminDashboard} />
            <AdminRoute path="/admin/orders" exact component={Orders} />
            <AdminRoute path="/create/category" exact component={AddCategory} />
            <AdminRoute path="/create/product" exact component={AddProduct} />
            <Route path="/product/:productId" exact component={Product}/>
            <Route path="/cart" exact component={Cart}/>
            <Route path="/" component={Home}/>

        </Switch>
    </BrowserRouter>
    )
}

export default Routes;