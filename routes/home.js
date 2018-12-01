const express = require('express');
const router = express.Router();
var watson = require('watson-developer-cloud');

const request = require('request');
const google = require('./google_maps');
const googleMaps = new google();




var AssistantV2 = require('watson-developer-cloud/assistant/v2');










async function calcularTrabalho() {
    console.log('Salve');
    const distanciaEduracaoCarro =  await googleMaps.directions('Rua consolaçãpo 930', 'Avenida Paulista', 'driving');
    const distanciaEduracaoBicicleta =  await googleMaps.directions('Rua consolaçãpo 930', 'Avenida Paulista', 'bicycling');
    const distanciaEduracaoPublico =  await googleMaps.directions('Rua consolaçãpo 930', 'Avenida Paulista', 'transit');
    const distanciaEduracaoAndando =  await googleMaps.directions('Rua consolaçãpo 930', 'Avenida Paulista', 'walking');
    console.log('A duração do carro é ');
    console.log(distanciaEduracaoCarro.json.routes[0].legs[0].duration.text);

    console.log('A duração do biclicleta é ');
    console.log(distanciaEduracaoBicicleta.json.routes[0].legs[0].duration.text);

    console.log('A duração do publico é ');
    console.log(distanciaEduracaoPublico.json.routes[0].legs[0].duration.text);

    console.log('A duração do andando é ');
    console.log(distanciaEduracaoAndando.json.routes[0].legs[0].duration.text);
};










var assistant = new AssistantV2({
    version: '2018-11-08',
    username: 'apikey',
    //iam_apikey: 'vmBUPgZdQrBy1vy3fFTRd9UYIg3TptYI__VMVGrpie7g',
    password: 'vmBUPgZdQrBy1vy3fFTRd9UYIg3TptYI__VMVGrpie7g',
    url: 'https://gateway-syd.watsonplatform.net/assistant/api'
  });



router.get('', (req, res) => {
    res.json({res: 'Hello, world'});
});

router.get('/bot', (req, res) => {
    console.log('eae');
    //res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var mensagem = req.query.mensagem || 'ola';
    console.log('Mensagem ' + mensagem);

    var payload = {
        assistant_id: '23da1df8-b433-45e7-8b95-bf88fc0809d8',
        context: req.body.context || '',
        input: {
            'message_type': 'text',
            'text': mensagem || 'eae',
        },
        context: {
        }
    };

    assistant.createSession({
        assistant_id: '23da1df8-b433-45e7-8b95-bf88fc0809d8',
    }, function(err, response1) {
    if (err) {
        console.error(err);
    } else{
        payload.session_id = response1.session_id;
        console.log(payload);
        console.log(JSON.stringify(response1, null, 2));
        console.log('---------------------------------------------------------------------------------------');
        console.log(payload);
        assistant.message(payload,
            function (err, response) {
                if (err) {
                    console.log('Deu errro' + err + response);
                    res.send(err);
                } else {
                    console.log('Responsta');
                    var resposta = response.output.generic[0].text;

                    //if(resposta === 'trabalho_job') {
                    //    calcularTrabalho();
                    //}else{
                        res.json({message: resposta});
                    //}
                    //res.json(response.output.text[0]);
                }
            });
    }
    });

    
    /*


    */
});

module.exports = router;