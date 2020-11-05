import React from 'react';
import { Layout, Switch } from 'antd';
import Nav from '../components/Nav';
import NewUser from '../components/NewUser';

const { Content, Header, Footer } = Layout;

const CustomLayout = (props) => {
    return (
        <Layout>
            <NewUser />
            <Nav menuItem={props.menuItem} isAuthenticated={props.isAuthenticated}/>
            <Layout>
            <Header 
                style={{ padding: 0 }}
            >
                <span style={{ color: "white", padding: 24, margin: '24px 16px 0' }}>Dark Mode <Switch onChange={props.onSwitchChange} /></span>
            </Header>
            <Content className="site-layout-background" style={{ margin: '24px 16px 0' }}> 
                <div style={{ padding: 24, minHeight: 900 }}>
                    {props.children}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}></Footer>
            </Layout>
        </Layout>
    );
}
export default CustomLayout;