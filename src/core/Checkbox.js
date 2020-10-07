import React,{useState, useEffect} from 'react';

const Checkbox = ({categories, handleFilters}) => {

    const [checked, setChecked] = useState([]);

    const handleToggle = c => () =>{
        //return -1 if category is not on state
        const currentCategoryId = checked.indexOf(c);
        const newCheckedCategoryId = [...checked];
        // if category is not already on state, it get inserted to array
        if(currentCategoryId === -1){
            newCheckedCategoryId.push(c);
        }else {
            //if category is on state, it get removed
            newCheckedCategoryId.splice(currentCategoryId, 1);
        }
        //console.log(newCheckedCategoryId);
        setChecked(newCheckedCategoryId);
        handleFilters(newCheckedCategoryId);

    };

    return categories.map((c, i) => (
        <li  key={i}className="list-unstyled">
            <input 
            onChange={handleToggle(c._id)} 
            value={checked.indexOf(c._id === -1)}
            type="checkbox" 
            className="form-check-input"/>
            <label className="form-check-label">{c.name}</label>
        </li>
    ))
};

export default Checkbox;