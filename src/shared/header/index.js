import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { Header, Logo } from './styles';
import { logout } from '../../services/auth';
import Icone from '../../assets/icone.png';
/* Cabeçalho da página, com os menus */
function MainMenu({ history }) {
    async function handleLogout() {
        await logout();
        history.push('/');
    }

    return (
        <Header>
            <Navbar>
                <Container>
                    <Navbar.Brand href="/" >
                        <Logo src={Icone} alt='Question-Sender' />
                    </Navbar.Brand>
                    <Nav>
                        <Nav.Link href="/questions">Perguntas</Nav.Link>                  
                        <Nav.Link href="/company">Minha Conta</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={handleLogout}>Sair</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </Header>
    )
}

export default withRouter(MainMenu);