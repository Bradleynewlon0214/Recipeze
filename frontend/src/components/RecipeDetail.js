import React from 'react';
import { Card, List, Row, Col, Tag} from 'antd';
import { CommentOutlined } from '@ant-design/icons';

import SaveRecipeStar from '../components/SaveRecipeStar';
import ReportRecipe from '../components/ReportRecipe';
import { Link } from 'react-router-dom';



const RecipeDetail = ({ recipe }) => {
    const tagColors = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "cyan", "geekblue", "purple"];

    function getRandomInt(max) {
        var min = 0;
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return(
        <Card 
            title={<h1>{recipe.name}</h1>} 
            actions={[ <SaveRecipeStar id={recipe.id} stars={recipe.stars} />,
                <span onClick={ () => window.scrollTo(10000000, 10000000) }><CommentOutlined /> {recipe.recipe_comments.length}</span>,
            <ReportRecipe recipeID={recipe.id}/> ]} 
        >
            <Row>
                <Col flex="0 1 500px">
                        <img
                        style={{ width: '90%', height: '90%' }}
                        alt="logo"
                        src={recipe.picture_link}
                        /> 
                </Col>
                <Col flex="1 1 500px">
                    <Row>
                        <h3 style={{ width: "100%" }}>Description</h3>
                        <p  style={{ width: "100%" }}>{recipe.description}</p>
                    </Row>
                </Col>
            </Row>

            <Row>
                <Col flex="0 1 500px">
                    <p>This recipe is from: <a href={recipe.link}>{ (recipe.link.includes("epicurious.com")) ? "epicurious" : recipe.user.username }</a></p>
                    <p>This recipe yields: {recipe.yields}</p>
                    <List   size="small"
                            header={<h3>Ingredients</h3>}
                            dataSource={recipe.ingredients}
                            renderItem={item => <List.Item>{item}</List.Item>}
                    >

                    </List>
                </Col>
                <Col flex="1 1 500px">
                    <Row>
                        <h3>Directions</h3>
                        <p>{recipe.steps}</p>
                    </Row>
                        {
                            (recipe.nutrition) ?
                                <div>
                                <h3>Nutrition Information</h3>
                                <Row style={{ margin: "0% 0% 1% 0%" }}>
                                <Col span={12}>Calories: {recipe.nutrition.Calories} - {recipe.per_serving}</Col>
                                <Col span={12}>Sodium: {recipe.nutrition.Sodium}</Col>
                                </Row>
                                
                                <Row style={{ margin: "0% 0% 1% 0%" }}>
                                <Col span={12}>Carbohydrates: {recipe.nutrition.Carbohydrates}</Col>
                                <Col span={12}>SaturatedFat: {recipe.nutrition.SaturatedFar}</Col>
                                </Row>
                                
                                <Row style={{ margin: "0% 0% 1% 0%" }}>
                                <Col span={12}>Fat: {recipe.nutrition.Fat}</Col>
                                <Col span={12}>Fiber: {recipe.nutrition.Fiber}</Col>
                                </Row>
                                
                                <Row style={{ margin: "0% 0% 1% 0%" }}>
                                <Col span={12}>Protein: {recipe.nutrition.Protein}</Col>
                                <Col span={12}>MonoFat:  {recipe.nutrition.MonoFat}</Col>
                                </Row>
                                
                                <Row style={{ margin: "0% 0% 1% 0%" }}>
                                <Col span={12}>Cholesterol:  {recipe.nutrition.Cholesterol}</Col>
                                <Col span={12}>PolyFat:  {recipe.nutrition.PolyFat}</Col>
                                </Row>
                                </div>
                            :
                                null
                        }
                        

                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ margin: "2% 0% 0% 0%" }}>
                    
                    {
                        (recipe.tags) ?
                        recipe.tags.map((val, index) => {
                            return(
                                <Tag color={tagColors[getRandomInt(tagColors.length)]} ><Link to={`/discover/tag/${val.tag_slug}`}>{val.tag}</Link></Tag>
                            )
                        })
                        :
                        null
                    }
                    
                </Col>
            </Row>
        </Card>
    );

}
export default RecipeDetail;