import baseAPI from './api';
import baseURLs from '../configs/baseURLs';

class CompaniesService{
    constructor(){
        this.api = baseAPI(baseURLs.API_COMPANIES);
    }
    /*User model contém as informações do usuário*/ 
    async signup(userModel){
        /* Faz o POST para a api e retorna o resultado para o front 
         * Sign Up no caso*/
        const result = await this.api.post('companies', userModel);
        return result;
    }
    /* Faz o POST para a API fazer o LOGIN */
    async login(userName, password){
        const result = await this.api.post('companies/login', {
            userName, password
        });
        return result;
    }
    async set(company){
        const result = await this.api.post('companies/set', {
            name: company.name,
            password: company.password,
            urlQrCode: company.urlQrCode
        });
        return result;
    }
    async getCompany(){
        const result = await this.api.get('/companies');
        return result.data;
    }

    async getQRCode(){
        const result = await this.api.post('/companies/newqrcode');
        return result.data;
    }
}

export default CompaniesService;