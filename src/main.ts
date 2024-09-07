import Cell from "./models/point";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");
const info = document.querySelector<HTMLDivElement>("#info");
const startBtn = document.querySelector<HTMLDivElement>("#startBtn");
const stopBtn = document.querySelector<HTMLDivElement>("#stopBtn");
const resetBtn = document.querySelector<HTMLDivElement>("#resetBtn");


const W = 20;
const H = 20;
const frame = 250;

let frameInterval: number | undefined;
let cells: Cell[] = [
  new Cell(5, 5),
  new Cell(6, 6),
  new Cell(5, 6),
  new Cell(6, 7),
  new Cell(8, 8),
];
let last: Cell[] = [];
let gen = 0;

const toggleCell = (c: any) => {
  const cds = (c.target.id as string).split("-");
  const pt = new Cell(+cds[0], +cds[1]);
  const exCll = cells.find((c) => c.x === pt.x && c.y === pt.y);

  if (exCll) {
    cells = cells.filter((c) => c !== exCll);
  } else {
    cells.push(pt);
  }
  render();
};

const render = () => {
  if (app) {
    app.innerHTML = "";
    info!.innerHTML = ` gen: ${gen.toString()} ,  num: ${cells.length}`;
    for (let y = 1; y <= H; y++) {
      const row = document.createElement("div");
      row.classList.add("grid-row");
      app?.appendChild(row);
      for (let x = 1; x <= W; x++) {
        const cell = document.createElement("div");
        cell.id = `${x}-${y}`;
        cell.setAttribute("x", x.toString());
        cell.setAttribute("y", y.toString());
        cell.classList.add("grid-cell");
        if (cells.some((c) => c.x === x && c.y === y)) {
          cell.classList.add("cell-alive");
        }
        cell.onclick = toggleCell;

        row?.appendChild(cell);
      }
    }
  }
};

const start = () => {
  frameInterval = setInterval(calcFrame, frame);
};

function calcFrame() {
  if (cells.length && JSON.stringify(cells) !== JSON.stringify(last)) {

    last = cells;
    gen++;
    const cellsCp = [...cells];
    const survivedCells: Cell[] = [];
    const newCells: Cell[] = [];
    cellsCp.forEach((cp) => {
      const nrNbrs = getNumberNbrs(cp);
      if (nrNbrs >= 2 && nrNbrs <= 3) {
        survivedCells.push(cp);
      }
      getNewCellsCand(cp, newCells);
    });
    cells = [...survivedCells, ...newCells];
    render();
  }
}

function getNumberNbrs(cl: Cell) {
  const nbs = cells.filter(
    (c) =>
      (c.x === cl.x - 1 && c.y === cl.y - 1) ||
      (c.x === cl.x - 1 && c.y === cl.y) ||
      (c.x === cl.x - 1 && c.y === cl.y + 1) ||
      (c.x === cl.x + 1 && c.y === cl.y - 1) ||
      (c.x === cl.x + 1 && c.y === cl.y) ||
      (c.x === cl.x + 1 && c.y === cl.y + 1) ||
      (c.x === cl.x && c.y === cl.y + 1) ||
      (c.x === cl.x && c.y === cl.y - 1)
  );
  return nbs.length;
}

function getNewCellsCand(cl: Cell, newClsToComp: Cell[]) {
  const nbs = [
    new Cell(cl.x - 1, cl.y - 1),
    new Cell(cl.x - 1, cl.y),
    new Cell(cl.x - 1, cl.y + 1),
    new Cell(cl.x, cl.y - 1),
    new Cell(cl.x, cl.y + 1),
    new Cell(cl.x + 1, cl.y + 1),
    new Cell(cl.x, cl.y),
    new Cell(cl.x - 1, cl.y - 1),
  ];
  const newNbs = nbs.filter(
    (n) =>
      !newClsToComp.some((cp) => cp.x === n.x && cp.y === n.y) &&
      !cells.some((cp) => cp.x === n.x && cp.y === n.y)
  );
  newNbs.forEach((nn) => {
    const numberOfNbsNewCell = getNumberNbrs(nn);
    if (numberOfNbsNewCell === 3) newClsToComp.push(nn);
  });
}

const clear = () => {
  if (frameInterval) {
    clearInterval(frameInterval);
  }
};

startBtn!.onclick = start;
stopBtn!.onclick = clear;
resetBtn!.onclick = () => {
  clear();
  cells = [];
  last = [];
  gen = 0;
  render();
};
render();
