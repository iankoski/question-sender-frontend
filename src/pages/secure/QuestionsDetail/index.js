import React from 'react';
import Header from '../../../shared/header';
import { PageContent } from '../../../shared/styles';
import QuestionsService from '../../../services/questions';
import { dateFormat } from '../../../services/util';
import { Link, withRouter, useRouteMatch } from 'react-router-dom';
import { Container, Button, Form, Alert, Row, Col, FormGroup } from 'react-bootstrap';
class QuestionDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            question: null,
        }
    }

    async getQuestion(questionId) {
        const service = new QuestionsService();
        const result = await service.getOne(questionId);

        this.setState({
            question: result,
            isLoading: false
        })
    }

    /*Ciclo de vida do React: essa função será executada sempre que o componente é montado*/
    async componentDidMount() {
        const { params: { questionId } } = this.props.match;
        await this.getQuestion(questionId);
    }

    render() {
        const { isLoading, question } = this.state;

        if (!isLoading){
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
                            <Form onSubmit={this.handleSave}>
                                <Form.Group>
                                    <Form.Label>Descrição: </Form.Label>
                                    <Form.Control
                                        type="text"                                        
                                        value={isLoading ? ("Carregando...") : (this.state.question.description)}
                                        placeholder="Digite a pergunta"
                                        onChange={e => this.setState({ description: e.target.value })}>

                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="startDate">
                                    <Form.Label>Data Início: </Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={isLoading ? (null) : (dateFormat(this.state.question.startDate, 'yyyy-MM-dd'))}
                                        placeholder="Data Início"
                                        name="startDate"
                                        onChange={e => this.setState({ startDate: new Date(e.target.value) })}>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="endDate">
                                    <Form.Label>Data Fim: </Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={isLoading ? (null) : (dateFormat(this.state.question.endDate, 'yyyy-MM-dd'))}
                                        placeholder="Data Fim"
                                        name="startDate"
                                        onChange={e => this.setState({ endDate: e.target.value })}>
                                    </Form.Control>
                                </Form.Group>
                                <br />
                                <Button className='btn btn-success' variant="primary" type="submit" >Alterar Pergunta</Button>
                                <Link className="btn btn-link" to="/questions">Voltar</Link>
                            </Form>
                        </Col>
                    </Container>
                </PageContent>
            </>
        )
    }
}

export default QuestionDetails;