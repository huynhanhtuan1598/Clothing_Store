import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import { DOMAIN } from '~/util/setting/config';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import { Formik } from 'formik'
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import * as yup from 'yup';


export default function Product() {
    const [listProduct, setListProduct] = useState([]);
    const [cate, setCate] = useState([]);
    const [statusProduct, setStatusProduct] = useState(1);
    const [infoProduct, setInfoProduct] = useState([]);
    const [showDrop, setShowDrop] = useState("");
    const [arrProdcutSearch, setArrProductSearch] = useState([]);
    const [pageProduct, setPageProdut] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [img1, setImg1] = useState();
    const [img2, setImg2] = useState();
    const [img3, setImg3] = useState();

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setImg1();
        setImg2();
        setImg3();
    };

    const [show1, setShow1] = useState(false);
    const handleShow1 = (item) => { getInfoProduct(item); };
    const handleClose1 = () => {
        setShow1(false);
        setImg1();
        setImg2();
        setImg3();
    };

    const getAllCategory = async () => {
        await axios({
            method: 'get',
            url: `${DOMAIN}/cate/1`,
        }).then((data) => {
            setCate(data.data?.[0])
        }).catch((err) => {
            console.log("err")
        })
    }

    const deleteProduct = async (maSP) => {
        if (window.confirm("Delete Products ?") === true) {
            await axios({
                method: 'delete',
                url: `${DOMAIN}/product/delete`,
                data: {
                    maSP: maSP
                }
            }).then((data) => {
            }).catch((err) => {
                console.log("err")
            })
        }

        getAllProduct();
    }

    const getAllProduct = async () => {
        await axios({
            method: 'post',
            url: `${DOMAIN}/products?page=${pageProduct}`,
            data: {
                trangThai: statusProduct,
                maTL: 0,
                gia: 0
            }
        }).then((data) => {
            console.log(data)
            setListProduct(data?.data.data)
            setTotalPage(data?.data.totalPage)
        }).catch((err) => {
            console.log("err", err.message)
        })
    }

    const getInfoProduct = async (maSP) => {
        await axios({
            method: 'get',
            url: `${DOMAIN}/product/${maSP}`,
        }).then((data) => {
            setInfoProduct(data.data[0][0])
            setShow1(true)
        }).catch((err) => {
            console.log("err")
        })
    }

    const activateProduct = async (maSP) => {
        if (window.confirm("Bán Lại Sản Phẩm ?") === true) {
            await axios({
                method: 'post',
                url: `${DOMAIN}/product/activate`,
                data: {
                    maSP: maSP
                }
            }).then((data) => {
                getAllProduct();
            }).catch((err) => {
                console.log("err")
            })
        }
    }

    const formatPrice = (price) => {
        return Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(price)
    }

    const imageUpload = async (e, idImg) => {
        var fileIn = e.target;
        var file = fileIn.files[0];
        if (file && file.size < 5e6) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "nghiephh")
            formData.append("mode", 'no-cors')
            try {
                if (idImg === 1) {
                    await fetch('https://api.cloudinary.com/v1_1/nghiephh/image/upload', {
                        method: 'POST',
                        body: formData,
                    })
                        .then((response) => response.json())
                        .then((response) => {
                            e.preventDefault();
                            setImg1(response.secure_url)
                        });
                } else if (idImg === 2) {
                    await fetch('https://api.cloudinary.com/v1_1/nghiephh/image/upload', {
                        method: 'POST',
                        body: formData,
                    })
                        .then((response) => response.json())
                        .then((response) => {
                            e.preventDefault();
                            setImg2(response.secure_url)
                        });
                } else if (idImg === 3) {
                    await fetch('https://api.cloudinary.com/v1_1/nghiephh/image/upload', {
                        method: 'POST',
                        body: formData,
                    })
                        .then((response) => response.json())
                        .then((response) => {
                            e.preventDefault();
                            setImg3(response.secure_url)
                        });
                }
            } catch (error) {
                console.log(error);
            }

        } else {
            alert("file Quá Lớn");
        }
    }

    const handleSearch = (e) => {
        if (e !== "") {
            axios({
                method: 'POST',
                url: `${DOMAIN}/product/find`,
                data: {
                    tenSP: e,
                    trangThai: statusProduct
                }
            }).then((data) => {
                setArrProductSearch(data.data)
            }).catch((err) => {
                console.log("Lỗi lấy thể loại :", err)
            })
            setShowDrop("block")
        } else {
            setShowDrop("")
        }
    }

    const setNumPage = (boolean) => {
        if (boolean === true) {
            if (pageProduct < totalPage) {
                setPageProdut(pageProduct + 1)
            }
        } else {
            if (pageProduct > 1) {
                setPageProdut(pageProduct - 1)
            }
        }
    }

    const schema = yup.object().shape({
        tenSP: yup.string().required("Please Enter Product Name"),
        moTa: yup.string().required("Please Fill In Product Description"),
        hinhAnh: yup.mixed().required("Please Choose 1 Image"),
        // hinhAnh2: yup.mixed().required("Please Choose 1 Image"),
        // hinhAnh3: yup.mixed().required("Please Choose 1 Image"),

        SLSizeS: yup.number().required("Please Fill In The Number Of Sizes S").min(0),
        giaSizeS: yup.number().when("SLSizeS", {
            is: value => value && value > 0,
            then: yup.number().required("If You Have Quantity, The Price Can't Be 0 !!!")
                .test('len', 'Price Cant Be Zero When Quantity Other Than 0', val => val > 0)
        }),

        SLSizeM: yup.number().required("Please Fill In The Number Of Sizes M").min(0),
        giaSizeM: yup.number().when("SLSizeM", {
            is: value => value && value > 0,
            then: yup.number().required("If You Have Quantity, The Price Can't Be 0 !!!")
                .test('len', 'Price Cant Be Zero When Quantity Other Than 0', val => val > 0)
        }),

        SLSizeL: yup.number().required("Please Fill In The Number Of Sizes L").min(0),
        giaSizeL: yup.number().when("SLSizeL", {
            is: value => value && value > 0,
            then: yup.number().required("If You Have Quantity, The Price Can't Be 0 !!!")
                .test('len', 'Price Cant Be Zero When Quantity Other Than 0', val => val > 0)
        }),

        SLSizeXL: yup.number().required("Please Fill In The Number Of Sizes XL").min(0),
        giaSizeXL: yup.number().when("SLSizeXL", {
            is: value => value && value > 0,
            then: yup.number().required("If You Have Quantity, The Price Can't Be 0 !!!")
                .test('len', 'Price Cant Be Zero When Quantity Other Than 0', val => val > 0)
        }),

        SLSizeXXL: yup.number().required("Please Fill In The Number Of Sizes XXL").min(0),
        giaSizeXXL: yup.number().when("SLSizeXXL", {
            is: value => value && value > 0,
            then: yup.number().required("If You Have Quantity, The Price Can't Be 0 !!!")
                .test('len', 'Price Cant Be Zero When Quantity Other Than 0', val => val > 0)
        }),
    })

    const schema2 = yup.object().shape({
        tenSP: yup.string().required("Please Enter Product Name"),
        moTa: yup.string().required("Please Fill In Product Description"),

        SLSizeS: yup.number().required("Please Fill In The Number Of Sizes S").min(0),
        giaSizeS: yup.number().when("SLSizeS", {
            is: value => value && value > 0,
            then: yup.number().required("If You Have Quantity, The Price Can't Be 0 !!!")
                .test('len', 'Price Cant Be Zero When Quantity Other Than 0', val => val > 0)
        }),

        SLSizeM: yup.number().required("Please Fill In The Number Of Sizes M").min(0),
        giaSizeM: yup.number().when("SLSizeM", {
            is: value => value && value > 0,
            then: yup.number().required("If You Have Quantity, The Price Can't Be 0 !!!")
                .test('len', 'Price Cant Be Zero When Quantity Other Than 0', val => val > 0)
        }),

        SLSizeL: yup.number().required("Please Fill In The Number Of Sizes L").min(0),
        giaSizeL: yup.number().when("SLSizeL", {
            is: value => value && value > 0,
            then: yup.number().required("If You Have Quantity, The Price Can't Be 0 !!!")
                .test('len', 'Price Cant Be Zero When Quantity Other Than 0', val => val > 0)
        }),

        SLSizeXL: yup.number().required("Please Fill In The Number Of Sizes XL").min(0),
        giaSizeXL: yup.number().when("SLSizeXL", {
            is: value => value && value > 0,
            then: yup.number().required("If You Have Quantity, The Price Can't Be 0 !!!")
                .test('len', 'Price Cant Be Zero When Quantity Other Than 0', val => val > 0)
        }),

        SLSizeXXL: yup.number().required("Please Fill In The Number Of Sizes XXL").min(0),
        giaSizeXXL: yup.number().when("SLSizeXXL", {
            is: value => value && value > 0,
            then: yup.number().required("If You Have Quantity, The Price Can't Be 0 !!!")
                .test('len', 'Price Cant Be Zero When Quantity Other Than 0', val => val > 0)
        }),
    })

    useEffect(() => {
        getAllProduct();
        getAllCategory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listProduct?.length, statusProduct, infoProduct, pageProduct, img1, img2, img3])

    return (
        <>
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    {/* Begin Page Content */}
                    <div className="container-fluid">
                        {/* Page Heading */}
                        <h1 className="h3 mb-2 text-gray-800">Product Management</h1>
                        {/* DataTales Example */}
                        <div className="card shadow mb-4">
                            <div className="card-header py-3" style={{ marginBottom: "5px" }}>
                                <h6 className="m-0 font-weight-bold text-primary" style={{ display: "flex", justifyContent: "space-between" }}>
                                    <Form.Select onChange={e => setStatusProduct(e.target.value)} name="status" style={{ width: "300px" }}>
                                        <option value="1">Products On Sale</option>
                                        <option value="0">Discontinued Products</option>
                                    </Form.Select>
                                    <div className="col-lg-4 col-6 text-left">
                                        <form>
                                            <div className="input-group">
                                                <input type="text" onChange={e => handleSearch(e.target.value)} className="form-control" placeholder="Search by Product Name" style={{ float: "right" }} />
                                                <div className="input-group-append">
                                                    <span className="input-group-text bg-transparent text-primary">
                                                        <i className="fa fa-search" />
                                                    </span>
                                                </div>
                                            </div>
                                        </form>
                                        <ul className='dropdown_search' style={{ display: `${showDrop}` }}>
                                            {arrProdcutSearch.map((item, index) => {
                                                return (
                                                    <li style={{ height: "70px", display: "flex", alignItems: "center" }}>
                                                        <img src={item.hinhAnh1} alt="imageProduct" style={{ width: "20%", height: "100%" }}></img>
                                                        <div style={{ color: "black", overflow: "hidden", cursor: "pointer" }} onClick={() => handleShow1(`${item.maSP}`)}>{item.tenSP}</div>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                    <Button variant="success" onClick={handleShow} >Add New Products</Button>
                                </h6>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <Table striped bordered hover
                                        className="table table-bordered"
                                        id="dataTable"
                                        width="100%"
                                        cellSpacing={0}
                                        style={{ color: "black", textAlign: "center", display: 'table' }}
                                    >
                                        <thead>
                                            <tr>
                                                <th >ID</th>
                                                <th style={{ width: "18%" }}>Picture</th>
                                                <th style={{ width: "25%" }}>Product's name</th>
                                                <th >Price</th>
                                                <th >Total Inventory</th>
                                                <th >Manipulation</th>
                                            </tr>
                                        </thead>
                                        <tbody className='cssbutton'>
                                            {listProduct?.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td style={{ verticalAlign: "middle" }}>{item.maSP}</td>
                                                        <td style={{ verticalAlign: "middle" }}><img src={`${item.hinhAnh}`} alt='ImgProduct' style={{ width: "50%" }}></img></td>
                                                        <td style={{ verticalAlign: "middle" }}>{item.tenSP}</td>
                                                        <td style={{ verticalAlign: "middle" }}>{formatPrice(`${item.giaThapNhat}`)} ~ {formatPrice(`${item.giaCaoNhat}`)}</td>
                                                        <td style={{ verticalAlign: "middle" }}>{item.tongSLTon}</td>
                                                        <td style={{ verticalAlign: "middle" }}>
                                                            {statusProduct == "1" ?
                                                                (<><button onClick={() => handleShow1(`${item.maSP}`)} style={{ marginRight: "10px" }}><FontAwesomeIcon icon={faPenToSquare} style={{ color: "green", cursor: "pointer" }} /></button>
                                                                    {' '}
                                                                    <button onClick={() => deleteProduct(`${item.maSP}`)} ><FontAwesomeIcon icon={faTrash} style={{ color: "red", cursor: "pointer" }} /></button></>)
                                                                : (<Button variant="success" onClick={() => activateProduct(`${item.maSP}`)}>Resell</Button>)}
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
                                    <p className="form-control bg-secondary border-0 text-center" style={{ color: "white", width: "fit-content" }}>{`${pageProduct} / ${totalPage}`}</p>
                                    <div onClick={() => { setNumPage(true) }} className="input-group-btn">
                                        <button className="btn btn-success btn-plus">
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /.container-fluid */}
                </div>
            </div>

            <Modal show={show} onHide={handleClose} size={'xl'} fullscreen={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        onSubmit={(values, { resetForm }) => {
                            var index = cate.map(item => item.tenTL).indexOf(`${values.maTL}`)
                            if (index === -1) {
                                alert("Please Select Category !!!");
                            } else if (values.SLSizeS === 0 && values.SLSizeM === 0 && values.SLSizeL === 0 && values.SLSizeXL === 0 && values.SLSizeXXL === 0) {
                                alert("Can't Add Products With Total Quantity equal to 0 !!!\nMust Have At least 1 Size Yes Quantity !!!");
                            } else {
                                console.log(values)
                                values.maTL = cate[index].maTL;
                                values.hinhAnh = img1;
                                values.hinhAnh2 = img2;
                                values.hinhAnh3 = img3;
                                values.maNV = JSON.parse(localStorage.getItem("infoUser"))?.maNguoiDung;
                                values.tenSP = ((values.tenSP.toLowerCase().replace(/  +/g, ' ')).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).trim()).charAt(0).toUpperCase() + ((values.tenSP.toLowerCase().replace(/  +/g, ' ')).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).trim()).slice(1)
                                values.moTa = ((values.moTa.toLowerCase().replace(/  +/g, ' ')).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).trim()).charAt(0).toUpperCase() + ((values.moTa.toLowerCase().replace(/  +/g, ' ')).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).trim()).slice(1)
                                axios({
                                    method: 'post',
                                    url: `${DOMAIN}/product/add`,
                                    data: values
                                }).then((data) => {
                                    handleClose();
                                    getAllProduct();
                                    resetForm();
                                    alert("Add Successful Products");
                                }).catch((err) => {
                                    console.log("err", err)
                                })
                            }
                        }}
                        enableReinitialize={true}
                        validationSchema={schema}
                        initialValues={{
                            tenSP: "",
                            maTL: "",
                            hinhAnh: "",
                            hinhAnh2: "",
                            hinhAnh3: "",
                            maNV: JSON.parse(localStorage.getItem("infoUser"))?.maNguoiDung,

                            SLSizeS: 0,
                            SLSizeM: 0,
                            SLSizeL: 0,
                            SLSizeXL: 0,
                            SLSizeXXL: 0,

                            giaSizeS: 0,
                            giaSizeM: 0,
                            giaSizeL: 0,
                            giaSizeXL: 0,
                            giaSizeXXL: 0,

                            moTa: "No description available.",
                        }}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            resetForm,
                            values,
                            touched,
                            isValid,
                            errors,
                        }) => (
                            <Form onSubmit={handleSubmit} style={{ color: "black", fontSize: "18px" }}>
                                <Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>Product's name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="tenSP"
                                                onChange={handleChange}
                                                isValid={touched.tenSP && !errors.tenSP}
                                                isInvalid={!!errors.tenSP}
                                            />
                                            <Form.Control.Feedback type="invalid" tooltip>
                                                {errors.tenSP}
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Label>Category</Form.Label>
                                            <Form.Select onChange={handleChange} name="maTL">
                                                <option>Please Select Category</option>
                                                {cate.map((item, index) => {
                                                    return (<option name="maTL" key={item.maTL}>{item.tenTL}</option>)
                                                })}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>Image 1</Form.Label>
                                            <Form.Control type='file' name="hinhAnh"
                                                onChange={e => {
                                                    imageUpload(e, 1)
                                                    handleChange(e)
                                                }}
                                                isValid={touched.hinhAnh && !errors.hinhAnh}
                                                isInvalid={!!errors.hinhAnh}
                                            />
                                            <Form.Control.Feedback type="invalid" tooltip>
                                                {errors.hinhAnh}
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Label>Image 2</Form.Label>
                                            <Form.Control type='file' name="hinhAnh2"
                                                onChange={e => {
                                                    imageUpload(e, 2)
                                                    handleChange(e)
                                                }}
                                                isValid={touched.hinhAnh2 && !errors.hinhAnh2}
                                                isInvalid={!!errors.hinhAnh2}
                                            />
                                            <Form.Control.Feedback type="invalid" tooltip>
                                                {errors.hinhAnh2}
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Label>Image 3</Form.Label>
                                            <Form.Control type='file' name="hinhAnh3"
                                                onChange={e => {
                                                    imageUpload(e, 3)
                                                    handleChange(e)
                                                }}
                                                isValid={touched.hinhAnh3 && !errors.hinhAnh3}
                                                isInvalid={!!errors.hinhAnh3}
                                            />
                                            <Form.Control.Feedback type="invalid" tooltip>
                                                {errors.hinhAnh3}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                    <Row style={{ paddingTop: "20px" }}>
                                        <Col>
                                            <Form.Label>Describe</Form.Label>
                                            <Form.Control name="moTa" defaultValue={values.moTa} onChange={handleChange} as="textarea" aria-label="With textarea"
                                                isValid={touched.moTa && !errors.moTa}
                                                isInvalid={!!errors.moTa}
                                            />
                                            <Form.Control.Feedback type="invalid" tooltip>
                                                {errors.moTa}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                </Row>
                                <Tabs
                                    defaultActiveKey="sizeS"
                                    id="uncontrolled-tab-example"
                                    className="mb-3"
                                    style={{ paddingTop: "20px" }}
                                >
                                    <Tab eventKey="sizeS" title="Size S">
                                        <Row style={{ paddingTop: "10px" }}>
                                            <Form.Label>Size S</Form.Label>
                                        </Row>
                                        <Row style={{ color: "red" }}>
                                            <Col>
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="giaSizeS"
                                                    defaultValue={values.giaSizeS}
                                                    onChange={handleChange}
                                                    min="0"
                                                    placeholder='Price Size S'
                                                    isValid={touched.giaSizeS && !errors.giaSizeS}
                                                    isInvalid={!!errors.giaSizeS}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.giaSizeS}
                                                </Form.Control.Feedback>
                                            </Col>
                                            <Col>
                                                <Form.Label>Amount</Form.Label>
                                                <Form.Control name="SLSizeS" onChange={handleChange} defaultValue={values.SLSizeS} type="number" placeholder="S Size Quantity "
                                                    isValid={touched.SLSizeS && !errors.SLSizeS}
                                                    isInvalid={!!errors.SLSizeS}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.SLSizeS}
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Row>
                                    </Tab>
                                    <Tab eventKey="sizeM" title="Size M">
                                        <Row style={{ paddingTop: "10px" }}>
                                            <Form.Label>Size M</Form.Label>
                                        </Row>
                                        <Row style={{ color: "red" }}>
                                            <Col>
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="number"
                                                    name="giaSizeM"
                                                    defaultValue={values.giaSizeM}
                                                    onChange={handleChange}
                                                    min="0"
                                                    placeholder='Price Size M'
                                                    isValid={touched.giaSizeM && !errors.giaSizeM}
                                                    isInvalid={!!errors.giaSizeM}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.giaSizeM}
                                                </Form.Control.Feedback>
                                            </Col>
                                            <Col>
                                                <Form.Label>Amount</Form.Label>
                                                <Form.Control required name="SLSizeM" onChange={handleChange} defaultValue={values.SLSizeM} type="number" placeholder=" M Size Quantity"
                                                    isValid={touched.SLSizeM && !errors.SLSizeM}
                                                    isInvalid={!!errors.SLSizeM}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.SLSizeM}
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Row>
                                    </Tab>
                                    <Tab eventKey="sizeL" title="Size L">
                                        <Row style={{ paddingTop: "10px" }}>
                                            <Form.Label>Size L</Form.Label>
                                        </Row>
                                        <Row style={{ color: "red" }}>
                                            <Col>
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="number"
                                                    name="giaSizeL"
                                                    defaultValue={values.giaSizeL}
                                                    onChange={handleChange}
                                                    min="0"
                                                    placeholder='Price Size L'
                                                    isValid={touched.giaSizeL && !errors.giaSizeL}
                                                    isInvalid={!!errors.giaSizeL}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.giaSizeL}
                                                </Form.Control.Feedback>
                                            </Col>
                                            <Col>
                                                <Form.Label>Amount</Form.Label>
                                                <Form.Control required name="SLSizeL" onChange={handleChange} defaultValue={values.SLSizeL} type="number" placeholder="L Size Quantity "
                                                    isValid={touched.SLSizeL && !errors.SLSizeL}
                                                    isInvalid={!!errors.SLSizeL}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.SLSizeL}
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Row>
                                    </Tab>

                                    <Tab eventKey="sizeXL" title="Size XL">
                                        <Row style={{ paddingTop: "10px" }}>
                                            <Form.Label>Size XL</Form.Label>
                                        </Row>
                                        <Row style={{ color: "red" }}>
                                            <Col>
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="number"
                                                    name="giaSizeXL"
                                                    defaultValue={values.giaSizeXL}
                                                    onChange={handleChange}
                                                    min="0"
                                                    placeholder='Price Size XL'
                                                    isValid={touched.giaSizeXL && !errors.giaSizeXL}
                                                    isInvalid={!!errors.giaSizeXL}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.giaSizeXL}
                                                </Form.Control.Feedback>
                                            </Col>
                                            <Col>
                                                <Form.Label>Amount</Form.Label>
                                                <Form.Control required name="SLSizeXL" onChange={handleChange} defaultValue={values.SLSizeXL} type="number" placeholder=" XL Size Quantity"
                                                    isValid={touched.SLSizeXL && !errors.SLSizeXL}
                                                    isInvalid={!!errors.SLSizeXL}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.SLSizeXL}
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Row>
                                    </Tab>

                                    <Tab eventKey="sizeXXL" title="Size XXL">
                                        <Row style={{ paddingTop: "10px" }}>
                                            <Form.Label>Size XXL</Form.Label>
                                        </Row>
                                        <Row style={{ color: "red" }}>
                                            <Col>
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="number"
                                                    name="giaSizeXXL"
                                                    defaultValue={values.giaSizeXXL}
                                                    onChange={handleChange}
                                                    min="0"
                                                    placeholder='Price Size XXL'
                                                    isValid={touched.giaSizeXXL && !errors.giaSizeXXL}
                                                    isInvalid={!!errors.giaSizeXXL}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.giaSizeXXL}
                                                </Form.Control.Feedback>
                                            </Col>
                                            <Col>
                                                <Form.Label>Amount</Form.Label>
                                                <Form.Control required name="SLSizeXXL" onChange={handleChange} defaultValue={values.SLSizeXXL} type="number" placeholder=" XXL Size Quantity"
                                                    isValid={touched.SLSizeXXL && !errors.SLSizeXXL}
                                                    isInvalid={!!errors.SLSizeXXL}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.SLSizeXXL}
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Row>
                                    </Tab>
                                </Tabs>
                                <div style={{ paddingTop: "20px" }}>
                                    <img src={img1} alt="Img1" style={{ height: "20%", width: "20%", paddingRight: "15px" }}></img>
                                    <img src={img2} alt="Img2" style={{ height: "20%", width: "20%", paddingRight: "15px" }}></img>
                                    <img src={img3} alt="Img3" style={{ height: "20%", width: "20%", paddingRight: "15px" }}></img>
                                </div>
                                <Button type="submit" style={{ marginTop: "15px" }} > Add Product</Button>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body >
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Delete</Button>
                </Modal.Footer>
            </Modal >

            <Modal show={show1} onHide={handleClose1} size={'xl'} fullscreen={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        onSubmit={values => {
                            if (img1 !== undefined) {
                                values.hinhAnh = img1;
                            }
                            if (img2 !== undefined) {
                                values.hinhAnh2 = img2;
                            }
                            if (img3 !== undefined) {
                                values.hinhAnh3 = img3;
                            }
                            values.maTL = parseInt(values.maTL);
                            values.maNV = JSON.parse(localStorage.getItem("infoUser")).maNguoiDung;
                            values.tenSP = ((values.tenSP.toLowerCase().replace(/  +/g, ' ')).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).trim()).charAt(0).toUpperCase() + ((values.tenSP.toLowerCase().replace(/  +/g, ' ')).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).trim()).slice(1)
                            values.moTa = (values.moTa.toLowerCase().replace(/  +/g, ' ')).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).trim()
                            console.log(values)
                            axios({
                                method: 'post',
                                url: `${DOMAIN}/product/edit`,
                                data: values
                            }).then((data) => {
                                alert("Update Product Information Successfully!!!");
                                handleClose1();
                                getAllProduct();
                            }).catch((err) => {
                                console.log("err", err)
                            })
                        }}
                        enableReinitialize={true}
                        validationSchema={schema2}
                        initialValues={{
                            maSP: infoProduct.maSP,
                            tenSP: infoProduct.tenSP,
                            maTL: infoProduct.maTL,
                            hinhAnh: infoProduct.hinhAnh,
                            hinhAnh2: infoProduct.hinhAnh2,
                            hinhAnh3: infoProduct.hinhAnh3,
                            maNV: "",

                            SLSizeS: infoProduct.SLSizeS || 0,
                            SLSizeM: infoProduct.SLSizeM || 0,
                            SLSizeL: infoProduct.SLSizeL || 0,
                            SLSizeXL: infoProduct.SLSizeXL || 0,
                            SLSizeXXL: infoProduct.SLSizeXXL || 0,

                            giaSizeS: infoProduct.giaSizeS || 0,
                            giaSizeM: infoProduct.giaSizeM || 0,
                            giaSizeL: infoProduct.giaSizeL || 0,
                            giaSizeXL: infoProduct.giaSizeXL || 0,
                            giaSizeXXL: infoProduct.giaSizeXXL || 0,

                            ngayCapNhat: infoProduct.ngayCapNhat,
                            trangThai: infoProduct.trangThai,
                            moTa: infoProduct.moTa,
                        }}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            resetForm,
                            values,
                            touched,
                            isValid,
                            errors,
                        }) => (
                            <Form onSubmit={handleSubmit} style={{ color: "black", fontSize: "18px" }}>
                                <Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="tenSP"
                                                onChange={handleChange}
                                                value={values.tenSP}
                                                isValid={touched.tenSP && !errors.tenSP}
                                                isInvalid={!!errors.tenSP}
                                            />
                                            <Form.Control.Feedback type="invalid" tooltip>
                                                {errors.tenSP}
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Label>Type</Form.Label>
                                            <Form.Select onChange={handleChange} name="maTL" defaultValue={values.maTL}>
                                                {cate.map((item, index) => {
                                                    return (<option name="maTL" key={item.maTL} value={item.maTL}>{item.tenTL}</option>)
                                                })}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>Image 1</Form.Label>
                                            <Form.Control type='file' name="hinhAnh"
                                                onChange={e => {
                                                    imageUpload(e, 1)
                                                    handleChange(e)
                                                }}
                                                isValid={touched.hinhAnh && !errors.hinhAnh}
                                                isInvalid={!!errors.hinhAnh}
                                            />
                                            <Form.Control.Feedback type="invalid" tooltip>
                                                {errors.hinhAnh}
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Label>Image 2</Form.Label>
                                            <Form.Control type='file' name="hinhAnh2"
                                                onChange={e => {
                                                    imageUpload(e, 2)
                                                    handleChange(e)
                                                }}
                                                isValid={touched.hinhAnh2 && !errors.hinhAnh2}
                                                isInvalid={!!errors.hinhAnh2}
                                            />
                                            <Form.Control.Feedback type="invalid" tooltip>
                                                {errors.hinhAnh2}
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Label>Image 3</Form.Label>
                                            <Form.Control type='file' name="hinhAnh3"
                                                onChange={e => {
                                                    imageUpload(e, 3)
                                                    handleChange(e)
                                                }}
                                                isValid={touched.hinhAnh3 && !errors.hinhAnh3}
                                                isInvalid={!!errors.hinhAnh3}
                                            />
                                            <Form.Control.Feedback type="invalid" tooltip>
                                                {errors.hinhAnh3}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                    <Row style={{ paddingTop: "20px" }}>
                                        <Col>
                                            <Form.Label>Describe</Form.Label>
                                            <Form.Control name="moTa" defaultValue={values.moTa} onChange={handleChange} as="textarea" aria-label="With textarea"
                                                isValid={touched.moTa && !errors.moTa}
                                                isInvalid={!!errors.moTa}
                                            />
                                            <Form.Control.Feedback type="invalid" tooltip>
                                                {errors.moTa}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                </Row>

                                <Tabs
                                    defaultActiveKey="sizeS"
                                    id="uncontrolled-tab-example"
                                    className="mb-3"
                                >
                                    <Tab eventKey="sizeS" title="Size S">
                                        <Row style={{ paddingTop: "10px" }}>
                                            <Form.Label>Size S</Form.Label>
                                        </Row>
                                        <Row style={{ color: "red" }}>
                                            <Col>
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="giaSizeS"
                                                    defaultValue={values.giaSizeS}
                                                    onChange={handleChange}
                                                    min="0"
                                                    placeholder='Price Size S'
                                                    isValid={touched.giaSizeS && !errors.giaSizeS}
                                                    isInvalid={!!errors.giaSizeS}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.giaSizeS}
                                                </Form.Control.Feedback>
                                            </Col>
                                            <Col>
                                                <Form.Label>Amount</Form.Label>
                                                <Form.Control name="SLSizeS" onChange={handleChange} defaultValue={values.SLSizeS} type="number" placeholder="Amount Size S"
                                                    isValid={touched.SLSizeS && !errors.SLSizeS}
                                                    isInvalid={!!errors.SLSizeS}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.SLSizeS}
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Row>
                                    </Tab>
                                    <Tab eventKey="sizeM" title="Size M">
                                        <Row style={{ paddingTop: "10px" }}>
                                            <Form.Label>Size M</Form.Label>
                                        </Row>
                                        <Row style={{ color: "red" }}>
                                            <Col>
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="number"
                                                    name="giaSizeM"
                                                    defaultValue={values.giaSizeM}
                                                    onChange={handleChange}
                                                    min="0"
                                                    placeholder='Price Size M'
                                                    isValid={touched.giaSizeM && !errors.giaSizeM}
                                                    isInvalid={!!errors.giaSizeM}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.giaSizeM}
                                                </Form.Control.Feedback>
                                            </Col>
                                            <Col>
                                                <Form.Label>Amount</Form.Label>
                                                <Form.Control required name="SLSizeM" onChange={handleChange} defaultValue={values.SLSizeM} type="number" placeholder="Amount Size M"
                                                    isValid={touched.SLSizeM && !errors.SLSizeM}
                                                    isInvalid={!!errors.SLSizeM}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.SLSizeM}
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Row>
                                    </Tab>
                                    <Tab eventKey="sizeL" title="Size L">
                                        <Row style={{ paddingTop: "10px" }}>
                                            <Form.Label>Size L</Form.Label>
                                        </Row>
                                        <Row style={{ color: "red" }}>
                                            <Col>
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="number"
                                                    name="giaSizeL"
                                                    defaultValue={values.giaSizeL}
                                                    onChange={handleChange}
                                                    min="0"
                                                    placeholder='Price Size L'
                                                    isValid={touched.giaSizeL && !errors.giaSizeL}
                                                    isInvalid={!!errors.giaSizeL}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.giaSizeL}
                                                </Form.Control.Feedback>
                                            </Col>
                                            <Col>
                                                <Form.Label>Amount</Form.Label>
                                                <Form.Control required name="SLSizeL" onChange={handleChange} defaultValue={values.SLSizeL} type="number" placeholder="Amount Size L"
                                                    isValid={touched.SLSizeL && !errors.SLSizeL}
                                                    isInvalid={!!errors.SLSizeL}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.SLSizeL}
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Row>
                                    </Tab>

                                    <Tab eventKey="sizeXL" title="Size XL">
                                        <Row style={{ paddingTop: "10px" }}>
                                            <Form.Label>Size XL</Form.Label>
                                        </Row>
                                        <Row style={{ color: "red" }}>
                                            <Col>
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="number"
                                                    name="giaSizeXL"
                                                    defaultValue={values.giaSizeXL}
                                                    onChange={handleChange}
                                                    min="0"
                                                    placeholder='Price Size XL'
                                                    isValid={touched.giaSizeXL && !errors.giaSizeXL}
                                                    isInvalid={!!errors.giaSizeXL}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.giaSizeXL}
                                                </Form.Control.Feedback>
                                            </Col>
                                            <Col>
                                                <Form.Label>Amount</Form.Label>
                                                <Form.Control required name="SLSizeXL" onChange={handleChange} defaultValue={values.SLSizeXL} type="number" placeholder="Amount Size XL"
                                                    isValid={touched.SLSizeXL && !errors.SLSizeXL}
                                                    isInvalid={!!errors.SLSizeXL}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.SLSizeXL}
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Row>
                                    </Tab>

                                    <Tab eventKey="sizeXXL" title="Size XXL">
                                        <Row style={{ paddingTop: "10px" }}>
                                            <Form.Label>Size XXL</Form.Label>
                                        </Row>
                                        <Row style={{ color: "red" }}>
                                            <Col>
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="number"
                                                    name="giaSizeXXL"
                                                    defaultValue={values.giaSizeXXL}
                                                    onChange={handleChange}
                                                    min="0"
                                                    placeholder='Price Size XXL'
                                                    isValid={touched.giaSizeXXL && !errors.giaSizeXXL}
                                                    isInvalid={!!errors.giaSizeXXL}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.giaSizeXXL}
                                                </Form.Control.Feedback>
                                            </Col>
                                            <Col>
                                                <Form.Label>Amount</Form.Label>
                                                <Form.Control required name="SLSizeXXL" onChange={handleChange} defaultValue={values.SLSizeXXL} type="number" placeholder="Amount Size XXL"
                                                    isValid={touched.SLSizeXXL && !errors.SLSizeXXL}
                                                    isInvalid={!!errors.SLSizeXXL}
                                                />
                                                <Form.Control.Feedback type="invalid" tooltip>
                                                    {errors.SLSizeXXL}
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Row>
                                    </Tab>
                                </Tabs>
                                <Form.Label style={{ marginTop: "25px", color: "red" }}>Last Edited : {values.ngayCapNhat.substring(0, 10).substring(0, 10)}</Form.Label>
                                <Form.Label style={{ marginTop: "25px", color: "red", display: "flex" }}>
                                    <img src={img1 || values.hinhAnh} alt="Old Img" style={{ height: "20%", width: "20%", paddingRight: "15px" }}></img>
                                    <img src={img2 || values.hinhAnh2} alt="Old Img" style={{ height: "20%", width: "20%", paddingRight: "15px" }}></img>
                                    <img src={img3 || values.hinhAnh3} alt="Old Img" style={{ height: "20%", width: "20%", paddingRight: "15px" }}></img>
                                </Form.Label>
                                {values.trangThai === 0 ? (<Button type="button" variant='success' onClick={() => activateProduct(`${values.maSP}`)} style={{ marginTop: "15px" }} >Resell</Button>) : (<></>)}
                                <Button type="submit" variant='success' style={{ marginTop: "15px", float: "right" }} >Edit Product</Button>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body >
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose1}>Cancel</Button>
                </Modal.Footer>
            </Modal >
        </>
    )
}
