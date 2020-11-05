import axios from 'axios';
import { SERVER } from './server';


class RecipeManager{
  state = {}
  constructor(){
    this.state["recipeIDS"] = this.getRecipeIDS();
    this.state["recipeData"] = this.getRecipeData();
  }

  compareNumbers = (a, b) => {
    return a - b;
  }

  getNumberOfRecipes = () => {
    return (this.state["recipeIDS"]) ? this.state["recipeIDS"].length : 0;
  }

  getRecipeData = () => {
    return JSON.parse(localStorage.getItem('recipeData'));
  }
  setRecipeData(recipeData){
    localStorage.setItem('recipeData', JSON.stringify(recipeData));
    this.state["recipeData"] = recipeData;
  }


  getRecipeIDS = () => { 
    return JSON.parse(localStorage.getItem('recipeIDS'));
  }
  setRecipeIDS = (recipes) => {
    recipes.sort(this.compareNumbers);
    localStorage.setItem('recipeIDS', JSON.stringify(recipes));
    this.state["recipeIDS"] = recipes;
  }

  search = (left, right, target, arr) => {
    if(left <= right){
      let middle = Math.floor((right + left) / 2);
      
      if(arr[middle] === target){
        return middle;
      }

      if(target > arr[middle]){
        return this.search(middle + 1, right, target, arr);
      }

      if(target < arr[middle]){
        return this.search(left, middle - 1, target, arr);
      }
    }
    return -1;
  }

  containsID = (id) => {
    let recipes = this.getRecipeIDS();
    if(recipes !== null){
      const ans = this.search(0, recipes.length, id, recipes);
      if(ans === -1){
        return false;
      } else{
        return true;
      }
    } else{
      return false;
    }
      
  }

  searchData = (id) => {
    let recipeData = this.getRecipeData();
    if(recipeData != null){
      for(let i = 0; i < recipeData.length; i++){
        if(recipeData[i].id === id){
          return i;
        }
      }
    }
    return -1;
  }

  add = (id) => {
    this.addID(id);
    this.addData(id)
  }

  addID = (id) => {
    let recipes = this.getRecipeIDS();
    if(recipes === null){
      recipes = [id]
    } else {
      const ans = this.search(0, recipes.length, id, recipes);
      if(ans === -1){ //not found
        recipes.push(id);
      }
    }
    this.setRecipeIDS(recipes);
  }

  addData = async (id) => {
    let recipeData = this.getRecipeData();
    let promise = await axios.get(`${SERVER}/api/recipe/${id}`);
    if(recipeData === null){
      recipeData = [promise.data];
    } else{
      const ans = this.searchData(id);
      if(ans === -1){
        recipeData.push(promise.data);
      }
    }
    this.setRecipeData(recipeData);
  }

  removeRecipeID = (id) => {
    let recipes = this.getRecipeIDS();
    let loc = this.search(0, recipes.length, id, recipes);
    recipes.splice(loc, 1);
    this.setRecipeIDS(recipes);
  }

  removeRecipeData = (id) => {
    let recipeData = this.getRecipeData();
    let loc = this.searchData(id);
    recipeData.splice(loc, 1);
    this.setRecipeData(recipeData);
  }

  removeRecipe = (id) =>{
    this.removeRecipeID(id);
    this.removeRecipeData(id);
  }

  clearRecipes = () => {
    this.setRecipeIDS(null);
    this.setRecipeData(null);
  }

  getIngredients = () => {
    const recipes = this.state["recipeData"];
    var ingredients = [];
    if(recipes){
      recipes.forEach(item => {
        item.ingredients_cleaned.forEach(j => {
          ingredients.push(j.ingredient);
        });
      });
    }
    return ingredients;
  }
}

export default RecipeManager;