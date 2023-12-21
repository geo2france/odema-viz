// Footer.js

import React from "react";
import "./Footer.css";
import Ademe from "./images/Logo_ADEME-removebg-preview.png";
import Prefet from "./images/Préfet_de_la_région_Hauts-de-France-removebg-preview.png";
import Region from "./images/Logo_Région_HDF-removebg-preview.png";
import Cerc from "./images/Logo_CERC_Hauts-de-Fce_sans-sign-removebg-preview.png";
import Cerdd from "./images/Logo_cerdd.svg";
import Geo2France from "./images/geo2france.svg";

export const Footer = () => {
  const emailAddress = "odema@cerdd.org";

  const handleEmailClick = () => {
    window.location.href = `mailto:${emailAddress}`;
  };

  return (
    <footer>
      <div className="logo">
        <a href="https://www.ademe.fr/" target="_blank">
          <img className="imgLogo" src={Ademe} alt="Ademe" />
        </a>
        <a
          href="https://www.hauts-de-france.developpement-durable.gouv.fr/"
          target="_blank"
        >
          <img className="imgLogo" src={Prefet} alt="Prefet" />
        </a>
        <a href="https://www.hautsdefrance.fr/" target="_blank">
          <img className="imgLogo" src={Region} alt="Region" />
        </a>
        <a href="https://www.cerc-hautsdefrance.fr/" target="_blank">
          <img className="imgLogo" src={Cerc} alt="Cerc" />
        </a>
        <a href="https://www.cerdd.org/" target="_blank">
          <img className="imgLogo" src={Cerdd} alt="Cerdd" />
        </a>
        <a href="https://www.geo2france.fr/" target="_blank">
          <img className="imgLogo" src={Geo2France} alt="Geo2France" />
        </a>
      </div>

      <div className="contact">
        <p className="email" onClick={handleEmailClick}>
          Nous contacter
        </p>
      </div>
    </footer>
  );
};
