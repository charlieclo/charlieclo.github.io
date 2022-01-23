const portfolio = {
  namespaced: true,
  state: {
    navigations: [
      {
        url: '/',
        name: 'Home',
        type: 'Basic',
        icon: 'HomeOutline',
        order: 2
      },
      {
        url: '/experiences',
        name: 'Experiences',
        type: 'Basic',
        icon: 'CollectionOutline',
        order: 1
      },
      {
        url: '/projects',
        name: 'Projects',
        type: 'Basic',
        icon: 'TerminalOutline',
        order: 3
      },
      {
        url: '/hello',
        name: 'Say Hello',
        type: 'Button',
        icon: 'HandOutline'
      }
    ]
  },
  getters: {
    getNavigations (state) {
      return state.navigations
    }
  }
}

export default portfolio