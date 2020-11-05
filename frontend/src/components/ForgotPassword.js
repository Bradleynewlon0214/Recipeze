import React from 'react';
import axios from 'axios';
import { SERVER } from '../utils/server';
import { Modal, Button, Form, Input } from 'antd';
import { MailOutlined } from '@ant-design/icons';


class ForgotPassword extends React.Component{

    state = {
        visible: false,
        confirmLoading: false,
        emailAddress: null,
    }

    showModal = () => {
        this.setState({
            visible: true
        });
    }

    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });

        axios.post(`${SERVER}/rest-auth/password/reset/`, 
            {
                email: this.state.emailAddress
            }
        )
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        })

        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 2000);
    }

    handleCancel = () => {
        console.log("canceled!");
        this.setState({
            visible: false,
        });
    }

    handleEmailChange = e => {
        this.setState({
            emailAddress: e.target.value,
        })
    }

    render() {
        const { visible, confirmLoading, emailAddress } = this.state;

        return(
            <div>
                <a href="#forgot" type="primary" onClick={this.showModal}>
                    Forgot password?
                </a>
                <Modal
                    title="Password Reset"
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                          Cancel
                        </Button>,
                        <Button key="submit" type="primary" htmlType="submit" loading={confirmLoading} onClick={this.handleOk}>
                          Reset Password
                        </Button>,
                    ]}
                >
                    <Form onFinish={this.handleOk}>
                        <Form.Item name="email">
                            <Input prefix={<MailOutlined />}  type="text" placeholder=" Email" value={emailAddress} onChange={this.handleEmailChange}/>
                        </Form.Item>
                        <Form.Item>
                            <p>Enter the e-mail associated with your account and we'll send you an link to reset your password.</p>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default ForgotPassword;
