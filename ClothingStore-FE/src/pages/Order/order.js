import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons'
import Alert from 'react-bootstrap/Alert';
import axios from 'axios'
import { DOMAIN } from '~/util/setting/config';
import Modal from 'react-bootstrap/Modal';

export default function Order() {
    const [listOrder, setListOrder] = useState([]);
    const [pageOrder, setPageOrder] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [detailOrder, setDetailOrder] = useState([]);
    const [lgShow, setLgShow] = useState(false);
    const [statusSearch, setStatusSearch] = useState();

    const listSize = [
        {
            size: 'S'
        },
        {
            size: 'M'
        },
        {
            size: 'L'
        },
        {
            size: 'XL'
        },
        {
            size: 'XXL'
        },
    ]


    const status = [
        {
            status: -1,
            title: <Alert variant={'danger'} style={{ width: "fit-content" }}>
               Failure
            </Alert>
        },
        {
            status: 0,
            title: <Alert variant={'info'} style={{ width: "fit-content" }}>
               Order Success
            </Alert>
        },
        {
            status: 1,
            title: <Alert variant={'info'} style={{ width: "fit-content" }}>
               On Delivery
            </Alert>
        },
        {
            status: 2,
            title: <Alert variant={'info'} style={{ width: "fit-content" }}>
                Successful Delivery
            </Alert>
        },
    ]

    const updateStatusOrder = async (idOrder, statusOrder) => {
        if (statusOrder === -1) {
            if (window.confirm(`Order Cancellation Confirmation ${idOrder} ?`) === true) {
                await axios({
                    method: 'post',
                    url: `${DOMAIN}/order/update`,
                    data: {
                        trangThai: statusOrder,
                        maDH: idOrder
                    }
                }).then((data) => {
                    alert("Update successful")
                }).catch((err) => {
                    console.log("err")
                })
            }
        } else {
            if (window.confirm(`Order Received Confirmation ${idOrder} ?`) === true) {
                await axios({
                    method: 'post',
                    url: `${DOMAIN}/order/update`,
                    data: {
                        trangThai: statusOrder,
                        maDH: idOrder
                    }
                }).then((data) => {
                    alert("Update successful")
                }).catch((err) => {
                    console.log("err")
                })
            }
        }

        getListOrder();
    }

    const getDetailOrder = async (id) => {
        axios({
            method: 'get',
            url: `${DOMAIN}/order/detail/${id}`,
        }).then((data) => {
            setDetailOrder(data.data[0]);
            setLgShow(true);
        }).catch((err) => {
            console.log("err")
        })
    }

    const getAction = (id, status) => {
        if (status == 0) {
            return (<>
                <button onClick={() => { setStatusSearch(status); getDetailOrder(id) }} title={'View Orders'}><FontAwesomeIcon icon={faEye} style={{ color: "black", cursor: "pointer" }} /></button>
                {' '}
                <button onClick={() => updateStatusOrder(id, -1)} title={'Cancellation'}><FontAwesomeIcon icon={faTrash} style={{ color: "red", cursor: "pointer" }} /></button>
            </>)
        } else {
            return (<button onClick={() => { setStatusSearch(status); getDetailOrder(id) }} title={'View Orders'}><FontAwesomeIcon icon={faEye} style={{ color: "black", cursor: "pointer" }} /></button>)
        }
    }

    const getListOrder = async (id) => {
        await axios({
            method: 'post',
            url: `${DOMAIN}/order/id?page=${pageOrder}`,
            data: {
                maNguoiDung: JSON.parse(localStorage.getItem("infoUser")).maNguoiDung
            }
        }).then((data) => {
            setListOrder(data.data.data);
            setTotalPage(data.data.totalPage);
        }).catch((err) => {
            console.log("err")
        })
    }

    const formatPrice = (price) => {
        return Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(price)
    }

    const setNumPage = (boolean) => {
        if (boolean === true) {
            if (pageOrder < totalPage) {
                setPageOrder(pageOrder + 1)
            }
        } else {
            if (pageOrder > 1) {
                setPageOrder(pageOrder - 1)
            }
        }
    }

    useEffect(() => {
        getListOrder();
        console.log(listOrder)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listOrder?.length, pageOrder])


    return (
        <>
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    {/* Begin Page Content */}
                    <div className="container-fluid">
                        {/* Page Heading */}
                        <h1 className="h3 mb-2 text-gray-800">Your Order</h1>
                        {/* DataTales Example */}
                        <div className="card shadow mb-4">
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
                                                <th>Code</th>
                                                <th>Amount</th>
                                                <th>Order Creation Date</th>
                                                <th>Delivery date</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th style={{ width: "155px" }}>Manipulation</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listOrder?.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.maDH}</td>
                                                        <td>{item.soLuong || 0}</td>
                                                        <td>{item.ngayTao?.slice(0, 10)}</td>
                                                        <td>{item.ngayGiao?.slice(0, 10)}</td>
                                                        <td>{formatPrice(item.gia || 0)}</td>
                                                        <td >{status[item.trangThai + 1]?.title}</td>
                                                        <td style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                                                            {getAction(`${item.maDH}`, `${item.trangThai}`)}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="input-group quantity mr-3" style={{ width: "fit-content" }}>
                                    <div className="input-group-btn">
                                        <button onClick={() => { setNumPage(false) }} className="btn btn-success btn-minus">
                                            Prev
                                        </button>
                                    </div>
                                    <p className="form-control bg-secondary border-0 text-center" style={{ color: "white", width: "fit-content" }}>{`${pageOrder} / ${totalPage}`}</p>
                                    <div onClick={() => { setNumPage(true) }} className="input-group-btn">
                                        <button className="btn btn-success btn-plus">
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                size="xl"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        [{detailOrder?.[0]?.maDH}]
                        {' -- '}
                        Date created: <u>{detailOrder?.[0]?.ngayTao.slice(0, 10)}</u>
                        {' -- '}
                        Staff code approval: <u>{detailOrder?.[0]?.maNVDuyet}</u>
                        <br />
                        <br />
                        {' '}Delivery date: <u>{detailOrder?.[0]?.ngayGiao?.slice(0, 10)}</u>
                        {' -- '}
                        Delivery staff code: <u>{detailOrder?.[0]?.maNVGiao}</u>
                        {' ------ '}
                        <b>
                            <u>
                                Total : {formatPrice(detailOrder?.reduce((total, item) =>
                                    total += (item.gia * item.soLuong), 0
                                ))}
                            </u>
                        </b>
                        {' ------ '}
                        {getAction(`${detailOrder.maDH}`, `${statusSearch}`)}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Image - Product Code</th>
                                <th>Name Product</th>
                                <th>Price</th>
                                <th>Size</th>
                                <th>Amount</th>
                                <th>Promo code</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detailOrder?.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={{ fontSize: "20px", fontWeight: "bold" }}>{index}</td>
                                        <td style={{ fontSize: "20px", fontWeight: "bold" }}><img src={item.hinhAnh1} alt="imageProduct" style={{ width: "150px" }} /> - {item.maSP}</td>
                                        <td>{item.tenSP}</td>
                                        <td>{formatPrice(item.gia)}</td>
                                        <td>{listSize[`${item.maSize - 1}`].size}</td>
                                        <td>{item.soLuong}</td>
                                        <td></td>
                                        <td>{formatPrice(item.gia * item.soLuong)}</td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        </>
    )
}
