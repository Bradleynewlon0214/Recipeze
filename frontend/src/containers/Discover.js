import React from 'react';
import { Card, Form, Input, List} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PaginatedRecipes from '../components/PaginatedRecipes';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { SERVER } from '../utils/server';


class Discover extends React.Component{

    state = {
        loading: true,
        isTag: false,
        searched: false,
        searchTerm: this.props.match.params.term,
        page: this.props.match.params.page,
        tag: this.props.match.params.tag,
    }


    componentDidMount(){
        const { searchTerm, page, tag } = this.state;
        document.title = "Discover";
        if(searchTerm){
            let endPoint = `/api/recipes/search/${searchTerm}`;
            this.setState({
                searchTerm: searchTerm,
                endPoint: endPoint,
                loading: false,
                searched: true,
                page: page
            })
        }
        if(tag){
            let endPoint = `/api/tag/${tag}`;
            this.setState({
                endPoint: endPoint,
                loading: false,
                isTag: true,
                tag: tag,
                page: page,
            });
        }
        axios.get(`${SERVER}/api/tags/`)
        .then(res => {
            var tags = res.data;
            tags.sort((a, b) => a.slug > b.slug);
            this.setState({
                originalTags: tags,
                tags: tags
            });
        })
        
    }

    filterTags = (e) => {
        // if(e.keyCode === 13){
            const term = e.target.value;
            const { originalTags } = this.state;
            const result = originalTags.filter( item => item.tag.toLowerCase().includes(term.toLowerCase()))
            this.setState({
                tags: result,
            });
        // }
    } 

    enter =(e) => {
        if(e.keyCode === 13){
            const searchTerm = e.target.value;
            let endPoint = `/api/recipes/search/${searchTerm}`;
            this.setState({
                searchTerm: searchTerm,
                endPoint: endPoint,
                loading: false,
                searched: true,
                page: 1
            });
            this.props.history.push(`/discover/search/${searchTerm}/page/1`);
        }
    }

    render(){
        const { searched, endPoint, searchTerm, isTag, tag, tags } = this.state;
        let page  = this.props.match.params.page;
        if(!page){
            page = 1;
        }

        if(isTag){
            return(
                <PaginatedRecipes page={page} endPoint={endPoint} url={`/discover/tag/${tag}`} />
            );
        }
        
        return(
            <div>
                <Card>
                    <Form layout="inline">
                        <Input prefix={<SearchOutlined className="site-form-item-icon" />} placeholder="Search Recipes" onKeyDown={this.enter} />
                    </Form>
                    <br/>
                    {
                        (searched) ? <PaginatedRecipes page={page} endPoint={endPoint} url={`/discover/search/${searchTerm}`} /> : <p>Search Results will appear here!</p>
                    }
                </Card>


                <Card>
                    <Form layout="inline">
                        <Input placeholder="Filter Tags" onChange={this.filterTags}/>
                    </Form>
                    <br/>
                    <List
                        // grid={{ gutter: 16, column: 4 }}
                        grid={{
                            gutter: 16,
                            xs: 1,
                            sm: 2,
                            md: 2,
                            lg: 3,
                            xl: 3,
                            xxl: 4,
                          }}
                        itemLayout="vertical"
                        dataSource={tags}
                        renderItem={item => (
                            <div 
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }} 
                            >
                                <Link to={`/discover/tag/${item.slug}`}>{item.tag}</Link>
                            </div>
                        )}
                    />
                </Card>

            </div>
        );
        
    }


}

export default Discover;