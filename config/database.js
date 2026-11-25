const {Sequelize,DataTypes} = require("sequelize");
const db = new Sequelize('ignyte-dev','postgres','postgres',{
         host: 'localhost',
         port:5434,
         dialect:"postgres"
    });

 (async function connect(){
    try {

    await db.authenticate();
    
} catch (error) {
    console.log("ERR:",error)
}
 })()

module.exports = {db,DataTypes};