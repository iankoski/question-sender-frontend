import React from 'react';
import Header from '../../../shared/header';
import { PageContent } from '../../../shared/styles';
import { Container, Button, Form, Alert, Row, Col, FormGroup } from 'react-bootstrap';
import QuestionsService from '../../../services/questions';
import { withRouter, Link } from 'react-router-dom';

class QuestionAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            startDate: '',
            endDate: '',
            error: '',
            isLoading: false
          
        } 
    }

    handleSave = async(event) => {
        event.preventDefault();
        const{ description, startDate, endDate} = this.state;

        if (!description || !startDate || !endDate){
            this.setState({error: "Informe todos os campos para adicionar a pergunta"});
        } else {
            try{
                const service = new QuestionsService();
                await service.add({description, startDate, endDate});
                /* Retorna o usuário para a tela anterior */
                this.props.history.push('/questions');
            }catch(error){
                this.setState({error: "Ocorreu um erro durante a criação da pergunta"});
            }
        };
    }

    renderError = () => {
        const {error} = this.state;
        return (
            <Alert variant="danger">
                {error}
            </Alert>
        )
    }

    render() {
        
        return (
            <>
                <Header />
                <PageContent>
                    <Container>
                        <Row>
                            <Col>
                                <h3>Adicionar Pergunta</h3>
                                <p>Informe todos os campos para adicionar a pergunta</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6} sm={12}>
                                {this.state.error && this.renderError()}
                                <Form onSubmit={this.handleSave}>
                                    <Form.Group>
                                        <Form.Label>Descrição: </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Digite a descrição da pergunta"
                                            onChange = {e => this.setState({description: e.target.value})}>

                                        </Form.Control>
                                    </Form.Group>                                    
                                        
                                    <Form.Group controlId="startDate">
                                        <Form.Label>Data Início: </Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder="Data Início"
                                            name="startDate"
                                            onChange = {e => this.setState({startDate: new Date(e.target.value)})}>
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId="endDate">
                                        <Form.Label>Data Fim: </Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder="Data Fim"                                            
                                            name="startDate"
                                            onChange = {e => this.setState({endDate: e.target.value})}>
                                        </Form.Control>
                                    </Form.Group>
                                    <br/>
                                    <Button className='btn btn-success' variant="primary" type="submit" >Adicionar Pergunta</Button>
                                    <Link className="btn btn-link" to="/questions">Voltar</Link>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                </PageContent>
            </>
        )
    }
}

export default withRouter(QuestionAdd);