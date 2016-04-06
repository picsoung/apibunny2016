Router.map(function () {
  this.route('levels.index', {
    path: '/levels',
    template: 'levelsIndex'
  });

  this.route('levels.new', {
    path: '/levels/new',
    template: 'levelsNew'
  });
})
