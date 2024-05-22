import React from 'react';
import { Col, Table, Button } from 'reactstrap';


const Top5Table = ({ topFiveCandidates, handleUpdateVoteTransOnBC, userIsVoted, handleAddVoteTransOnBC, canIdOld }) => {
    return (

        <Col md="5" lg="5">
            <Table responsive>
                <thead>
                    <tr>
                        <th className="text-center">#</th>
                        <th>Name</th>
                        <th className="text-center">Votes</th>
                        <th className="text-right"></th>
                    </tr>
                </thead>
                <tbody>
                    {topFiveCandidates.map((candidate, index) => (
                        <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td>{candidate.name}</td>
                            <td className="text-center">
                                <Button className=" btn-simple" color="success" size="sm">
                                    {candidate.countVote}
                                </Button>{' '}
                            </td>
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
                    ))}
                </tbody>
            </Table>
        </Col>

    );
};

export default Top5Table;