import './App.css';
import  React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
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
          acc[dep.properties.code] = {loc:adjustCentre(pointOnSurface(dep.geometry), dep.properties.code), dep:dep.properties.code, fontSize: adjustCentreSize(dep.properties.code)};
          return acc;
        }, {}))
        setCentreReverse(sortedDepartments.reduce((acc, dep) => {
          acc[dep.properties.code] = {loc:adjustCentre(pointOnSurface(dep.geometry), dep.properties.code), dep:dep.properties.code};
          return acc;
        }, {}))
      })
  }, [])
  
  const adjustCentreSize = (code) => {
    switch (code) {
      case "75":
        return 3;
      case "92":
      case "93":
      case "94":
        return 4;
      case "78":
      case "91":
        return 12;
      case "95":
        return 10;
      case "90":
        return 8;
      default:
        return 14;
    }
  }


  const adjustCentre = (centreDep, code) => {
    switch (code) {
      case "02":
        centreDep.geometry.coordinates[0]-=0.06;
        centreDep.geometry.coordinates[1]+=0.1;
        break;
      case "03":
        centreDep.geometry.coordinates[0]+=0.03;
        break;
      case "07":
        centreDep.geometry.coordinates[1]-=0.1;
        break;
      case "08":
        centreDep.geometry.coordinates[0]-=0.08;
        centreDep.geometry.coordinates[1]-=0.1;
        break;
      case "13":
        centreDep.geometry.coordinates[0]-=0.1;
        centreDep.geometry.coordinates[1]+=0.11;
        break;
      case "2A":
        centreDep.geometry.coordinates[0]+=0.02;
        break;
      case "2B":
        centreDep.geometry.coordinates[0]+=0.1;
        break;
      case "21":
        centreDep.geometry.coordinates[0]-=0.03;
        centreDep.geometry.coordinates[1]-=0.05;
        break;
      case "22":
        centreDep.geometry.coordinates[0]+=0.03;
        centreDep.geometry.coordinates[1]-=0.1;
        break;
      case "27":
        centreDep.geometry.coordinates[0]-=0.06;
        centreDep.geometry.coordinates[1]-=0.05;
        break;
      case "29":
        centreDep.geometry.coordinates[0]+=0.26;
        break;
      case "30":
        centreDep.geometry.coordinates[0]+=0.15;
        break;
      case "31":
        centreDep.geometry.coordinates[0]+=0.15;
        centreDep.geometry.coordinates[1]+=0.15;
        break;
      case "33":
        centreDep.geometry.coordinates[0]-=0.12;
        centreDep.geometry.coordinates[1]-=0.12;
        break;
      case "41":
        centreDep.geometry.coordinates[0]+=0.05;
        centreDep.geometry.coordinates[1]-=0.1;
        break;
      case "42":
        centreDep.geometry.coordinates[0]-=0.1;
        centreDep.geometry.coordinates[1]-=0.06;
        break;
      case "52":
        centreDep.geometry.coordinates[0]-=0.03;
        centreDep.geometry.coordinates[1]-=0.06;
        break;
      case "54":
        centreDep.geometry.coordinates[0]-=0.2;
        centreDep.geometry.coordinates[1]-=0.27;
        break;
      case "55":
        centreDep.geometry.coordinates[1]-=0.09;
        break;
      case "56":
        centreDep.geometry.coordinates[0]+=0.1;
        centreDep.geometry.coordinates[1]+=0.09;
        break;
      case "57":
        centreDep.geometry.coordinates[0]-=0.18;
        break;
      case "59":
        centreDep.geometry.coordinates[0]+=0.3;
        centreDep.geometry.coordinates[1]-=0.3;
        break;
      case "61":
        centreDep.geometry.coordinates[0]+=0.06;
        centreDep.geometry.coordinates[1]+=0.08;
        break;
      case "62":
        centreDep.geometry.coordinates[0]-=0.08;
        centreDep.geometry.coordinates[1]-=0.05;
        break;
      case "65":
        centreDep.geometry.coordinates[1]-=0.09;
        break;
      case "66":
        centreDep.geometry.coordinates[0]+=0.1;
        centreDep.geometry.coordinates[1]-=0.05;
        break;
      case "67":
        centreDep.geometry.coordinates[0]-=0.04;
        break;
      case "69":
        centreDep.geometry.coordinates[1]-=0.15;
        break;
      case "72":
        centreDep.geometry.coordinates[1]-=0.05;
        break;
      case "76":
        centreDep.geometry.coordinates[0]+=0.06;
        centreDep.geometry.coordinates[1]-=0.03;
        break;
      case "80":
        centreDep.geometry.coordinates[1]-=0.06;
        break;
      case "88":
        centreDep.geometry.coordinates[0]+=0.06;
        break;
      case "90":
        centreDep.geometry.coordinates[0]-=0.04;
        centreDep.geometry.coordinates[1]-=0.01;
        break;
      case "92":
        centreDep.geometry.coordinates[0]+=0.03;
        centreDep.geometry.coordinates[1]-=0.052;
        break;
      case "93":
        centreDep.geometry.coordinates[0]+=0.035;
        break;
      case "94":
        centreDep.geometry.coordinates[0]+=0.01;
        centreDep.geometry.coordinates[1]-=0.005;
        break;
      case "95":
        centreDep.geometry.coordinates[0]+=0.02;
        centreDep.geometry.coordinates[1]+=0.005;
        break;
    }
    return centreDep;
  }

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
        setCentre({...centre, [locateCode]: {loc:adjustCentre(pointOnSurface(dep.geometry), dep.properties.code), dep: dep.properties.code, fontSize: adjustCentreSize(dep.properties.code)}});

        setCentreReverse({...centreReverse, [dep.properties.code]:{loc:adjustCentre(pointOnSurface(dep.geometry), dep.properties.code), dep:locateCode}});
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
          acc[dep.properties.code] = {loc:adjustCentre(pointOnSurface(dep.geometry), dep.properties.code), dep:dep.properties.code, fontSize: adjustCentreSize(dep.properties.code)};
            return acc;
          }, {}))
          setCentreReverse(sortedDepartments.reduce((acc, dep) => {
            acc[dep.properties.code] = {loc:adjustCentre(pointOnSurface(dep.geometry), dep.properties.code), dep:dep.properties.code};
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
            <ZoomableGroup 
              center={[2.2137, 46.2276]} // On définit le centre ici pour le zoom
              maxZoom={6}               // Pour éviter de zoomer à l'infini
              translateExtent={[
                [0, 0],       // Coin haut-gauche maximum
                [800, 800]    // Coin bas-droite maximum
              ]}
            >
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
                <g className="rsm-markers ">
                {Object.keys(centre).map((marker, index)=> {
                  return (
                    <Marker key={index} coordinates={centre[marker].loc.geometry.coordinates}>
                      <text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={centre[marker].fontSize}
                        fontWeight="bold"
                      >
                        {marker}
                      </text>
                    </Marker>
                  )})
                }
                </g>
              )}
            </ZoomableGroup>
        </ComposableMap>
      </main>
    </div>
  );
}

export default App;
