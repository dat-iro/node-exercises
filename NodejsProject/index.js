luckyDraw("Joe")
  .then((res) => console.log(res))
  .then(() => luckyDraw("Caroline"))
  .then((res2) => console.log(res2))
  .then(() => luckyDraw("Sabrina"))
  .then((res3) => console.log(res3))
  .catch((err) => console.error(err));

function luckyDraw(player) {
  return new Promise((resolve, reject) => {
    const win = Boolean(Math.round(Math.random()));

    process.nextTick(() => {
      if (win) {
        resolve(`${player} won a prize in the draw!`);
      } else {
        reject(new Error(`${player} lost the draw.`));
      }
    });
  });
}