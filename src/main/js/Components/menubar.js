import React, {Component} from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import NavDropdown from "react-bootstrap/es/NavDropdown";

class Menubar extends Component
{
    render()
    {
        return (
            <Navbar bg="light" expand="lg">
                <Nav.Link onClick={()=>{this.props.changePage('homepage')}}>
                    <i className="fas fa-info fa-2x"/>
                    <i className="fab fa-cuttlefish fa-2x"/>
                    <i className="fab fa-cuttlefish fa-2x"/>
                    <i className="fab fa-cuttlefish fa-2x"/>
                </Nav.Link>
                <Nav>
                    <Form inline>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Search..."
                                required
                            />
                            <InputGroup.Append>
                                <Button><i className="fas fa-search"/></Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                </Nav>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end' style={{textAlign: 'right'}}>
                    <Nav>
                        {
                            this.props.loggedIn ?
                                <Nav.Link onClick={() => {this.props.changePage('newContent')}}>
                                    <i className="fas fa-plus-circle fa-2x"/>
                                </Nav.Link>
                                    :
                                <></>
                        }
                        <NavDropdown title={<i className="fas fa-user-circle fa-2x"/>} alignRight>
                            {
                                this.props.loggedIn &&
                                    <NavDropdown.Item href='/logout'>Logout</NavDropdown.Item>
                            }
                            {
                                !this.props.loggedIn &&
                                    <NavDropdown.Item onClick={() => {this.props.changePage('login')}}>
                                        Login
                                    </NavDropdown.Item>
                            }
                            {
                                !this.props.loggedIn &&
                                    <NavDropdown.Item onClick={() => {this.props.changePage('create')}}>
                                        Create Account
                                    </NavDropdown.Item>
                            }
                        </NavDropdown>
                        {
                            this.props.loggedIn ?
                                <Nav.Link onClick={()=>{this.props.changePage('userInfo')}}>
                                    <i className="fas fa-cog fa-2x"/>
                                </Nav.Link>
                                    :
                                <></>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default Menubar