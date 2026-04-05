import swaggerJSDoc from "swagger-jsdoc";
import { DEFAULTADMIN } from "../src/lib/constants.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RBAC assignment",
      version: "1.0.0",
      description: `
      ## API Documentation Notes

      ⚠️ **Default Admin Credentials**
      - Email: ${DEFAULTADMIN.defaultAdminEmail}
      - Password: ${DEFAULTADMIN.defaultAdminPass}

      for admin realated task please login as admin and use its token

      ℹ️ Please use the **Authorize** button to add your JWT token before testing protected endpoints.
      `,
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // where your docs will live
};

export const swaggerSpec = swaggerJSDoc(options);