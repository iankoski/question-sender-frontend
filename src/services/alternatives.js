import baseAPI from './api';
import baseURLs from '../configs/baseURLs';

class AlternativesService {
    constructor() {
        /* Endereço da API de perguntas */
        this.api = baseAPI(baseURLs.API_ALTERNATIVES);
    }
    /* getAll retorna apenas alternativas de uma pergunta */
    async getAll(questionId) {
        const result = await this.api.get(`/alternatives/company/${questionId}`);
        return result.data;
    }

    async getOne(alternativeId) {
        const result = await this.api.get(`alternatives/${alternativeId}`);
        console.log(result);
        return result.data;
    }

    async add(alternativeDescription, questionId) {
        try {
            
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

    async set(alternativeModel, questionId) {
        try {
            const result = await this.api.patch(`alternatives/${questionId}`, alternativeModel);
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