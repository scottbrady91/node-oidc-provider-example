const express = require('express');
const Provider = require('oidc-provider');

const app = express();

const clients = [{
    client_id: 'test_implicit_app',
    grant_types: ['implicit'],
    response_types: ['id_token'],
    redirect_uris: ['https://testapp/signin-oidc'],
    token_endpoint_auth_method: 'none'
},
{
    client_id: 'test_oauth_app',
    client_secret: 'super_secret',
    grant_types: ['client_credentials'],
    redirect_uris: [],
    response_types: [],
}];

const oidc = new Provider('http://localhost:3000', {
    claims: {
        address: ['address'],
        email: ['email', 'email_verified'],
        phone: ['phone_number', 'phone_number_verified'],
        profile: ['birthdate', 'family_name', 'gender', 'given_name', 'locale', 'middle_name', 'name',
            'nickname', 'picture', 'preferred_username', 'profile', 'updated_at', 'website', 'zoneinfo']
    },
    scopes: ['api1'],
    features: {
        clientCredentials: true,
        introspection: true,
        sessionManagement: true
    },
    async findById(ctx, id) {
        return {
            accountId: id,
            async claims() { return { sub: id }; },
        };
    }
});

// no stores configured, all in-memory (dev only)
oidc.initialize({ clients }).then(function () {
    app.use('/', oidc.callback);
    app.listen(3000);
});