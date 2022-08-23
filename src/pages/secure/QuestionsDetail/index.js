import React from 'react';
import Header from '../../../shared/header';
import Footer from '../../../shared/footer';
import { PageContent, BoxForm, AlternativeLetter } from '../../../shared/styles';
import QuestionsService from '../../../services/questions';
import AlternativesService from '../../../services/alternatives';
import AnswersService from '../../../services/answers';
import { dateFormat, validateQuestionAndAlternatives } from '../../../services/util';
import { Link } from 'react-router-dom';
import { Container, Button, Form, Alert, Row, Col, Modal, Table } from 'react-bootstrap';
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
            showDeletedQuestionModal: false,
            showAlteredQuestionModal: false,
            alternatives: []
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

    }

    async getAlternatives(questionId) {
        const service = new AlternativesService();
        const answersService = new AnswersService();
        try {
            var result = await service.getAll(questionId);
            for (const [idx, r] of result.entries()) {
                r['answersCount'] = await answersService.getCountAlternativeAnswers(r.id);
            }
            this.setState({
                isLoading: false,
                alternatives: result
            });
        } catch (error) {
            console.log('getAlternatives ' + error);
            if (error.response.status === 401) {
                this.props.history.push('/');
            }
        }
    }

    handleSave = async (event) => {
        try {
            event.preventDefault();

            const { description, alternatives } = this.state;
            const startDate = new Date(this.state.startDate);
            const endDate = new Date(this.state.endDate);
            const { params: { questionId } } = this.props.match;

            validateQuestionAndAlternatives(description, startDate, endDate, alternatives, 'alter');

            const questionService = new QuestionsService();
            const alternativeService = new AlternativesService();
            const answerService = new AnswersService();

            const questionAnswers = await answerService.getCountQuestionAnswers(questionId);

            if (questionAnswers > 0) {
                throw 'Esta pergunta já foi respondida e não pode ser alterada';
            };

            await questionService.set({ description, startDate, endDate }, questionId);

            alternatives.map((a) => { a.questionId = questionId });

            await alternativeService.set(alternatives, questionId);
            /* Retorna o usuário para a tela anterior */
            this.setState({ showAlteredQuestionModal: true });

        } catch (error) {
            console.log('handleSave: ' + error);
            this.setState({ showAlteredQuestionModal: false });
            this.setState({ error });
        }

    }

    /*Ciclo de vida do React: essa função será executada sempre que o componente é montado*/
    async componentDidMount() {
        try {
            const { params: { questionId } } = this.props.match;
            await this.getQuestion(questionId);
            await this.getAlternatives(questionId);
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

    handleSetAlternative = (element, index) => {
        var array = this.state.alternatives;
        array.map((e, i) => {
            if (i === index) {
                e.description = element;
            }
        });
        this.setState({ alternatives: array });
    }

    handleRedirectModal = async (event) => {
        /* Redireciona para a página anterior */
        this.props.history.push('/questions');
    }

    handleCancelDelete() {
        this.setState({ showDeleteModal: false });
    }
    handleDeleteQuestion = async (event) => {
        event.preventDefault();
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
    handleIncrementAlternatives = () => {

        if (this.state.alternatives.length > 4) {
            this.setState({ error: "A quantidade máxima de alternativas é 5" });
            return;
        }
        var array = this.state.alternatives;
        array.push({ description: '' });

        this.setState({ alternatives: array });
    }
    handleDecressAlternatives = () => {
        var array = [...this.state.alternatives];
        if (array.length < 3) {
            this.setState({ error: "A quantidade mínima de alternativas é 2" });
            return;
        }
        array.splice(array.length - 1, 1);
        this.setState({ alternatives: array });
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
                        <Col lg={8} sm={12}>
                            <BoxForm>
                                <Row>
                                    <Col>
                                        <h3>Dados da Pergunta</h3>
                                    </Col>
                                </Row>
                                {this.state.error && this.renderError()}
                                <Form onSubmit={this.handleSave}>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column sm="2">Descrição: </Form.Label>
                                        <Col >
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                type="text"
                                                defaultValue={isLoading ? (null) : this.state.question.description}
                                                placeholder="Digite a descrição da pergunta"
                                                onChange={e => this.setState({ description: e.target.value })}>
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group controlId="startDate" as={Row} className="mb-3">
                                        <Form.Label column sm="2">Data Início: </Form.Label>
                                        <Col lg={4}>
                                            <Form.Control
                                                type="date"
                                                defaultValue={isLoading ? (null) : (dateFormat(this.state.question.startDate, 'yyyy-MM-dd'))}
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
                                                defaultValue={isLoading ? (null) : (dateFormat(this.state.question.endDate, 'yyyy-MM-dd'))}
                                                placeholder="Data Fim"
                                                name="startDate"
                                                onChange={e => this.setState({ endDate: e.target.value })}>
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>

                                    <Row>
                                        <Col>
                                            <h4>Alternativas</h4>
                                        </Col>
                                        <Col>
                                            <h4 className="float-end">Qt. Respostas</h4>
                                        </Col>
                                    </Row>
                                    <Row>
                                        {isLoading ? (null) :
                                            this.state.alternatives.map((alternative, index) =>
                                                <Form.Group as={Row} className="mb-3">
                                                    <Col md="auto">
                                                        <AlternativeLetter>{`${String.fromCharCode(65 + index)}`}</AlternativeLetter>
                                                    </Col>
                                                    <Col xs={10}>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={3}
                                                            type="text"
                                                            name={alternative}
                                                            defaultValue={isLoading ? (null) : (alternative.description)}
                                                            onChange={e => { this.handleSetAlternative(e.target.value, index) }}
                                                            placeholder="Alternativa">
                                                        </Form.Control>
                                                    </Col>
                                                    <Col>
                                                        <h4 className="float-end">{alternative.answersCount}</h4>
                                                    </Col>
                                                </Form.Group>
                                            )}
                                    </Row>
                                    <Row>
                                        <Col lg={3} sm={2}>
                                            <Button variant="primary" type="submit" >Alterar Pergunta</Button>
                                        </Col>
                                        <Col lg={2}>
                                            <Button className='btn' variant="outline-primary" type="button"
                                                onClick={e => { this.handleIncrementAlternatives() }}>+ Alternativa</Button>
                                        </Col>
                                        <Col lg={2} sm={2}>
                                            <Button className='btn' variant="outline-warning" type="button"
                                                onClick={e => { this.handleDecressAlternatives() }}>- Alternativa</Button>
                                        </Col>
                                        <Col lg={3} sm={2}>
                                            <Button variant="danger" type="button" onClick={() => { this.handleDeleteModal() }}>Excluir Pergunta</Button>
                                        </Col>

                                        <Col>
                                            <Link className="btn btn-link " to="/questions">Voltar</Link>
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

                                    <Modal show={this.state.showAlteredQuestionModal}>
                                        <Modal.Header>
                                            <Modal.Title>Pergunta alterada com sucesso</Modal.Title>
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
                <Footer text="Uma pergunta somente pode ser alterada se ainda não tiver respostas" />
            </>
        )
    }
}

export default QuestionDetails;