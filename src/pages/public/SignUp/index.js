import React from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import {Link, withRouter} from 'react-router-dom';
import Logo from '../../../assets/logo.png';
import { BoxContent, BoxForm } from '../../../shared/styles';
//import AccountService from '../../../services/accounts';

class SignUp extends React.Component {
    /*O state armazena os dados do <Form> em variáveis*/ 
    state = {
        name: '',
        email: '',
        password: '',
        domain: '',
        error: '',
        isLoading: false,
    };

    handleSignUp = async(event)=>{
        event.preventDefault();
        const {name, email, password, domain, isLoading} = this.state;
        /* Valida se todos os campos foram informados */
        if (!name || !email || !domain || !password){
            this.setState({error: "Informe todos os campos para se cadastrar"})
        } else {
            try{
                //const service = new AccountService();
                /* Faz o post para o backend logar */
                //await service.signup({name, email, password, domain});
                this.props.history.push("/signin");
            }catch(error){
                console.log(error);
                this.setState({error: 'Ocorreu um erro durante a criação da conta'});
            }
        }
    }

    renderError = () =>{
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

                                <Form.Group controlId="emailGroup">
                                    <Form.Label>E-mail:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite seu e-mail"
                                        onChange={e => this.setState({email: e.target.value})}
                                    />
                                </Form.Group>

                                <Form.Group controlId="dominioGroup">
                                    <Form.Label>Domínio:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite seu domínio"
                                        onChange={e => this.setState({domain: e.target.value})}
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