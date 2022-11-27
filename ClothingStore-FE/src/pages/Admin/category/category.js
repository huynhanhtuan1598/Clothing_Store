import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import { DOMAIN } from '~/util/setting/config';
import Table from 'react-bootstrap/Table';

export default function Category() {
    const [listCategory, setListCategory] = useState([]);
    const [nameCategory, setNameCategory] = useState();
    const [statusCategory, setStatusCategory] = useState(1);

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const [infoBeforUpdate, setInfoBeforUpdate] = useState();
    const [nameAfterUpdate, setNameAfterUpdate] = useState();
    const [show1, setShow1] = useState(false);
    const handleShow1 = (item) => { setInfoBeforUpdate(item); setShow1(true) };
    const handleClose1 = () => setShow1(false);

    const updateStatusCategory = async (trangThai, maTL) => {
        var text = (trangThai === 0 ? 'Xoá Thể Loại ?' : "Kích Hoạt Thể Loại?");
        if (window.confirm(text) === true) {
            axios({
                method: 'delete',
                url: `${DOMAIN}/cate/status`,
                data: {
                    trangThai: trangThai,
                    maTL: maTL,
                }
            }).then((data) => {
            }).catch((err) => {
                console.log("err")
            })
        }
        window.location.href = '/admin/category'
    }

    const getAllCategory = async () => {
        await axios({
            method: 'get',
            url: `${DOMAIN}/cate/${statusCategory}`
        }).then((data) => {
            setListCategory(data.data?.[0])
        }).catch((err) => {
            console.log("err")
        })
    }

    const addCategory = async () => {
        axios({
            method: 'post',
            url: `${DOMAIN}/cate/add`,
            data: {
                tenTL: nameCategory
            }
        }).then((data) => {
            if (data.data === 0) {
                alert("Type Name already exists !!!")
                return;
            } else {
                setStatusCategory(0)
                setStatusCategory(1)
                handleClose();
            }
        }).catch((err) => {
            console.log("err")
        })

    }

    const updateCategory = async () => {
        axios({
            method: 'post',
            url: `${DOMAIN}/cate/update`,
            data: {
                tenTL: nameAfterUpdate,
                maTL: infoBeforUpdate.maTL
            }
        }).then((data) => {
            if (data.data === 0) {
                alert("Type Name already exists !!!")
                return;
            } else {
                setNameAfterUpdate("");
                handleClose1();
            }
        }).catch((err) => {
            console.log("err")
        })
    }

    useEffect(() => {
        getAllCategory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listCategory.length, statusCategory, show1, show])

    return (
        <>
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    {/* Begin Page Content */}
                    <div className="container-fluid">
                        {/* Page Heading */}
                        <h1 className="h3 mb-2 text-gray-800">Category Management</h1>
                        {/* DataTales Example */}
                        <div className="card shadow mb-4">
                            <div className="card-header py-3" style={{ marginBottom: "5px" }}>
                                <h6 className="m-0 font-weight-bold text-primary">
                                    <Form.Select onChange={e => setStatusCategory(parseInt(e.target.value))} name="status" style={{ width: "300px" }}>
                                        <option value="1">Categories On Sale</option>
                                        <option value="0">Discontinued Category</option>
                                    </Form.Select>
                                    <Button variant="success" onClick={handleShow} style={{ position: "absolute", top: "8px", right: "10px" }}>Thêm Thể Loại Mới</Button>
                                </h6>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <Table striped bordered hover
                                        className="table table-bordered"
                                        id="dataTable"
                                        width="100%"
                                        cellSpacing={0}
                                        style={{ color: "black" }}
                                    >
                                        <thead>
                                            <tr >
                                                <th>Category Code</th>
                                                <th>Category Name</th>
                                                <th>Amount</th>
                                                <th>Manipulation</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listCategory.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.maTL}</td>
                                                        <td>{item.tenTL}</td>
                                                        <td>{item.SLSanPham}</td>
                                                        <td>
                                                            {statusCategory == "1" ?
                                                                (<><button onClick={() => handleShow1(item)} style={{ marginRight: "10px" }}><FontAwesomeIcon icon={faPenToSquare} style={{ color: "green", cursor: "pointer" }} /></button>
                                                                    {' '}
                                                                    <button onClick={() => updateStatusCategory(0, `${item.maTL}`)} ><FontAwesomeIcon icon={faTrash} style={{ color: "red", cursor: "pointer" }} /></button></>)
                                                                : (<Button variant="success" onClick={() => updateStatusCategory(1, `${item.maTL}`)}>Bán Lại</Button>)}
                                                        </td>
                                                    </tr>
                                                )
                                            })}

                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /.container-fluid */}
                </div>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Tpye</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label htmlFor="tenTL">Enter Category Name</Form.Label>
                    <Form.Control
                        type="text"
                        id="tenTL"
                        onChange={e => setNameCategory(((e.target.value.toLowerCase().replace(/  +/g, ' ')).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).trim()).charAt(0).toUpperCase() + ((e.target.value.toLowerCase().replace(/  +/g, ' ')).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).trim()).slice(1))}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={addCategory}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show1} onHide={handleClose1}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label htmlFor="tenCu">Name antiquated</Form.Label>
                    <Form.Control
                        disabled
                        type="text"
                        id="tenCu"
                        value={infoBeforUpdate?.tenTL}
                    />
                    <Form.Label htmlFor="tenMoi">New</Form.Label>
                    <Form.Control
                        type="text"
                        id="tenMoi"
                        onChange={e => {
                            var temp = e.target.value;
                            temp = ((temp.toLowerCase().replace(/  +/g, ' ')).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).trim()).charAt(0).toUpperCase() + ((temp.toLowerCase().replace(/  +/g, ' ')).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).trim()).slice(1)
                            setNameAfterUpdate(temp)
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose1}>
                        Cancel
                    </Button>
                    <Button variarfnt="success" onClick={() => updateCategory()}>
                        Edit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
