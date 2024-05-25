
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { UserOutlined } from '@ant-design/icons';


// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import { useMaterialUIController } from "context";
import { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import MDAvatar from "components/MDAvatar";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

import { List, Avatar } from 'antd';
import { Space, Table, Tag } from 'antd';

import moment from "moment";

import { message } from 'antd';

import { Tabs } from 'antd';
const onChange = (key) => {
    console.log(key);
};
function UserList() {
    const [messageApi, contextHolder] = message.useMessage();

    const success = (content) => {
        messageApi.open({
            type: 'success',
            content: content,
        });
    };
    const [users, setUsers] = useState([])
    const [blockedUser, setBlockedUser] = useState([])

    useEffect(() => {
        getUsers();
        getBlockedUsers();
    }, []);

    async function handleBlockUser(id) {
        console.log(id.key)
        try {
            const response = await fetch(`/api/users/blockUser/${id.key}`, {
                method: 'PUT',
            });
            const data = await response.json();
            console.log(data)
            if (data) {
                getUsers();
                getBlockedUsers();
                success("User  unblocked successfully!")
            }
        } catch (error) {
            console.error("Error in getUsers: ", error.message);
        }
    }
    async function handleUnBlockUser(id) {
        console.log(id.key)
        try {
            const response = await fetch(`/api/users/unblockUser/${id.key}`, {
                method: 'PUT',
            });
            const data = await response.json();
            console.log(data)
            if (data) {
                getUsers();
                getBlockedUsers();
                success("User  unblocked successfully!")
            }

        } catch (error) {
            console.error("Error in getUsers: ", error.message);
        }
    }
    async function getUsers() {
        try {
            const response = await fetch(`/api/users/getUsers/unblocked`, {
                method: "GET",
            });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error in getUsers: ", error.message);
        }
    }
    async function getBlockedUsers() {
        try {
            const response = await fetch(`/api/users/getUsers/blocked`, {
                method: "GET",
            });
            const data = await response.json();
            console.log(data);
            setBlockedUser(data);
        } catch (error) {
            console.error("Error in getUsers: ", error.message);
        }
    }
    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
        },
        {
            title: 'Avt',
            dataIndex: 'avt',
            key: 'avt',
            render: (url) => <Avatar
                style={{
                    backgroundColor: '#87d068',
                }}
                icon={<UserOutlined />}
            />
        }
        ,
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Created At',
            dataIndex: 'createAt',
            key: 'createAt',
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'red';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (id) => (
                <Space onClick={() => { handleBlockUser(id) }} size="middle">
                    <a>Block</a>
                </Space>
            ),
        },
    ];
    const columnsBlock = [
        {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
        },
        {
            title: 'Avt',
            dataIndex: 'avt',
            key: 'avt',
            render: (url) => <Avatar
                style={{
                    backgroundColor: '#87d068',
                }}
                icon={<UserOutlined />}
            />
        }
        ,
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Created At',
            dataIndex: 'createAt',
            key: 'createAt',
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'red';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (id) => (
                <Space onClick={() => { handleUnBlockUser(id) }} size="middle">
                    <a> Unblock</a>
                </Space>
            ),
        },
    ];
    const rows = Object.keys(users || {})
        .map((id) => {
            const user = users[id];
            if (user) {
                return {
                    key: user._id,
                    no: users.indexOf(user) + 1,
                    avt: user.avtUrl,
                    name: user.name,
                    email: user.email,
                    createAt: moment(user.createdAt).format("MMM Do YY"),
                    tags: ['nice',],
                    action: id
                };
            }
        })

    const rowsBlocked =blockedUser
        .map((user) => {
            // const user = users[id];
            if (user) {
                return {
                    key: user._id,
                    no: blockedUser.indexOf(user) + 1,
                    avt: user.avtUrl,
                    name: user.name,
                    email: user.email,
                    createAt: moment(user.createdAt).format("MMM Do YY"),
                    tags: [, 'blocked'],
                };
            }
        })

    const items = [
        {
            key: '1',
            label: 'Users',
            children: <Table columns={columns} dataSource={rows} />,
        },
        {
            key: '2',
            label: 'Blocked Users',
            children: <Table columns={columnsBlock} dataSource={rowsBlocked} />,
        },

    ];

    return (
        <DashboardLayout>
            <DashboardNavbar />
            {contextHolder}
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    {users &&
                        <Grid item xs={12}>
                            <Card>
                                <MDBox
                                    mx={2}
                                    mt={-3}
                                    py={3}
                                    px={2}
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                >
                                    <MDTypography variant="h6" color="white">
                                        Users Table
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={3}>
                                    <Tabs defaultActiveKey="1" items={items} onChange={onChange}
                                        style={{
                                            padding: '20px'
                                        }}
                                    />
                                    {/* <Table columns={columns} dataSource={rows} /> */}
                                </MDBox>
                            </Card>
                        </Grid>}

                </Grid>
            </MDBox>

        </DashboardLayout>
    );
}

export default UserList;
