const express= require('express');
const bodyparser = require('body-parser');


const app = express();

app.use(bodyparser.json( ))

app.listen(3000,()=>{
console.log('started')
})