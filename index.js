const express = require('express');

const app = express();

app.get("/", (req, resp) => {
    resp.send("Hello DevOps! App is successfully deployed on QA, staging and producion through CI/CD change in only QA !");
});


const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'APP';

app.listen(PORT, () => {
    console.info(`${APP_NAME} started on PORT ${PORT}`);
});
