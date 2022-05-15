
const app = require("./app");
const PORT = process.env.PORT || '3001';
/* start listening */
app.listen(PORT, () => {
    console.log(`Listening for requests on port ${PORT}`);
})