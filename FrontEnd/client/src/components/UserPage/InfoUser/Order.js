import React, { Component } from 'react';
import {Row, Col, Button, Table, Tag} from 'antd';
import {StopOutlined, MinusCircleOutlined, SyncOutlined, CheckCircleOutlined} from '@ant-design/icons';
import moment from 'moment';
import ModalCancelOrder from '../../order/modalOrder/ModalCancelOrder';
import ModalReturnOrder from '../../order/modalOrder/ModalReturnOrder';
import {Empty, message} from 'antd';
import axiosInstance from '../../../utils/axiosInstance';




export default class Order extends Component {
    constructor(props){
        super(props);
        this.state = {
            
            visible: false,
            visibleCancel: false,
            isLoading: true,
            feeShip: 0,
            customerItem: '',
            orderId: 0,
            note: null,
            //
            rangePicker: [],
            keyWord: null,
        }
    }
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
    SuccessOrder(record){
        this.props.onSuccess(record.id);
    }
    CancelOrder(record){
        this.props.onCancel(record.id);
    }

    // huy don hang
    confirmCancelOrder = (record) => {
        
        this.setState({
            isLoading: true,
            visibleCancel: true,
            orderId: record.id,
        })
    }
//khieu nai
    confirmReturnOrder = (record) => {
        
        this.setState({
            isLoading: true,
            visibleCancel: true,
            orderId: record.id,
        })
    }

    //hide return detail
    handleReturn(value){
        this.setState({
            visible: value,
        })
        this.callApi();
    }
    //hide modal cancel
    handleReturnModal(){
        this.setState({
            visibleCancel: false,
            isLoading: false,
        })
    }
    //hide modal detail
    handleCancel(value){
        this.setState({
            visible: value,
        })
        this.callApi();
    }
    //hide modal cancel
    handleCancelModal(){
        this.setState({
            visibleCancel: false,
            isLoading: false,
        })
    }

    async handleCancelOrder(note, orderId){
        this.setState({
            isLoading: true,
            visibleCancel: false,
        })
        let list = await axiosInstance(`ManageOrder/UserCancelOrder`,'POST', 
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
    async handleReturnOrder(note, orderId){
        this.setState({
            isLoading: true,
            visibleCancel: false,
        })
        let list = await axiosInstance(`ManageOrder/Refund`,'POST', 
        {orderId: orderId, status: 5, statusRollBack: 0, note: note})
        .then(res => res.data);
        if(list === true){
            message.success('Khiếu nại Đơn hàng thành công vui lòng chờ phản hồi !', 4)
            this.callApi();
        }else{
            message.warning('Khiếu nại Đơn hàng thất bại!', 4);
            this.setState({
                
                isLoading: false,
            })
        }
        
    }
    
    render() {
        const {list} = this.props;
        const {orderNotConfirm, isLoading, visible, visibleCancel, orderDetailList, customerItem, 
            note ,feeShip, orderId} = this.state;
        //
        
        //
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                render: text => <span>{text}</span>,
            },
            {
                title: 'NGÀY ĐẶT',
                dataIndex: 'createDate',
                key: 'createDate',
                render: text => <span >{moment(text).format('DD/MM/YYYY')}</span>
            },
              
            {
                title: 'TRẠNG THÁI',
                key: 'status',
                dataIndex: 'status',
                render: status => (
                    
                    
                    <Tag style={{width: 100}} icon={status === 2 ? <SyncOutlined spin/>: status === 3 ? <CheckCircleOutlined/> : <MinusCircleOutlined></MinusCircleOutlined> } 
                    color={status === 5 ? '#FF6633':status === 6 ? '#2db7f5':status === 2 ? '#2db7f5': status === 3 ? '#87d068' : '#f50'}>
                        {status === 5 ? 'Return':status === 6 ? 'Confirmed':status === 2 ? 'Shipping': status === 3 ? 'received' : 'Not Confirm'}
                    </Tag>
                    
                    
                    
                ),
            },
            {
                title: 'PHÍ SHIP',
                key: 'feeShip',
                dataIndex: 'feeShip',
                render: fee => (
                  
                    <strong>{(fee).toLocaleString('vi-VN')} đ</strong>
                  
                ),
            },
            
            {
                title: 'TỔNG TIỀN',
                dataIndex: 'total',
                key: 'total',
                render: total => <strong style={{color: '#87d068'}}>{(total).toLocaleString('vi-VN')} đ</strong>
            },
            {
                render: (record) => <>
                <Button  
                style={{color: '#87d068', display:record.status === 3||record.status === 5||record.status === 6||record.status === 0||record.status === 1 ? 'none':null}} onClick={() => this.SuccessOrder(record)} danger>Đã nhận hàng</Button>
                <Button  
                style={{color: '#f50',display:record.status === 3||record.status === 5||record.status === 6||record.status === 2||record.status === 1 ? 'none':null}} onClick={() => this.confirmCancelOrder(record)} danger>Hủy đơn hàng</Button>
                <Button  
                style={{color: '#f50',display:record.status === 2||record.status === 5||record.status === 6||record.status === 0||record.status === 1 ? 'none':null}} onClick={() => this.confirmReturnOrder(record)} danger>Khiếu nại/Trả hàng</Button>

                </>
                
            }
        
        ];
        return (
            <div>
                <br></br>
                <Row>
                    <Col lg={{span: 24}}>
                        <Table columns={columns} dataSource={list}
                        pagination={{
                            position: ["bottomCenter", "bottomCenter"],
                            defaultPageSize: 5,
                            defaultCurrent: 1
                          }}
                        >

                        </Table>
                         {/*Modal Cancel */}
                         {
                            visibleCancel ?
                            <ModalCancelOrder 
                            visible={visibleCancel}
                            onOk={this.handleCancelOrder.bind(this)}
                            onCancel={this.handleCancelModal.bind(this)}
                            orderId={orderId}
                            >
                            </ModalCancelOrder> : null
                        }
                        {
                            visibleCancel ?
                            <ModalReturnOrder 
                            visible={visibleCancel}
                            onOk={this.handleReturnOrder.bind(this)}
                            onCancel={this.handleReturnModal.bind(this)}
                            orderId={orderId}
                            >
                            </ModalReturnOrder> : null
                        }
                    </Col>
                    
                    
                </Row>
            </div>
        )
    }
}
