# APIBunny 2016 - Maze generation
![](http://apibunny.com/img/opengraph.png)

This is part of the [APIBunny](http://apibunny.com) 2016 project.

This is the part responsible to generate maze logic on [Pandorabots](http://pandorabots.com) using AIML markup language.

Maze info are listed on `data/maze.json`

# Scripts
Launch scripts with `node [file_name]` command

`generate_common_cellsfile.js` use `common_cells_tpl.aiml` template to generate the file that will be common to all the cells

`generate_maze.js` use `cell_tpl.aiml` template to generate a specific file for each individual cell.

The generated files are stored in `data` folder.

# Upload files to Pandorabots
Once files are generated you need to upload them to Pandorabots system and compile your bot.
You need to use [pb-cli](https://github.com/pandorabots/pb-cli) to do so.
I wrote a bash script to automate the upload. Check `uploadScript` and invoke it `./uploadScript`

You will also need to upload the `directions.set` file
