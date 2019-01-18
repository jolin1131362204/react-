import React, {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {Row,Col} from 'antd'


import MemoryUtils from '../../utils/MemoryUtils'
import LeftNav from '../../components/Left-nav/left-nav'
import Header from '../../components/header/header'
import Footer from '../../components/footer/footer'

import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'


import './admin.less'

/*
后台管理主界面的路由组件
 */
export default class Admin extends Component {
  render() {
      // 检查用户是否已经登陆, 如果还没有, 自动跳转到登陆界面
    const user = MemoryUtils.user            //从内存中读
      if (!user || !user._id) {
          // this.props.history.replace('/login')  // 用在事件回调函数中
        return  <Redirect to='/login'/>
      }
    return (
        <Row className='container'>
            <Col span={4}>
              <LeftNav></LeftNav>
            </Col>

            <Col span={20} className='main'>
                <Header>
                </Header>
                <div className='content'>
                    <Switch>
                        <Route path='/home' component={Home}/>
                        <Route path='/category' component={Category}/>
                        <Route path='/product' component={Product}/>
                        <Route path='/user' component={User}/>
                        <Route path='/role' component={Role}/>
                        <Redirect to='/home'/>
                    </Switch>
                </div>
                <Footer></Footer>
            </Col>
        </Row>
    )
  }
}

