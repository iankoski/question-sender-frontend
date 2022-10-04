import React from 'react';
import Header from '../../../shared/header';
import Footer from '../../../shared/footer';
import { PageContent, BoxForm } from '../../../shared/styles';
import { Container, Button, Form, Alert, Row, Col, Modal } from 'react-bootstrap';
import NewsService from '../../../services/news';
import { validateNews } from '../../../services/util';
import { withRouter, Link } from 'react-router-dom';

class NewsAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            startDate: '',
            endDate: '',
            error: '',
            title: '',
            isLoading: false,
            showAddedNewsModal: false
        }
    }

    handleAddedNewsModal() {
        this.setState({ showAddedNewsModal: true });
    }

    handleSave = async (event) => {
        try {
            event.preventDefault();
            const { description, title } = this.state;
            const startDate = new Date(this.state.startDate);
            const endDate = new Date(this.state.endDate);
            const newsService = new NewsService();
            validateNews(description, startDate, endDate, title);
            const newsResult = await newsService.add({ description, startDate, endDate, title });

            this.setState({ showAddedNewsModal: true });
        } catch (error) {
            console.log('handleSave ' + error);
            this.setState({ showAddedNewsModal: false });
            if (error.response && error.response.status === 401) {
                let errorAuth = 'Sua sessão expirou, faça o login novamente';
                this.props.history.push(`/errorAuth/${errorAuth}`);
            }
            this.setState({ error });
        }

    }


    handleRedirectModal = async (event) => {
        /* Redireciona para a página anterior */
        this.props.history.push('/news/company');
    }

    renderError = () => {
        const { error } = this.state;
        return (
            <Alert variant="danger">
                {error}
            </Alert>
        )
    }

    render() {
        return (
            <>
                <Header />
                <PageContent>

                    <Container>
                        <Col lg={8} sm={12}>
                            <BoxForm>
                                <Row>
                                    <Col>
                                        <h3>Adicionar Notícia</h3>
                                        <p>Informe todos os campos para adicionar a notícia</p>
                                    </Col>
                                </Row>
                                <Row>

                                    {this.state.error && this.renderError()}
                                    <Form onSubmit={this.handleSave}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="2">Título: </Form.Label>
                                            <Col >
                                                <Form.Control                                             
                                                    type="text"
                                                    placeholder="Digite o título da notícia"
                                                    onChange={e => this.setState({ title: e.target.value })}>
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="2">Descrição: </Form.Label>
                                            <Col >
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    type="text"
                                                    placeholder="Digite a descrição da notícia"
                                                    onChange={e => this.setState({ description: e.target.value })}>
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>

                                        <Form.Group controlId="startDate" as={Row} className="mb-3" >
                                            <Form.Label column sm="2">Data Início: </Form.Label>
                                            <Col lg={4}>
                                                <Form.Control
                                                    type="date"
                                                    placeholder="Data Início"
                                                    name="startDate"
                                                    onChange={e => this.setState({ startDate: new Date(e.target.value) })}>
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>

                                        <Form.Group controlId="endDate" as={Row} className="mb-3">
                                            <Form.Label column sm="2">Data Fim: </Form.Label>
                                            <Col lg={4}>
                                                <Form.Control
                                                    type="date"
                                                    placeholder="Data Fim"
                                                    name="startDate"
                                                    onChange={e => this.setState({ endDate: e.target.value })}>
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>


                                        <Row>
                                            <Col>
                                                <Button className='btn btn-success' variant="primary" type="submit"
                                                    onClick={() => { this.handleAddedNewsModal() }} >Adicionar Notícia</Button>
                                            </Col>
                                            <Col>
                                                <Link className="btn btn-link float-end" to="/news/company">Voltar</Link>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Row>

                                <Modal show={this.state.showAddedNewsModal}>
                                    <Modal.Header>
                                        <Modal.Title>Notícia adicionada com sucesso</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Footer>
                                        <Button variant="success" type="button" onClick={() => { this.handleRedirectModal() }}>OK</Button>
                                    </Modal.Footer>
                                </Modal>

                            </BoxForm>
                        </Col>
                    </Container>
                </PageContent>
                <Footer text="As notícias poderão ser visualizadas juntamente das perguntas a serem respondidas" />
            </>
        )
    }
}

export default withRouter(NewsAdd);