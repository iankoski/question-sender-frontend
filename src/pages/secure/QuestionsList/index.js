import React from 'react';
import Header from '../../../shared/header';
import { PageContent } from '../../../shared/styles';
import { Container, Table, Row, Col, Button } from 'react-bootstrap';
import { Link, withRouter, useRouteMatch } from 'react-router-dom';
import QuestionsService from '../../../services/questions';
import {dateFormat} from '../../../services/util';
function RenderLine({ question }) {
    const { url } = useRouteMatch();
    return (
        <tr key={question.id}>
            <td>
                <Link to={`${url}/${question.id}`}>{question.description}</Link>
            </td>
            <td>
                {dateFormat(question.startDate, 'dd/MM/yyyy')}
            </td>
            <td>                
                {dateFormat(question.endDate, 'dd/MM/yyyy')}
            </td>
        </tr>
    )
}

function RenderTable({ questions }) {
    return (
        <Table striped bordered hover >
            <thead>
                <tr>
                    <th>Descrição</th>
                    <th>Data Início</th>
                    <th>Data Fim</th>
                </tr>
            </thead>
            <tbody>
                {questions.length === 0 && <RenderEmptyRow mensagem="Nenhuma pergunta foi adicionada" />}
                {questions.map((item) => <RenderLine key={item.id} question={item} />)}                
            </tbody>
        </Table>
    )
}

function RenderEmptyRow() {
    return (
        <tr>
            <td colspan='3'>Nenhuma pergunta cadastrada</td>
        </tr>
    )
}

class Questions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            questions: [],
        }
    }

    async componentDidMount() {
        const service = new QuestionsService();
        const result = await service.getAll();
        this.setState({
            isLoading: false,
            questions: result,
        });
    }

    render() {
        const { isLoading, questions } = this.state;

        return (
            <>
                <Header />
                <PageContent>
                    <Container>
                        <Row>
                            <Col>
                                <h3>Perguntas</h3>
                            </Col>
                            <Col>
                                <Link className='btn btn-success float-end' to='/questions/add'>Adicionar pergunta</Link>
                            </Col>
                        </Row>
                        <p>Relação de perguntas cadastradas.</p>
                        {!isLoading && <RenderTable questions={questions} />}
                    </Container>
                </PageContent>
            </>
        )

    }
}

export default Questions;