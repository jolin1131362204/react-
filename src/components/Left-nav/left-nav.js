import React, {Component} from 'react'
import {NavLink, withRouter} from 'react-router-dom'
import {Menu, Icon} from 'antd'
import menuList from '../../config/menuConfig'

import './left-nav.less'


const SubMenu = Menu.SubMenu
const Item = Menu.Item
/*
左侧导航组件
 */
class LeftNav extends Component {
    getNodes = (list) => {
        return list.reduce((pre,item) => {
            if (item.children){
                const subMenu = (
                    <SubMenu key={item.key} title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
                        {
                            this.getNodes(item.children)
                        }
                    </SubMenu>
                )
                pre.push(subMenu)

                //计算得到当前请求路径对应的父菜单的key
                const path = this.props.location.pathname
                const cItem = item.children.find(child => child.key === path)
                if (cItem){
                   this.openKey = item.key
                }

            } else {
                const menuItem = (
                    /*
       //             {
       //               title: '首页', // 菜单标题名称
       //               key: '/home', // 对应的path
       //               icon: 'home', // 图标名称
       //             }
       //              */
                    <Item key={item.key}>
                        <NavLink to={item.key}>
                            <Icon type={item.icon} />{item.title}
                        </NavLink>
                    </Item>
                )
                pre.push(menuItem)
            }

            return pre

        },[])

    }


    /*
     在第一次render()之前调用
      */
    componentWillMount() {
        this.menuNodes = this.getNodes(menuList)
        console.log(this.menuNodes)
    }

    render() {

        //当前请求的路径
        const path = this.props.location.pathname
        console.log('path', path)

        return (
            <div className='left-nav'>
                <NavLink to='/home' className='logo'>
                    <img src="/static/media/logo.ba1f87ec.png" alt="logo"/>
                    <h1>硅谷后台</h1>
                </NavLink>

                <Menu mode='inline' theme='dark'
                      defaultSelectedKeys={[path]}
                      defaultOpenKeys={[this.openKey]}
                >
                    {this.menuNodes}
                </Menu>
            </div>
        )
    }
}

//将一个非路由组件包装生成一个路由组件，向非路由组件传递路由组件才有的3个属性：histoty(实现路由跳转)/location（请求路径）/match（请求参数）
export default withRouter(LeftNav)
