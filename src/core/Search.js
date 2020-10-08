import React,{useState, useEffect} from 'react';
import {getCategories, list} from './apiCore';
import Card from './Card';

const Search = () => {
    
    const [data, setData] = useState({
        categories: [],
        category: '',
        search: '',
        results: [],
        searched: false
    });

    const {
        categories, category, search, results, searched
    } = data;

    //get categories from api
    const loadCategories = () => {
        getCategories().then(data =>{
            if(data.error){
                console.log(data.error);
            }else{
                setData({...data, categories: data});
            }
        })
    }

    //load categories at start
    useEffect(() => {
        loadCategories()
    }, []);

    //get products searched from api
    const searchData = () => {
        if(search){
            list({search: search || undefined, category: category})
                .then(response =>{
                    if(response.e){
                        console.log(response.error)
                    }else{
                        setData({...data,results: response, searched: true});
                    }
                })
        }
    }

    //on submit search form
    const onSubmit = (event) =>{
        event.preventDefault();
        searchData();
    };

    //handle typing on search input
    const handleChange = (name) => event => {
        setData({...data, [name]: event.target.value, searched:false});

    };

    //return a message showing search results
    const searchMessage = (searched, results) => {
        if(searched && results.length > 0){
            return `${results.length} products found`;
        }
        if(searched && results.length < 1){
            return 'No products found';
        }
    }

    //display search results on Card components
    const searchedProducts = (results = []) => {
        return (
            <div>
                <h2 className="mt-4 mb-4">
                    {searchMessage(searched, results)}
                </h2>
                <div className="row">
                    {results.map((product, i) => (
                        <Card key={i} product={product} />
                    ))}
                </div>
            </div>
        );
    };

    //Search form
    const searchForm = () => (
        <form onSubmit={onSubmit}>
            <span className="input-group-text">
                <div className="input-group input-group-lg">
                    <div className="input-group-prepend">
                        <select 
                            className="btn mr-2" 
                            onChange={handleChange("category")}
                        >
                            <option value="All">All</option>
                            {categories.map((c, i) => (
                                <option key={i} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <input 
                        type="search" 
                        className="form-control" 
                        onChange={handleChange("search")}
                        placeholder="Search by name"
                    />
                </div>
                <div className="btn input-group-append" style={{border:'none'}}>
                    <button className="input-group-text">Search</button>
                </div>
            </span>
        </form>
    );

    return ( 
        <div className="row">
            <div className="container mb-3">
                {searchForm()}            
            </div>
            <div className="container-fluid mb-3">
                {searchedProducts(results)}            
            </div>
        </div>
     );
}
 
export default Search;