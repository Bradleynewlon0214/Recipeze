import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import ForgotPassword from '../components/ForgotPassword';


import { Form, Input, Button, Card, message } from 'antd';

class Login extends React.Component {

    componentDidMount(){
        document.title = "Login";
    }

    onFinish = values => {
        this.props.onAuth(values.username, values.password);
    }

    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    }

    render(){

        if(this.props.error){
            message.error("Your credentials do not match those on file.");
            // errorMessage = (
            //     <p>{this.props.error.message}</p>
            // );
        }

        if(this.props.isAuthenticated){
            this.props.history.push("/account");
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
                        label="Password"
                        name="password"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <ForgotPassword />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}

const  mapStateToProps = state => {
    return{
        isAuthenticated: state.token !== null,
        loading: state.loading,
        error: state.error,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, password) => dispatch(actions.authLogin(username, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);