import './GuessLine.js';
import React, { useState } from "react";

function GuessLine({ guess, given, ingame, setSelected, setLocateCode, centre, setCentre, centreReverse, setCentreReverse }) {
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

  const handleCodeChange = (value) => {
    setCode(value);
    if (code in centre) {
      const temp = {...centre};
      const temp2 = {...centreReverse};
      temp[value] = temp[code];
      temp2[temp[code].dep].dep = value;
      setCentreReverse(temp2);
      delete temp[code];
      setCentre(temp);
    }
  }

  const isCorrect = 
    given !== -1 && (
      given === 0 ? (
        guess.properties.code in centre ? (
          centre[guess.properties.code].dep === guess.properties.code
        ) : ""
      ) : code in centre ? 
        centre[code].dep === guess.properties.code
      : "" 
    );
  console.log(isCorrect);
  return (
    <tr>
      <td className={"code" + ((given === 0 || given === -1) ? "" : ((code === guess.properties.code) ? " correct" : ""))}
          onChange={(e)=>{handleCodeChange(e.target.value);}}>
        {(given === 0 || given === -1) ? <strong>{guess.properties.code}</strong> : <input type="text" name="numero" autoComplete="off"/>}
      </td>
      <td className={"name" + ((given === 1 || given === -1) ? "" : ((name.toLocaleUpperCase() === guess.properties.nom.toLocaleUpperCase()) ? " correct" : ""))}
          onChange={(e)=>{setName(e.target.value);}}>
          {(given === 1 || given === -1) ? <strong>{guess.properties.nom}</strong> : <input type="text" name="departement" autoComplete="off"/>}</td>
      <td className={"chef-lieu" + ((given === 2 || given === -1) ? "" : ((prefecture.toLocaleUpperCase() === guess.properties["chef-lieu"].toLocaleUpperCase()) ? " correct" : ""))}
          onChange={(e)=>{setPrefecture(e.target.value)}}>
        {(given === 2 || given === -1) ? <strong>{guess.properties["chef-lieu"]}</strong> : <input type="text" name="numero" autoComplete="off"/>}
      </td>
      <td className={"locate"
              + (isCorrect ? " correct" : "")}
          onClick={handleLocateButton}>
        <img className="locate-img" src={require('./img/locate.png')} alt="Placer"/>
      </td>
    </tr>
  )
}

export default GuessLine;
