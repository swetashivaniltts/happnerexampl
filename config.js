module.exports = {
name: 'happner_demo',
  datalayer: {
    host: 'localhost',
    port: 6060,
    persist: false,
    secure: false,
  },
    modules: {
      master: {
      path: 'master'
    },
    hello_module :{
      path : 'hello'
    }
    },
  components: {
    'master': {
      startMethod: 'start',
      stopMethod: 'stop',
      module: 'master',
      web: {
             routes: {
               static: 'app'
             }
           }
},
'hello': {
  module: 'hello_module',
     web: {
       routes: {
         static: 'app'
       }
     }
   }
}

}
