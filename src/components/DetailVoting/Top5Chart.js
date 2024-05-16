import React from 'react';
import { Col } from 'reactstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';

const Top5Chart = ({ transformedData }) => {
    const data = [
        {
            "name": "Page A Page",
            "uv": 4000,
        },
        {
            "name": "Page B",
            "uv": 3000,
        },
        {
            "name": "Page C",
            "uv": 2000,
        },
        {
            "name": "Page D",
            "uv": 2780,
        },
        {
            "name": "Page E",
            "uv": 1890,
        },

    ]
    const colors = ['#d850d4', '#2582f7', '#00dccf', '#2e3c61', '#ffffff']; // Mảng các màu

    return (
        <Col md="7" lg="7" style={{}}>
            {transformedData &&
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart width={500} height={300} data={transformedData}
                        margin={{ top: 50, right: 20, bottom: 0, left: -40 }}
                    >
                        {/* <CartesianGrid strokeDasharray="3 3" /> */}
                        <XAxis hide={true} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="countVote">
                            {
                                data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index]} strokeWidth={index === 2 ? 4 : 1} />
                                ))
                            }
                            <LabelList dataKey="name" position="top" scale={true}
                            >
                            </LabelList>
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

            }
        </Col>

    );
};

export default Top5Chart;