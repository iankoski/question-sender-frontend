import React from 'react';
import Header from '../../../shared/header';
import Footer from '../../../shared/footer';
import { PageContent, BoxForm } from '../../../shared/styles';
import { Container, Table, Row, Col } from 'react-bootstrap';
import { Link, useRouteMatch } from 'react-router-dom';
import NewsService from '../../../services/news';
import { dateFormat } from '../../../services/util';

function RenderLine({ news }) {
    const { url } = useRouteMatch();
    console.log('teste ' + url + 'add/' + news.id);
    return (

        <tr key={news.id}>
            <td>
                <Link to={`${url}/add/${news.id}`}>{news.title}</Link>
            </td>

            <td>
                {news.description}
            </td>
            <td>
                {dateFormat(news.startDate, 'dd/MM/yyyy')}
            </td>
            <td>
                {dateFormat(news.endDate, 'dd/MM/yyyy')}
            </td>
        </tr>
    )
}

function RenderTable({ news }) {

    return (

        <Table responsive striped bordered hover size="sm">
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Descrição</th>
                    <th>Data Início</th>
                    <th>Data Fim</th>
                </tr>
            </thead>
            <tbody>
                {news.length === 0 && <RenderEmptyRow mensagem="Nenhuma novidade adicionada ao quadro" />}
                {news.map((item) => <RenderLine key={item.id} news={item} />)}
            </tbody>
        </Table>
    )
}

function RenderEmptyRow() {
    return (
        <tr>
            <td colSpan='3'>Nenhuma notícia cadastrada</td>
        </tr>
    )
}

class News extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            news: [],
            text: ''
        }
    }

    async componentDidMount() {
        const newsService = new NewsService();
        try {
            const result = await newsService.getAll();

            this.setState({
                isLoading: false,
                news: result,
            });
        } catch (error) {
            if (error.response && error.response.status === 401) {
                let errorAuth = 'Sua sessão expirou, faça o login novamente';
                this.props.history.push(`/errorAuth/${errorAuth}`);
            }
        }
    }

    render() {
        const { isLoading } = this.state;
        return (
            <>
                <Header />
                <PageContent>
                    <Container>
                        <BoxForm>
                            <Row>
                                <Col>
                                    <h3>Notícias</h3>
                                </Col>
                                <Col>
                                    <Link className='btn btn-success float-end' to='/news/add'>Adicionar notícia</Link>
                                </Col>
                            </Row>
                            <p>Relação de notícias cadastradas.</p>
                            {!isLoading && <RenderTable news={this.state.news} />}
                        </BoxForm>
                    </Container>

                </PageContent>
                <Footer text="Listagem de todas as notícias adicionadas ao quadro. Clique em uma notícia para editá-la e ver mais opções." />
            </>
        )

    }
}

export default News;