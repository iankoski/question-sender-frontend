function dateFormat(oldDate, newFormat) {
    const { format, utcToZonedTime } = require("date-fns-tz");
    const timeZone = 'Europe/London';
    const timeInBritishsbane = utcToZonedTime(oldDate, timeZone);
    return format(timeInBritishsbane, newFormat);
}

function validateQuestionAndAlternatives(description, startDate, endDate, alternatives, sendingStatus) {

    if (!description) {
        throw "Informe uma pergunta válida";
    }
    if (description.trim().length < 10 || !description) {
        throw "Uma pergunta deve ter ao menos 10 caracteres";
    }    
    if (!description || !startDate || !endDate) {
        console.log('12');
        throw "Informe todos os campos para adicionar ou alterar a pergunta";
    }
    if (startDate.getTime() >= endDate.getTime()) {
        console.log('3');
        throw "A data que a pergunta inicia deve ser menor a data que ela termina";;
    }
    if (alternatives.length < 2 || !alternatives) {
        throw "Informe uma alternativa válida";
    }
    if (sendingStatus === 'alter'){
        alternatives.map((a) => {
            console.log('4 '+alternatives.length);
            if (a.description.trim().length < 5) {
                throw "Uma alternativa válida deve ter ao menos 5 caracteres";            
            }
        });
    }
    if(sendingStatus === 'add'){
        alternatives.map((a) => {
            console.log('5 '+alternatives.length);
            if (a.trim().length < 5) {
                throw "Uma alternativa válida deve ter ao menos 5 caracteres";            
            }
        });        
    }

    return null;
}

export { dateFormat, validateQuestionAndAlternatives };