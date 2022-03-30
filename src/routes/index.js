import React from 'react';
import { 
    BrowserRouter as Router, 
    Switch, 
    Route, 
    useRouteMatch 
  } from 'react-router-dom';
import SignInPage from './../pages/public/SignIn';
import SignUpPage from './../pages/public/SignUp';/*
import DashboardPage from './../pages/secure/Dashboard';
import RoutePrivate from './route-wrapper';
import ContactsListPage from './../pages/secure/ContactsList';
import ContactsAddPage from './../pages/secure/ContactAdd';
import ContactsDetailPage from './../pages/secure/ContactDetail';
import MessagesListPage from './../pages/secure/MessageList';
import MessageAddPage from './../pages/secure/MessageAdd';
import MessagesDetailPage from './../pages/secure/MessageDetail';
import SettingsDetailsPage from './../pages/secure/SettingsDetails';
import SettingsEmailAddPage from './../pages/secure/SettingsEmailAdd';*/

export default function Routes(){
    /*                <RoutePrivate exact path="/" component={DashboardPage}/>
                <RoutePrivate exact path="/contacts" component={ContactsListPage}/>
                <RoutePrivate exact path="/contacts/add" component={ContactsAddPage}/>
                <RoutePrivate exact path="/contacts/:contactId" component={ContactsDetailPage}/>
                <RoutePrivate exact path="/messages" component={MessagesListPage}/>
                <RoutePrivate exact path="/messages/add" component={MessageAddPage}/>
                <RoutePrivate exact path="/messages/:messageId" component={MessagesDetailPage}/>     
                <RoutePrivate exact path="/settings" component={SettingsDetailsPage}/>       
                <RoutePrivate exact path="/settings/email/add" component={SettingsEmailAddPage}/>*/
    return (
        <Router>
            <Switch>
        
                <Route exact path="/signin" component={SignInPage}/>
                <Route exact path="/signup" component={SignUpPage}/>

            </Switch>
        </Router>
    )
}
/*
function ContactsRoutes(){
    const {path} = useRouteMatch();
    return (
        <Switch>
            <Route exact path ={path} component={ContactsListPage}/>
        </Switch>
    );
}*/
