import React, {Component} from 'react'
import {
    Form,
    Icon,
    Input,
    Button
} from 'antd';

import logo from '../../assets/imsges/logo.png'
import './index.less'


const Item = Form.Item
/*
登陆的路由组件
 */
export default class Login extends Component {
  render() {
    return (
      <div className= 'login'>
        <div className='login-header'>
          <img src={logo} alt="logo"/>
          React项目：后台管理系统
        </div>
        <div className='login-content'>
          <div className='login-box'>
            <div className='title'>用户登陆</div>
            <LoginFrom/>
          </div>
        </div>
      </div>
    )
  }
}

//包含<From/>被包装组件
class LoginFrom extends React.Component{

    clickLogin = () => {
        //只有当验证没有错误时，才输出输入的数据
        this.props.form.validateFields((error,values) => {
            console.log('validateFields',error,values)
            if (!error) {
                console.log('收集表单数据', values)
            }else{
                this.props.form.resetFields()   //重置所有输入框
            }
        })
        //得到表单数据
        // const username = this.props.form.getFieldValue('username')
        // alert(username)
    }
                 //规则，值，回调函数
    checkPassword = (rule,value,callback) => {  //如果不满足要求。通过callback（）来指定对应的提示
        //半编程式验证
        if (!value){
            callback('必须输入密码')
        } else if (value.length >4 || value.length < 8) {
            callback('密码必须4-8位')
        }else {
            callback()    //callback不传参数代表成功
        }
    }

  render(){

      const {getFieldDecorator} = this.props.form    //props上有一个form对象，对象里边有一个 getFieldDecorator属性
      //this.props.form.getFieldValue('username')

      return(
        <Form className='login-form'>
            <Item>

                {
                    getFieldDecorator('username', {
                        initialValue: 'admin',  //input的默认值
                        rules: [  //声明式的验证配置
                            { type: "string",required: true, message: '必须输入用户名!' },
                            { min:4, message: '长度不能少于4位' }
                            ]
                    })(
                        <Input placeholder='请输入用户名' prefix={<Icon type="user"  />}/>
                    )
                }

            </Item>
            <Form.Item>
                {
                    getFieldDecorator('password',{
                        rules:[{validator : this.checkPassword}]

                    })(
                        <Input type='password' placeholder='请输入密码' prefix={<Icon type="lock"  />}/>
                    )
                }

            </Form.Item>
            <Form.Item>
                <Button type='primary' className='login-form-button' onClick={this.clickLogin}>登陆</Button>
            </Form.Item>
        </Form>
    )
  }
}

//包装包含<From/>的组件的包装组件，生成一个新的组件（包装组件）
//包装组件会像被包装组件传递一个新的属性（Form属性）
LoginFrom = Form.create()(LoginFrom)