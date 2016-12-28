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
    }
  },
  components: {
    'test_component': {
      module: 'test_component',
      web: {
        routes: {
          static: 'app'
        }
      }
    }
  }

}
