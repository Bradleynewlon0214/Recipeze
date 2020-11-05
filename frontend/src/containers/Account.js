import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Col, Row, List, Button, Popconfirm, message, Skeleton } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import ManageAccount from '../components/ManageAccount';
import { SERVER } from '../utils/server';

const Account = ({ token }) => {
    const [loading, setLoading] = useState(true);
    const [changeSettings, setChangeSettings] = useState(false);
    const [username, setUsername] = useState();
    const [comments, setComments] = useState();
    const [mostViewed, setMostViewed] = useState();
    const [mostStarred, setMostStarred] = useState();

    const authAxios = axios.create({
        baseUrl: SERVER,
        headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
    });
    
    useEffect(() => {
        document.title = "Account";

        authAxios.get(`${SERVER}/rest-auth/user/`)
        .then(res => {
            var mv = res.data.user_recipes.sort( (a, b) => a.views.length < b.views.length);
            var ms = res.data.user_recipes.sort( (a, b) => a.stars < b.stars );
            mv.splice(10);
            ms.splice(10);
            setUsername(res.data.username);
            setComments(res.data.user_comments);
            setMostViewed(mv);
            setMostStarred(ms);
            setLoading(false);
        })
        .catch(error => {
            console.log(error);
        })
        
            
    }, []);

    function handleDelete(id){
        let index = -1;
        for(let i = 0; i < comments.length; i++){
            if(comments[i].id === id){
                index = i;
            }
        }

        authAxios.delete(`/api/comments/delete/${id}`, {
            data: {
                pk: id
            }
        })
        .then(response => {
            console.log(response);
            message.success("Comment deleted successfully.");
        })

        comments.splice(index, 1);
        setComments(comments);
    }

    
    
    return(
        <Card>
            <Row>
                <Col span={12}>
                    <h1>{ (!loading) ? `Hello ${username}!` : "Hello!" }</h1>
                    <p>You can view recipes and comments you've posted below. Or you can change your password by clicking the Change Password button.</p>
                </Col>
                <Col span={12}>
                    {
                        (changeSettings) ? 
                        <ManageAccount onFinish={() => setChangeSettings(!changeSettings)} />
                        :
                        <Button onClick={() => setChangeSettings(!changeSettings)} style={{float: 'right'}} type="primary">Change Password</Button>
                    }
                </Col>
            </Row>

            <Row>
                <Col span={12}>
                    <Row>
                        <Skeleton loading={loading}>
                            <List
                                size="small"
                                header={<h3>Your Most Viewed Recipes</h3>}
                                dataSource={mostViewed}
                                renderItem={ item => <List.Item><Link to={`/recipe/${item.id}`}>{item.name}</Link></List.Item> }
                            />
                        </Skeleton>
                    </Row>
                    <Row>
                        <Skeleton loading={loading}>
                            <List
                                size="small"
                                header={<h3>Your Most Starred Recipes</h3>}
                                dataSource={mostStarred}
                                renderItem={ item => <List.Item><Link to={`/recipe/${item.id}`}>{item.name}</Link></List.Item> }
                            />
                        </Skeleton>
                    </Row>
                </Col>

                <Col span={12}>
                    <Skeleton loading={loading}>
                        <List
                            size="small" 
                            header={<h3>Your Comments</h3>}
                            dataSource={comments}
                            renderItem={item => 
                                <List.Item>
                                    <Link to={`/recipe/${item.recipe}`}>{item.content}</Link>
                                    <Popconfirm
                                        title="Are you sure you want to delete this comment?"
                                        onConfirm={() => handleDelete(item.id)}
                                        onCancel={(e) => console.log(e)}
                                        okText="I'm sure."
                                        cancelText="No."
                                    >
                                        <CloseOutlined style={{ float: "right" }} />
                                    </Popconfirm>
                                </List.Item>
                            }
                        />
                    </Skeleton>
                </Col>
            </Row>
        </Card>

    );


}

const mapStateToProps = state => {
    return {
      token: state.token,
    }
}

export default connect(mapStateToProps)(Account);