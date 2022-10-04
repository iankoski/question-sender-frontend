import React from 'react';
import Header from '../../../shared/header';
import Footer from '../../../shared/footer';
import { PageContent, BoxForm } from '../../../shared/styles';
import NewsService from '../../../services/news';
import { dateFormat, validateNews } from '../../../services/util';
import { Link } from 'react-router-dom';
import { Container, Button, Form, Alert, Row, Col, Modal } from 'react-bootstrap';
class NewsDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            news: {
                description: '',
                startDate: '',
                endDate: '',
                title: ''
            },
            showDeleteModal: false,
            showDeletedNewsModal: false,
            showAlteredNewsModal: false
        }
    }

    async getNews(newsId) {
        const service = new NewsService();
        const result = await service.getOne(newsId);

        this.setState({
            news: result,
            isLoading: false
        })
        this.setState({
            description: this.state.news.description,
            startDate: this.state.news.startDate,
            endDate: this.state.news.endDate,
            title: this.state.news.title
        })
    }

    handleSave = async (event) => {
        try {
            event.preventDefault();

            const { description, title } = this.state;
            const startDate = new Date(this.state.startDate);
            const endDate = new Date(this.state.endDate);
            const { params: { newsId } } = this.props.match;
            validateNews(description, startDate, endDate, title);

            const newsService = new NewsService();

            await newsService.set({ description, startDate, endDate, title }, newsId);

            /* Retorna o usuário para a tela anterior */
            this.setState({ showAlteredNewsModal: true });

        } catch (error) {
            console.log('handleSave: ' + error);
            this.setState({ showAlteredNewsModal: false });
            this.setState({ error });
        }

    }

    /*Ciclo de vida do React: essa função será executada sempre que o componente é montado*/
    async componentDidMount() {
        try {
            const { params: { newsId } } = this.props.match;
            await this.getNews(newsId);
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

    handleDeleteModal() {
        this.setState({ showDeleteModal: true });
    }

    handleRedirectModal = async (event) => {
        /* Redireciona para a página anterior */
        this.props.history.push('/news/company');
    }

    handleCancelDelete() {
        this.setState({ showDeleteModal: false });
    }
    handleDeleteNews = async (event) => {
        event.preventDefault();
        const { params: { newsId } } = this.props.match;
        try {
            const service = new NewsService();
            await service.delete(newsId);
            /* Mensagem de confirmação de exclusão */
            this.setState({ showDeleteModal: false });
            this.setState({ showDeletedNewsModal: true });
        } catch (error) {
            this.setState({ error: "Ocorreu um erro durante a exclusão da notícia" });
        };
    }

    render() {
        const { isLoading, news } = this.state;

        if (!isLoading) {
            dateFormat(this.state.news.startDate, 'dd/MM/yyyy');
        }
        return (
            <>
                <Header />
                <PageContent>

                    <Container>
                        <Col lg={8} sm={12}>
                            <BoxForm>
                                <Row>
                                    <Col>
                                        <h3>Dados da Notícia</h3>
                                    </Col>
                                </Row>
                                {this.state.error && this.renderError()}
                                <Form onSubmit={this.handleSave}>
                                <Form.Group as={Row} className="mb-3">
                                        <Form.Label column sm="2">Título: </Form.Label>
                                        <Col >
                                            <Form.Control
                                                type="text"
                                                defaultValue={isLoading ? (null) : this.state.news.title}
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
                                                defaultValue={isLoading ? (null) : this.state.news.description}
                                                placeholder="Digite a descrição da notícia"
                                                onChange={e => this.setState({ description: e.target.value })}>
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group controlId="startDate" as={Row} className="mb-3">
                                        <Form.Label column sm="2">Data Início: </Form.Label>
                                        <Col lg={4}>
                                            <Form.Control
                                                type="date"
                                                defaultValue={isLoading ? (null) : (dateFormat(this.state.news.startDate, 'yyyy-MM-dd'))}
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
                                                defaultValue={isLoading ? (null) : (dateFormat(this.state.news.endDate, 'yyyy-MM-dd'))}
                                                placeholder="Data Fim"
                                                name="startDate"
                                                onChange={e => this.setState({ endDate: e.target.value })}>
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>

                                    <Row>
                                        <Col md={{ span: 3, offset: 1 }}>
                                            <Button variant="primary" type="submit" >Alterar Notícia</Button>
                                        </Col >
                                        <Col md={{ span: 3, offset: 1 }}>
                                            <Button variant="danger" type="button" onClick={() => { this.handleDeleteModal() }}>Excluir Notícia</Button>
                                        </Col>
                                        <Col md={{ span: 3, offset: 1 }}>
                                            <Link className="btn btn-link " to="/news/company">Voltar</Link>
                                        </Col>
                                    </Row>

                                    <Modal show={this.state.showDeleteModal}>
                                        <Modal.Dialog >
                                            <Modal.Header>
                                                <Modal.Title>Confirmar Exclusão</Modal.Title>
                                            </Modal.Header>

                                            <Modal.Body>
                                                <p>Esta notícia não ficará mais disponível. Deseja excluir mesmo assim?</p>
                                            </Modal.Body>

                                            <Modal.Footer>
                                                <Button variant="secondary" type="button" onClick={() => { this.handleCancelDelete() }}>Voltar</Button>
                                                <Button variant="danger" type="button" onClick={this.handleDeleteNews}>Excluir Notícia</Button>
                                            </Modal.Footer>
                                        </Modal.Dialog>
                                    </Modal>

                                    <Modal show={this.state.showDeletedNewsModal}>
                                        <Modal.Header>
                                            <Modal.Title>Notícia excluída com sucesso</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Footer>
                                            <Button variant="success" type="button" onClick={() => { this.handleRedirectModal() }}>OK</Button>
                                        </Modal.Footer>
                                    </Modal>

                                    <Modal show={this.state.showAlteredNewsModal}>
                                        <Modal.Header>
                                            <Modal.Title>Notícia alterada com sucesso</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Footer>
                                            <Button variant="success" type="button" onClick={() => { this.handleRedirectModal() }}>OK</Button>
                                        </Modal.Footer>
                                    </Modal>

                                </Form>
                            </BoxForm>
                        </Col>
                    </Container>
                </PageContent>
                <Footer text="Notícias exibidas na leitura do QR Code" />
            </>
        )
    }
}

export default NewsDetails;