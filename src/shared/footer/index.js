import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { FooterStyle } from './styles';

function Footer({ text }) {

    return (
        <FooterStyle >
            <footer className="footer justify-content-center">              
                <Nav.Item>
                    <p>{text}</p>
                </Nav.Item>         
            </footer>
        </FooterStyle>
    )  
}  
 
export default withRouter(Footer);