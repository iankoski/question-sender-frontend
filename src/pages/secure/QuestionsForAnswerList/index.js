import React from 'react';
import Footer from '../../../shared/footer';
import { PageContent, BoxForm } from '../../../shared/styles';
import { Container, Table, Row, Col, Tab, Tabs } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import QuestionsService from '../../../services/questions';
import NewsService from '../../../services/news';
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

function RenderNew({ n }) {

    return (
        <PageContent key={n.id}>
            <Row>
                <Col>
                    <h4>{n.title}</h4>
                </Col>
                <Col>
                    <p>Data: {dateFormat(n.startDate, 'dd/MM/yyyy')}</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    {n.description}
                </Col>
            </Row>
        </PageContent>
    )
}

function RenderNews({ news }) {

    return (
        <Table responsive striped borderless hover size="sm">
            <tbody>
                {news.length === 0 && <RenderEmptyRow mensagem="Nenhuma notícia no feed" />}
                {news.map((item) => <RenderNew key={item.id} n={item} />)}
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
            deviceId: 0,
            news: []
        }
    }

    async getCompanyName() {
        try {
            const service = new CompaniesService();
            const { params: { companyId } } = this.props.match;
            const companyName = await service.getCompanyName(companyId);
            this.setState({ companyName: companyName.companyName, companyId: companyId });
        } catch (error) {
            console.log('getCompanyName: ' + error);
        }
    }

    async componentDidMount() {
        const questionsService = new QuestionsService();
        const newsService = new NewsService();
        const { params: { companyId, deviceId, secret, companyuid } } = this.props.match;
        /* Caso o secret não seja o mesmo que foi enviado pelo APP Perguntador, redireciona para a página de erro */
        if (!validateSecret(secret)) {
            this.props.history.push(`/questionsforanswer/error/${companyId}`);
        }
        /* Valida se o unique id que está vindo da requisição é o último que foi gerado para a url do qr code da company */
        if (!validateUid(companyId, companyuid)) {
            this.props.history.push(`/questionsforanswer/error/${companyId}`);
        }
        
        this.getCompanyName();

        const questionsForAnswer = await questionsService.getQuestionsForAnswer(companyId, deviceId);
        const news = await newsService.getNewsByDate(companyId);
        this.setState({
            isLoading: false,
            questions: questionsForAnswer,
            news: news
        });

    }

    render() {
        const { isLoading, questions, news } = this.state;
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
                    <Tabs
                        defaultActiveKey="questions"
                        id="justify-tab-example"
                        className="mb-3"
                        justify>
                        <Tab eventKey="questions" title="Perguntas">
                            <Row>
                                <Container>
                                    <BoxForm>
                                        <Row>
                                            <Col>
                                                <h3>Perguntas a serem respondidas de {isLoading ? (null) : this.state.companyName}</h3>
                                            </Col>
                                        </Row>
                                        {!isLoading && <RenderTable questions={questions} companyId={companyId} deviceId={deviceId} secret={secret} companyuid={companyuid} />}
                                    </BoxForm>
                                </Container>
                            </Row>
                            <Footer text="Clique em uma pergunta para responder." />
                        </Tab>

                        <Tab eventKey="news" title="Quadro de Notícias">
                            <Row>
                                <Container>
                                    <BoxForm>
                                        <Row>
                                            <Col>
                                                <h3>Quadro de notícias de {!isLoading && this.state.companyName}</h3>
                                            </Col>
                                        </Row>
                                        <Row>
                                            {!isLoading && <RenderNews news={news} />}
                                        </Row>
                                    </BoxForm>
                                </Container>
                                <Footer text="Quadro de notícias." />
                            </Row>
                        </Tab>
                    </Tabs>

                </PageContent>
            </>
        )

    }
}

export default QuestionsForAnswerList;