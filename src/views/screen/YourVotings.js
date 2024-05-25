
import React, { useContext, useEffect, useState } from "react";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import {

    Container,
    Row,
    Col,
    Modal,
    UncontrolledAlert,
} from "reactstrap";
import { Link, useNavigate } from 'react-router-dom';
import { getDatabase, ref as dbRef, set, onValue, query, orderByChild, equalTo, child, get } from "firebase/database";
import { database, storage } from "firebase.js";
import { AppContext } from "context/AppContext";
import PublicVotings from "components/home/PublicVotings";
import { MaterialUIControllerProvider } from "context";
import UploadImage from "components/home/UploadImage";
import moment from "moment";
import { ConfigProvider, Pagination } from "antd";

import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, List, Space, Input } from 'antd';

const { Search } = Input;

const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

const onSearch = (value, _e, info) => console.log(info?.source, value);

export default function YourVotings({ isLogin }) {
    const [votings, setVotings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const votingsPerPage = 6;
    // const votingsToShow = votings.slice((currentPage - 1) * votingsPerPage, currentPage * votingsPerPage);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const navigate = useNavigate();
    const userInfor = JSON.parse(localStorage.getItem("user-voting"));
    useEffect(() => {
        // hàm láy danh sách votings từ mongodb
        getYourVotings();
    }, []);

    // hàm getYourVotings
    async function getYourVotings() {
        try {
            const response = await fetch(`/api/votings/getYourVotings/${userInfor._id}`);
            const data = await response.json();
            console.log(data);
            setVotings(data)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        
        // Khi searchTerm thay đổi thì filter lại danh sách votings theo tên của các votings
        const results = votings.filter(voting =>
            voting.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    }, [searchTerm]);
    const votingsToShow = searchTerm ? searchResults.slice((currentPage - 1) * votingsPerPage, currentPage * votingsPerPage) : votings.slice((currentPage - 1) * votingsPerPage, currentPage * votingsPerPage);
    return (
        <>
            <IndexNavbar isLogin={isLogin} />
            <div className="wrapper">
                <div
                    className="page-header"
                    style={{ overflow: 'auto' }}
                >

                    <Container >
                        <div style={{
                            marginTop: '100px',
                        }}>
                            <Row>
                                <Col lg='6' md='6'>
                                    <h3>Your Votings</h3>
                                </Col>
                                <Col lg='6' md='6'>
                                    <ConfigProvider
                                        theme={{
                                            token: {
                                                /* here is your global tokens */
                                                colorBgContainer: 'rgba(255, 255, 255, 0.15)',
                                                // colorIcon: 'rgb(255, 255, 255)',
                                                colorText: 'rgb(255, 255, 255)',
                                                colorIcon: 'rgb(255, 255, 255)',
                                                colorTextPlaceholder: 'rgba(255, 255, 255, 0.35)',
                                            },
                                            components: {
                                                Input: {
                                                    /* here is your component tokens */
                                                    activeBg: 'rgba(247, 247, 247, 0.0)',
                                                    activeBorderColor: 'rgba(255, 255, 255, 0.0)',
                                                    addonBg: 'rgba(255, 255, 255, 0.51)',

                                                },
                                            },
                                        }}
                                    >
                                        <Search
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="search your votings ..."
                                            onSearch={onSearch}
                                            style={{
                                                width: 400,
                                                position: 'relative',
                                                right: '0px',

                                            }}
                                        />
                                    </ConfigProvider>

                                </Col>
                            </Row>
                            {/* <h3>Public Votings</h3> */}
                            <div>
                                <Row className="row-grid justify-content-start">

                                    {votingsToShow.map((voting) => (
                                        <Col lg="4" sm="12"
                                            key={voting._id}
                                            onClick={() => { navigate(`/votingDetail?votingId=${voting._id}`) }}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                            }}
                                        >
                                            <div className="info" style={{ paddingTop: '10px' }}>
                                                <div className="icon icon-primary">
                                                    <div >
                                                        <img
                                                            src={voting.imgUrl}
                                                            alt={voting.title}
                                                            style={{ height: '200px', width: '300px', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                </div>
                                                <h4 className="info-title">{voting.title}</h4>
                                                <hr className="line-primary" />
                                                <p>
                                                    Ends {moment(`${voting.endAt}`, 'YYYYMMDD').fromNow()}
                                                    {/* {poll.endAt} */}
                                                </p>
                                            </div>
                                        </Col>
                                    ))}

                                </Row>
                                <Row style={{
                                    margin: '10px auto 150px',

                                }}>
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Pagination: {
                                                    /* here is your component tokens */
                                                    itemActiveBg: 'rgba(255, 255, 255, 0.4)',
                                                },
                                            },
                                        }}
                                    >
                                        <Pagination pageSizeOptions={[3, 6, 9, 12, 30]} current={currentPage} onChange={setCurrentPage} total={votings.length + 50} />
                                    </ConfigProvider>


                                </Row>

                            </div>
                        </div>

                        {/* logic của phân trang, lấy current page  */}
                        {/* <div style={{
                            backgroundColor: 'white',
                        }}>
                            <List
                                itemLayout="vertical"
                                size="large"
                                pagination={{
                                    onChange: (page) => {
                                        setCurrentPage(page);
                                    },
                                    pageSize: 3,
                                    total: votings.length,
                                }}
                                dataSource={votings}
                                renderItem={(voting) => (
                                    <List.Item
                                        key={voting.title}
                                        actions={[
                                            <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                                            <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                                            <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                                        ]}
                                        extra={
                                            <img
                                                width={272}
                                                alt="logo"
                                                src={voting.imgUrl}
                                            />
                                        }
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar src={voting.avatar} />}
                                            title={<a href={voting.href}>{voting.title}</a>}
                                            description={voting.description}
                                        />
                                        {voting.content}
                                    </List.Item>
                                )}
                            />
                        </div> */}


                    </Container>





                </div>

            </div >
        </>
    );

}
