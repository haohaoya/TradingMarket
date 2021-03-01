import React from 'react';
import {HashRouter,BrowserRouter,Route,Redirect,Switch,Link,NavLink} from 'react-router-dom';
import Index from "./pages/index";

import Register from './pages/account/register/register';
import Login from './pages/account/login/login';

import Publish from "./pages/product/publish/publish";
import ProductDetail from "./pages/product/productDetail/productDetail";

import MessageDetail from "./pages/message/messageDetail/messageDetail";
import MessageList from "./pages/message/messageList/messageList";

import Order from "./pages/payment/order";
import OrderDetail from "./pages/payment/orderDetail";

import Personal from "./pages/personal/personal";

import AddressManage from "./pages/personal/address/addressManage";
import AddAddress from "./pages/personal/address/addAddress";

import MyPublish from "./pages/personal/business/myPublish";
import MyPurchase from "./pages/personal/business/myPurchase";
import MySale from "./pages/personal/business/mySale";

import ModifyInfo from "./pages/personal/info/modifyInfo";

import VerifyOldMobile from "./pages/personal/info/verifyOldMobile";
import BindNewMobile from "./pages/personal/info/bindNewMobile";
import ModifyPwd from "./pages/personal/info/modifyPwd";
import ForgotPwd from "./pages/personal/info/forgotPwd";

const Router = () => (
    <BrowserRouter>
        <Route exact path="/"   component={Index}/>
        <Route exact path="/index" component={Index}/>

        <Route exact path="/register" component={Register}/>
        <Route exact path="/login" component={Login}/>

        <Route exact path="/publish" component={Publish}/>
        <Route exact path="/productDetail" component={ProductDetail}/>

        <Route exact path="/message" component={MessageList}/>
        <Route exact path="/messageDetail" component={MessageDetail}/>

        <Route exact path="/order" component={Order}/>
        <Route exact path="/orderDetail" component={OrderDetail}/>

        <Route exact path="/personal" component={Personal}/>

        <Route exact path="/addressManage" component={AddressManage}/>
        <Route exact path="/addAddress" component={AddAddress}/>

        <Route exact path="/myPublish" component={MyPublish}/>
        <Route exact path="/myPurchase" component={MyPurchase}/>
        <Route exact path="/mySale" component={MySale}/>

        <Route exact path="/modifyInfo" component={ModifyInfo}/>

        <Route exact path="/verifyOldMobile" component={VerifyOldMobile}/>
        <Route exact path="/bindNewMobile" component={BindNewMobile}/>
        <Route exact path="/modifyPwd" component={ModifyPwd}/>
        <Route exact path="/forgotPwd" component={ForgotPwd}/>
    </BrowserRouter>
);
export default Router;