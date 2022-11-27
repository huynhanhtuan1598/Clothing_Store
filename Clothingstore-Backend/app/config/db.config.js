const config = {
    user: 'sa',
    password: '123',
    server: 'ADMIN',
    database: 'DB_ClothingWebsite',
    options: {
        encrypt: true,
        trustedconnection: true,
        enableArithAbort: true,
        instancename: 'SQLEXPRESS'
    },
    PORT: 1433
}

module.exports = config;