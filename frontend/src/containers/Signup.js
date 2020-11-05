import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';

import { Form, Input, Button, Card, message } from 'antd';

class Signup extends React.Component{

    componentDidMount(){
        document.title = "Signup";
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }


    onFinish = values => {
        // console.log('Success:', values);
        if(values.password1 !== values.password2){
            message.error("Your passwords do not match!");
        } else if(values.password1.length < 8){
            message.error("Your password is not long enough!");
        } else{
            this.props.onAuth(values.username, values.email, values.password1, values.password2);
        }
        
    }

    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    }

    render(){

        if(this.props.error){
            // errorMessage = (
            //     <p>{this.props.error.message}</p>
            // );
            const { error } = this.props;
            console.log(this.props.error.response.data);
            if(error.response.data.password1 !== undefined){
                error.response.data.password1.forEach(item => {
                    message.error(item);
                });
            } else if(error.response.data.password2 !== undefined){
                error.response.data.password2.forEach(item => {
                    message.error(item);
                })
            }
        }

        if(this.props.isAuthenticated){
            this.props.history.push("/");
        }

        return(
            <Card>
                <Form 
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    
                    <Form.Item
                        label="Password"
                        name="password1"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Password Again"
                        name="password2"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your password again!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Sign up
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}

const mapStateToProps = state => {
    return{
        isAuthenticated: state.token !== null,
        loading: state.loading,
        error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, email, password1, password2) => dispatch(actions.authSignup(username, email, password1, password2))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);