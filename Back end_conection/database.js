const sql = require('mssql');

//Configuração para Windowns Authentication
const config = {
    server: "DESKTOP-B4JK7O0\\SQLEXPRESS",
    database: "Acessmap_DB",
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    },
    authentication: {
        type: "ntlm",
        options: {
            domain: "",
            userName: "",
            password: ""
        }
    }
};

async function getConnection() {
    try {
        const pool = await sql.connect(config);
        console.log("Conectado ao SQL Server com sucesso!");
        return pool;
    } catch (error) {
        console.error("Algo deu errado ao tentar conectar com SQL Sever: ", error)
        throw error;
    }
}

module.exports = {getConnection};