require('@babel/polyfill')

import React, { useState } from 'react'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import NavDropdown from "react-bootstrap/es/NavDropdown";
import Spinner from 'react-bootstrap/Spinner';

/**
 * The menubar that is displayed at the top of every page.
 * @param userId The User ID of the currently logged in user (if there is one).
 * @param loggedIn Whether or not there is a currently logged in user.
 * @param changePage The function to call to change the current page.
 */
export default function Menubar({ userId, loggedIn, changePage }) {
    const [searchText, setSearchText] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);

    async function search(event) {
        try {
            event.preventDefault();

            // show search spinner
            setSearchLoading(true);

            let searchRes = await fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'All',
                    searchText: searchText
                })
            });
            searchRes = await searchRes.json();

            // stop showing search spinner
            setSearchLoading(false);

            if (searchRes.status !== 'OK') throw new Error('Search failed.');

            changePage('searchResultsPage', { content: searchRes.content });
        } catch (err) {
            console.error(err);
        }
    }

    function handleSearchChange(event) {
        let searchText = event.target.value;
        setSearchText(searchText);
    }

    // rendering logic
    return (
        <Navbar bg="light" expand="lg">
            <Nav.Link onClick={()=>{changePage('homepage')}}>
                <i className="fas fa-info fa-2x"/>
                <i className="fab fa-cuttlefish fa-2x"/>
                <i className="fab fa-cuttlefish fa-2x"/>
                <i className="fab fa-cuttlefish fa-2x"/>
            </Nav.Link>
            <Nav className='mr-3'>
                <Nav.Link onClick={() => {changePage('refresh')}}>
                    <i className="fas fa-redo fa-2x"/>
                </Nav.Link>
            </Nav>
            <Nav>
                <Form inline>
                    <InputGroup>
                        <Form.Control type="text" placeholder="Search..." onChange={handleSearchChange} required/>
                        <InputGroup.Append>
                            {
                                searchLoading ?
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
                                    <Button type='submit' onClick={search}>
                                        <i className="fas fa-search"/>
                                    </Button>
                            }
                        </InputGroup.Append>
                    </InputGroup>
                </Form>
            </Nav>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end' style={{ textAlign: 'right' }}>
                <Nav>
                    {
                        <Nav.Link onClick={() => {changePage('createCategoryPage', {
                            userId: userId,
                            location: 'Home'
                        })}}>
                            <i className="fas fa-vial fa-2x"></i>
                        </Nav.Link>
                    }
                    {
                        loggedIn ?
                            <Nav.Link onClick={() => {changePage('newContent', { type: 'Series' })}}>
                                <i className="fas fa-plus-circle fa-2x"/>
                            </Nav.Link>
                                :
                            <></>
                    }
                    <NavDropdown title={<i className="fas fa-user-circle fa-2x"/>} alignRight>
                        {
                            loggedIn &&
                            <NavDropdown.Item href='/logout'>Logout</NavDropdown.Item>
                        }
                        {
                            loggedIn &&
                            <NavDropdown.Item onClick={() => {changePage('changePassword')}}>
                                Change Password
                            </NavDropdown.Item>
                        }
                        {
                            !loggedIn &&
                            <NavDropdown.Item onClick={() => {changePage('login')}}>
                                Login
                            </NavDropdown.Item>
                        }
                        {
                            !loggedIn &&
                            <NavDropdown.Item onClick={() => {changePage('create')}}>
                                Create Account
                            </NavDropdown.Item>
                        }
                    </NavDropdown>
                    {
                        loggedIn ?
                            <Nav.Link onClick={()=>{changePage('userInfo', { loggedIn: true })}}>
                                <i className="fas fa-cog fa-2x"/>
                            </Nav.Link>
                                :
                            <></>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}