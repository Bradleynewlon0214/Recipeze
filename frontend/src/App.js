import React from 'react';
import './App.css';
// import 'antd/dist/antd.dark.css';
import { connect } from 'react-redux';
import { BrowserRouter as Router} from 'react-router-dom';
import BaseRouter from './routes';
import * as actions from './store/actions/auth';

import CustomLayout from './containers/Layout';

class App extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      dark: false,
    }
  }

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.dark !== this.state.dark){

    }
  }
  
  onSwitchChange = (e) => {
    console.log(e);
    this.setState({
      dark: e
    })
  }

  render(){
    return (
      <div className="App">
        <link rel="stylesheet" type="text/css" href={ (this.state.dark) ? '/antd.dark.css' : '/antd.css' } />
        <Router>
          <CustomLayout {...this.props} onSwitchChange={this.onSwitchChange}>
              <BaseRouter />
          </CustomLayout>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);