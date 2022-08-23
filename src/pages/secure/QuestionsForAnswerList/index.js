import React from 'react';
import Footer from '../../../shared/footer';
import { PageContent, BoxForm } from '../../../shared/styles';
import { Container, Table, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import QuestionsService from '../../../services/questions';
import CompaniesService from '../../../services/companies';
import { dateFormat, validateSecret, validateUid } from '../../../services/util';
import Logo from '../../../assets/logo.png';
function RenderLine({ question, companyId, deviceId, secret, companyuid }) {

    return (
        <tr key={question.id}>
            <td>
                <Link to={`/questionsforanswer/detail/${companyId}/${question.id}/${deviceId}/companyuid/${companyuid}/secret/${secret} `}>{question.description}</Link>
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

function RenderTable({ questions, companyId, deviceId, secret, companyuid }) {
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
                {questions.map((item) => <RenderLine key={item.id} question={item} companyId={companyId} deviceId={deviceId} secret={secret} companyuid={companyuid} />)}
            </tbody>
        </Table>
    )
}

function RenderEmptyRow({ mensagem }) {
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
        const { params: { companyId, deviceId, secret, companyuid } } = this.props.match;
        /* Caso o secret não seja o mesmo que foi enviado pelo APP Perguntador, redireciona para a página de erro */
        if (!validateSecret(secret)) {
            this.props.history.push(`/questionsforanswer/${companyId}`);
        }
        /* Valida se o unique id que está vindo da requisição é o último que foi gerado para a url do qr code da company */
        if (! await validateUid(companyId, companyuid)) {
            this.props.history.push(`/questionsforanswer/${companyId}`);
        }
        await this.getCompanyName();
        try {
            const result = await questionsService.getQuestionsForAnswer(companyId, deviceId);
            this.setState({
                isLoading: false,
                questions: result
            });
        } catch (error) {
            console.log('componentDidMount ' + error);
        }
    }

    render() {
        const { isLoading, questions } = this.state;
        const { params: { companyId, deviceId, secret, companyuid } } = this.props.match;
        return (
            <>
                <PageContent>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>

                        <Row>
                            <Col >
                                <img src={Logo} alt='QuestionSender' style={{ width: 200, height: 200 }} />
                            </Col>
                        </Row>
                    </div>

                    <Row>

                        <Container>
                            <BoxForm>
                                <Row>
                                    <Col>
                                        <h3>Perguntas</h3>
                                    </Col>
                                </Row>
                                <p>Listagem de todas as perguntas válidas a serem respondidas de {isLoading ? (null) : this.state.companyName}.</p>
                                {!isLoading && <RenderTable questions={questions} companyId={companyId} deviceId={deviceId} secret={secret} companyuid={companyuid} />}
                            </BoxForm>
                        </Container>


                    </Row>

                    <Footer text="Clique em uma pergunta para visualizar as alternativas e responder." />
                </PageContent>
            </>
        )

    }
}

export default QuestionsForAnswerList;