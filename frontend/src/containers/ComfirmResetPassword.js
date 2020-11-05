import React from 'react';
import axios from 'axios';
import { SERVER } from '../utils/server';
import { Form, Input, Button, message } from 'antd';

class ConfirmResetPassword extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            newPasswordOne: "",
            newPasswordTwo: "",
        }
    }

    newPasswordOneChange = e => {
        this.setState({
            newPasswordOne: e.target.value,
        });
    }

    newPasswordTwoChange = e => {
        this.setState({
            newPasswordTwo: e.target.value,
        });
    }

    handleSubmit = () => {
        const { newPasswordOne, newPasswordTwo } = this.state;
        const { uidb64, token } = this.props.match.params;
        
        axios.post(`${SERVER}/rest-auth/password/reset/confirm/`, {
            new_password1: newPasswordOne,
            new_password2: newPasswordTwo,
            uid: uidb64,
            token: token,
        })
        .then(response => {
            message.success("Your password has been reset successfully!");
            this.props.history.push("/login");
        })
        .catch(error => {
            if(error.response.data.new_password2 !== undefined){
                error.response.data.new_password2.forEach(item => {
                    message.error(item);
                })  
            }
            if(error.response.data.new_password1 !== undefined){
                error.response.data.new_password1.forEach(item =>{
                    message.error(item);
                })
            }
            if(error.response.data.uid !== undefined){
                message.error("Your reset token has expired!");
            }
        })

    }

    render(){
        return(
            <div>
                {/* <h1>Hello</h1>
                <h1>{this.props.match.params.uidb64}</h1>
                <h2>{this.props.match.params.token}</h2> */}

                <Form>
                    <Form.Item 
                        label="Enter your new password"
                        rules={[{
                            required: true,
                            message: 'Please input your new password'
                        }]}
                    >
                        <Input 
                            type="password" 
                            placeholder="Password"
                            onChange={this.newPasswordOneChange}
                            value={this.state.newPasswordOne}
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Enter your new password again."
                        rules={[{
                            required: true,
                            message: 'Please input your new password'
                        }]}
                    >
                        <Input 
                            type="password"
                            placeholder="Repeat Password"
                            onChange={this.newPasswordTwoChange}
                            value={this.state.newPasswordTwo}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={this.handleSubmit}>
                            Reset Password
                        </Button>
                    </Form.Item>
                </Form>

            </div>
        );
    }
}

export default ConfirmResetPassword;