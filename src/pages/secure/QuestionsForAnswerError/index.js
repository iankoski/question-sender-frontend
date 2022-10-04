import React from 'react';
import Footer from '../../../shared/footer';
import { PageContent, BoxForm } from '../../../shared/styles';
import { Container, Alert, Row, Col } from 'react-bootstrap';
import Logo from '../../../assets/logo.png';
import CompaniesService from '../../../services/companies';

class QuestionsForAnswerError extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionId: '',
            companyId: '',
            deviceId: '',
            companyName: '',
            error: ''
        }
    }

    /*Ciclo de vida do React: essa função será executada sempre que o componente é montado*/
    async componentDidMount() {
        try {
            const { params: { companyId } } = this.props.match;
            const service = new CompaniesService();
            
            const companyName = await service.getCompanyName(companyId);          
            this.setState({error: `Para responder as perguntas de ${companyName.companyName} acesse esse QR Code pelo APP Perguntador`});
        } catch (error) {
            console.log('componentDidMount '+error);
        }
    }

    renderError = () => {
        return (
            <Alert variant="danger">{this.state.error}</Alert>
        )
    }

    render() {

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
                                {this.state.error && this.renderError()}                                
                            </BoxForm>
                        </Col>
                    </Container>
                </PageContent>
                <Footer text="" />
            </>
        )
    }
}

export default QuestionsForAnswerError;