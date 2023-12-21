import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Tag, Input, ConfigProvider } from "antd";
import geowebService from "../../services/geoweb.service";
import { IndicatorsContext } from "../../context/IndicatorsContext";
import { Feature } from "../../models/indicator.types";
import { Header } from "../../components/Header/Header";
import { Container, Col } from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeProvider";

import "./Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Footer } from "../../components/Footer/Footer";


export default () => {
  const { indicators, fetchIndicators } = useContext<any>(IndicatorsContext);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const getIndicators = async () => {
      const response = await geowebService.getFilteredIndicatorsProperties();
      fetchIndicators(response);
    };

    getIndicators();
  }, []);

  const { darkMode } = useContext(DarkModeContext);

  const generateTagColor = (tag: string) => {
    // Utilisez une fonction pour générer une couleur en fonction du nom du tag
    const hash = Array.from(tag).reduce(
      (acc, char) => char.charCodeAt(0) + acc,
      0
    );
    const colorIndex = hash % tagColorsPalette.length;
    return tagColorsPalette[colorIndex];
  };

  const tagColorsPalette = [
    "#FF5733", // Rouge
    "#FF9333", // Orange
    "#33A5FF", // Ciel
    "#B233FF", // Violet
    "#337AFF", // Bleu
    "#c47a45", // Maron
    "#28a745", // Vert
    "#343a40", // Noir
    "#091731", // Bleu foncé
    "#155a25", // Vert foncé
  ];

  const columns = [
    {
      title: "Nom de l'indicateur",
      dataIndex: ["properties", "nom_indicateur"],
      render: (text: string, record: Feature) => (
        <Link to={`/technicalsheet/${record.properties.guid}`}>
          <div className="indicator-cell">{text}</div>
        </Link>
      ),
    },
    {
      title: "Mots clés",
      key: "tags",
      dataIndex: ["properties", "tags"],
      render: (tags: string) => {
        const tagArray = tags.split("|"); // Divisez la chaîne en un tableau de tags
        return (
          <>
            {tagArray.map((tag, index) => {
              const color = generateTagColor(tag);
              return (
                <Tag key={index} color={color}>
                  {tag}
                </Tag>
              );
            })}
          </>
        );
      },
    },
  ];

  const filteredIndicators = indicators?.features.filter(
    (indicator: Feature) => {
      const lowercaseSearchText = searchText.toLowerCase();
      const lowercaseNomIndicateur =
        indicator.properties.nom_indicateur.toLowerCase();
      const tagArray = indicator.properties.tags?.split("|");

      // Vérifie si le nom de l'indicateur ou l'un de ses tags correspond à la recherche
      return (
        lowercaseNomIndicateur.includes(lowercaseSearchText) ||
        tagArray?.some((tag) => tag.toLowerCase().includes(lowercaseSearchText))
      );
    }
  );

  const darkThemeAnt = {
    // Configuration du thème sombre
    // Token pour tous les composants
    token: {
      colorBgContainer: "#2c2c2c",
      colorTextDescription: "#aca9b0",
      colorTextPlaceholder: "#aca9b0",
      colorPrimaryHover: "#ff7700",
      colorText: "white"

    },
    components: {
      Table: {},
    },
  };

  const lightThemeAnt = {
    token: {},
    components: {
      Table: {},
    },
  };

  const theme = darkMode ? darkThemeAnt : lightThemeAnt;

  return (

    <>
      <Header />
      <Container className="dashboard-map d-flex justify-content-around">
        <Col xs={12} lg={8}>
          {/* SearchBar */}
          <ConfigProvider theme={theme}>
            <Input.Search
              className={darkMode ? "dark mb-3 mt-3" : "light mb-3 mt-3"}
              placeholder="Rechercher un indicateur"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Table
              dataSource={filteredIndicators}
              columns={columns}
              pagination={false}
              bordered={true}
              size={"middle"}
              rowClassName={(_, index) =>
                index % 2 === 0 ? "table-row-dark" : "table-row-light"
              }
              rowKey={(indicator: Feature) => indicator.id}
            />
          </ConfigProvider>
        </Col>
      </Container>
      <Footer/>
    </>
  );
};
