# Conway's Game of Life

A Typescript implementation of the [Conway's Game of Life](https://conwaylife.com/wiki/Conway%27s_Game_of_Life) using [PixiJS](https://github.com/pixijs/pixijs) for WebGL support.

Includes a nice control panel so users can change parameters like cell color or simulation speed but that can also be changed by the developer in `config.json` according to the schema below:

- **rowCount:** _number_: How many rows will be rendered
- **colCount:** _number_: How many columns will be rendered
- **containerBackgroundColor:** string: Hex string for the background color of the grid
- **cellSize:** _number_: Cell dimensions in pixels
- **cellLineWidth:** _number_: Cell border width in pixels
- **cellLineColor:** _string_: Hex string for the color of the cell's border
- **cellBackgroundColor:** _string_: Hex string for the color of the cell's background
- **randomAliveChance:** _number_: The % chance of a cell coming alive when clicking 'Random'
- **simulationSpeed:** _number_: Frequency of cell status updates. Controls how many frames will be skipped in between each update
