var fs = require('fs');
var swig  = require('swig');
var _ = require('underscore')

//load maze
var maze = JSON.parse(fs.readFileSync('./data/maze.json', 'utf8'));
console.log(maze.title)

generateCellFile = function(cellInfos){
  return swig.renderFile('./cell_tpl.aiml', {
      cell_number: cellInfos.id,
      cardinals: _.map(cellInfos.exits,function(num){return num.cardinal}),
      directions: cellInfos.exits,
      puzzle: "" || cellInfos.puzzle,
      clue: "" || cellInfos.clue,
      solution: "" || cellInfos.solution,
      type: "" || cellInfos.type
  });
}

maze.cells.forEach(function(cell){
  var render = generateCellFile(cell)
  fs.writeFile("./data/cell_"+cell.id+".aiml", render, function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("The file was saved!");
  });
})
