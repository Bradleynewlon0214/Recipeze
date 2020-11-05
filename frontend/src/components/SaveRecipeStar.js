import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {SERVER} from '../utils/server';
import RecipeManager from '../utils/RecipeManager';
import { StarOutlined, StarFilled } from '@ant-design/icons';


const SaveRecipeStar = ({id, stars}) => {
    const [saved, setSaved] = useState(null);
    const [starsState, setStars] = useState(stars);

    useEffect(() => {
        function saved(id){
            const rm =  new RecipeManager();
            return rm.containsID(id)
        }
        setSaved(saved(id));
    }, [id, saved]);

    const starRecipe = () => {
        let data = new FormData();
        data.append('recipe_id', id);
        axios({
            method: 'post',
            url: `${SERVER}/api/recipe/star/`,
            data: data,
            headers: {'Content-Type': 'multipart/form-data'}
        })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    }

    const saveRecipe = () => {
        const rm = new RecipeManager();
        setSaved(!saved);
        id = Number(id);
        if(rm.containsID(id)){
          rm.removeRecipe(id);
        } else {
          rm.add(id);
        }
        if (saved) { 
           setStars(starsState - 1);
        } else { 
            setStars(starsState + 1);
            starRecipe();
        }
        
    }

    if(saved){
        return(
            <span><StarFilled onClick={saveRecipe} style={{ color: "gold" }} /> {starsState} </span>
        );
    } else {
        return(
            <span><StarOutlined onClick={saveRecipe} /> {starsState} </span>
        );
    }
}
export default SaveRecipeStar;