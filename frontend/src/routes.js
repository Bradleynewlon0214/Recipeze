import React from 'react';
import { Route } from 'react-router-dom';

import RecipeList from './containers/RecipeListView';
import RecipeDetailView from './containers/RecipeDetailView';
import SavedRecipes from './containers/SavedRecipes';
import Discover from './containers/Discover';
import AddRecipe from './containers/AddRecipe'
import Login from './containers/Login';
import Signup from './containers/Signup';
import Account from './containers/Account';
import ConfirmResetPassword from './containers/ComfirmResetPassword';

const BaseRouter = () =>(

    <div>
        <Route exact path="/" component={RecipeList} />
        <Route exact path="/page/:page" component={RecipeList} />

        <Route exact path="/recipe/:recipeID" component={RecipeDetailView} />
        <Route exact path="/recipe/:recipeID/page/:page" component={RecipeDetailView} />

        <Route exact path="/saved" component={SavedRecipes} />

        <Route exact path="/discover" component={Discover} />
        <Route exact path="/discover/search/:term/page/:page" component={Discover} />

        <Route exact path="/discover/tag/:tag" component={Discover}/>
        <Route exact path="/discover/tag/:tag/page/:page" component={Discover} />

        <Route exact path="/add" component={AddRecipe} />
        <Route exact path="/login/" component={Login} />
        <Route exact path="/signup/" component={Signup} />
        <Route exact path="/account" component={Account} />
        <Route exact path="/rest-auth/password/reset/confirm/:uidb64/:token" component={ConfirmResetPassword} />
    </div>

);

export default BaseRouter;