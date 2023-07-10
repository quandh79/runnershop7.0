import React, { Component } from 'react';
import {CardElement, injectStripe, ReactStripeElements} from 'react-stripe-elements';
import {Button, Input, message} from 'antd';
import { PayPalButton } from "react-paypal-button-v2";


const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding,
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
};
class FormStripe extends Component {
  constructor(props){
      super(props);
      this.state = {
          name: '',
          isLoading: false,
          
          clientId: "https://www.paypal.com/sdk/js?client-id=AR86XShHEggIM0YzMF6FdymWDWPkpjh7mx-PDVlwis1Ve0HRniLtcaaIjPLMDDw-MZPi89PNeLAmuKrd"
          
      }
  }
  handleSubmit = async(e) => {
      try{
          //let token = await this.props.stripe.createToken({name: this.state.name, currency: 'VND'})
          //console.log(token);
          //localStorage.setItem("payment", JSON.stringify(token));
          message.success("Thanh toán online thành công!",2);
          this.setState({
            isLoading: true,
          })
          setTimeout(()=>{
            this.setState({
              isLoading: false,
            })
          }, 2000)
      }
      catch(err){
          throw err;
      }
  }
  
  render() {
      return (
        
          <>
          
              {/* <label>Tên chủ tài khoản</label>
              <Input type="text" value={this.state.name} placeholder="Tên chủ tài khoản" 
              onChange={(e)=> this.setState({name: e.target.value})}></Input> */}
              <br></br><br></br>
              <label>Tổng tiền (VND)</label>
              <Input type="text" value={this.props.total + " - VND (free ship)"} disabled></Input>
              <br></br><br></br>
              {/* <CardElement {...createOptions(16)}></CardElement> */}
              <br></br>
              {/* <Button onClick={this.handleSubmit.bind(this)} loading={this.state.isLoading}>Thanh toán</Button> */}
              <PayPalButton
              // options={{
              //   "vault": true,
              //   "client-id": "AR86XShHEggIM0YzMF6FdymWDWPkpjh7mx-PDVlwis1Ve0HRniLtcaaIjPLMDDw-MZPi89PNeLAmuKrd"
              // }}
              
                  amount={Math.round(this.props.total / 23000)}
                  // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                  onSuccess={(details, data) => {
                    alert("Transaction completed by " + details.payer.name.given_name);

                    // OPTIONAL: Call your server to save the transaction
                    return fetch("/paypal-transaction-complete", {
                      method: "post",
                      body: JSON.stringify({
                        orderID: data.orderID
                      })
                    });
                  }}
                 
                  
                />
          </>
          
      )
  }
}
export default injectStripe(FormStripe);
