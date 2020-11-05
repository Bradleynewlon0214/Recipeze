import React from 'react';
import { Layout, Menu} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    HomeOutlined,
    UserOutlined,
    KeyOutlined,
    DownloadOutlined,
    UserDeleteOutlined,
    UserAddOutlined
  } from '@ant-design/icons';


import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';

const { Sider } = Layout;


class Nav extends React.Component{
 
    render(){
        return(
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={broken => {
                }}
                onCollapse={(collapsed, type) => {

                }}
            >
                <div className="logo"/>
                <Menu mode="inline" theme="dark">
                    <Menu.Item key="1" icon={<HomeOutlined />}>
                        <Link style={{color: "white"}} to="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<SearchOutlined />}>
                        <Link style={{color: "white"}} to="/discover">Discover</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<PlusOutlined />}>
                        <Link style={{color: "white"}} to="/add">Add Recipe</Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<DownloadOutlined />}>
                        <Link style={{color: "white"}} to="/saved">Saved Recipes</Link>
                    </Menu.Item>
                    {
                        (this.props.isAuthenticated) ?
                            <Menu.Item icon={<UserOutlined/>}>
                                <Link style={{color: "white"}} to="/account">View Account</Link>
                            </Menu.Item>
                        :
                            <Menu.Item icon={<KeyOutlined />}>
                                <Link style={{color: "white"}} to="/login">Login</Link>
                            </Menu.Item>
                    }
                    {
                        (this.props.isAuthenticated) ?
                            <Menu.Item key="6" icon={<UserDeleteOutlined />}>
                                <Link style={{color: "white"}} to="/" onClick={this.props.onAuth}>Logout</Link>
                            </Menu.Item>
                        :
                            <Menu.Item key="6" icon={<UserAddOutlined />}>
                                <Link style={{color: "white"}} to="/signup">Signup</Link>
                            </Menu.Item>
                    }

                </Menu>
            </Sider>
        );

    }

}


const mapDispatchToProps = dispatch => {
    return {
        onAuth: () => dispatch(actions.logout())
    }
}

export default withRouter(connect(null, mapDispatchToProps)(Nav));