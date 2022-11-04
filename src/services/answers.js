import baseAPI from './api';
import baseURLs from '../configs/baseURLs';

class AnswersService {
    constructor() {
        /* Endereço da API de perguntas */
        this.api = baseAPI(baseURLs.API_ANSWERS);
    }

    async getCountQuestionAnswers(questionId){
        const result = await this.api.get(`/answers/countbyquestion/${questionId}`);
        return result.data;
    }

    async getCountAlternativeAnswers(alternativeId){
        const result = await this.api.get(`/answers/countbyalternative/${alternativeId}`);
        return result.data;       
    }

    async getMostAnsweredAlternative(questionId){
        const result = await this.api.get(`/answers/mostanswered/${questionId}`);
        return parseInt(result.data.alternativeId);
    }    
    async sendAnswer(companyId, questionId, alternativeId, deviceId){
        const result = await this.api.post(`/answers/`, {
            companyId, questionId, alternativeId, deviceId
        });
        return result;
    }
    async getAnswersCount(alternatives){
        const result = await this.api.post('/answers/answerscount', {alternatives});
        return result;
    }
}
export default AnswersService;