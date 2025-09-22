import React from 'react';
import {BrowserRouter as Router,Route,Switch,Link } from 'react-router-dom'
import LoginComponent from './LoginComponent'
import Signup from './Signup';
import ErrorComponent from './ErrorComponent'
import DashBoard from './DashBoard';
import AuthenticatedRoute from './AuthenticatedRoute'
import ProjectComp from './Project'
import FeedbackComponent from './FeedbackComponent';
import DemoRequestComponent from './DemoRequestComponent';


const DemoLoginApp = () =>{
 
    return(
        <Router>
            <>
            <Switch>
            <Route path="/" exact component={LoginComponent} />
            <Route path="/signup" exact component={Signup} />
            <Route path="/demo" exact component={DemoRequestComponent}   />
            <Route path="/feedback" exact component={FeedbackComponent}   />
            <AuthenticatedRoute path="/dashboard" exact component={DashBoard} />
            <Route component={ErrorComponent} />
            </Switch>
            </>
        </Router>
    )

}

export default DemoLoginApp;