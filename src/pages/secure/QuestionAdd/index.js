import React from 'react';
import Header from '../../../shared/header';
import Footer from '../../../shared/footer';
import { PageContent, BoxForm, AlternativeLetter } from '../../../shared/styles';
import { Container, Button, Form, Alert, Row, Col, Modal } from 'react-bootstrap';
import { validateQuestionAndAlternatives } from '../../../services/util';
import QuestionsService from '../../../services/questions';
import AlternativesService from '../../../services/alternatives';
import { withRouter, Link, useHistory } from 'react-router-dom';

class QuestionAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            startDate: '',
            endDate: '',
            error: '',
            isLoading: false,
            showAddedQuestionModal: false,
            alternatives: [" ", " "]
        }
    }

    handleAddedQuestionModal() {
        this.setState({ showAddedQuestionModal: true });        
        console.log(`handleAddedQuestionModal ${this.state.showAddedQuestionModal}`);
    }

    handleSave = async (event) => {
        try {
            event.preventDefault();
            const { description, alternatives } = this.state;
            const startDate = new Date(this.state.startDate);
            const endDate = new Date(this.state.endDate);
            validateQuestionAndAlternatives(description, startDate, endDate, alternatives, 'add');
            const questionService = new QuestionsService();
            const alternativeService = new AlternativesService();
            /* Primeiro salva a pergunta */
            const questionResult = await questionService.add({ description, startDate, endDate });
            /* Atribui o id da pergunta a alternativa */
            const alternativeResult = await alternativeService.add(alternatives, questionResult.id);
            this.setState({ showAddedQuestionModal: true });
        } catch (error) {
            console.log('handleSave ' + error);
            this.setState({ showAddedQuestionModal: false });
            if (error.response && error.response.status === 401) {
                let errorAuth = 'Sua sessão expirou, faça o login novamente';
                this.props.history.push(`/errorAuth/${errorAuth}`);
            }            
            this.setState({ error });
        }

    }

    handleSetAlternative = (e, index) => {
        var array = [...this.state.alternatives];
        array[index] = e;
        this.setState({ alternatives: array });
    }

    handleIncrementAlternatives = () => {

        if (this.state.alternatives.length > 4) {
            this.setState({ error: "A quantidade máxima de alternativas é 5" });
            return;
        }

        this.setState(prevState => ({
            //count: this.state.count + 1
            alternatives: [...prevState.alternatives, this.state.alternatives.length + 1]
        }))
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

    handleRedirectModal = async (event) => {
        /* Redireciona para a página anterior */
        this.props.history.push('/questions');
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
                                        <h3>Adicionar Pergunta</h3>
                                        <p>Informe todos os campos para adicionar a pergunta</p>
                                    </Col>
                                </Row>
                                <Row>

                                    {this.state.error && this.renderError()}
                                    <Form onSubmit={this.handleSave}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="2">Descrição: </Form.Label>
                                            <Col >
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    type="text"
                                                    placeholder="Digite a descrição da pergunta"
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

                                        <h4>Alternativas</h4>
                                        {this.state.alternatives.map((alternative, index) => (
                                            <Form.Group as={Row} className="mb-3">
                                                <AlternativeLetter>{`${String.fromCharCode(65 + index)}`}</AlternativeLetter>
                                                <Col>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        type="text"
                                                        name={alternative}
                                                        onChange={e => { this.handleSetAlternative(e.target.value, index) }}
                                                        placeholder="Alternativa">
                                                    </Form.Control>
                                                </Col>
                                            </Form.Group>
                                        ))}

                                        <Row>
                                            <Col>
                                                <Button className='btn btn-success' variant="primary" type="submit" 
                                                    onClick={() => { this.handleAddedQuestionModal() }} >Adicionar Pergunta</Button>
                                            </Col>
                                            <Col xs lg="2">
                                                <Button className='btn' variant="outline-primary" type="button"
                                                    onClick={e => { this.handleIncrementAlternatives() }}>+ Alternativa</Button>
                                            </Col>
                                            <Col xs lg="2">
                                                <Button className='btn' variant="outline-warning" type="button"
                                                    onClick={e => { this.handleDecressAlternatives() }}>- Alternativa</Button>
                                            </Col>
                                            <Col>
                                                <Link className="btn btn-link float-end" to="/questions">Voltar</Link>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Row>
                                <Modal show={this.state.showAddedQuestionModal}>
                                    <Modal.Header>
                                        <Modal.Title>Pergunta adicionada com sucesso</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Footer>
                                        <Button variant="success" type="button" onClick={() => { this.handleRedirectModal() }}>OK</Button>
                                    </Modal.Footer>
                                </Modal>
                            </BoxForm>
                        </Col>
                    </Container>
                </PageContent>
                <Footer text="As perguntas são de múltipla escolha e até cinco alternativas podem ser adicionadas" />
            </>
        )
    }
}

export default withRouter(QuestionAdd);