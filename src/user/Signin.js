import React, {useState} from 'react';
import Layout from './../core/Layout';
import { Redirect } from 'react-router-dom';
import { signin, authenticate, isAuthenticated } from '../auth';




const Signin = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
        redirectToReferrer: false
    });

    const {email, password, error, loading, redirectToReferrer} = values;
    const {user} = isAuthenticated();

    //handle changes on values
    const handleChange = name => event => {
        setValues({...values, error:false, [name]: event.target.value});
    };

    
    
    const onSubmit = (e) => {
        e.preventDefault();
        //set values on state
        setValues({...values, error: false, loading: true});
        //use signin from auth
        signin({email, password})
        .then(data => {
            if(data.error){
                //return errors
                setValues({...values, error: data.error, loading: false})
            } else{
                //use authenticate from auth
                authenticate(data,
                    () => {
                        setValues({...values, redirectToReferrer: true});
                    });
            }
        });
    }

    //Form
    const signUpForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input 
                    onChange={handleChange('email')} 
                    type="email" 
                    className="form-control"
                    value={email}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input 
                    onChange={handleChange('password')} 
                    type="password" 
                    className="form-control"
                    value={password}
                />
            </div>

            <button onClick={onSubmit} className="btn btn-primary">Submit</button>
        </form>
    );

    //Display errors
    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    )

    //when request is send it will show  
    const showLoading = () => 
        loading && (
            <div className="alert alert-info">
                <h2>Loading...</h2>
            </div>
            );
    
    //after sign in redirect to home
    const redirectUser = () => {
        //check for role to redirect to dashboard
        if(redirectToReferrer){
            if(user && user.role === 1){
                return <Redirect to ="/admin/dashboard" />;
            }
            else{
                return <Redirect to ="/user/dashboard" />;
            }
        }
        //if user is already authenticated, redirect to home
        if(isAuthenticated()) {
            return <Redirect to="/" />;
        }
    }


    return ( 
        <Layout 
            title="Signin" 
            description="Signin to MERN E-Commerce App"
            className="container col-md-8 offset-md-2"
        >
            {showLoading()}
            {showError()}
            {signUpForm()}
            {redirectUser()}
        </Layout>
     );
}
 
export default Signin;