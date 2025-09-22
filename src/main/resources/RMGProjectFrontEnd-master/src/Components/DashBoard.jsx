import React from 'react';
import Header from './Header';
import SideBar from './SideBar'
import DashBoardContent from './DashBoardContent'
import {BrowserRouter as Router,Route,Switch,Link} from 'react-router-dom'
import ProjectComp from './Project'
import UserComp from './Users'
import AuthenticatedRoute from './AuthenticatedRoute'
import ProfileSettings from './ProfileSettings';
import ProjectModules from './Modules';
import ExportOptionsComponent from './ExportOptionsComponent';
import DashboardChartComponent from './DashboardChartComponent';
import TransactionComp from './TransactionComponent';
import PayrollComp from './PayrollComponent';
import ChatRoom from './ChatRoom';
import Resources from './Resources';



const DashBoard = ()=>{
    
    return(
        <Router>
        <div className="wrapper">
       
         <SideBar />
         
         <div  id="content" >
         <Header />
         <AuthenticatedRoute path="/welcome" component={DashBoardContent} /> 
         <AuthenticatedRoute path="/dashboard/projects" exact component={ProjectComp} /> 
       
        <AuthenticatedRoute path="/dashboard/overview" exact component={DashboardChartComponent} /> 
        <AuthenticatedRoute path="/dashboard/modules/:projectId"  component={ProjectModules} /> 
        <AuthenticatedRoute path="/dashboard/export" exact component={ExportOptionsComponent} />
        <AuthenticatedRoute path="/dashboard/users" exact component={UserComp} /> 
        <AuthenticatedRoute path="/dashboard/payroll" exact component={PayrollComp} />
        <AuthenticatedRoute path="/dashboard/chat" exact component={ChatRoom} />
        {/* <AuthenticatedRoute path="/dashboard/transactions" exact component={TransactionComp} />  */}
        <AuthenticatedRoute path="/dashboard/settings" exact component={ProfileSettings} />  
        <AuthenticatedRoute path="/dashboard/resources" exact component={Resources} /> 
         {/* <AuthenticatedRoute path="/dashboard/transactions" exact component={TransactionComp} />  */}
        </div>
        </div> 
        </Router>
    )
}
export default DashBoard