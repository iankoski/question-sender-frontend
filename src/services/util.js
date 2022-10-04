import { useState } from 'react';
import QRCode from 'react-qr-code';
import CompaniesService from './companies';

function dateFormat(oldDate, newFormat) {
    const { format, utcToZonedTime } = require("date-fns-tz");
    const timeZone = 'Europe/London';
    const timeInBritishsbane = utcToZonedTime(oldDate, timeZone);
    return format(timeInBritishsbane, newFormat);
}

function validateNews(description, startDate, endDate, title){
    if (!description) {
        throw "Informe uma notícia válida";
    }
    if (!title){
        throw "Informe um título válido para a nóticia";
    }
    if (title.trim().length < 5 || !title || title.trim().length >= 60) {
        throw "Uma notícia deve ter entre 5 e 60 caracteres";
    } 
    if (description.trim().length < 10 || !description || description.trim().length >= 2000) {
        throw "Uma notícia deve ter entre 10 e 2000 caracteres";
    } 
    if ((startDate.getTime() !== startDate.getTime()) 
        || endDate.getTime() !== endDate.getTime()){
            throw "Informe data(s) válida(s)";
        }     
    if (!description || !startDate || !endDate) {
        throw "Informe todos os campos para adicionar ou alterar a notícia";
    }      
    if (startDate.getTime() > endDate.getTime()) {
        throw "A data que a notícia inicia deve ser menor a data que ela termina";;
    }       
}

function validateQuestionAndAlternatives(description, startDate, endDate, alternatives, sendingStatus) {

    if (!description) {
        throw "Informe uma pergunta válida";
    }
    if (description.trim().length < 10 || !description || description.trim().length >= 150) {
        throw "Uma pergunta deve ter entre 10 e 150 caracteres";
    }
    if (!description || !startDate || !endDate) {
        throw "Informe todos os campos para adicionar ou alterar a pergunta";
    }    

    if ((startDate.getTime() !== startDate.getTime()) 
        || endDate.getTime() !== endDate.getTime()){
            throw "Informe data(s) válida(s)";
        }
    if (startDate.getTime() >= endDate.getTime()) {
        throw "A data que a pergunta inicia deve ser menor a data que ela termina";;
    }
    if (alternatives.length < 2 || !alternatives ) {
        throw "Informe uma alternativa válida";
    }
    if (sendingStatus === 'alter') {
        alternatives.map((a) => {
            if (a.description.trim().length < 5 || a.description.trim().length >= 150) {
                throw "Uma alternativa válida deve ter entre 5 e 150 caracteres";
            }
        });
    }
    if (sendingStatus === 'add') {
        alternatives.map((a) => {
            console.log('5 ' + alternatives.length);
            if (a.trim().length < 5) {
                throw "Uma alternativa válida deve ter ao menos 5 caracteres";
            }
        });
    }

    return null;
}

function QRCodeGenerator(urlQrCode) {

    const [back, setBack] = useState('#FFFFFF');
    const [fore, setFore] = useState('#000000');
    const [size, setSize] = useState(200);

    return (
        <div className="QRCodeGenerator">

                {urlQrCode && (
                    <QRCode
                        title="QR Code que será lido pelos usuários que responderão as perguntas"
                        value={String(urlQrCode['urlQrCode'])}
                        bgColor={back}
                        fgColor={fore}
                        size={size === '' ? 0 : size}
                    />
                )}       
        </div>
    );
}

function validateSecret(secret){
    try{
        if (secret.trim() !== "82ad4f00-0d34-11ed-861d-0242ac120002"){
            console.log('validate secret returning false '+secret.length);
            return false;
        }
        return true;
    } catch (error) {
        console.log(`validateSecret ${error}`);
    }
    
}

async function validateUid(companyId, companyUid){
    try{
        const service = new CompaniesService();
        const uid = await service.getCompanyUid(companyId);
        if (companyUid !== uid.companyUid){
            console.log('validateUid returning false companyId '+companyId + ' companyUid '+companyUid + ' uid.companyUid '+uid.companyUid );
            return false;
        }
        return true;
    }catch(error){
        console.log(`validateUid ${error}`);
    }
}

export default QRCodeGenerator;


export { dateFormat, validateQuestionAndAlternatives, validateSecret, validateUid, validateNews };