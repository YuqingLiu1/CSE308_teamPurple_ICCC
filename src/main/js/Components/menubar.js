import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

class Menubar extends Component {
    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Nav.Link href="">
                    <i className="fas fa-info fa-2x" />
                    <i className="fab fa-cuttlefish fa-2x" />
                    <i className="fab fa-cuttlefish fa-2x" />
                    <i className="fab fa-cuttlefish fa-2x" />
                </Nav.Link>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto" />
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Search..."
                            required
                        />
                        <InputGroup.Append>
                            <Button><i className="fas fa-search" /></Button>
                        </InputGroup.Append>
                    </InputGroup>
                    {this.props.loggedIn ? <Nav.Link href=""><i className="fas fa-plus-circle fa-2x" /></Nav.Link> : <></>}
                    <Nav.Link href=""><i className="fas fa-user-circle fa-2x" /></Nav.Link>
                    <Nav.Link href=""><i className="fas fa-cog fa-2x" /></Nav.Link>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Menubar;