import React,{useState, useEffect} from 'react';
import Layout from './Layout';
import {read, listRelated} from './apiCore';
import Card from './Card';


const Product = (props) => {
    const [product, setProduct] = useState({});
    const [error, setError] = useState(false);
    const [relatedProduct, setRelatedProduct] = useState([]);
    
    //request to api for product data using product id 
    const loadSingleProduct = productId => {
        read(productId).then(data => {
            if(data.error){
                setError(data.error);
            } else{
                setProduct(data);
                // fetch related products
                listRelated(data._id)
                    .then(data =>{
                        if(data.error){
                            setError(data.error);
                        }else{
                            setRelatedProduct(data);
                        }
                    });
            }
        })
    }

    //load at start and everytime the props are change
    useEffect(() => {
        const productId = props.match.params.productId;
        loadSingleProduct(productId);
    }, [props]);

    return ( 
        <Layout 
        title={product && product.name} 
        description={
            product && 
            product.description && 
            product.description.substring(0,100)} 
        className="container-fluid"
        >
            <div className="row">
                <div className="col-8">
                {
                    product && 
                    product.description && 
                    <Card 
                        product={product}
                        showViewProductButton={false}
                    />
                }
                </div>
                <div className="col-4">
                    <h4>Related Products</h4>
                    {relatedProduct.map((product, i) => (
                        <div key={i} className="mb-3">
                            <Card product={product}/>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default Product;