import React, {Component} from 'react'
import {
    Form,
    Icon,
    Input,
    Button
} from 'antd';
import PropTypes from 'prop-types'


import storageUtils from '../../utils/storageUtils'
import MemoryUtils from '../../utils/MemoryUtils'
import {reqLogin} from '../../api'
import logo from '../../assets/imsges/logo.png'
import './index.less'


const Item = Form.Item
/*
登陆的路由组件
 */
export default class Login extends Component {

    state = {
        errorMsg :''    //错误提示信息
    }

    //登陆请求
    login = async (username, password) => {
        const result = await reqLogin(username, password)
        if (result.status===0){   //登陆成功
            const user = result.data
            //保存user，登陆一次之后，保存记住
            /*
              localStorage       关掉浏览器还在   保存在本地
              sessionStorage    关掉浏览器不在了  保存在内存
           */
            // localStorage.setItem('USER_KEY',JSON.stringify(user))
            // store.set('USER_KEY',user)
            storageUtils.saveUser(user)  //存在localStorage中
            MemoryUtils.user = user      //存在MemoryUtils内存中     并且希望一上来，就可以打开应用，所以在inde入口文件中，也存储上

            //跳转到管理页面
            this.props.history.replace('/')
        } else {         //登陆失败
            this.setState({
                errorMsg: result.msg
            })
        }
    }
  render() {
        const {errorMsg} = this.state
    return (
      <div className= 'login'>
        <div className='login-header'>
          <img src={logo} alt="logo"/>
          React项目：后台管理系统
        </div>
        <div className='login-content'>
          <div className='login-box'>
              <div className="error-msg-wrap">
                  <div className={errorMsg ? "show" : ""}>
                      {errorMsg}
                  </div>
              </div>

              <div className='title'>用户登陆</div>
            <LoginFrom login={this.login}/>
          </div>
        </div>
      </div>
    )
  }
}

//包含<From/>被包装组件
class LoginFrom extends React.Component{

    // 想接受上边的函数，需要先声明
    static propTypes = {
        login:PropTypes.func.isRequired
    }

        clickLogin = () => {
        //只有当验证没有错误时，才输出输入的数据
        this.props.form.validateFields(async (error,values) => {
            console.log('validateFields',error,values)
            if (!error) {
                console.log('收集表单数据', values)
                // const result = await ajax('/login',values,'POST')    这样写有点麻烦，每次写都要调用'/login',values,'POST'
                const {username, password} = values
                // const result = await reqLogin(username, password)     //针对每一个接口封装一个函数
                this.props.login(username, password)
            }else{
                // this.props.form.resetFields()   //重置所有输入框
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
        } else if (value.length < 4 || value.length > 8) {
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