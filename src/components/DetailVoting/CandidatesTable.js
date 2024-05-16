import React from 'react';
import { Col, Table, Button } from 'reactstrap';


const CandidatesTable = ({ candidates }) => {
    // Tính tổng số phiếu bầu
    const totalVotes = candidates.reduce((total, candidate) => total + candidate.countVote, 0);

    return (
        <Col md="12" lg="12">
            <Table responsive>
                <thead>
                    <tr>
                        <th className="text-center">#</th>
                        <th>Name</th>
                        <th className="text-center">Votes</th>
                        <th className="text-center">Percentage</th>
                        <th className="text-right"></th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map((candidate, index) => {
                        // Tính phần trăm phiếu bầu cho mỗi ứng cử viên
                        const percentage = ((candidate.countVote / totalVotes) * 100).toFixed(2);

                        return (
                            <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td>{candidate.name}</td>
                                <td className="text-center">
                                    <Button className=" btn-simple" color="success" size="sm">
                                        {candidate.countVote}
                                    </Button>{' '}
                                </td>
                                <td className="text-center">{percentage}%</td>
                                {/* <td className="text-center">
                                    {
                                        userIsVoted ? (
                                            canIdOld == candidate.id ? (
                                                <Button color="success" size="sm">
                                                    Voted
                                                </Button>
                                            ) : (
                                                <Button color="info" size="sm" onClick={() => { handleUpdateVoteTransOnBC(candidate.id) }}>
                                                    Re-vote
                                                </Button>
                                            )
                                        ) : (
                                            <Button color="info" size="sm" onClick={() => { handleAddVoteTransOnBC(candidate.id) }}>
                                                Vote
                                            </Button>
                                        )
                                    }
                                </td> */}
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </Col>
    );
};

export default CandidatesTable;