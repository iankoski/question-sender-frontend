import React from 'react';
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import Logo from '../../../assets/logo.png';
import { BoxContent, BoxForm } from '../../../shared/styles';
import { Link, withRouter } from 'react-router-dom';
import CompaniesService from '../../../services/companies';
import { login } from '../../../services/auth';
import Footer from '../../../shared/footer';
import { PageContent } from '../../../shared/styles';


class SignIn extends React.Component {
    state = {
        userName: '',
        password: '',
        error: ''
    };
    handleSignIn = async (event) => {
        /*Chamada feita para evitar que o navegador faça um POST*/
        event.preventDefault();
        const { userName, password } = this.state;
        if (!userName || !password) {
            this.setState({ error: "Informe todos os campos para acessar" });
        } else {
            try {
                /* Faz o post para o backend logar */
                const service = new CompaniesService();
                const response = await service.login(userName, password);
                /* Faz o login passando o token que veio da requisição */
                login(response.data.token);
                this.props.history.push("/questions");
            } catch (error) {
                console.log(`Erro handleSignIn ${error}`);
                this.setState({ error: 'Ocorreu um erro durante o login' });
            }
        }
    }
    renderError = () => {
        const { error } = this.state;

        return (
            <Alert variant="danger">
                {error}
            </Alert>
        )
    }
    async componentDidMount() {
        const { params: { errorAuth } } = this.props.match;
        console.log('errorAuth '+errorAuth);
        if (errorAuth){
            this.setState({ error: errorAuth });
        }
    }    

    render() {
        return (
            <>
                <PageContent>

                    <Container >
                        <Row className="justify-content-md-center" >
                            <Col xs={12} md={6}>
                                <BoxContent>
                                    <img src={Logo} alt='QuestionSender'/>
                                </BoxContent>
                                <BoxForm>
                                    <h2>Login</h2>
                                    <p>Informe seus dados para autenticar: </p>
                                    {this.state.error && this.renderError()}
                                    <Form onSubmit={this.handleSignIn} >
                                        <Form.Group controlId="userNameGroup">
                                            <Form.Label>Usuário:</Form.Label>
                                            <Form.Control type="userName"
                                                placeholder="Digite seu nome de usuário"
                                                onChange={e => this.setState({ userName: e.target.value })} />
                                        </Form.Group>
                                        <Form.Group controlId="passwordGroup">
                                            <Form.Label>Senha:</Form.Label>
                                            <Form.Control type="password"
                                                placeholder="Digite sua senha"
                                                onChange={e => this.setState({ password: e.target.value })} />
                                        </Form.Group>

                                        <div className="d-grid gap-2">
                                            <br />
                                            <style type="text/css">
                                                {`
                                        .btn-login {
                                        background-color: SteelBlue;
                                        color: white;
                                        }
                                        `}
                                            </style>

                                            <Button variant="login" type="submit">
                                                Fazer Login
                                            </Button>
                                        </div>

                                    </Form>
                                </BoxForm>

                                <BoxContent>
                                    <p>Novo na plataforma?</p>
                                    <Link className="button" to="/signup">Crie sua conta</Link>
                                </BoxContent>
                            </Col>

                        </Row>


                    </Container>
                    <Footer text="O Perguntador é uma plataforma para coleta de opinião de público através de perguntas com múltiplas escolhas. Experimente!" />
                </PageContent>
            </>
        )
    }
}

export default withRouter(SignIn);