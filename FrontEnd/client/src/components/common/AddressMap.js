import React from 'react';
import { Row, Col } from 'antd';
 const AddressMap=()=>{
    return (
        <Row>
            <Col lg={{span: 24}}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d931.0249655844383!2d105.7824507!3d21.0286899!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab86cece9ac1%3A0xa9bc04e04602dd85!2zRlBUIEFwdGVjaCBIw6AgTuG7mWkgLSBI4buHIFRo4buRbmcgxJDDoG8gVOG6oW8gTOG6rXAgVHLDrG5oIFZpw6puIFF14buRYyBU4bq_IChTaW5jZSAxOTk5KQ!5e0!3m2!1svi!2s!4v1687192420324!5m2!1svi!2s" width="100%" height="350"  style={{border:0}}  aria-hidden="false" ></iframe>
            </Col>
        </Row>
    );
 }
 export{AddressMap}