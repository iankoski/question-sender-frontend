import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import Logo from '../../../assets/logo.png';
import { BoxContent } from '../../../shared/styles';
import { withRouter } from 'react-router-dom';
import QRCodeGenerator from '../../../services/util';

import Footer from '../../../shared/footer';
import { PageContent } from '../../../shared/styles';

class QrCodeDetail extends React.Component {
    state = {
        qrcode: '',
        isLoading: true
    };

    async componentDidMount() {
        try {
            const { params: { qrcode } } = this.props.match;
            this.setState({
                qrcode: qrcode,
                isLoading: false
            })

        } catch (error) {
            if (error.response && error.response.status === 401) {
                let errorAuth = 'Sua sessão expirou, faça o login novamente';
                this.props.history.push(`/errorAuth/${errorAuth}`);
            }
        }
    }

    render() {
        const { qrcode, isLoading } = this.state;
        return (
            <>
                <PageContent>

                    <Container >
                        <Row className="justify-content-md-center" >
                            <Col xs={12} md={6}>
                                <BoxContent>
                                    <img src={Logo} alt='QuestionSender' />
                                </BoxContent>
                            </Col>
                        </Row>
                    </Container>

                </PageContent>
                <div className="d-flex justify-content-center">
                    <Row  >
                        <Col xs={12} md={6}>
                            <QRCodeGenerator urlQrCode={isLoading ? (null) : qrcode}></QRCodeGenerator>
                        </Col>
                    </Row>
                </div> 
                <Footer text="Imprima ou exiba o QR Code em uma tela para que as perguntas válidas possam ser respondidas" />
            </>
        )
    }
}

export default withRouter(QrCodeDetail);