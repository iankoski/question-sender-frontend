import baseAPI from './api';
import baseURLs from '../configs/baseURLs';

class NewsService {
    constructor() {
        /* Endereço da API de perguntas */
        this.api = baseAPI(baseURLs.API_NEWS);
    }
    /* Como o result retorna vários dados do response, aqui usaremos apenas os dados do contato mesmo */
    async getAll() {
        const result = await this.api.get(`/news/company`);
        return result.data;
    }

    async getOne(newId) {
        const result = await this.api.get(`news/${newId}`);
        return result.data;
    }

    async add(newModel) {
        try {
            const result = await this.api.post('news', newModel);
            return result.data;
        } catch (error) {
            console.log(`addNew error: ${error}`);
        }
    }

    async set(newModel, newId) {
        try {
            const result = await this.api.patch(`news/${newId}`, newModel);
            return result.data;
        } catch (error) {
            console.log(`setNew error: ${error}`);
        }
    }

    async delete(newId) {
        const result = await this.api.delete(`news/${newId}`);
        return result;
    }

    async getNewsByDate(companyId) {
        try {
            const result = await this.api.get(`/news/date/${companyId}`);         
            return result.data;
        } catch (error) {
            console.log(`getNewsByDate ${error}`);
        }
    }
}
export default NewsService;