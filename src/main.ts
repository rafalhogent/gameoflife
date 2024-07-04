import Cell from "./models/point";
import "./style.css";
// import typescriptLogo from './typescript.svg'
// import { setupCounter } from './counter'

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>

//   </div>
// `
const app = document.querySelector<HTMLDivElement>("#app");
const info = document.querySelector<HTMLDivElement>("#info");

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

const W = 20;
const H = 20;
let cells: Cell[] = [
  // new Cell(5, 5),
  // new Cell(6, 6),
  // new Cell(5, 6),
  // new Cell(6, 7),
  // new Cell(8, 8),
];
let nbsToChck: Cell[] = [];

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
        cell.innerText = `${x}-${y}`;
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
  const cellsCp = [...cells];
  const survivedCells = [];
  cellsCp.forEach((cp) => {
    const nrNbrs = getNumberNbrs(cp);
    if (nrNbrs >= 2 && nrNbrs <= 3) {
      survivedCells.push(cp)
    }
  });
};

function myTimer() {
  const d = new Date();
  if (info) {
    info.innerHTML = d.getTime().toString();
  }
}
setInterval(myTimer, 1000);

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

function getEmptyNbs(cl: Cell, copy: Cell[]) {
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
      !copy.some((cp) => cp.x === n.x && cp.y === n.y) &&
      !nbsToChck.some((cp) => cp.x === n.x && cp.y === n.y)
  );
  const nnnbsNr = newNbs.forEach(nn => {
    // getNumberNbrs()
  })
}

function removeItem<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

render();
