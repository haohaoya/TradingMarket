import React from 'react';
import {HashRouter,BrowserRouter,Route,Redirect,Switch,Link,NavLink} from 'react-router-dom';
import Register from './pages/register/register';
import Login from './pages/login/login';
import Publish from "./pages/publish/publish";
import Index from "./pages/index";
const Router = () => (
    <BrowserRouter>
        <Route exact path="/"   component={Index}/>
        <Route exact path="/index" component={Index}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/publish" component={Publish}/>
    </BrowserRouter>
);
export default Router;