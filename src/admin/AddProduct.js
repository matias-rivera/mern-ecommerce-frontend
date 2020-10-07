import React, {useState, useEffect} from 'react';
import Layout from '../core/Layout'
import { isAuthenticated } from './../auth/index';
import { Link } from 'react-router-dom';
import { createProduct, getCategories } from './apiAdmin';


const AddProduct = () => {

    // destructure from local storage
    const {user, token} = isAuthenticated()

    
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        categories: [],
        category: '',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        error: '',
        createdProduct: '',
        redirectToProfile: false,
        formData: ''
    })

    //destructured values
    const {
        name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData
    } = values;


    //load all categories
    const init = () => {
        getCategories().then(data => {
            if(data.error) {
                setValues({...values, error: data.error})
            }else{
                setValues({...values, categories: data, formData: new FormData})
            }
        })
    }

    //check when values change
    useEffect(() => {
        init();
    }, []);

    const handleChange = name => event => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({...values, [name]: value});
        
    }

    //when form is sent
    const onSubmit = (event) => {
        event.preventDefault();
        setValues({...values, error:'',loading:true});

        //call to api
        createProduct(user._id, token, formData)
            .then(data => {
                if(data.error) {
                    setValues({...values, error: data.error})
                } else {
                    //clear values
                    setValues({
                        ...values, 
                        name: '', 
                        description: '', 
                        photo: '', 
                        price: '', 
                        quantity: '',
                        loading: false,
                        createdProduct: data.name
                    })
                }
            })
    }

    //form
    const newPostForm = () => (
        <form className="mb-3" onSubmit={onSubmit}>
            <h4>Post Photo</h4>
            <div className="form-group">
                <label className="btn btn-secondary">
                    <input 
                    type="file" 
                    name="photo" 
                    accept="image/*"
                    onChange={handleChange('photo')}
                    />
                </label>
            </div>

            <div className="form-group">
                <label className="text-muted" >Name</label>
                <input 
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={handleChange('name')}
                />
            </div>

            <div className="form-group">
                <label className="text-muted" >Description</label>
                <textarea 
                    className="form-control"
                    value={description}
                    onChange={handleChange('description')}
                />
            </div>

            <div className="form-group">
                <label className="text-muted" >Price</label>
                <input 
                    type="number"
                    className="form-control"
                    value={price}
                    onChange={handleChange('price')}
                />
            </div>

            <div className="form-group">
                <label className="text-muted" >Category</label>
                <select 
                    className="form-control"
                    onChange={handleChange('category')}
                >
                    <option >Select Category</option>
                    {categories && categories.map((c, i) => (
                        <option key={i} value={c._id}>{c.name}</option>
                    ))}


                </select>
            </div>

            <div className="form-group">
                <label className="text-muted" >Quantity</label>
                <input 
                    type="number"
                    className="form-control"
                    value={quantity}
                    onChange={handleChange('quantity')}
                />
            </div>

            <div className="form-group">
                <label className="text-muted" >Shipping</label>
                <select 
                    className="form-control"
                    onChange={handleChange('shipping')}
                >
                    <option>Select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>

                </select>
            </div>

            <button className="btn btn-outline-primary">Create Product</button>
        </form>
    )

    //show errors
    const showError = () =>(
        <div 
        className="alert alert-danger" 
        style={{display: error ? '' : 'none'}}>
            <h2>
                {error}

            </h2>
        </div>
    )

    //show product created
    const showSuccess = () =>(
        <div 
        className="alert alert-info" 
        style={{display: createdProduct ? '' : 'none'}}>
            
            <h2>{`${createdProduct}`} was created!</h2>
           
            
        </div>
    )

    //it show when is loading
    const showLoading = () =>(
        loading && (<div className="alert alert-success">
            <h2>Loading...</h2>
        </div>)
    );

    return (
        <Layout
            title="Add a new product"
            description="Add a new porduct"
        >
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                </div>
            </div>
        </Layout>
    );
}
export default AddProduct;