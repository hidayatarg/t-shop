const Pool = require ('pg').Pool;
const pool = new Pool({        
      user     : 'postgres',        
      host     : 'localhost',        
      database : '101-NodeJs-MovieStore',        
      password : '**',        
      port     : 5432,    
});

module.exports = pool;