import React from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import {Link, withRouter} from 'react-router-dom';
import Logo from '../../../assets/logo.png';
import { BoxContent, BoxForm } from '../../../shared/styles';
import CompaniesService from '../../../services/companies';

class SignUp extends React.Component {
    /*O state armazena os dados do <Form> em variáveis*/ 
    state = {
        name: '',
        userName: '',
        password: '',
        urlQrCode: '',
        error: '',
        isLoading: false,
    };

    handleSignUp = async(event)=>{
        event.preventDefault();
        const {name, userName, password, urlQrCode, isLoading} = this.state;
        /* Valida se todos os campos foram informados */
        if (!name || !userName || !password){
            this.setState({error: "Informe todos os campos para se cadastrar"})
        } else {
            try{
                const service = new CompaniesService();
                /* Faz o post para o backend logar */
                await service.signup({name, userName, password});
                this.props.history.push("/signin");
            }catch(error){
                console.log(error);
                this.setState({error: 'Ocorreu um erro durante a criação da conta'});
            }
        }
    }

    renderError = () =>{
        const {error} = this.state;
        return (
            <Alert variant="danger">
                {this.state.error}
            </Alert>
        )
    }

    render() {
        return (
            <Container>
                <Row className="justify-content-md-center" >
                    <Col xs={12} md={6}>
                        <BoxContent>
                            <img src={Logo} alt='Question Sender' />                            
                        </BoxContent>

                        <BoxForm>
                            <h2>Cadastro</h2>
                            <p>Informe todos os campos para realizar o cadastro.</p>
                            <Form onSubmit={this.handleSignUp}>
                                {this.state.error && this.renderError()}
                                <Form.Group controlId="nomeGroup">
                                    <Form.Label>Nome:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite seu nome"
                                        onChange={e => this.setState({name: e.target.value})}
                                    />
                                </Form.Group>

                                <Form.Group controlId="usuarioGroup">
                                    <Form.Label>Usuário:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite seu usuário"
                                        onChange={e => this.setState({userName: e.target.value})}
                                    />
                                </Form.Group>

                                <Form.Group controlId="senhaGroup">
                                    <Form.Label>Senha:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Digite uma senha"
                                        onChange={e => this.setState({password: e.target.value})}
                                    />
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

                                    <Button block="true" variant="login" type="submit">
                                        Realizar Cadastro
                                    </Button>
                                </div>
                            </Form>
                        </BoxForm>
                        <BoxContent>
                            <Link className="button" to="/signin">Voltar para login</Link>
                        </BoxContent>
                    </Col>
                </Row>
            </Container>
        )
    };
}

export default withRouter(SignUp);