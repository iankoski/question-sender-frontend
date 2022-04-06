import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useRouteMatch
} from 'react-router-dom';
import SignInPage from './../pages/public/SignIn';
import SignUpPage from './../pages/public/SignUp';
import QuestionsListPage from './../pages/secure/QuestionsList';
import QuestionsAddPage from './../pages/secure/QuestionAdd';
import QuestionsDetailPage from './../pages/secure/QuestionsDetail';
import RoutePrivate from './route-wrapper';
/*
import DashboardPage from './../pages/secure/Dashboard';


import MessagesListPage from './../pages/secure/MessageList';
import MessageAddPage from './../pages/secure/MessageAdd';
import MessagesDetailPage from './../pages/secure/MessageDetail';
import SettingsDetailsPage from './../pages/secure/SettingsDetails';
import SettingsEmailAddPage from './../pages/secure/SettingsEmailAdd';*/

export default function Routes() {

    /*                

                <RoutePrivate exact path="/messages" component={MessagesListPage}/>
                <RoutePrivate exact path="/messages/add" component={MessageAddPage}/>
                <RoutePrivate exact path="/messages/:messageId" component={MessagesDetailPage}/>     
                <RoutePrivate exact path="/settings" component={SettingsDetailsPage}/>       
                <RoutePrivate exact path="/settings/email/add" component={SettingsEmailAddPage}/>*/
    return (
        <Router>
            <Switch>               
                <Route exact path="/" component={SignInPage} />
                <RoutePrivate exact path="/questions" component={QuestionsListPage} />
                <RoutePrivate exact path="/questions/add" component={QuestionsAddPage} />
                <RoutePrivate exact path="/questions/:questionId" component={QuestionsDetailPage} />         
                <Route exact path="/signin" component={SignInPage} />
                <Route exact path="/signup" component={SignUpPage} />
            </Switch>
        </Router>
    )
}

function QuestionsRoutes(){
    const {path} = useRouteMatch();
    return (
        <Switch>
            <Route exact path ={path} component={QuestionsListPage}/>
        </Switch>
    );
}
