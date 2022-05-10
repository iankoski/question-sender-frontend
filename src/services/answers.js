import baseAPI from './api';
import baseURLs from '../configs/baseURLs';

class AnswersService {
    constructor() {
        /* Endereço da API de perguntas */
        this.api = baseAPI(baseURLs.API_ANSWERS);
    }

    async getQuestionAnswers(questionId){
        const result = await this.api.get(`/answers/countbyquestion/${questionId}`);
        return result.data;
    }
}
export default AnswersService;