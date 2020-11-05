import React from 'react';
import axios from 'axios';
import { SERVER } from '../utils/server';
import Comments from '../components/Comments';
import { Skeleton, message, Divider } from 'antd';
import PaginatedRecipes from '../components/PaginatedRecipes';
import RecipeDetail from '../components/RecipeDetail';
import RecipeManager from '../utils/RecipeManager';

class RecipeDetailView extends React.Component{
    state = {
        recipeID: this.props.match.params.recipeID,
        recipe: {},
        loading: true,
        page: this.props.match.params.page,
    }

    componentDidMount(){
        const { recipeID } = this.props.match.params;
        this.getRecipeData(recipeID);
        document.title = "Recipe";
    }

    componentDidUpdate(prevProps){
        if(prevProps.match.params.page !== this.props.match.params.page || prevProps.match.params.recipeID !== this.props.match.params.recipeID){
            this.componentDidMount();
        }
    }

    getRecipeData = (id) => {
        axios.get(`${SERVER}/api/recipe/${id}`)
            .then(res =>{
                const common_ingredients = ['kosher salt', 'ground black pepper', 'butter', 'sugar', 'water', 'milk', 'kosher salt', 'unsalted butter'];
                const rm = new RecipeManager();

                let ingredients = null;
                if(rm.getNumberOfRecipes() > 0){
                    ingredients = rm.getIngredients();
                } else{
                    ingredients = this.getCleanedIngredients(res.data.ingredients_cleaned);
                    common_ingredients.forEach(item => {
                        var i = ingredients.indexOf(item);
                        if(i > -1){
                            ingredients.splice(i, 1);
                        }
                    });
                } 

                const ingredients_string = ingredients.join(",");

                var page = this.props.match.params.page;
                if(!page){
                    page = 1;
                }
                const endPoint = `/api/ingredients/${ingredients_string.toLowerCase()}`;

                this.setState({
                    endPoint:endPoint,
                    loading: false,
                    recipeID: id,
                    recipe: res.data,
                    page: page,
                })
            })
            .catch(error => {
                message.error("We couldn't find that one!");
                console.log(error);
                // this.props.history.push("/");
            });
    }

    getCleanedIngredients = (ingredients_cleaned) => {
        let cleaned_ingredients = [];
        if(ingredients_cleaned.length > 0){
            for(let i = 0; i < ingredients_cleaned.length; i++){
                if(String(ingredients_cleaned[i].quantity).trim() !== "<empty string>".trim() && ingredients_cleaned[i].ingredient.trim() !== "<empty string>".trim() && ingredients_cleaned[i].ingredient.trim() !== ""){
                    cleaned_ingredients.push(ingredients_cleaned[i].ingredient);
                }
            }
        }
        return cleaned_ingredients;
    }
    
    render(){
        const { loading, recipeID, recipe, page, endPoint, } = this.state;
        return(
            <Skeleton active loading={loading}>
                <RecipeDetail recipe={recipe} />
                <Divider />
                <PaginatedRecipes heading="Related Recipes" page={page} endPoint={endPoint} url={`/recipe/${recipeID}`} />
                <Comments comments={recipe.recipe_comments} recipeID={recipeID}/>
            </Skeleton>
        );
    }
}
export default RecipeDetailView;