import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER } from '../utils/server';
import { connect } from 'react-redux';
import { authAxios } from '../utils/authAxios';
import { List, Form, Input, Button, Card, Comment, message } from 'antd';
import { validateCommentData, stripTags } from '../utils/Validator';
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';


const Comments = ({ recipeID, isAuthenticated }) => {
    const [loading, setLoading] = useState(true);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [username, setUsername] = useState("anon");
    const [localComment, setLocalComment] = useState("");

    useEffect(() => {
        function getCommentData(){
            axios.get(`${SERVER}/api/comments/${recipeID}`)
            .then(response => {
                setComments(response.data);
            })
        }

        function getUserData(){
            if(isAuthenticated){
                authAxios.get('/rest-auth/user/')
                .then(response => {
                    setUsername(response.data.username);
                })
            }
        }

        getCommentData();
        getUserData();
        setLoading(false);

    }, [recipeID, isAuthenticated]);

    const onFinish = () => {
        const [truth, msg] = validateCommentData(username, localComment);
        if(truth){
            let data = new FormData();
            data.append('content', stripTags(localComment));
            data.append('recipe', recipeID);
            data.append('user', stripTags(username));
    
            axios({
                method: 'post',
                url: `${SERVER}/api/comments/create/`,
                data: data,
                headers: {'Content-Type': 'multipart/form-data'}
            })
            .then(response => {
                setComments([{id: response.data.id, user: username, content: localComment, recipe: recipeID}, ...comments]);
                document.getElementById('username').value = "";
                document.getElementById('comment').value = "";
            })
            .catch(error => {
                console.log(error);
            })
        } else {
            message.error(msg);
        }
    }

    return(
        <div style={{ marginTop: '2%' }}>

        <Form>
            <Form.Item name="username">
                <Input name="username" placeholder="Your name (defaults to 'anon')" value={username} onChange={(e) => setUsername(e.target.value)} />
            </Form.Item>
            <Form.Item name="comment">
                <Input name="comment" placeholder="Leave a comment here!" value={localComment} onChange={(e) => setLocalComment(e.target.value)} />
            </Form.Item>
            <Form.Item>
                <Button  type="primary" style={{ float: 'left' }} onClick={() => setShowComments(!showComments)}>
                    Show Comments { (showComments) ? < CaretDownOutlined/> : <CaretRightOutlined />} 
                </Button>
                <Button type="primary" style={{ float: 'right' }} htmlType="submit" onClick={onFinish}>
                    Send Comment
                </Button>
            </Form.Item>
        </Form>

            {
                (showComments) ? 
                    <Card>
                        <List 
                            itemLayout="horizontal"
                            loading={loading}
                            dataSource={comments}
                            renderItem={item => (
                                <List.Item>
                                    <Comment
                                        author={item.user}
                                        content={item.content}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                :
                    null
            }

        </div>
    );


} 

const mapStateToProps = state => {
    return {
        isAuthenticated: state.token !== null,
    }
}

export default connect(mapStateToProps)(Comments);