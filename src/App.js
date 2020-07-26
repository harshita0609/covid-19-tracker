import React , { useState, useEffect } from 'react';
import{
  MenuItem, FormControl, Select, Card,CardContent
}from "@material-ui/core";
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData,prettyPrintStat} from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries,setCountries]= useState([
    // 'USA','UK','INDIA'
    // now passing empty array
  ]);
  const [country,setCountry] = useState('worldwide');  //setting worldwide menuitem by default
  const [countryInfo,setCountryInfo]= useState({});
  const [tableData,setTableData] = useState([]);
  const [mapCenter,setMapCenter]= useState({lat:34.80746,lng:-40.4796}); // center of map
  const [mapZoom, setMapZoom]= useState(3);
  const [mapCountries, setMapCountries]= useState([]);
  const [casesType, setCasesType]= useState("cases");

  //STATE= HOW TO WRITE A VARIABLE IN REACT
  //USEEFECT
  useEffect(()=>{
    //send a req to server
  const getCountriesData= async () =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=> response.json())
      .then((data)=>{
        //restructuring this api fetch
        // [item1,item2,item3]
        //returning item1 an obj in a shape
        //for loop vs map --> map returns as an arr
          const countries= data.map((country)=>(
            {
              name: country.country,//United Kingdom United States
              value:country.countryInfo.iso2//UK USA
            }));
            const sortedData= sortData(data);
            setTableData(sortedData);
            setCountries(countries);
            setMapCountries(data);

      });
    };
    //call async func
    getCountriesData();
  },[]);

  //for autoset worldwide data preset without clicking on options
  useEffect(()=> {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  },[]);
  //on change 
  const onCountryChange= async (event)=> {
    //we want to get country code
    const countryCode= event.target.value;

    // console.log('----------',countryCode);
    setCountry(countryCode);
    const url = countryCode==='worldwide'
    ?'https://disease.sh/v3/covid-19/all' 
    :`https://disease.sh/v3/covid-19/countries/${countryCode}`;

    //https://disease.sh/v3/covid-19/countries/all -->for worlwide
    //https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]-->for each country

    await fetch(url)
      .then(response => response.json())
      .then(data => {
          setCountryInfo(data);
          setCountry(countryCode);

          setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
          setMapZoom(4);
      });
  };
  // console.log("country--ifo--",countryInfo);


  return (
    <div className="app">
      {/* -----------------=======LEFT SIDE======-------- */}
    <div className="app__left">

          <div className="app__header">
            {/* ----------------------title----------------------- */}
          <h1>COVID-19 TRACKER</h1>

          {/* ----------------dropdown for countries----------------------- */}
        
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}> 
            {/*above in value = { country } //setting worldwide menuitem by default */}
              {/* loop through all the countries and their dropdown options */}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {  countries.map((country)=>(
                    <MenuItem value= {country.value}>{country.name}</MenuItem>
                ))
              }
              {/* <MenuItem value="worlwide">Worldwide</MenuItem>
              <MenuItem value="worlwide">India</MenuItem>
              <MenuItem value="worlwide">xyz</MenuItem>
              <MenuItem value="worlwide">abc</MenuItem> */}
            </Select>
          </FormControl>

          </div>
              {/* ------------it will have 3 info boxes------------------ */}
          <div className= "app__stats">
            
            {/* 1.total cases  2.recovered  3. deaths */}
            <InfoBox 
            isRed
            active = {casesType === "cases"}
            onClick={e=>setCasesType("cases")}
            title="Coronavirus Cases"  
            cases={prettyPrintStat(countryInfo.todayCases)}
             total={prettyPrintStat(countryInfo.cases)} 
             />
            <InfoBox 
            // isRed  -- not here here green only 
            active = {casesType === "recovered"}
            onClick={e=>setCasesType("recovered")}
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)}
             total={prettyPrintStat(countryInfo.recovered)}
             />
            <InfoBox 
            isRed
            active = {casesType === "deaths"}
            onClick={e=>setCasesType("deaths")}
            title="Deaths"
             cases={prettyPrintStat(countryInfo.todayDeaths)} 
             total={prettyPrintStat(countryInfo.deaths)}
             />
          </div>
          {/* --------------map ------------------- */}
          <Map 
          casesType={casesType}  
          countries= {mapCountries}
          center= {mapCenter}
          zoom={mapZoom}
           />

    </div>
      {/* ---------------=====RIGHT SIDE========----------- */}
    
    <Card className="app__right">
      <CardContent>
        <h3> LIVES CASES BY COUNTRY</h3>
        <Table countries={tableData}>

        </Table>
              {/* ------------------list of cases by country--------- */}
        <h3 className="app__graphTitle">Worldwide New {casesType} </h3>
        <LineGraph  className="app__graph" casesType={casesType}>

        </LineGraph>
        {/* ----------------graph--------------- */}
      </CardContent>
        
    </Card> 
    </div>
  );
}

export default App;
