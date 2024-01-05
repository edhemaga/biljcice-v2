const MYSQL_HOST = process.env.MYSQL_HOST || "localhost";
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || "biljcice";
const MYSQL_USER = process.env.MYSQL_HOST || "root";
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || "admin";

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.SERVER_PORT || 3306;

const MYSQL = {
    host: MYSQL_HOST,
    database: MYSQL_DATABASE,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD
}

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
};

const config = {
    mysql: MYSQL,
    server: SERVER
};

export default config;