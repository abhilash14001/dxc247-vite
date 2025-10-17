import React, {useEffect, useState, useRef, useContext} from 'react';
import {Modal, Button, Form, Table} from 'react-bootstrap';
import axiosFetch from "../utils/Constants";
import Notify from "../utils/Notify";
import {SportsContext} from "../contexts/SportsContext";
import { useStake } from '../contexts/StakeContext';

const StakeModal = ({show, handleClose}) => {
    // State for form data retrieval and disabling the save button
    const [stakeDisable, setStakeDisable] = useState(false);
    const [formData, setFormData] = useState({});

    const { stakeValues, setStakeValues, refreshStakeValues } = useStake();

    // Refs for each form input
    const stakeRefs = useRef({});

    // Initialize refs and form data when stakeValues change
    useEffect(() => {
        if (Object.values(stakeValues).length > 0) {
            const newFormData = {};
            Object.entries(stakeValues).forEach(([i, stake], index) => {
                if (!stakeRefs.current[index]) {
                    stakeRefs.current[index] = {label: React.createRef(), val: React.createRef()};
                }
                newFormData[index] = {
                    label: stake.label,
                    val: stake.val
                };
            });
            setFormData(newFormData);
        }
    }, [stakeValues]);



    // Handle input changes
    const handleInputChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            [index]: {
                ...prev[index],
                [field]: value
            }
        }));
    };

    // Save function
    const saveStakeNew = async (event) => {
        event.preventDefault();
        setStakeDisable(true);

        // Retrieve values from formData state
        const submitData = {};
        Object.entries(formData).forEach(([index, data], i) => {
            submitData[`lable${parseInt(i) + 1}`] = data.label;
            submitData[`val${parseInt(i) + 1}`] = data.val;
        });

        try {
            const result = await axiosFetch('saveStake', 'post', null, submitData);

            if (result.data.status === true) {
                await refreshStakeValues();
                setStakeDisable(false);
                Notify("Stake Values Updated Successfully", null, null, 'success');
                handleClose(false);
            } else {
                setStakeDisable(false);
                Notify("Update Error", null, null, 'danger');
            }
        } catch (error) {
            setStakeDisable(false);
            Notify("Something Went Wrong", null, null, 'danger');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Stake</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Table bordered>
                        <thead>
                        <tr>
                            
                            <th>Price Label</th>
                            <th>Price Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.entries(formData).map(([index, data]) => (
                            <tr key={index}>
                                <td>
                                    <Form.Control
                                        type="number"
                                        value={data.label || ''}
                                        onChange={(e) => handleInputChange(index, 'label', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        value={data.val || ''}
                                        onChange={(e) => handleInputChange(index, 'val', e.target.value)}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <div className="text-right mb-3">
                        <Button variant="success" disabled={stakeDisable} onClick={saveStakeNew}>
                            Update
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default StakeModal;
