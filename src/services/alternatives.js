import baseAPI from './api';
import baseURLs from '../configs/baseURLs';

class AlternativesService {
    constructor() {
        /* Endereço da API de perguntas */
        this.api = baseAPI(baseURLs.API_ALTERNATIVES);
    }
    /* Como o result retorna vários dados do response, aqui usaremos apenas os dados do contato mesmo */
    async getAll() {
        const result = await this.api.get('/alternatives/company');
        return result.data;
    }

    async getOne(alternativeId) {
        const result = await this.api.get(`alternatives/${alternativeId}`);
        console.log(result);
        return result.data;
    }

    async add(alternativeDescription, questionId) {
        try {
            console.log('questionId: ' + questionId);
            var alternativesList = [];
            alternativeDescription.map(item => {
                let alternative = {description: item, questionId: questionId};
                alternativesList.push(alternative);
            });            
            console.log(alternativesList);
            const result = await this.api.post('alternatives', alternativesList);
            return result;
        } catch (error) {
            console.log(`addAlternative error: ${error}`);
        }
    }

    async set(alternativeModel, alternativeId) {
        try {
            const result = await this.api.patch(`alternatives/${alternativeId}`, alternativeModel);
            return result;
        } catch (error) {
            console.log(`setAlternative error: ${error}`);
        }
    }

    async delete(alternativeId) {
        const result = await this.api.delete(`alternatives/${alternativeId}`);
        return result;
    }
}
export default AlternativesService;