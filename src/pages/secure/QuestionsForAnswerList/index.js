import React from 'react';
import Footer from '../../../shared/footer';
import { PageContent, BoxForm } from '../../../shared/styles';
import { Container, Table, Row, Col, Button } from 'react-bootstrap';
import { Link, useRouteMatch } from 'react-router-dom';
import QuestionsService from '../../../services/questions';
import AlternativesService from '../../../services/alternatives';
import CompaniesService from '../../../services/companies';
import { dateFormat } from '../../../services/util';
import Logo from '../../../assets/logo.png';
import { Icone } from '../../../shared/styles/index';
function RenderLine({ question , companyId, deviceId}) {

    return (
        <tr key={question.id}>
            <td>
                <Link to={`/questionsforanswer/detail/${companyId}/${question.id}/${deviceId}`}>{question.description}</Link>
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

function RenderTable({ questions, companyId, deviceId }) {
    return (
        <Table responsive striped borderless hover size="sm">
            <thead>
                <tr>
                    <th>Descrição</th>
                    <th>Data Início</th>
                    <th>Data Fim</th>
                </tr>
            </thead>
            <tbody>
                {questions.length === 0 && <RenderEmptyRow mensagem="Nenhuma pergunta disponível para responder" />}
                {questions.map((item) => <RenderLine key={item.id} question={item} companyId={companyId} deviceId={deviceId}/>)}
            </tbody>
        </Table>
    )
}

function RenderEmptyRow({mensagem}) {
    return (
        <tr>
            <td colSpan='3'>{mensagem}</td>
        </tr>
    )
}



class QuestionsForAnswerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            questions: [],
            text: '',
            companyName: '',
            companyId: 0,
            deviceId: 0
        }
    }

    async getCompanyName() {
        try {
            const service = new CompaniesService();
            const { params: { companyId } } = this.props.match;
            const companyName = await service.getCompanyName(companyId);
            this.setState({ companyName: companyName.companyName, isLoading: false, companyId: companyId });
        } catch (error) {
            console.log('getCompanyName: ' + error);
        }

    }

    async componentDidMount() {
        const questionsService = new QuestionsService();
        const { params: { deviceId, companyId } } = this.props.match;

        this.getCompanyName();
        try {
            const result = await questionsService.getQuestionsForAnswer(companyId, deviceId);
            this.setState({
                isLoading: false,
                questions: result
            });
        } catch (error) {
            console.log('componentDidMount '+error);
        }
    }

    render() {
        const { isLoading, questions } = this.state;
        const { params: { companyId, deviceId } } = this.props.match;
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

                <Row>
                    <PageContent>
                        <Container>
                            <BoxForm>
                                <Row>
                                    <Col>
                                        <h3>Perguntas</h3>
                                    </Col>
                                </Row>
                                <p>Listagem de todas as perguntas válidas a serem respondidas de {isLoading ? (null) : this.state.companyName}.</p>
                                {!isLoading && <RenderTable questions={questions} companyId={companyId} deviceId={deviceId}/>}
                            </BoxForm>
                        </Container>

                    </PageContent>
                </Row>
                <Footer text="Clique em uma pergunta para visualizar as alternativas e responder." />

            </>
        )

    }
}

export default QuestionsForAnswerList;