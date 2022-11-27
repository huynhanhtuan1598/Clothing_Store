import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faTrash, faEye, faTruckFast, faBan } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import { DOMAIN } from '~/util/setting/config';

export default function Order() {
    const [listOrder, setListOrder] = useState([]);
    const [statusOrder, setStatusOrder] = useState(3);
    const [detailOrder, setDetailOrder] = useState([]);
    const [lgShow, setLgShow] = useState(false);
    const [pageOrder, setPageOrder] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [arrOrderSearch, setArrOrderSearch] = useState([]);
    const [showDrop, setShowDrop] = useState("");
    const [statusSearch, setStatusSearch] = useState();

    const listStatusOrder = [
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

    const updateStatusOrder = async (idOrder, statusOrder2) => {
        var maPT = 0;
        var arrProduct = [];
        if (statusOrder2 === -1) {
            if (window.confirm(`Order Cancellation ${idOrder} ?`) === true) {
                axios({
                    method: 'post',
                    url: `${DOMAIN}/order/update`,
                    data: {
                        maNVDuyet: JSON.parse(localStorage.getItem("infoUser")).maNguoiDung,
                        maDH: idOrder,
                        trangThai: statusOrder2,
                    }
                }).then((data) => {
                    maPT = (data.data[1])[0].maHD;
                    arrProduct = data.data[0];
                    try {
                        arrProduct.forEach((item, index) => {
                            axios({
                                method: 'post',
                                url: `${DOMAIN}/order/return`,
                                data: {
                                    maPhieuTra: maPT,
                                    maCTSP: item.maCTSP,
                                    soLuong: item.soLuong
                                }
                            }).then((data) => {
                                setStatusOrder(0);
                                setStatusOrder(statusOrder2);
                                getListOrder();
                                setLgShow(false);
                            }).catch((err) => {
                                console.log("err")
                                return;
                            })
                        })
                    } catch (error) {
                        console.log("Error Canceling Order", error)
                    }
                }).catch((error) => {
                    console.log("Error Adding Entry Voucherp", error)
                })
            }
        } else if (statusOrder2 === 1) {
            if (window.confirm(`Ordered ${idOrder} ?`) === true) {
                axios({
                    method: 'post',
                    url: `${DOMAIN}/order/update`,
                    data: {
                        maNVDuyet: JSON.parse(localStorage.getItem("infoUser")).maNguoiDung,
                        maDH: idOrder,
                        trangThai: statusOrder2,
                    }
                }).then((data) => {
                    alert("Update successful")
                    setStatusOrder(0);
                    setStatusOrder(statusOrder2);
                    getListOrder();
                    setLgShow(false);
                }).catch((err) => {
                    console.log("err")
                })
            }
        } else if (statusOrder2 === 2) {
            if (window.confirm(`Order Delivery Confirmation ${idOrder} Successful ?`) === true) {
                axios({
                    method: 'post',
                    url: `${DOMAIN}/order/update`,
                    data: {
                        maNVDuyet: JSON.parse(localStorage.getItem("infoUser")).maNguoiDung,
                        maDH: idOrder,
                        trangThai: statusOrder2
                    }
                }).then((data) => {
                    maPT = (data.data[1])[0].maHD;
                    arrProduct = data.data[0];
                    try {
                        arrProduct.forEach((item, index) => {
                            axios({
                                method: 'post',
                                url: `${DOMAIN}/order/return`,
                                data: {
                                    maPhieuTra: maPT,
                                    maCTSP: item.maCTSP,
                                    soLuong: 0
                                }
                            }).then((data) => {

                            }).catch((err) => {
                                console.log("err")
                                return;
                            })
                        })
                        alert("Update successful");
                        setStatusOrder(0);
                        setStatusOrder(statusOrder2);
                        getListOrder();
                        setLgShow(false);
                    } catch (error) {
                        console.log("Error Update Order Successful", error)
                    }
                }).catch((err) => {
                    console.log("err")
                })
            }
        }

    }

    const getAction = (id, status) => {
        if (status === '0') {
            return (
                <>
                    <button onClick={() => updateStatusOrder(id, 1)} title={'Already Apply'}><FontAwesomeIcon icon={faClipboardCheck} style={{ color: "green", cursor: "pointer" }} /></button>
                    {' '}
                    <button onClick={() => { setStatusSearch(status); getDetailOrder(id) }} title={'View Orders'}><FontAwesomeIcon icon={faEye} style={{ color: "black", cursor: "pointer" }} /></button>
                    {' '}
                    <button onClick={() => updateStatusOrder(id, -1)} title={'Cancellation'}><FontAwesomeIcon icon={faTrash} style={{ color: "red", cursor: "pointer" }} /></button>
                </>
            )
        } else if (status === '1') {
            return (
                <>
                    <button onClick={() => { setStatusSearch(status); getDetailOrder(id) }} title={'View Orders'}><FontAwesomeIcon icon={faEye} style={{ color: "black", cursor: "pointer" }} /></button>
                    {' '}
                    <button onClick={() => updateStatusOrder(id, 2)} title={'Delivery Confirmation'}><FontAwesomeIcon icon={faTruckFast} style={{ color: "green", cursor: "pointer" }} /></button>
                    {' '}
                    <button onClick={() => updateStatusOrder(id, -1)} title={'Delivery Failed'}><FontAwesomeIcon icon={faBan} style={{ color: "red", cursor: "pointer" }} /></button>
                </>
            )
        } else {
            return <button onClick={() => { setStatusSearch(status); getDetailOrder(id) }} title={'View Orders'}><FontAwesomeIcon icon={faEye} style={{ color: "black", cursor: "pointer" }} /></button>
        }
    }

    const getListOrder = async () => {
        axios({
            method: 'get',
            url: `${DOMAIN}/order/status/${statusOrder}?page=${pageOrder}`,
        }).then((data) => {
            setListOrder(data?.data.data);
            setTotalPage(data.data.totalPage);
        }).catch((err) => {
            console.log("err")
        })
    }

    useEffect(() => {
        getListOrder();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusOrder, listOrder?.length, detailOrder, pageOrder])

    const handleSearch = (e) => {
        if (e !== "") {
            axios({
                method: 'GET',
                url: `${DOMAIN}/order/find/${e}`,
            }).then((data) => {
                setArrOrderSearch(data.data[0])
            }).catch((err) => {
                console.log("Error getting category :", err)
            })
            setShowDrop("block")
        } else {
            setShowDrop("")
        }
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

    return (
        <>
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    {/* Begin Page Content */}
                    <div className="container-fluid">
                        {/* Page Heading */}
                        <h1 className="h3 mb-2 text-gray-800">Order Management</h1>
                        {/* DataTales Example */}
                        <div className="card shadow mb-4">
                            <div className="card-header py-3" style={{ marginBottom: "5px" }}>
                                <h6 className="m-0 font-weight-bold text-primary" style={{ display: "flex", justifyContent: "space-between" }}>
                                    <Form.Select value={statusOrder} onChange={e => setStatusOrder(parseInt(e.target.value))} name="status" style={{ width: "300px" }}>
                                        <option value="3">All</option>
                                        <option value="0">Order Success</option>
                                        <option value="1">Delivering</option>
                                        <option value="2">Successful</option>
                                        <option value="-1">Failure</option>
                                    </Form.Select>

                                    <div className="col-lg-4 col-6 text-left">
                                        <form>
                                            <div className="input-group">
                                                <input type="text" onChange={e => handleSearch(e.target.value)} className="form-control" placeholder="Search by Order ID" style={{ float: "right" }} />
                                                <div className="input-group-append">
                                                    <span className="input-group-text bg-transparent text-primary">
                                                        <i className="fa fa-search" />
                                                    </span>
                                                </div>
                                            </div>
                                        </form>
                                        <ul className='dropdown_search' style={{ display: `${showDrop}` }}>
                                            {arrOrderSearch?.map((item, index) => {
                                                return (
                                                    <li style={{ height: "70px", display: "flex", alignItems: "center" }} key={index}>
                                                        <div style={{ color: "black", overflow: "hidden", cursor: "pointer" }} onClick={() => { setStatusSearch(item.trangThai); getDetailOrder(item.maDH) }}>Code orders : {item.maDH}</div>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
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
                                                <th>Code</th>
                                                <th>Amount</th>
                                                <th>Order Creation Date</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th style={{ width: "155px" }}>Manipulation</th>
                                            </tr>
                                        </thead>
                                        <tbody className='cssbutton'>
                                            {listOrder?.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.maDH}</td>
                                                        <td>{item.soLuong || 0}</td>
                                                        <td>{item.ngayTao.slice(0, 10)}</td>
                                                        <td>{formatPrice(item.gia) || 0}</td>
                                                        <td >{listStatusOrder[item.trangThai + 1].title}</td>
                                                        <td style={{ display: "flex" }}>
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
                        Staff code Approved: <u>{detailOrder?.[0]?.maNVDuyet}</u>
                        <br />
                        <br />
                        {' '}Delivery date: <u>{detailOrder?.[0]?.ngayGiao?.slice(0, 10)}</u>
                        {' -- '}
                        Delivery staff code: <u>{detailOrder?.[0]?.maNVGiao}</u>
                        {' ------ '}
                        <b>
                            <u>
                                Total: {formatPrice(detailOrder?.reduce((total, item) =>
                                    total += (item.gia * item.soLuong), 0
                                ))}
                            </u>
                        </b>
                        {' ------ '}
                        {getAction(`${detailOrder?.[0]?.maDH}`, `${statusSearch}`)}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th style={{ width: "23%" }}>Image - Product Code</th>
                                <th>Product's name</th>
                                <th>Price</th>
                                <th>Size</th>
                                <th>Amount</th>
                                {/* <th>Mã KM</th> */}
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
                                        {/* <td></td> */}
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
