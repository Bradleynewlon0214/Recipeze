import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { SERVER } from '../utils/server';
import Recipes from './Recipes';

import { Card, Row, Col } from 'antd';
import { DoubleLeftOutlined, LeftOutlined, RightOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';


/**
 * This component should take an API endpoint and a page number.
 * endpoint should be in form /api/recipes/ or /api/recipes/search/<STRING>
 */
class PaginatedRecipes extends React.Component{
    
    state = {
        count: 0,
        next: '',
        recipes: [],
        loading: true,
    }

    getNum = (str) =>{
        if(str !== null){
            let splt = str.split("=");
            let num = (splt[1]) ? splt[1] : 1;
            return Number(num);
        }
    }

    getRecipeID = () => {
        let x = this.props.url.split("/");
        return x[x.length - 1];
    }

    componentDidMount(){
        const page = this.props.page;
        const endPoint = this.props.endPoint;
        let queryString = `${SERVER}${endPoint}?page=${page}`;
        this.setState({ loading: true })
        axios.get(queryString)
        .then(res => {
            let recipes = null;
            if(endPoint.includes("/ingredients/")){
                recipes = [];
                let ids = [];
                ids.push(Number(this.getRecipeID()));
                res.data.results.forEach(item => {
                    const id = item.id;
                    if(!ids.includes(id)){
                        ids.push(id);
                        recipes.push(item);
                    }
                });
            } 
            else {
                recipes = res.data.results;
            }
            this.setState({
                count: res.data.count,
                next: this.getNum(res.data.next),
                prev: this.getNum(res.data.previous),
                recipes: recipes,
                loading: false,
            });
        })
    }

    componentDidUpdate(prevProps){
        if(prevProps.page !== this.props.page || prevProps.endPoint !== this.props.endPoint){
            this.componentDidMount();
        }
    }

    handleClick = () => {
        this.setState({
            recipes: [],
        });
    }

    render(){
        const { recipes, loading, count, next, prev } = this.state;
        const { page } = this.props;
        let url = this.props.url;
        if(url){
            url = `${url}/page/`;
        } else{
            url = `/page/`;
        }
        return(

            <div>

                <Row style={{ marginBottom: "1%" }}>
                    <Col span={8} push={16}>
                        <div style={{ float:'right' }} >
                        {
                            (prev) ?
                            <span>
                                <Link to={`${url}${1}`}><DoubleLeftOutlined>First</DoubleLeftOutlined></Link>
                                <Link to={`${url}${prev}`}><LeftOutlined>Prev</LeftOutlined></Link>
                            </span>
                            :
                            null

                        }

                        { page } / { Math.ceil( count / 24 ) }

                        {
                            (next) ?
                            <span>
                                <Link to={`${url}${next}`}><RightOutlined>Next</RightOutlined></Link>
                                <Link to={`${url}${Math.ceil( count / 24 )}`}><DoubleRightOutlined>Last</DoubleRightOutlined></Link>
                            </span>
                            :
                            null
                        }
                        </div>
                        
                    </Col>
                </Row>
                    
                {
                    (this.props.heading) ? <Card><h1>{this.props.heading}</h1></Card> : null
                }

                <Row>
                    <Col span={24}>
                        <Recipes pagination={false} recipes={recipes} loading={loading} recipeOnClick={this.handleClick}/>
                    </Col>
                </Row>


                <Row style={{ marginBottom: "1%" }}>
                    <Col span={8} push={16}>
                        <div style={{ float:'right' }}>
                        {
                            (prev) ?
                            <span>
                                <Link to={`${url}${1}`}><DoubleLeftOutlined>First</DoubleLeftOutlined></Link>
                                <Link to={`${url}${prev}`}><LeftOutlined>Prev</LeftOutlined></Link>
                            </span>
                            :
                            null

                        }

                        { page } / { Math.ceil( count / 24 ) }

                        {
                            (next) ?
                            <span>
                                <Link to={`${url}${next}`}><RightOutlined>Next</RightOutlined></Link>
                                <Link to={`${url}${Math.ceil( count / 24 )}`}><DoubleRightOutlined>Last</DoubleRightOutlined></Link>
                            </span>
                            :
                            null
                        }
                        </div>
                    </Col>
                </Row>

            </div>

        );
    }
}

export default withRouter(PaginatedRecipes);