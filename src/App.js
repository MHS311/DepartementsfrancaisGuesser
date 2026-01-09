import './App.css';
import  React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import franceGeo from "./departements-fr.geojson";
import GuessLine from './GuessLine.js';
import pointOnSurface from "@turf/point-on-surface";

function App() {
  const [selected, setSelected] = useState(null);
  const [gamemode,setGamemode] = useState("infinite");
  const [guesses, setGuesses] = useState([]);
  const [hints, setHints] = useState([]);
  const [centre, setCentre] = useState({});
  const [centreReverse, setCentreReverse] = useState({});
  const [ingame, setIngame] = useState(false);
  const [locateCode, setLocateCode] = useState(null);

  window.centre = centre;
  window.centreReverse = centreReverse;
  useEffect(()=>{
    fetch(franceGeo)
      .then((res) => res.json())
      .then((data) => {
        const sortedDepartments = data.features.sort((a, b) => a.properties.code < b.properties.code ? -1 : 1);
        setGuesses(sortedDepartments);
        setCentre(sortedDepartments.reduce((acc, dep) => {
          acc[dep.properties.code] = {loc:pointOnSurface(dep.geometry), dep:dep.properties.code};
          return acc;
        }, {}))
        setCentreReverse(sortedDepartments.reduce((acc, dep) => {
          acc[dep.properties.code] = {loc:pointOnSurface(dep.geometry), dep:dep.properties.code};
          return acc;
        }, {}))
      })
  }, [])

  const handleSelect = (dep) => {
    if (ingame) {
      if (!(locateCode === null)) {
        if (locateCode in centre) {
          setCentreReverse(()=>{
            const temp = centreReverse;
            delete temp[centre[locateCode].dep]
            return temp;
          })
        }
        setCentre({...centre, [locateCode]: {loc:pointOnSurface(dep.geometry), dep: dep.properties.code}});

        setCentreReverse({...centreReverse, [dep.properties.code]:{loc:pointOnSurface(dep.geometry), dep:locateCode}});
        setLocateCode(null);
      }
    }
    setSelected(dep.properties.nom);
  };

  const handleDepartementHover = (dep) => {
  };

  const handlePlayButton = (gamemode) => {
    const hintsArray = Array.from({ length: 101 }, () => Math.floor(Math.random() * 3));
    if (!ingame) {
      if (gamemode === "classical"){
        fetch(franceGeo)
          .then((res) => res.json())
          .then((data) => {
            setGuesses(data.features.sort(() => Math.random() - 0.5).slice(0, 10));
            setHints(hintsArray.slice(0, 10));
          });
      } else if (gamemode === "linear"){
        fetch(franceGeo)
          .then((res) => res.json())
          .then((data) => {
            setGuesses(data.features.sort((a,b) => a.properties.code < b.properties.code ? -1 : 1));
            setHints(Array.from({ length: 101 }, () => 0));
          });
      } else if (gamemode === "infinite"){
        fetch(franceGeo)
          .then((res) => res.json())
          .then((data) => {
            setGuesses(data.features.sort(() => Math.random() - 0.5));
            setHints(hintsArray);
          });
      };
      setIngame(true);
      setCentre({});
      setCentreReverse({});
      setSelected(null);
    }
  };

  const handleAbandonButton = () => {
    if (ingame) {
      fetch(franceGeo)
        .then((res) => res.json())
        .then((data) => {
          const sortedDepartments = data.features.sort((a, b) => a.properties.code < b.properties.code ? -1 : 1);
          setGuesses(sortedDepartments);
          setCentre(sortedDepartments.reduce((acc, dep) => {
          acc[dep.properties.code] = {loc:pointOnSurface(dep.geometry), dep:dep.properties.code};
            return acc;
          }, {}))
          setCentreReverse(sortedDepartments.reduce((acc, dep) => {
            acc[dep.properties.code] = {loc:pointOnSurface(dep.geometry), dep:dep.properties.code};
            return acc;
          }, {}))
        })
    }
    setIngame(false);
    setSelected(null);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h3>DépartementsfrançaisGuesser</h3>
      </header>
      <main>
        <div className="config">
          <fieldset>
            <legend>Game mode :</legend>
            <div>
              <input type="radio"
                     id="infinite"
                     name="gamemode"
                     value="infinite"
                     onChange={(e)=>setGamemode(e.target.value)}
                     checked={gamemode==="infinite"} />
              <label htmlFor="infinite">Infini</label>
            </div>

            <div>
              <input type="radio"
                     id="classical"
                     name="gamemode"
                     value="classical"
                     onChange={(e)=>setGamemode(e.target.value)}
                     checked={gamemode==="classical"} />
              <label htmlFor="classical">Classique (10 départements)</label>
            </div>

            <div>
              <input type="radio"
                     id="linear"
                     name="gamemode"
                     value="linear"
                     onChange={(e)=>setGamemode(e.target.value)}
                     checked={gamemode==="linear"} />
              <label htmlFor="linear">Linéaire</label>
            </div>
          </fieldset>
          <button onClick={()=>handlePlayButton(gamemode)} >Play</button>
          <button onClick={()=>handleAbandonButton(gamemode)} >Abandon</button>
        </div>
        <div className="table-container">
          <table className="table-input" border="1" cellPadding="5" cellSpacing="0">
            <thead>
              <tr>
                <td className="code" >Numéro</td>
                <td className="name">Département</td>
                <td className="chef-lieu">Chef-lieu</td>
                <td className="locate">{ingame ? "Placer" : "Trouver"}</td>
              </tr>
            </thead>
            {ingame ? (
              <tbody>
                {guesses.map((guess,index) => (
                  <GuessLine key={index}
                             guess={guess}
                             given={hints[index]}
                             ingame={ingame}
                             setSelected={setSelected}
                             setLocateCode={setLocateCode}/>
                ))}
              </tbody>)
              :(
              <tbody>
                {guesses.map((guess,index) => (
                  <GuessLine key={index}
                             guess={guess}
                             given={-1}
                             ingame={ingame}
                             setSelected={setSelected}
                             setLocateCode={setLocateCode}/>
                ))}
              </tbody>)
            }
          </table>
        </div>
        <ComposableMap 
          projection="geoMercator"
          projectionConfig={{
            scale: 3000,                // zoom sur la France
            center: [2.2137, 46.2276],  // coordonnées du centre de la France
          }}
          width={800} height={800}
          className="france-map">
          <Geographies geography={franceGeo}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  className={"geography"
                    + (ingame ? (geo.properties.code in centreReverse ? (centreReverse[geo.properties.code].dep === geo.properties.code ? " correct" : " incorrect") : "") : (selected === geo.properties.nom ? " locate" : ""))}
                  geography={geo}
                  id={"dep-" + geo.properties.code}
                  onClick={()=>handleSelect(geo)}
                  onMouseEnter={()=>handleDepartementHover(geo)}
                />
              ))
            }
          </Geographies>
          {(Object.keys(centre).length>0) && (
            Object.keys(centre).map((marker, index)=> {
              return (
                <Marker key={index} coordinates={centre[marker].loc.geometry.coordinates}>
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={14}
                    fontWeight="bold"
                  >
                    {marker}
                  </text>
                </Marker>
              )})
          )}

        </ComposableMap>
      </main>
    </div>
  );
}

export default App;
