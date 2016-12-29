module.exports = {
  name: 'happnerexampl',
  datalayer: {
    host: 'localhost',
    port: 6060,
    persist: false,
    secure: false,
  },
  modules: {
    test_component: {
      path: 'test_component'
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
