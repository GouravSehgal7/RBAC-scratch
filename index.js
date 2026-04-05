import app from "./src/main.js";
import { swaggerSpec } from "./docs/swagger.js";
import swaggerUi from "swagger-ui-express";
async function StartServer() {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.listen(8000,()=>{
        console.log("Server running on http://localhost:8000/ \nSwagger running on http://localhost:8000/api-docs");
    })
}


StartServer()