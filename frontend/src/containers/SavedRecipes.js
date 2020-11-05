import React from 'react';
import { Table, Button, List, Card, Menu, Col } from 'antd';
import RecipeManager from '../utils/RecipeManager';
import SubMenu from 'antd/lib/menu/SubMenu';
import { Link } from 'react-router-dom';

import ExportIngredients from '../components/ExportIngredients';

const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        (record.id > -1) ? <Link to={`/recipe/${record.id}`}>{text}</Link> :<Link to="/">{text}</Link>
      )
    },
];
  

class SavedRecipes extends React.Component{

    state = {
        selectedRowKeys: [],
        loading: false,
        data: [],
        selectedIngredients: [],
    }

    componentDidMount(){
        document.title = "Your Saved Recipes";
        let rm = new RecipeManager();
        rm.getIngredients();
        let recipeData = rm.getRecipeData();
        let data = [];
        let names = [];
        if(recipeData !== null && recipeData.length > 0){
            for(let i = 0; i < recipeData.length; i++){
                data.push({
                    key: i,
                    name: recipeData[i].name,
                    id: recipeData[i].id,
                    ingredients: recipeData[i].ingredients,
                    ingredients_cleaned: recipeData[i].ingredients_cleaned,
                });
                names.push(recipeData[i].name);
            }
            this.setState({
                data: data,
                names: names,
            });
        } else {
            this.setState({
                data: [{key: 0, name: "You haven't saved any recipes yet! :(", id: -1}]
            });
        }

    }

    handleDelete = () => {
        this.setState({
            loading: true,
        });
        let rm = new RecipeManager();
        const keys = this.state.selectedRowKeys;
        for(let i = 0; i < keys.length; i++){
            let val = this.state.data.filter(item => item.key === keys[i]);
            rm.removeRecipe(val[0].id);
        }
        
        setTimeout(() =>{
            this.setState({
                loading: false,
                selectedRowKeys: [],
                selectedIngredients: [],
            });
        }, 500);

        this.componentDidMount();
    }

    getDuplicates = (arr) => {
        const groupBy = key => array =>
            array.reduce((objectsByKeyValue, obj) => {
            const value = obj[key];
            objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
            return objectsByKeyValue;
        }, {});

        const groupByIngredient = groupBy('ingredient');
        return groupByIngredient(arr);
    }

    badMerge = (arr, propToCheck, propToMerge) => {
        var sum = 0;
        for(let i = 1; i < arr.length; i++){
            if(arr[i][propToCheck] === arr[i - 1][propToCheck]){
                sum++;
            }
        }
        if(sum === arr.length - 1){
            var sumTwo = arr.reduce((accum, currentVal) => accum + Number(currentVal[propToMerge]), 0);
            var obj = {};
            obj[propToMerge] = sumTwo;
            return {...arr[0], ...obj};
        } else{
            return arr;
        }
        
    }

    showIngredients = () => {
        const keys = this.state.selectedRowKeys;
        let ingredients = [];
        
        for(let i = 0; i < keys.length; i++){
            let val = this.state.data.filter(item => item.key === keys[i]);
            if(val[0].ingredients_cleaned !== undefined){
                ingredients.push(...val[0].ingredients_cleaned);
            }
        }

        let ingredient_keys = Object.keys(this.getDuplicates(ingredients));
        let selectedIngredientsObject = this.getDuplicates(ingredients)
        for(let i = 0; i < ingredient_keys.length; i++){
            let key = ingredient_keys[i];
            let n = selectedIngredientsObject[key].length;
            let arr = selectedIngredientsObject[key];
            if(n > 1){
                selectedIngredientsObject[key] = [this.badMerge(arr, "measurement", "quantity")]
            }
        }
        this.setState({
            selectedIngredients: ingredient_keys,
            selectedIngredientsObject: selectedIngredientsObject
        });
        return selectedIngredientsObject;
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys
        });
    }

    render(){
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        const capializeFirstChar = str => str.charAt(0).toUpperCase() + str.substring(1);
        return(

            <div>
                <div style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={this.handleDelete} disabled={!hasSelected} loading={loading}>
                        Delete
                    </Button>
                    
                    <Button type="primary" onClick={this.showIngredients} disabled={!hasSelected} loading={loading} style={{ marginLeft: 8 }}>
                        Show Ingredients
                    </Button>

                    <ExportIngredients disabled={!hasSelected} loading={loading} style={{ marginLeft: 8 }} getIngredients={this.showIngredients} recipes={this.state.names}/>

                    <span style={{ marginLeft: 8 }}>
                        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                    </span>
                </div>
                <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.data} />

                {
                    this.state.selectedIngredients[0] 
                        ? 
                            <Card>
                                <List   size="small"
                                        header={<div><h3>Ingredients</h3></div>}
                                        dataSource={this.state.selectedIngredients}
                                        renderItem={item => 
                                            <List.Item>
                                                <Col span={8}>{capializeFirstChar(item)}</Col>
                                                <Col span={8}>
                                                    <Menu mode="inline">
                                                        <SubMenu key="sub1" title="Quantities">
                                                            {this.state.selectedIngredientsObject[item].map( (val, idx) => {
                                                                return (<Menu.Item>{this.state.selectedIngredientsObject[item][idx].quantity}</Menu.Item>);
                                                            })}
                                                        </SubMenu>
                                                    </Menu>
                                                </Col>
                                                <Col span={8}>
                                                    <Menu mode="inline">
                                                        <SubMenu key="sub2" title="Measurements">
                                                            {this.state.selectedIngredientsObject[item].map( (val, idx) => {
                                                                return (<Menu.Item>{this.state.selectedIngredientsObject[item][idx].measurement}</Menu.Item>);
                                                            })}
                                                        </SubMenu>
                                                    </Menu>
                                                </Col>
                                            </List.Item>
                                        }
                                />
                            </Card> 
                        : 
                            <Card><h3>Outputed Ingredients will appear here!</h3></Card>
                }
            </div>

        );
    }
}

export default SavedRecipes;