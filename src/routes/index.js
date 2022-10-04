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
import CompanyDetailPage from './../pages/secure/CompanyDetail';
import QrcodeDetailPage from './../pages/secure/QrcodeDetail';
import QuestionsForAnswerList from './../pages/secure/QuestionsForAnswerList';
import QuestionsForAnswerDetail from './../pages/secure/QuestionsForAnswerDetail';
import QuestionsForAnswerError from './../pages/secure/QuestionsForAnswerError';
import NewsList from './../pages/secure/NewsList';
import NewsAdd from './../pages/secure/NewsAdd';
import NewsDetail from './../pages/secure/NewsDetail';

import RoutePrivate from './route-wrapper';

export default function Routes() {
    /*
                    <Route exact path="/questionsforanswer/:deviceId/:companyId/companyuid/:companyuid" component={QuestionsForAnswerError} />
                <Route exact path="/questionsforanswer/detail/:companyId/:questionId/:deviceId" component={QuestionsForAnswerError} />
                <Route exact path="/questionsforanswer/:companyId/:questionId" component={QuestionsForAnswerError} />
    */
    return (
        <Router>
            <Switch>
                <Route exact path="/errorAuth/:errorAuth" component={SignInPage} />
                <Route exact path="/" component={SignInPage} />
                <RoutePrivate exact path="/questions" component={QuestionsListPage} />
                <RoutePrivate exact path="/company/qrcodedetail/:companyId/companyuid/:qrcode" component={QrcodeDetailPage} />
                <RoutePrivate exact path="/company" component={CompanyDetailPage} />
                <RoutePrivate exact path="/questions/add" component={QuestionsAddPage} />
                <RoutePrivate exact path="/questions/:questionId" component={QuestionsDetailPage} />
                <Route exact path="/questionsforanswer/:deviceId/:companyId/companyuid/:companyuid/secret/:secret" component={QuestionsForAnswerList} />
                <Route exact path="/questionsforanswer/detail/:companyId/:questionId/:deviceId/companyuid/:companyuid/secret/:secret" component={QuestionsForAnswerDetail} />
                <Route exact path="/questionsforanswer/error/:companyId" component={QuestionsForAnswerError} />
                <Route exact path="/news/company" component={NewsList} />
                <Route exact path="/news/company/add/:newsId" component={NewsDetail} />
                <Route exact path="/news/add" component={NewsAdd} />
                <Route exact path="/signin" component={SignInPage} />
                <Route exact path="/signup" component={SignUpPage} />
            </Switch>
        </Router>
    )
}
