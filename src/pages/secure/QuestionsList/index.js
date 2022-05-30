import React, { useEffect, useState } from 'react';
import Header from '../../../shared/header';
import Footer from '../../../shared/footer';
import { PageContent, BoxForm } from '../../../shared/styles';
import { Container, Table, Row, Col, Button } from 'react-bootstrap';
import { Link, withRouter, useRouteMatch } from 'react-router-dom';
import QuestionsService from '../../../services/questions';
import AnswersService from '../../../services/answers';
import AlternativesService from '../../../services/alternatives';
import { dateFormat } from '../../../services/util';

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
            <td>
                {question.alternativeDescription}
            </td>            
        </tr>
    )
}

function RenderTable({ questions }) {
    return (

        <Table responsive striped bordered hover size="sm">
            <thead>
                <tr>
                    <th>Descrição</th>
                    <th>Data Início</th>
                    <th>Data Fim</th>
                    <th>Alternativa mais respondida</th>
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
            text: ''
        }
    }

    async componentDidMount() {
        const questionsService = new QuestionsService();
        const answersService = new AnswersService();
        const alternativesService = new AlternativesService();
        try {
            const result = await questionsService.getAll();

            for (const [idx, q] of result.entries()) {
                const mostAnswered = await answersService.getMostAnsweredAlternative(q.id);
                q['mostAnsweredId'] = mostAnswered;
                q['alternativeDescription'] = 'SEM RESPOSTAS';
                if (mostAnswered){
                    const description = await alternativesService.getOne(mostAnswered);
                    q['alternativeDescription'] = description.description;
                }
            }
            this.setState({
                isLoading: false,
                questions: result,
            });            
        } catch (error) {            
            if (error.response && error.response.status === 401) {
                let errorAuth = 'Sua sessão expirou, faça o login novamente';
                this.props.history.push(`/errorAuth/${errorAuth}`);
            }
        }
    }

    render() {
        const { isLoading, questions } = this.state;
        return (
            <>
                <Header />
                <PageContent>
                    <Container>
                        <BoxForm>
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
                        </BoxForm>
                    </Container>

                </PageContent>
                <Footer text="Listagem de todas as perguntas cadastradas. Clique em uma pergunta para ver as alternativas e mais opções." />
            </>
        )

    }
}

export default Questions;