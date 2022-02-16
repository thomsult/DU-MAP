import Helios from "../data/helios.json";

function GetMoon(array) {
  const Sat = array;
  return Sat
    ? Sat.map((id) => {
        const HeliosArray = Object.values(Helios["0"]);
        const Moon = HeliosArray.filter((el) => {
          return el.type[0]?.includes("Moon") ? el : null;
        });
        return Moon.find((items) => items.id === id);
      })
    : null;
}

function GetPlanete() {
  var size = 1300;
  const Planete = [];
  for (let index = 1; index < size; index++) {
    if (Helios[0][index] !== undefined) {
      if (!Helios[0][index].name[0].includes("Moon")) {
        const p = Helios[0][index];
        Planete.push(p);
      }
    } else {
      index++;
    }
  }

  return Planete;
}

export { GetPlanete, GetMoon };
