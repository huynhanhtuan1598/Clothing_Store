import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import axios from 'axios'
import { DOMAIN } from '~/util/setting/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

export default function Revenue() {
    const DayInitial = (boolean) => {
        if (boolean) {
            if (today.getMonth() < 10) {
                return (today.getFullYear() + '-0' + (today.getMonth() + 1) + '-01')
            } else {
                return (today.getFullYear() + '-' + (today.getMonth() + 1) + '-01')
            }
        } else {
            if (today.getMonth() < 10) {
                return (today.getFullYear() + '-0' + (today.getMonth() + 1) + '-30')
            } else {
                return (today.getFullYear() + '-' + (today.getMonth() + 1) + '-30')
            }
        }
    }
    const navigate = useNavigate();
    const today = new Date();
    const [listOrder, setListOrder] = useState([]);
    const [statusOrder, setStatusOrder] = useState(3);
    const [pageOrder, setPageOrder] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [dayStart, setDayStart] = useState(DayInitial(true));
    const [dayEnd, setDayEnd] = useState(DayInitial(false));
    const [detailOrder, setDetailOrder] = useState([]);
    const [lgShow, setLgShow] = useState(false);
    const [totalData, setTotalDate] = useState([]);

    const listStatusOrder = [
        {
            status: -1,
            title: <Alert variant={'danger'} style={{ width: "fit-content" }}>
                failed
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

    const getListOrder = async () => {
        axios({
            method: 'post',
            url: `${DOMAIN}/orders/day?page=${pageOrder}`,
            data: {
                trangThai: statusOrder,
                ngayBatDau: dayStart,
                ngayKetThuc: dayEnd
            }
        }).then((data) => {
            setListOrder(data?.data.data);
            setTotalPage(data.data.totalPage);
            setTotalDate(data.data.totalData);
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

    const setDaySearch = (day, boolean) => {
        if (boolean) {
            if (day > dayEnd) {
                alert("Start Date Can't Be Greater Than End Date!!!");
            } else {
                setDayStart(day);
            }
        } else {
            if (day < dayStart) {
                alert("End Date Must Not Be Less Than Start Date!!!");
            } else {
                setDayEnd(day)
            }
        }
    }

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("infoUser")).role !== 1) {
            alert("You Do Not Have Permission to Access This Site !!!!!")
            navigate('/admin')
        }
        getListOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dayStart, dayEnd, statusOrder, pageOrder])

    return (
        <>
            <div className="container-fluid">
                {/* Page Heading */}
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">View Revenue By Timeline</h1>
                </div>
                {/* Content Row */}
                <div className="row">
                    {/* Earnings (Monthly) Card Example */}
                    <div className="col-xl-3 col-md-6 mb-4">
                        <div className="card border-left-success shadow h-100 py-2">
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                            Turnover
                                        </div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                                            {statusOrder === -1 ? ("-") : null}
                                            {formatPrice(totalData?.reduce((sum, { gia }) => sum += gia, 0))}
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <i className="fas fa-dollar-sign fa-2x text-gray-300" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Earnings (Monthly) Card Example */}
                    <div className="col-xl-3 col-md-6 mb-4">
                        <div className="card border-left-info shadow h-100 py-2">
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                            {statusOrder === -1 ? ("Number of Returned Orders") : ("ORDER NUMBER")}
                                        </div>
                                        <div className="row no-gutters align-items-center">
                                            <div className="col-auto">
                                                <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                                                    {totalData?.length}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Pending Requests Card Example */}
                    <div className="col-xl-3 col-md-6 mb-4">
                        <div className="card border-left-warning shadow h-100 py-2">
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">

                                            {statusOrder === -1 ? ("Number of Returned Products") : ("Number of Products Sold")}
                                        </div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{totalData?.reduce((sum, { soLuong }) => sum += soLuong, 0)}</div>
                                    </div>
                                    <div className="col-auto">
                                        <i className="fas fa-box fa-2x text-gray-300" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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
                            <Col>
                                <Form.Label>Start day</Form.Label>
                                <Form.Control
                                    required
                                    type="date"
                                    name="ngayBatDau"
                                    defaultValue={DayInitial(true)}
                                    value={dayStart}
                                    onChange={e => setDaySearch(e.target.value, true)}
                                />
                            </Col>
                            <Col>
                                <Form.Label>End date</Form.Label>
                                <Form.Control
                                    required
                                    type="date"
                                    name="ngayKetThuc"
                                    defaultValue={DayInitial(false)}
                                    value={dayEnd}
                                    onChange={e => setDaySearch(e.target.value, false)}
                                />
                            </Col>
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
                                        <th>Code orders</th>
                                        <th>The number of products</th>
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
                                                    <button onClick={() => { getDetailOrder(item.maDH) }} title={'Xem Đơn Hàng'}><FontAwesomeIcon icon={faEye} style={{ color: "black", cursor: "pointer" }} /></button>
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
                        Employee Code Approval: <u>{detailOrder?.[0]?.maNVDuyet}</u>
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
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Image - Product code</th>
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
