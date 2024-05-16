// component này nhận vào idVoting và idUser, sau đó hiển thị các lần mà user đã thay đổi vote
// 1. Lấy ra danh sách các lần thay đổi vote của user từ Blockchain
// 2. Lấy các idCandidate trong các update truyền qua component con 
//    UpdateVoteItem để lấy thông tin chi tiết từ Firebase
//  
import React from "react";

import {
    Table,
    TabPane,
} from "reactstrap";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import CandidateName from "./CandidateName";



function UpdateVoteList(idVoting, userId) {
    const [updateVoteList, setUpdateVoteList] = React.useState([]);
    React.useEffect(() => {
        const signer = new ethers.providers.Web3Provider(
            window.ethereum,
        ).getSigner();
        const sdk = ThirdwebSDK.fromSigner(signer, "sepolia");
        const smartContractAddress = "0xe9fE15A6Be86a57c9A8dbB3dcD4441CFE24471C0"
        const getUpdateVoteList = async () => {
            try {
                if (idVoting && userId) {
                    console.log("param", idVoting, userId);
                    const contract = await sdk.getContract(smartContractAddress);
                    // const Data = await contract.call("getVoteUpdatesByIdVotingAndUser", [idVoting, userId]);
                    const Data = await contract.call("voteUpdates", []);
                    setUpdateVoteList(Data);
                    console.log("DataUpdate", Data);
                    console.log("VoteUpdate", updateVoteList);
                    
                }
            } catch (error) {
                console.error(error)
            }
        }
        getUpdateVoteList()
    }, []);

    return (
        <TabPane tabId="tab1">
            <Table className="tablesorter" responsive>
                <tbody>
                    {updateVoteList.map((update, index) => (
                        <tr>
                            <td>Lần {index + 1}: </td>
                            <td>
                                <CandidateName canId={update.idCandidate}></CandidateName>
                            </td>
                        </tr>
                    ))}
                </tbody>

                <tbody>
                    {/* <tr>
                        <td>ETH</td>
                        <td>30.737</td>
                        <td>64,53.30 USD</td>
                    </tr>
                    <tr>
                        <td>XRP</td>
                        <td>19.242</td>
                        <td>18,354.96 USD</td>
                    </tr> */}
                </tbody>
            </Table>
        </TabPane>
    )

}

export default UpdateVoteList;