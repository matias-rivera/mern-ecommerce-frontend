import React,{useState, useEffect} from 'react';
import Layout from './Layout';
import Card from './Card';
import { getCategories, getFilteredProducts } from './apiCore';
import Checkbox from './Checkbox';
import RadioBox from './RadioBox';
import { prices } from './fixedPrices';



const Shop = () => {

    //store selected filters, by categories and range of price
    const [myFilters, setMyFilters] = useState({
        filters:{category: [], price: []} 
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(false);
    const [limit, setLimit] = useState(6); //limit of products
    const [skip, setSkip] = useState(0); //used for load more products
    const [size, setSize] = useState(0); //size of products get it from api
    const [filteredResults, setFilteredResults] = useState([]); // 

     //load all categories
     const init = () => {
        getCategories().then(data => {
            if(data.error) {
                setError(data.error)
            }else{
                setCategories(data)
            }
        })
    };

    const loadFilteredResults = (newFilters) => {
        //console.log(newFilters);
        getFilteredProducts(skip, limit, newFilters)
            .then(data => {
                if(data.error){
                    setError(data.error);
                }else{
                    setFilteredResults(data.data);
                    setSize(data.size);
                    setSkip(0);
                }
            });
    };

    // load more products
    const loadMoreProducts = () => {
        //skip already loaded products
        let toSkip = skip + limit

        getFilteredProducts(toSkip, limit, myFilters.filters)
            .then(data => {
                if(data.error){
                    setError(data.error);
                }else{
                    setFilteredResults([...filteredResults, ...data.data]);
                    setSize(data.size);
                    setSkip(toSkip);
                }
            });
    };

    // button on click call loadMoreProducts function
    const loadMoreButton = () => {
        return (
            size > 0 && size >= limit && (
                <button 
                onClick={loadMoreProducts}
                className="btn btn-warning mb-5">
                    Load More
                </button>
            )
        )
    }

    //on component mount, load all products and categories
    useEffect(() => {
        init();
        loadFilteredResults(skip, limit, myFilters.filters);
    }, []);

    //handle filters of categories and prices
    const handleFilters = (filters, filterBy) => {
        //console.log("SHOP",filters, filterBy);
        const newFilters = {...myFilters};
        newFilters.filters[filterBy] = filters;

        //handle select range of price
        if(filterBy == "price"){
            let priceValues = handlePrice(filters);
            newFilters.filters[filterBy] = priceValues;
        }

        //load products
        loadFilteredResults(myFilters.filters);
        setMyFilters(newFilters);
    };

    //
    const handlePrice = value => {
        //get prices from fixedPrices.js
        const data = prices

        let array = []
        
        //get ramge of price of clicked value
        for(let key in data){
            if(data[key]._id === parseInt(value)){
                array = data[key].array;
            }
        }
        //return array of value [minvalue ,maxvalue]
        return array;
    }

    

    return ( 
        <Layout
         title="Shop Page" 
         description="Search products of your choice" 
         className="container-fluid">
            
            <div className="row">
                <div className="col-4">
                    <h4>Filter by categories</h4>
                    <ul>
                        <Checkbox 
                            categories={categories} 
                            handleFilters={filters => handleFilters(filters, 'category')}
                         />
                    </ul>

                    <h4>Filter by price range</h4>
                    <div>
                        <RadioBox 
                            prices={prices} 
                            handleFilters={filters => handleFilters(filters, 'price')}
                         />
                    </div>
                </div>

                <div className="col-8">
                    <h2 className="mb-4">Products</h2>
                    <div className="row">
                        {filteredResults.map((product, i) => (
                                <Card key={i} product={product}/>
                        ))}
                    </div>
                    <hr />
                    {loadMoreButton()}
                </div>
            </div>

        </Layout>
    );
};

export default Shop;