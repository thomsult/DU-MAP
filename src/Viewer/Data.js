//import Helios from "../data/helios.json" assert { type: "json" };
//const Helios = require("../data/helios.json")

async function GetAllData(){
   const fetcher = await fetch('./data/helios.json').then(response => {
      return response.json();

    }).catch((error)=>console.log(error))
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


function GetMoon(Planete,Helios) {
  if(Helios){
  ///console.log(Planete,Helios)
  const Sat = Planete.satellites;
  return Sat
    ? Sat.map((id) => {
      //console.log(id)
        const HeliosArray = Object.values(Helios);
        const Moon = HeliosArray.filter((el) => {
          return el.type[0].includes("Moon") ? el : null;
        });
        return Moon.find((items) => items.id === id);
      })
    : null;
  }
}



function FindBody(BodyId){
  return GetAllData().then((helios)=>{
    const HeliosArray = Object.values(helios)
    return HeliosArray.find((body)=>body.id === parseInt(BodyId))
  })
}
export {GetAllData, GetPlanete, GetMoon,FindBody };
