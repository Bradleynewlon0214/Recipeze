import React from 'react';
import ReportRecipe from './ReportRecipe';
import SaveRecipeStar from './SaveRecipeStar';
import RecipeManager from '../utils/RecipeManager';
import { Card, List } from 'antd';
import { Link } from 'react-router-dom';
import { CommentOutlined } from '@ant-design/icons';

class Recipes extends React.Component{

    constructor(props){
      super(props);

      const rm = new RecipeManager();
      this.saved = rm.containsID.bind(this);
      this.addRecipe = rm.add.bind(this);
      this.removeRecipe = rm.removeRecipe.bind(this);
    }

    handleSave = (id) => {
      id = Number(id);
      if(this.saved(id)){
        this.removeRecipe(id);
      } else {
        this.addRecipe(id);
      }
    }

    render(){
      const { recipes, loading, recipeOnClick } = this.props;
      return(
            <List
              itemLayout="vertical"
              loading={loading}
              grid={{
                gutter: 8,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 3,
                xxl: 4,
              }}
              pagination={this.props.pagination}
              dataSource={recipes}
              renderItem={item => (
                <List.Item>
                  <Card style={{ width: "100%" }} title={<Link onClick={() => recipeOnClick(item.id)} to={`/recipe/${item.id}`}>{item.name}</Link>} 
                        actions={[  <SaveRecipeStar id={item.id} stars={item.stars}/>,
                          <span><CommentOutlined /> {item.recipe_comments.length}</span>,
                                    <ReportRecipe recipeID={item.id}/> 
                                ]} 
                        cover={ [<img alt="recipePicture" loading="lazy" src={item.picture_link}/>] }
                  >
                    <p>{item.description}</p>
                    {
                      (item.num_similar) ?
                        <div>
                          <h3>Related Ingredients</h3>    
                          <List itemLayout="vertical" dataSource={item.similar} renderItem={ item => ( <p>{item}</p> ) } />
                        </div>
                      :
                        null
                    }
                  </Card>
                </List.Item>
              )}
            />

      );

    }
}

export default Recipes;