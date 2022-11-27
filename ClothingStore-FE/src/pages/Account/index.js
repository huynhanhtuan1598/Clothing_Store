import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import axios from 'axios'
import { DOMAIN } from '~/util/setting/config';
import { Formik } from 'formik';
import Container from 'react-bootstrap/Container';
import * as yup from 'yup'

export default function Index() {
    const infoUser = JSON.parse(localStorage.getItem("infoUser"));
    const [checkPhone, setCheckPhone] = useState(false);
    const [checkEmail, setCheckEmail] = useState(false);
    const [checkId, setCheckId] = useState(false);

    const schema = yup.object().shape({
        hoTen: yup.string().required("Please Enter Username"),
        sdt: yup.string().required("Please Enter Phone Number")
            .matches(/^[0-9]+$/, "Contains Only Numbers")
            .test('len', 'Phone Number Only 10 Numbers', val => val?.length === 10),
        email: yup.string().email().required("Check your email again"),
        diaChi: yup.string().required("Please Enter Address"),
        cmnd: yup.string().required("Please fill in your ID card")
            .matches(/^[0-9]+$/, "Contains Only Numbers")
            .test('len', 'Only Get 9 Or 12 Numbers', val => val?.length === 9 || val?.length === 12),
    });

    const fcCheckPhone = async (sdt) => {
        setCheckPhone(false);
        await axios({
            method: 'post',
            url: `${DOMAIN}/user/checkPhone`,
            data: {
                maNguoiDung: infoUser.maNguoiDung,
                sdt: sdt
            }
        }).then((data) => {
            if (data.data === 0) {
                alert("Phone Number Exists !!!")
                setCheckPhone(false);
            } else {
                setCheckPhone(true);
            }
        }).catch((err) => {
            console.log("err")
        })
    }

    const fcCheckEmail = async (email) => {
        setCheckEmail(false);
        await axios({
            method: 'post',
            url: `${DOMAIN}/user/checkEmail`,
            data: {
                maNguoiDung: infoUser.maNguoiDung,
                email: email
            }
        }).then((data) => {
            if (data.data === 0) {
                alert("Email already exists !!!")
                setCheckEmail(false);
            } else {
                setCheckEmail(true);
            }
        }).catch((err) => {
            console.log("err")
        })
    }

    const fcCheckId = async (cmnd) => {
        setCheckId(false);
        await axios({
            method: 'post',
            url: `${DOMAIN}/user/checkId`,
            data: {
                maNguoiDung: infoUser.maNguoiDung,
                cmnd: cmnd
            }
        }).then((data) => {
            if (data.data === 0) {
                alert("ID card already exists !!!")
                setCheckId(false);
            } else {
                setCheckId(true);
            }
        }).catch((err) => {
            console.log("err")
        })
    }

    return (
        <Container>
            <Formik
                onSubmit={values => {
                    fcCheckPhone(values.sdt)
                    fcCheckEmail(values.email)
                    fcCheckId(values.cmnd)
                    if (window.confirm("Do You Want To Update Information ?") === true) {
                        if (checkPhone === true && checkEmail === true && checkId === true) {
                            axios({
                                method: 'post',
                                url: `${DOMAIN}/user/updateinfo`,
                                data: values
                            }).then((data) => {
                                alert("User Information Update Successfully")
                                localStorage.setItem("infoUser", JSON.stringify(values));
                                window.location.href = '/account'
                            }).catch((err) => {
                                console.log("err", err)
                            })
                        }
                    }
                }}
                enableReinitialize={true}
                validationSchema={schema}
                initialValues={{
                    maNguoiDung: infoUser?.maNguoiDung,
                    hoTen: infoUser?.hoTen,
                    sdt: infoUser?.sdt,
                    email: infoUser?.email,
                    diaChi: infoUser?.diaChi,
                    cmnd: infoUser?.cmnd,
                    role: infoUser?.role,
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
                    <Form onSubmit={handleSubmit} style={{ color: "black", fontSize: "18px", paddingBottom: "50px" }}>
                        <Row>
                            < Col >
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="hoTen"
                                    value={values?.hoTen}
                                    onChange={handleChange}
                                    isValid={touched.hoTen && !errors.hoTen}
                                    isInvalid={!!errors.hoTen}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.hoTen}
                                </Form.Control.Feedback>
                            </Col>
                            <Col>
                                <Form.Label>Phone number</Form.Label>
                                <Form.Control required name="sdt"
                                    onChange={handleChange}
                                    value={values?.sdt}
                                    isValid={touched.sdt && !errors.sdt}
                                    isInvalid={!!errors.sdt}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.sdt}
                                </Form.Control.Feedback>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "40px" }}>
                            <Col>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={values?.email}
                                    onChange={handleChange}
                                    isValid={touched.email && !errors.email}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Col>

                            <Col>
                                <Form.Label>Address</Form.Label>
                                <Form.Control required name="diaChi" onChange={handleChange} value={values?.diaChi}
                                    isValid={touched.diaChi && !errors.diaChi}
                                    isInvalid={!!errors.diaChi}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.diaChi}
                                </Form.Control.Feedback>
                            </Col>

                            <Col>
                                <Form.Label>ID</Form.Label>
                                <Form.Control required name="cmnd"
                                    onChange={handleChange}
                                    value={values?.cmnd}
                                    isValid={touched.cmnd && !errors.cmnd}
                                    isInvalid={!!errors.cmnd}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {errors.cmnd}
                                </Form.Control.Feedback>
                            </Col>
                        </Row>
                        <Button type="submit" variant='success' style={{ marginTop: "15px", float: "right" }} >Edit</Button>
                    </Form>
                )}
            </Formik>
        </Container>

    )
}
