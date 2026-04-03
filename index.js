import app from "./src/main.js";


async function StartServer() {
    app.listen(8000,()=>{
        console.log("Server running on http://localhost:8000/");
    })
}


StartServer()