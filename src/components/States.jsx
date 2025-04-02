import React, { useEffect, useState } from "react";

function Dropdown({ text, id, entities, selectedValue, onSelect, disabled }) {
  function handleChange(e) {
    const value = e.target.value;
    if (onSelect) onSelect(value);
  }

  return (
    <div>
      <select
        name={id}
        id={id}
        value={selectedValue}
        onChange={handleChange}
        disabled={disabled}
        style={{ padding: "10px" }}
      >
        <option value="">{text}</option>
        {Array.isArray(entities) &&
          entities.map((entity, index) => (
            <option key={index} value={entity}>
              {entity}
            </option>
          ))}
      </select>
    </div>
  );
}

function States() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  async function fetchCountries() {
    try {
      const apiResponse = await fetch(
        "https://crio-location-selector.onrender.com/countries"
      );
      const finalResposne = await apiResponse.json();
      console.log(finalResposne, "+++countries++++");
      setCountries(finalResposne);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  async function fetchStates(countryName) {
    try {
      const apiResponse = await fetch(
        `https://crio-location-selector.onrender.com/country=${countryName}/states`
      );
      const finalResposne = await apiResponse.json();
      console.log(finalResposne, "+++states++++");
      setStates(finalResposne);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  async function fetchCities(countryName, stateName) {
    try {
      const apiResponse = await fetch(
        `https://crio-location-selector.onrender.com/country=${countryName}/state=${stateName}/cities`
      );
      const finalResposne = await apiResponse.json();
      console.log(finalResposne, "+++cities++++");
      setCities(finalResposne);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setStates([]);
      setCities([]);
      setSelectedState("");
      setSelectedCity("");
      fetchStates(selectedCountry);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      setCities([]);
      setSelectedCity("");
      fetchCities(selectedCountry, selectedState);
    }
  }, [selectedCountry, selectedState]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "30px",
        gap: "20px",
      }}
    >
      <h1>Select Location</h1>
      <div
        style={{
          display: "flex",
          gap: "20px",
        }}
      >
        <Dropdown
          text="Select Country"
          id="countries"
          entities={countries}
          selectedValue={selectedCountry}
          onSelect={setSelectedCountry}
          disabled={false}
        />
        <Dropdown
          text="Select State"
          id="states"
          entities={states}
          selectedValue={selectedState}
          onSelect={setSelectedState}
          disabled={!selectedCountry}
        />
        <Dropdown
          text="Select City"
          id="cities"
          entities={cities}
          selectedValue={selectedCity}
          onSelect={setSelectedCity}
          disabled={!selectedCountry || !selectedState}
        />
      </div>
      {selectedCountry && selectedState && selectedCity ? (
        <p style={{ fontWeight: "bold" }}>
          You selected{" "}
          <span style={{ fontSize: "25px" }}>{selectedCity}</span>,{" "}
          <span style={{ color: "grey", fontSize: "20px" }}>
            {selectedState}, {selectedCountry}
          </span>
        </p>
      ) : null}
    </div>
  );
}

export default States;
