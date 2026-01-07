import './GuessLine.js';
import { React } from "react";

function GuessLine({key, guess, given}) {
  return (
    <tr>
      <td className="code">{(given === 0 || given === -1) ? <strong>{guess.properties.code}</strong> : <input type="text" name="numero" />}</td>
      <td className="name">{(given === 1 || given === -1) ? <strong>{guess.properties.nom}</strong> : <input type="text" name="departement" />}</td>
      <td className="chef-lieu">{(given === 2 || given === -1) ? <strong>{guess.properties["chef-lieu"]}</strong> : <input type="text" name="chef_lieu" />}</td>
    </tr>
  )
}

export default GuessLine;
