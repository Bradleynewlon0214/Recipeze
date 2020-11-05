import React from 'react';
import PaginatedRecipes from '../components/PaginatedRecipes';


class RecipeList extends React.Component{

    componentDidMount(){
        document.title = "Home";
    }

    render(){

        let page  = this.props.match.params.page;
        if(!page){
            page = 1;
        }

        return(
            <PaginatedRecipes page={page} endPoint={"/api/recipes/"} />
        );
    }


}

export default RecipeList;