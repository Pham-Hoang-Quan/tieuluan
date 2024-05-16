import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Bar ,Column } from '@ant-design/plots';

export const  Chart = (data) => {
    // const data = [
    //     {
    //       action: '浏览网站',
    //       pv: 50000,
    //     },
    //     {
    //       action: '放入购物车',
    //       pv: 35000,
    //     },
    //     {
    //       action: '生成订单',
    //       pv: 25000,
    //     },
    //     {
    //       action: '支付订单',
    //       pv: 15000,
    //     },
    //     {
    //       action: '完成交易',
    //       pv: 8500,
    //     },
    //   ];
      const config = {
        data,
        xField: 'action',
        yField: 'pv',
        conversionTag: {},
        xAxis: {
          label: {
            autoHide: true,
            autoRotate: false,
          },
        },
      };
      return <Column  {...config} />;
    };

// ReactDOM.render(<Chart />, document.getElementById('container'));
