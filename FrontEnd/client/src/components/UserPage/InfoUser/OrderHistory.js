import React, { Component } from 'react';
import {Empty, message} from 'antd';
import axiosInstance from '../../../utils/axiosInstance';
import Order from './Order';

export default class OrderHistory extends Component {
    //
    constructor(props){
        super();
        this.state = {
            orderList: [],
        }
    }
    //
    callApi = async () => {
        let list = await axiosInstance(`Order/GetOrderListByUserId/${this.props.userId}`, 'GET')
        .then(res => res.data);
        let format = list.map(ele => {
            return {...ele, key: ele.id}
        })
        this.setState({
            orderList: format,
        })
    }
    async componentDidMount(){
        await this.callApi();
    }
    //
    // handleCancelOrder(orderId){
    //     axiosInstance(`ManageOrder/UserCancelOrder/${orderId}`, 'DELETE')
    //     .then(res => {
    //         if(res.data){
    //             const newList = this.state.orderList.filter(e => e.id !== orderId);
    //             message.success('Hủy đơn hàng thành công!', 4)
    //             this.setState({
    //                 orderList: newList,
    //             })
    //         }
    //         else{
    //             message.warning('Hủy đơn hàng thất bại!', 4)
    //         }
    //     })
    // }
    async confirmSuccess(orderId){
        this.setState({
            isLoading: true,
        });
        let list = await axiosInstance(`ManageOrder/ConfirmSuccessOrder`,'POST', {orderId: orderId, status: 3})
        .then(res => res.data);
        if(list === true){
            message.success('Đã chuyển sang trạng thái Giao hàng Thành công!', 4)
            this.callApi();
        }else{
            message.warning('Chuyển trạng thái Thành công thất bại!', 4)
            this.setState({
                isLoading: false,
            })
        }
    }

    async handleCancelOrder(note, orderId){
        this.setState({
            isLoading: true,
            visibleCancel: false,
        })
        let list = await axiosInstance(`ManageOrder/CancelOrder`,'POST', 
        {orderId: orderId, status: 1, statusRollBack: 0, note: note})
        .then(res => res.data);
        if(list === true){
            message.success('Đã hủy Đơn hàng thành công!', 4)
            this.callApi();
        }else{
            message.warning('Hủy Đơn hàng thất bại!', 4);
            this.setState({
                
                isLoading: false,
            })
        }
        
    }
    render() {
        const {orderList} = this.state;
        
        if(orderList.length === 0){
            return (
                <div style={{height: 300}}>
                    <Empty 
                    description={
                        <span>
                            Chưa có lịch sử mua hàng!
                        </span>
                      }>

                    </Empty>
                </div>
            )
        }
        else{
            return <Order list={orderList} onSuccess={this.confirmSuccess.bind(this)} ></Order>
        }
        
    }
}
