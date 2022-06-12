import React from 'react';
import Header from '../../../shared/header';
import Footer from '../../../shared/footer';
import { PageContent, BoxForm } from '../../../shared/styles';
import { Link, withRouter, useRouteMatch } from 'react-router-dom';
import CompaniesService from '../../../services/companies';
import { Container, Button, Form, Alert, Row, Col, Modal, Table } from 'react-bootstrap';
class CompanyDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            showSetCompanyModal: false,
            showAlteredCompanyModal: false,
            newPass: '',
            error: '',
            confirmNewPass: '',
            userName: '',
            urlQrCode: '',
            name: ''

        }
    }

    /*Ciclo de vida do React: essa função será executada sempre que o componente é montado*/
    async componentDidMount() {
        try {
            const companyService = new CompaniesService();
            const company = await companyService.getCompany();

            this.setState({
                userName: company.userName,
                urlQrCode: company.urlQrCode,
                name: company.name,
                isLoading: false
            })

        } catch (error) {
            if (error.response && error.response.status === 401) {
                let errorAuth = 'Sua sessão expirou, faça o login novamente';
                this.props.history.push(`/errorAuth/${errorAuth}`);
            }
        }
    }

    renderError = () => {
        return (
            <Alert variant="danger">{this.state.error}</Alert>
        )
    }

    handleRedirectModal = async (event) => {
        /* Redireciona para a página anterior */
        this.setState({
            showSetCompanyModal: false,
            showAlteredCompanyModal: false
        });
        this.props.history.push('/company');
    }

    async handleNewQRCode(){
        /* Gera um novo QRCode */
        const companyService = new CompaniesService();
        const newQRCode = await companyService.getQRCode();
        console.log('newQRCode '+newQRCode);
        this.setState({urlQrCode: newQRCode.uuid});
    }

    handleShowSetCompanyModal = () => {
        try {
            /* Se informou algum campo de senha, faz as validações necessárias */
            if (!this.state.name){
                throw "O nome de exibição deve ser informado";
            } 
            if (this.state.newPass || this.state.confirmNewPass) {
                if (!this.state.newPass || !this.state.confirmNewPass) {
                    throw "A nova senha deve ser informada";
                }
                if (this.state.newPass.trim().length < 6
                    || !this.state.newPass
                    || this.state.confirmNewPass.trim().length < 6
                    || !this.state.confirmNewPass) {
                    throw "A nova senha deve ter ao menos 6 caracteres";
                }
                if (this.state.newPass != this.state.confirmNewPass) {
                    throw "As senhas não correspondem";
                }
            }
            this.setState({ showSetCompanyModal: true });
        } catch (error) {
            this.setState({ error: error });
            console.log(`handleShowSetCompanyModal ${error}`);
        }
    }

    handleSave = async (event) => {
        try {
            const companiesservice = new CompaniesService();
            var company = {
                name: this.state.name,
                urlQrCode: '',
                password: ''
            }
            if (this.state.urlQrCode) {
                company.urlQrCode = this.state.urlQrCode;
            }
            if (this.state.newPass) {
                company.password = this.state.newPass;
            }
            await companiesservice.set(company);
            this.setState({
                showAlteredCompanyModal: true,
                showSetCompanyModal: false
            })

        } catch (error) {
            this.setState({ error: error });
            console.log(`handleSave ${error}`);
        }
    }

    render() {
        const { isLoading, question } = this.state;

        return (
            <>
                <Header />
                <PageContent>
                    <Container>
                        <Col lg={8} sm={12}>
                            <BoxForm>
                                {this.state.error && this.renderError()}
                                <Row><h3>Dados da conta</h3></Row>
                                <Row>
                                    <Col><p>Nome de usuário:</p></Col>
                                    <Col><p>{isLoading ? (null) : this.state.userName}</p></Col>
                                </Row>
                                <Row>
                                    <Form>
                                        <Form.Group as={Row} className="mb-3">
                                            <Row>
                                                <Form.Label column sm="3">Nome de exibição: </Form.Label>
                                                <Col>
                                                    <Form.Control
                                                        type="text"
                                                        defaultValue={isLoading ? (null) : this.state.name}
                                                        onChange={e => this.setState({ name: e.target.value })}>
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-2">
                                            <Row>
                                                <Col>
                                                    <Form.Label>Nova senha:</Form.Label>
                                                </Col>
                                                <Col>
                                                    <Form.Control type="password"
                                                        placeholder="Digite sua senha"
                                                        onChange={e => this.setState({ newPass: e.target.value })} />
                                                </Col>
                                            </Row>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-2">
                                            <Row>
                                                <Col><Form.Label>Confirme sua senha:</Form.Label></Col>
                                                <Col>
                                                    <Form.Control type="password"
                                                        placeholder="Confirme sua senha"
                                                        onChange={e => this.setState({ confirmNewPass: e.target.value })} />
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                        <Col><p>QR Code para responder as perguntas cadastradas</p></Col>
                                    </Form>

                                </Row>

                                <Row>
                                    <Col><p>{isLoading ? (null) : this.state.urlQrCode}</p></Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button variant="warning" type="button" onClick={() => { this.handleShowSetCompanyModal() }} >Salvar Alterações</Button>
                                    </Col>
                                    <Col>
                                        <Button variant="primary " type="button" onClick={() => { this.handleNewQRCode() }} >Gerar Novo QR Code</Button>
                                    </Col>
                                    <Col>
                                        <Link className="btn btn-link float-end" to="/questions">Voltar</Link>
                                    </Col>
                                </Row>


                                <Modal show={this.state.showSetCompanyModal}>
                                    <Modal.Dialog >
                                        <Modal.Header>
                                            <Modal.Title>Deseja salvar as alterações efetuadas?</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Button className="float-end" variant="secondary" type="button" onClick={() => { this.handleRedirectModal() }}>Voltar</Button>
                                            <Button variant="success" type="button" onClick={() => { this.handleSave() }}>Confirmar Alteração</Button>
                                        </Modal.Body>
                                    </Modal.Dialog>
                                </Modal>

                                <Modal show={this.state.showNewQRCodeModal}>
                                    <Modal.Header>
                                        <Modal.Title>Novo QR Code gerado com sucesso!</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Footer>
                                        <Button variant="success" type="button" onClick={() => { this.handleRedirectModal() }}>OK</Button>
                                    </Modal.Footer>
                                </Modal>

                                <Modal show={this.state.showAlteredCompanyModal}>
                                    <Modal.Header>
                                        <Modal.Title>Dados alterados com sucesso</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Footer>
                                        <Button variant="success" type="button" onClick={() => { this.handleRedirectModal() }}>OK</Button>
                                    </Modal.Footer>
                                </Modal>

                            </BoxForm>
                        </Col>

                    </Container>
                </PageContent>
                <Footer text="Dados da sua conta. Imprima ou exiba o QR Code em uma tela ou painel para que as perguntas possam ser acessadas e respondidas" />
            </>
        )
    }
}

export default CompanyDetails;