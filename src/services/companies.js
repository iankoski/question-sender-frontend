import baseAPI from './api';
import baseURLs from '../configs/baseURLs';
import axios from 'axios';

class CompaniesService{
    constructor(){
        this.api = baseAPI(baseURLs.API_COMPANIES);
    }
    /*User model contém as informações do usuário*/ 
    async signup(userModel){
        /* Faz o POST para a api e retorna o resultado para o front 
         * Sign Up no caso*/
        try{
            const result = await this.api.post('companies', userModel);
            return result;
        }catch(error){
            if (error.response && error.response.status === 403){
                throw error.response.data;
            }
            console.log(`companiesService.signup ${error}`);
        }        
    }
    /* Faz o POST para a API fazer o LOGIN */
    async login(userName, password){
        /*const result = axios.post('http://192.168.0.103:5001/companies/login', {
            userName, password
        });*/
        
        const result = await this.api.post('/companies/login', {
            userName, password
        });
        return result;
    }
    async set(company){
        const result = await this.api.post('/companies/set', {
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

    async getCompanyName(id){
        const result = await this.api.get('/companies/companyname/'+id);
        return result.data;
    }

    async getCompanyUid(id){
        const result = await this.api.get('/companies/companyuid/'+id);
        return result.data;        
    }
}

export default CompaniesService;