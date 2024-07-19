import React, { useState, useEffect, Fragment } from "react"
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/ReactToastify.css'



const CRUD = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const empdata = [
        {
            id: 1,
            name: "Nguyen Van A",
            age: 21,
            isActive: 1
        },
        {
            id: 2,
            name: "Nguyen Van B",
            age: 25,
            isActive: 1
        },
        {
            id: 3,
            name: "Nguyen Van C",
            age: 33,
            isActive: 0
        },
    ]

    const getData = () => {
        axios.get('https://localhost:7229/api/Employee')
            .then((result) => {
                setData(result.data)
                console.log(result.data);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleShowtoPageEdit = (id) => {
        handleShow();
        axios.get(`https://localhost:7229/api/Employee/${id}`)
            .then((result) => {
                setEditName(result.data.name)
                setEditAge(result.data.age)
                setEditIsActive(result.data.isActive)
                setEditId(id)

            }).catch((error) => {
                toast.error(error);
            })

    }
    const handleUpdate = () => {
        const url = `https://localhost:7229/api/Employee/${editID}`
        const data = {
            "id" : editID,
            "name": editName,
            "age": editAge,
            "isActive": editIsActive
        }

        if (checkEditNull()) {
            axios.put(url, data)
                .then((result) => {
                    handleClose();
                    getData();
                    clear();
                    toast.success('Sửa thành công');
                }).catch((error) => {
                    toast.error(error);
                })
        }
    }

    const handleDelete = (id, name) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa không!") == true) {
            axios.delete(`https://localhost:7229/api/Employee/${id}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success(`Xóa thành công ${name}`);
                        getData();
                    }
                }).catch((error) => {
                    toast.error(error);
                })
        }
    }

    const handleSave = () => {
        const url = 'https://localhost:7229/api/Employee';
        const data = {
            "name": name,
            "age": age,
            "isActive": isActive
        }

        if (checkAddNull()) {
            console.log("đã vào");
            axios.post(url, data)
                .then((result) => {
                    getData();
                    clear();
                    toast.success('Thêm thành công');
                }).catch((error) => {
                    toast.error(error);
                })
        }

    }

    const handleActiveChange = (e) => {
        if (e.target.checked) {
            setIsActive(1);
        } else {
            setIsActive(0);
        }
    }

    const handleEditActiveChange = (e) => {
        if (e.target.checked) {
            setEditIsActive(1);
        } else {
            setEditIsActive(0);
        }
    }

    const clear = () => {
        setName('');
        setAge('');
        setIsActive(0);
        setEditName('');
        setEditAge('');
        setEditIsActive(0);
        setEditId('');
    }

    const checkAddNull = () => {
        if (name == '') {
            toast.error('Vui lòng nhập họ và tên!');
            return false;
        }
        if (age == '') {
            toast.error('Vui lòng nhập tuổi!');
            return false;
        }
        console.log("bằng true??");
        return true
    }

    const checkEditNull = () => {
        if (editName == '') {
            toast.error('Vui lòng nhập họ và tên!');
            return false;
        }
        if (editAge == '') {
            toast.error('Vui lòng nhập tuổi!');
            return false;
        }
        console.log("bằng true??");
        return true
    }

    const [data, setData] = useState([])
    useEffect(() => {
        getData()
    }, [])

    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [isActive, setIsActive] = useState(0)


    const [editID, setEditId] = useState('')
    const [editName, setEditName] = useState('')
    const [editAge, setEditAge] = useState('')
    const [editIsActive, setEditIsActive] = useState(0)


    return (
        <Fragment>
            <ToastContainer />
            <Container style={{ padding: 20 }}>
                <Row>
                    <Col>
                        <input type="text" id="addName" className="form-control" placeholder="Mời nhập tên...."
                            value={name} onChange={(e) => setName(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <input type="number" id="addAge" className="form-control" placeholder="Mời nhập tuổi...." min={0} required
                            value={age} onChange={(e) => setAge(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <input type="checkbox"
                            checked={isActive === 1 ? true : false}
                            onChange={(e) => handleActiveChange(e)} value={isActive}
                        />
                        <label>Trạng thái</label>
                    </Col>
                    <Col>
                        <button className="btn btn-primary" onClick={() => handleSave()}>Thêm mới</button>
                    </Col>
                </Row>
            </Container>
            <br></br>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Họ và tên</th>
                        <th>Tuổi</th>
                        <th>Trạng thái</th>
                        <th>Chức năng</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        data && data.length > 0 ?
                            data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.age}</td>
                                        <td>{item.isActive === 0 ? 'Không hoạt động' : 'Hoạt động'}</td>
                                        <td colSpan={2}>
                                            <button className="btn btn-primary" onClick={() => handleShowtoPageEdit(item.id)}>Sửa</button> |
                                            <button className="btn btn-danger" onClick={() => handleDelete(item.id, item.name)}> Xóa</button>
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            ".........."
                    }

                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa nhân viên</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <input type="text" className="form-control" placeholder="Mời nhập tên...."
                                value={editName} onChange={(e) => setEditName(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <input type="text" className="form-control" placeholder="Mời nhập tuổi...."
                                value={editAge} onChange={(e) => setEditAge(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <input type="checkbox"
                                checked={editIsActive === 1 ? true : false}
                                onChange={(e) => handleEditActiveChange(e)} value={editIsActive}
                            />
                            <label>Trạng thái</label>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Thoát
                    </Button>
                    <Button variant="primary" onClick={() => handleUpdate()}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}



export default CRUD;