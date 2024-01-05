import cors from "cors";

const allowedOrigins = ['*'];

export const options: cors.CorsOptions = {
    origin: allowedOrigins
};