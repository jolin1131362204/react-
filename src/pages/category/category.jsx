import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {
    Card,
    Table,
    Button,
    Icon,
    Form,
    Input,
    Select,  //子标签option
    Modal,
    message
} from 'antd'
// import PropTypes from 'prop-types'
import {reqCategorys,reqAddCategory} from '../../api'

const Item = Form.Item    //定义这个为了写Item的时候简洁一点
const Option = Select.Option   //显示多少行
/*
管理的分类管理路由组件
 */
export default class Category extends Component {
    state={
        categorys:[],    //一级分类列表
        isShowAdd:false,  //是否显示添加分类的框，默认不显示
    }

    //获取一级分类
    getCategorys = async () => {
        const result = await reqCategorys('0')   //一级数据是0
        if (result.status===0) {                 //如果一级数据是0，并且里边的相应状态时0，代表成功
            const categorys = result.data        //数据在响应数据中，md的api里边
            //更新状态
            this.setState({
                categorys
            })

        }
    }

//添加分类
    addCategory = async () => {
        //隐藏添加框
        this.setState({
            isShowAdd:false
        })

        //得到输入的数据
        const {parentId,categoryName} = this.form.getFieldsValue()

        //提交添加分类的请求
        const result = await reqAddCategory(parentId,categoryName)    //想获取请求，要靠From,操作，读，验证
        if (result.status===0){
            message.success('添加成功')
            this.getCategorys()
        }
    }

    componentDidMount(){
        this.getCategorys()
    }


    componentWillMount(){
        //所有列的数组
        this.columns = [{
            title: '品类名称',
            dataIndex: 'name',
            // render: text => <a href="javascript:;">{text}</a>,
        }, {
            title: '操作',
            width:300,     //固定操作的宽度
            //修改分类时，会读到category的值
            render: (category) => {    //没有指定参数传的时候，就会把整个类名传进去
                return (
                    <span>
                        <a href="javascript:;">修改分类</a>
                        &nbsp;&nbsp;&nbsp;
                        <a href="javascript:;">查看子分类</a>
                    </span>
                )
            }
        },];
    }
    render() {
        //得到列的数组
        const columns = this.columns

        //得到分类的数组
        const {categorys,isShowAdd} = this.state


        return (
            <div>
                <Card>
                    <span style={{fontSize:20}}>一级分类列表</span>
                    <Button type='primary' style={{float:'right'}}
                            onClick={() => this.setState({isShowAdd: true})}>
                        <Icon type='plus'/>
                        添加数据
                    </Button>
                </Card>

                <Table
                    bordered
                    rowKey='_id'     //因为用的这个表格必须要有一个key值，但是自己的数据没有，所以找了一个antd的table方法中有一个设置key的属性，声明key值就是_id
                    columns={columns}
                    dataSource={categorys}
                    loading={!categorys || categorys.length === 0}
                    pagination={{defaultPageSize: 10,showSizeChanger: true, showQuickJumper: true}}
                />

                <Modal
                    title="添加数据"
                    visible={isShowAdd}
                    onOk={this.addCategory}//点击确定按钮，就是要添加分类
                    onCancel={() => this.setState({isShowAdd: false})}  //关闭按钮，回到添加页面，就是把 visible={isShowAdd}从true变成flase
                >
                    <AddForm categorys= {categorys} setForm={(form) => this.form = form}/>
                </Modal>
            </div>
        )
    }
}

//因为添加数据时个Form表单，form有好多方法，所以单独封装
class AddForm extends Component{
    static propTypes = {
        categorys: PropTypes.array.isRequired,    //根据他。生成一个option数据数组
        setForm:PropTypes.func.isRequired
    }

    componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render(){

        const {getFieldDecorator} = this.props.form    //getFieldDecorator可以做表单验证，和得到输入框的值
        //使用，直接调方法，调两次，里边需要传值，1：指定的名字  2：{配置，用来指定初始值的}

        const {categorys} = this.props
        return(
            <Form>
                <Item label='所属分类'>
                    {
                        getFieldDecorator('parentId',{
                            initialValue:'0'
                        })(
                            <Select>
                                <Option key='0' value='0'>一级分类</Option>
                                {
                                    categorys.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
                                }
                            </Select>
                        )
                    }

                </Item>

                <Item label='所属分类'>
                    {
                        getFieldDecorator('categoryName',{
                            initialValue: ''
                        })(
                            <Input placeholder='请输入分类名称'></Input>
                        )
                    }

                </Item>
            </Form>
        )
    }
}

AddForm = Form.create()(AddForm)    //专门包装组件，生成新组件
//包装的作用，就是像AddForm里面穿了一个属性form，小写form的属性，小写form属性是个对象。里边又好多功能可以用
//小写form可以控制属性，重置属性，验证属性


