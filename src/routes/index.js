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

export default function Routes() {
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
