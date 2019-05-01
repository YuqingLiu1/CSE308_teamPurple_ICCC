import React, {Component} from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import NavDropdown from "react-bootstrap/es/NavDropdown";
import Spinner from 'react-bootstrap/Spinner';

class Menubar extends Component
{
    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            searchLoading: false
        };
    }

    search = async (e) => {
        e.preventDefault();

        // show search spinner
        this.setState({
            searchLoading: true
        });

        let searchText = this.state.searchText;

        let searchRes = await fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                searchText: searchText
            })
        });
        searchRes = await searchRes.json();

        // stop showing search spinner
        this.setState({
            searchLoading: false
        });

        if (searchRes.status !== 'OK') {
            console.error('Search failed');
        } else {
            this.props.changePage('searchResultsPage', {
                content: searchRes.content
            });
        }
    }

    handleSearchChange = (e) => {
        this.setState({
            searchText: e.target.value
        });
    }

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
                            <Form.Control type="text" placeholder="Search..." onChange={this.handleSearchChange} required />
                            <InputGroup.Append>
                                {
                                    this.state.searchLoading ?
                                        <Button variant="primary" disabled>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                            <span className="sr-only">Loading...</span>
                                        </Button>
                                            :
                                        <Button type='submit' onClick={this.search}>
                                            <i className="fas fa-search"/>
                                        </Button>
                                }
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                </Nav>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end' style={{textAlign: 'right'}}>
                    <Nav>
                        {
                            <Nav.Link onClick={() => {this.props.changePage('test')}}>
                                <i className="fas fa-vial fa-2x"></i>
                            </Nav.Link>
                        }
                        {
                            this.props.loggedIn ?
                                <Nav.Link onClick={() => {this.props.changePage('newContent', { type: 'Series' })}}>
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
                                this.props.loggedIn &&
                                    <NavDropdown.Item onClick={() => {this.props.changePage('changePassword')}}>
                                        Change Password
                                    </NavDropdown.Item>
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