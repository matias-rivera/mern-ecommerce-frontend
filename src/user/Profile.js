import React, {useState, useEffect} from 'react';
import Layout from '../core/Layout'
import { isAuthenticated } from './../auth/index';
import { Link, Redirect } from 'react-router-dom';
import {read, update, updateUser} from './apiUser';

const Profile = ({match}) => {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: false,
        success: false
    });

    const {token} = isAuthenticated();

    const {name, email, password, error, success} = values;

    //get user info
    const init = (userId) => {
        read(userId, token).then(data =>{
            if(data.error) {
                setValues({...values, error: true})
            }else{
                setValues({...values, name: data.name, email: data.email})
            }
        })
    }

    //run at start
    useEffect(() => {
        init(match.params.userId);
    }, []);


    //handle form inpunt
    const handleChange = name => event => {
        setValues({...values, error: false, [name]: event.target.value});
    };

    //handle submit button
    const onSubmit = (event) => {
        event.preventDefault();
        //update user on server
        update(match.params.userId, token, {name, email, password})
            .then(data => {
                if(data.error){
                    console.log(data.error)
                }else{
                    //update on local storage
                    updateUser(data, () => {
                        setValues({...values, name:data.name, email: data.email, success: true
                        });
                    });
                }
            });
    };

    //redirect after a successfully update
    const redirectUser = success => {
        if(success){
            return <Redirect to="/cart" />
        }
    }

    //update form
    const profileUpdate = (name, email, password) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input 
                    type="text"
                    onChange={handleChange('name')}
                    className="form-control"
                    value={name}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input 
                    type="email"
                    onChange={handleChange('email')}
                    className="form-control"
                    value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input 
                    type="password"
                    onChange={handleChange('password')}
                    className="form-control"
                    value={password}
                />
            </div>
            <button
                onClick={onSubmit}
                className="btn btn-primary"
            >
                Submit
            </button>
        </form>
    );


    return(
        <Layout
            title="Profile"
            description="Update profiel"
            className="container-fluid"
        >
            <h2 className="mb-4">
                Profile update
            </h2>
            {redirectUser(success)}
            {profileUpdate(name, email, password)}
        </Layout>
    )
}


export default Profile;