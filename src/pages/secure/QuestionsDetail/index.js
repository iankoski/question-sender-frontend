import React from 'react';
import Header from '../../../shared/header';
import Footer from '../../../shared/footer';
import { PageContent, BoxForm } from '../../../shared/styles';
import QuestionsService from '../../../services/questions';
import { dateFormat } from '../../../services/util';
import { Link, withRouter, useRouteMatch } from 'react-router-dom';
import { Container, Button, Form, Alert, Row, Col, Modal } from 'react-bootstrap';
class QuestionDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            question: {
                description: '',
                startDate: '',
                endDate: ''
            },
            showDeleteModal: false,
            showDeletedQuestionModal: false
        }
    }

    async getQuestion(questionId) {
        const service = new QuestionsService();
        const result = await service.getOne(questionId);

        this.setState({
            question: result,
            isLoading: false
        })
        this.setState({
            description: this.state.question.description,
            startDate: this.state.question.startDate,
            endDate: this.state.question.endDate,
        })
        console.log(`log 1 question State: ${this.state.question.description} description state  2 ${this.state.description}`);
    }

    handleSave = async (event) => {
        event.preventDefault();
        console.log(`log 2 question State: ${this.state.question.description} description state 2 ${this.state.description}`);
        const { description, startDate, endDate } = this.state;
        const { params: { questionId } } = this.props.match;
        if (!description || !startDate || !endDate) {
            this.setState({ error: "Informe todos os campos para adicionar a pergunta" });
        } else {
            try {
                const service = new QuestionsService();
                await service.set({ description, startDate, endDate }, questionId);
                /* Retorna o usuário para a tela anterior */
                this.props.history.push('/questions');
            } catch (error) {
                this.setState({ error: "Ocorreu um erro durante a criação da pergunta" });
            }
        };
    }

    /*Ciclo de vida do React: essa função será executada sempre que o componente é montado*/
    async componentDidMount() {
        const { params: { questionId } } = this.props.match;
        await this.getQuestion(questionId);
    }

    renderError = () => {
        return (
            <Alert variant="danger">{this.state.error}</Alert>
        )
    }

    handleDeleteModal() {
        this.setState({ showDeleteModal: true });
        console.log(`handleDeleteModal ${this.state.showDeleteModal}`);
    }

    handleRedirectModal = async (event) => {
        /* Redireciona para a página anterior */
        this.props.history.push('/questions');
    }

    handleCancelDelete() {
        this.setState({ showDeleteModal: false });
        console.log(`handleDeleteModal ${this.state.showDeleteModal}`);
    }
    handleDeleteQuestion = async (event) => {
        event.preventDefault();
        console.log(`handleDeleteQuestion : ${this.state.question.description} description state 2 ${this.state.description}`);
        const { params: { questionId } } = this.props.match;

        try {
            const service = new QuestionsService();
            await service.delete(questionId);
            /* Mensagem de confirmação de exclusão */
            this.setState({ showDeleteModal: false });
            this.setState({ showDeletedQuestionModal: true });
        } catch (error) {
            this.setState({ error: "Ocorreu um erro durante a exclusão da pergunta" });
        };

    }

    render() {
        const { isLoading, question } = this.state;

        if (!isLoading) {
            dateFormat(this.state.question.startDate, 'dd/MM/yyyy');
        }
        return (
            <>
                <Header />
                <PageContent>

                    <Container>
                        <Row>
                            <Col>
                                <h3>Dados da Pergunta</h3>
                            </Col>
                        </Row>
                        <Col lg={6} sm={12}>
                            <BoxForm>
                                {this.state.error && this.renderError()}
                                <Form onSubmit={this.handleSave}>
                                    <Form.Group>
                                        <Form.Label>Descrição: </Form.Label>
                                        <Form.Control
                                            type="text"
                                            as="textarea"
                                            rows={3}
                                            defaultValue={isLoading ? (null) : (this.state.question.description)}
                                            placeholder="Digite a pergunta"
                                            onChange={e => this.setState({ description: e.target.value })}>
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId="startDate">
                                        <Form.Label>Data Início: </Form.Label>
                                        <Form.Control
                                            type="date"
                                            defaultValue={isLoading ? (null) : (dateFormat(this.state.question.startDate, 'yyyy-MM-dd'))}
                                            placeholder="Data Início"
                                            name="startDate"
                                            onChange={e => this.setState({ startDate: new Date(e.target.value) })}>
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId="endDate">
                                        <Form.Label>Data Fim: </Form.Label>
                                        <Form.Control
                                            type="date"
                                            defaultValue={isLoading ? (null) : (dateFormat(this.state.question.endDate, 'yyyy-MM-dd'))}
                                            placeholder="Data Fim"
                                            name="startDate"
                                            onChange={e => this.setState({ endDate: e.target.value })}>
                                        </Form.Control>
                                    </Form.Group>
                                    <br />
                                    <Row>
                                        <Col xs={5}>
                                            <Button variant="primary" type="submit" >Alterar Pergunta</Button>
                                        </Col>
                                        <Col xs={5}>
                                            <Button variant="danger" type="button" onClick={() => { this.handleDeleteModal() }}>Excluir Pergunta</Button>
                                        </Col>

                                        <Col>
                                            <Link className="btn btn-link" to="/questions">Voltar</Link>
                                        </Col>
                                    </Row>

                                    <Modal show={this.state.showDeleteModal}>
                                        <Modal.Dialog >
                                            <Modal.Header>
                                                <Modal.Title>Confirmar Exclusão</Modal.Title>
                                            </Modal.Header>

                                            <Modal.Body>
                                                <p>Esta pergunta não ficará mais disponível para ser respondida. Deseja excluir mesmo assim?</p>
                                            </Modal.Body>

                                            <Modal.Footer>
                                                <Button variant="secondary" type="button" onClick={() => { this.handleCancelDelete() }}>Voltar</Button>
                                                <Button variant="danger" type="button" onClick={this.handleDeleteQuestion}>Excluir Pergunta</Button>
                                            </Modal.Footer>
                                        </Modal.Dialog>
                                    </Modal>

                                    <Modal show={this.state.showDeletedQuestionModal}>
                                        <Modal.Header>
                                            <Modal.Title>Pergunta excluída com sucesso</Modal.Title>
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
                <Footer text="Uma pergunta somente pode ser alterada se ainda não tiver respostas"/>
            </>
        )
    }
}

export default QuestionDetails;