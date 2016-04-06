var fs = require('fs');
var swig  = require('swig');
var _ = require('underscore')

//load maze
var maze = JSON.parse(fs.readFileSync('./data/maze.json', 'utf8'));
console.log(maze.title)

generateCellFile = function(cells){
  return swig.renderFile('./common_cells_tpl.aiml', {
      cells: cells
  });
}
var render = generateCellFile(maze.cells)
fs.writeFile("./data/cells.aiml", render, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
