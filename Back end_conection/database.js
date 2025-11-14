const sql = require('mssql');

//Configuração para Windowns Authentication
const config = {
    sever: "DESKTOP-B4JK7O0\\SQLEXPRESS",
    database: "Acessmap_DB",
    options: {
        encrypt: false,
        trustSeverCertificate: true
    },
    authentication: {
        type: "ntlm",
        options: {
            domain: "",
            userName: "",
            passWord: ""
        }
    }
};

async function getConnection() {
    try {
        const pool = await sql.connect(confing);
        console.log("Conectado ao SQL Server com sucesso!");
        return pool;
    } catch (error) {
        console.error("Algo deu errado ao tentar conectar com SQL Sever: ")
        throw error;
    }
}

module.exports = {getConnection};