/*
用来发送ajax请求的函数模块
内部封装axios
函数的返回值为promise对象
目标:
  1. 请求错误统一处理
  2. 异步返回的是data, 而不是response
解决: 自定义promsie对象
 */

import axios from 'axios'    //引axios，因为这个ajax是用axios使用的
import {message} from 'antd'

    //发送请求，Api的使用，里边需要传参数
                       //url地址，传的数据，请求方式
export default function ajax(url,data={},method='GET') {      //定义好了需要去用，需要在loin界面去应用，因为login登陆需要发请求
    return new Promise((resolve,reject) => {
        let promise
        // 使用axios执行异步ajax请求
        if (method==='GET'){
            promise = axios.get(url,{params: data})
        }else {
            promise = axios.post(url,data)
        }

        // 如果请求成功了, 调用resolve()
        promise.then(response => {
            resolve(response.data)  //后面异步得到的就是data数据
        }).catch(error => {
            console.log(url,error)
            message.error('请求出错了')
        })
    })
}








/*
async function reqLogin() {
  const result = await ajax('/login', {username: 'tom', password: '123'}, 'POST')
  if(result.status===0) {
    alert('成功了')
  } else {
    alert('失败了')
  }
}*/
