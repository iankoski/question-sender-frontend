import baseAPI from './api';
import baseURLs from '../configs/baseURLs';

class QuestionsService{
    constructor(){
        /* Endereço da API de perguntas */
        this.api = baseAPI(baseURLs.API_QUESTIONS);
    }
    /* Como o result retorna vários dados do response, aqui usaremos apenas os dados do contato mesmo */
    async getAll(){
        const result = await this.api.get('/questions/company');
        return result.data;
    }

    async getOne(questionId){
        const result = await this.api.get(`questions/${questionId}`);
        console.log(result);
        return result.data;
    }

    async add(questionModel){
        try{
            const result = await this.api.post('questions', questionModel);        
            return result;
        }catch(error){
            console.log(`addQuestion error: ${error}`);
        }
    }

    async delete(questionId){
        const result = await this.api.delete(`questions/${questionId}`);
        return result;
    }
}
export default QuestionsService;