import React from 'react';
import { Modal, Table } from 'react-bootstrap';

function FancyBetPopup({ fancyData, setFancyData }) {
    // Extract data from fancyData prop
    const data = fancyData?.data || [];
    
    return (
        <Modal 
            show={fancyData !== null} 
            onHide={() => setFancyData(null)}
            size="md"
            
        >
            <Modal.Header closeButton>
                <Modal.Title>Fancy : <span className="fancyTitleName"></span></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table responsive bordered>
                    <thead>
                        <tr>
                            <th>Run</th>
                            
                            <th className="text-end">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.run}</td>
                                    <td className={`text-end ${
                                        item.is_negative ? 'text-danger' : 
                                        item.is_positive ? 'text-success' : 
                                        'text-muted'
                                    }`}>
                                        {item.amount}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="text-center text-muted">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Modal.Body>
        </Modal>
    );
}
export default FancyBetPopup