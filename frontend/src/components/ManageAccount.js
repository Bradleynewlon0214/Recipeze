import React from 'react';
import { authAxios } from '../utils/authAxios';
import { Form, Input, Button, message } from 'antd';
import { validatePassword } from '../utils/Validator';


class ManageAccount extends React.Component{

    state = {
        passwordOne: '',
        passwordTwo: '',
    }

    onFinish = values => {
        const { newPasswordOne, newPasswordTwo } = values;
        if(newPasswordOne === newPasswordTwo){
            authAxios.post('/rest-auth/password/change/', {
                new_password1: values.newPasswordOne,
                new_password2: values.newPasswordTwo
            })
            .then(response => {
                this.props.onFinish();
                message.success("Your password has been changed successfully!");
            })
            .catch(error => {
                error.response.data.new_password2.forEach(item => {
                    message.error(item);
                })
            })
        } else {
            message.error("Your passwords do not match.");
        }
    }

    onPasswordOneChange = (e) => {
        this.setState({
            passwordOne: e.target.value,
        })
    }

    onPasswordTwoChange = (e) => {
        this.setState({
            passwordTwo: e.target.value,
        })
    }

    render() {

        const valid = <li>{validatePassword(this.state.passwordOne, this.state.passwordTwo, 8)}</li>;

        return(
            <Form onFinish={this.onFinish}>
                <Form.Item 
                    name="newPasswordOne"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your new password',
                        },
                    ]}
                >
                    <Input type="password" onChange={this.onPasswordOneChange} value={this.state.passwordOne} placeholder="Enter your new password" />
                </Form.Item>
                <Form.Item 
                    name="newPasswordTwo"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your new password again!',
                        },
                    ]}
                >
                    <Input type="password" onChange={this.onPasswordTwoChange} value={this.state.passwordTwo} placeholder="Enter your new password again!" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={this.props.onFinish} style={{ float: 'left' }}>Cancel</Button> 
                    <Button htmlType="submit" type="primary" style={{float: 'right'}}>Change Password</Button>
                </Form.Item>
                <Form.Item>
                    <ul>
                        {valid}
                    </ul>
                </Form.Item>
            </Form>
        );
    }
}

export default ManageAccount;