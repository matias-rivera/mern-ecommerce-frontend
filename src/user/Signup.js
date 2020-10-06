import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout';
import { signup } from './../auth/index';


const Signup = () => {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    });

    const {name, email, password, success, error} = values;

    //handle changes on values
    const handleChange = name => event => {
        setValues({...values, error:false, [name]: event.target.value});
    };

    

    const onSubmit = (e) => {
        e.preventDefault();
        //set values on state
        setValues({...values, error: false});
        //use signup from auth
        signup({name, email, password})
        .then(data => {
            if(data.error){
                //return errors
                setValues({...values, error: data.error, success: false})
            } else{
                //clear values
                setValues({...values, name:'', email: '', password: '', error: '', success: true})
            }
        })
    }

    //form
    const signUpForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input 
                    onChange={handleChange('name')} 
                    type="text" 
                    className="form-control"
                    value={name}
                />
            </div>

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

    //show errors
    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    )

    //show success message
    const showSuccess = () => (
        <div className="alert alert-info" style={{display: success ? '' : 'none'}}>
            New account was created. Please <Link to ="/signin">Sign in</Link>
        </div>
    )

    return ( 
        <Layout 
            title="Signup" 
            description="Signup to MERN E-Commerce App"
            className="container col-md-8 offset-md-2"
        >
            {showSuccess()}
            {showError()}
            {signUpForm()}
        </Layout>
     );
}
 
export default Signup;