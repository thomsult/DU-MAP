//import Helios from "../data/helios.json" assert { type: "json" };
//const Helios = require("../data/helios.json")

async function GetAllData(){
   const fetcher = await fetch('https://thomsult.github.io/DU-MAP/data/helios.json').then(response => {
      return response.json();

    })
    return fetcher[0]
}




function GetPlanete(Helios) {
  var size = 1300;
  const Planete = [];
  for (let index = 1; index < size; index++) {
    if (Helios[index] !== undefined) {
      if (!Helios[index].name[0].includes("Moon")) {
        const p = Helios[index];
        Planete.push(p);
      }
    } else {
      index++;
    }
  }

  return Planete;
}


function GetMoon(array,Helios) {
  const Sat = array;
  return Sat
    ? Sat.map((id) => {
        const HeliosArray = Object.values(Helios);
        const Moon = HeliosArray.filter((el) => {
          return el.type[0]?.includes("Moon") ? el : null;
        });
        return Moon.find((items) => items.id === id);
      })
    : null;
}
export {GetAllData, GetPlanete, GetMoon };
