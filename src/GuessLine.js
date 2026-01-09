import './GuessLine.js';
import React, { useState } from "react";

function GuessLine({ guess, given, ingame, setSelected, setLocateCode}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [prefecture, setPrefecture] = useState("");

  const handleLocateButton = () =>{
    if (ingame) {
      if (given === 0){
        setLocateCode(guess.properties.code);
      } else {
        setLocateCode(code);
      }
    } else {
      setSelected(guess.properties.nom);
    }
  }


  return (
    <tr>
      <td className={"code" + ((given === 0 || given === -1) ? "" : ((code === guess.properties.code) ? " correct" : ""))}
          onChange={(e)=>{setCode(e.target.value); console.log(e.target.value);}}>
        {(given === 0 || given === -1) ? <strong>{guess.properties.code}</strong> : <input type="text" name="numero" autocomplete="off"/>}
      </td>
      <td className={"name" + ((given === 1 || given === -1) ? "" : ((name.toLocaleUpperCase() === guess.properties.nom.toLocaleUpperCase()) ? " correct" : ""))}
          onChange={(e)=>{setName(e.target.value); console.log("target: ", e.target.value); console.log("dep: ", guess.properties.nom)}}>
          {(given === 1 || given === -1) ? <strong>{guess.properties.nom}</strong> : <input type="text" name="departement" autocomplete="off"/>}</td>
      <td className={"chef-lieu" + ((given === 2 || given === -1) ? "" : ((prefecture.toLocaleUpperCase() === guess.properties["chef-lieu"].toLocaleUpperCase()) ? " correct" : ""))}
          onChange={(e)=>{setPrefecture(e.target.value); console.log(e.target.value); console.log(guess.properties["chef-lieu"]);}}>
        {(given === 2 || given === -1) ? <strong>{guess.properties["chef-lieu"]}</strong> : <input type="text" name="numero" autocomplete="off"/>}
      </td>
      <td className="locate"
          onClick={handleLocateButton}>
        <img className="locate-img" src={require('./img/locate.png')} alt="Placer"/>
      </td>
    </tr>
  )
}

export default GuessLine;
