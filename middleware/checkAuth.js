var jwt = require('jsonwebtoken');
var jwkToPem = require('jwk-to-pem');
var fetch = require('node-fetch');

const checkAuth = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const token = req.headers.authorization.split(' ')[1];
         // split the token from the header
    // First need to find out which key id is being used, we can get this from the header
    let d = jwt.decode(token,{complete:true});

    // Retreive the public keys from google
    if (d){
        let kid = d.header['kid'];
        data = await fetch('https://www.googleapis.com/oauth2/v3/certs');
        certs = await data.json();

        // Find the correct key
        let key = certs.keys.filter( c => c.kid == kid );

        // we now need to convert the certificate to pem format
        let pem = jwkToPem(key[0]);

        // We use the PEM cert to verify the token is signed by google
        try {
        let result = await jwt.verify(token, pem);
        console.log(result);
            next();
        } catch (e) {
            res.status(401).send('Unauthorized');
            console.log(e);
        return JSON.parse(`{ "${e.name}": "${e.message}"}`);
        }
        }
        else {
        res.status(401).send('Unauthorized');
        }
    }
    else {
        return res.status(401).json({Error: "Unauthorized"});
    }
    
};

module.exports = checkAuth;