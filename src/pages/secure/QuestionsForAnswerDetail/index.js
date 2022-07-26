import React from 'react';
import Footer from '../../../shared/footer';
import { PageContent, BoxForm, AlternativeLetter } from '../../../shared/styles';
import QuestionsService from '../../../services/questions';
import AlternativesService from '../../../services/alternatives';
import { dateFormat, validateQuestionAndAlternatives } from '../../../services/util';
import { Link, withRouter, useRouteMatch } from 'react-router-dom';
import { Container, Button, Form, Alert, Row, Col, Modal, Table } from 'react-bootstrap';
import Logo from '../../../assets/logo.png';
import AnswersService from '../../../services/answers';

class QuestionsForAnswerDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            question: {
                description: '',
                startDate: '',
                endDate: ''
            },
            showSentAnswerModal: false,
            alternatives: [],
            selectedAlternative: '',
            questionId: '',
            companyId: '',
            deviceId: ''
        }
    }

    async getQuestion(questionId) {

        try {
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
        } catch (error) {
            console.log(`getQuestion ${error}`);
        }

    }

    async getAlternatives(questionId) {
        const service = new AlternativesService();

        try {
            var result = await service.getAll(questionId);

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
            const { params: { companyId, questionId, deviceId } } = this.props.match;
            const alternativeId = this.state.selectedAlternative;
            const answersService = new AnswersService();

            await answersService.sendAnswer(companyId, questionId, alternativeId, deviceId);
            /* Retorna o usuário para a tela anterior */
            this.setState({ showSentAnswerModal: true });

        } catch (error) {
            console.log('handleSave: ' + error);
            this.setState({ showSentAnswerModal: false });
            this.setState({ error });
        }

    }

    /*Ciclo de vida do React: essa função será executada sempre que o componente é montado*/
    async componentDidMount() {
        try {
            const { params: { companyId, questionId, deviceId } } = this.props.match;
            await this.getQuestion(questionId);
            await this.getAlternatives(questionId);
        } catch (error) {
            console.log('componentDidMount ' + error);
        }
    }

    renderError = () => {
        return (
            <Alert variant="danger">{this.state.error}</Alert>
        )
    }

    handleRedirectModal = () => {
        /* Redireciona para a página anterior */
        const { params: { companyId, questionId, deviceId } } = this.props.match;
        this.props.history.push(`/questionsforanswer/${deviceId}/${companyId}`);
    }

    handleChangeRadio = (event) => {
        this.setState({ selectedAlternative: event.target.value });
        console.log('handleChangeRadio ' + this.state.selectedAlternative + ' event.target.value ' + event.target.value);
    }

    render() {
        const { isLoading, question } = this.state;

        if (!isLoading) {
            dateFormat(this.state.question.startDate, 'dd/MM/yyyy');
        }
        return (
            <>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>

                    <Row>
                        <Col xs={12} md={6} sm={1}>
                            <img src={Logo} alt='QuestionSender' style={{ width: 200, height: 200 }} />
                        </Col>
                    </Row>
                </div>

                <PageContent >
                    <Container>
                        <Col lg={8} sm={12}>
                            <BoxForm>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Row>
                                        <Col >
                                            <h3>Dados da Pergunta</h3>
                                        </Col>
                                    </Row>
                                </div>

                                {this.state.error && this.renderError()}
                                <Row className="mb-3">
                                    <Col xs={12} md={8}>
                                        <p>{isLoading ? (null) : this.state.question.description}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p>Data Incício</p>
                                    </Col>
                                    <Col>
                                        {isLoading ? (null) : (dateFormat(this.state.question.startDate, 'dd/MM/yyyy'))}
                                    </Col>
                                    <Col>
                                        <p>Data Fim</p>
                                    </Col>
                                    <Col>
                                        {isLoading ? (null) : (dateFormat(this.state.question.endDate, 'dd/MM/yyyy'))}
                                    </Col>
                                </Row>

                                <Form onSubmit={this.handleSave}>

                                    <Row>
                                        <Col>
                                            <h4>Alternativas</h4>
                                        </Col>
                                    </Row>
                                    {this.state.alternatives.map((alternative) => (
                                        <div key={alternative.id} className="mb-3">
                                            <Form.Check
                                                type='radio'
                                                value={alternative.id}
                                                checked={parseInt(this.state.selectedAlternative) === parseInt(alternative.id)}
                                                label={alternative.description}
                                                onChange={e => { this.handleChangeRadio(e) }}
                                            />
                                        </div>
                                    ))}

                                    <Row>
                                        <Col >
                                            <Button variant="success" type="submit">Enviar Resposta</Button>
                                        </Col>

                                        <Col >
                                            <Link className="btn btn-link float-end" to="/questions">Voltar</Link>
                                        </Col>
                                    </Row>

                                    <Modal show={this.state.showSentAnswerModal}>
                                        <Modal.Header>
                                            <Modal.Title>Resposta enviada com sucesso</Modal.Title>
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
                <Footer text="Uma pergunta somente pode ser respondida uma vez" />
            </>
        )
    }
}

export default QuestionsForAnswerDetail;