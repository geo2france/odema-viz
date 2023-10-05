import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Tag, Input } from "antd";
import geowebService from "../../services/geoweb.service";
import { IndicatorsContext } from "../../context/IndicatorsContext";
import { Feature } from "../../models/indicator.types";
import { Header } from "../../components/Header/Header";
import { Container, Col } from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeProvider";

import "./Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";

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
      key: "Tag",
      dataIndex: ["properties", "tags"],
      render: () => (
        <>
          <Tag color="rgb(13, 110, 253)">ODEMA</Tag>
          <Tag color="rgb(255, 119, 0)">Dechets</Tag>
        </>
      ),
    },
  ];


  return (
    <>
      <Header indicatorName="" />
      <Container className="dashboard-map d-flex justify-content-around">
        <Col xs={12} lg={8}>
          {/* SearchBar */}
            <Input.Search
              className={darkMode ? "dark mb-3 mt-3" : "light mb-3 mt-3"}
              placeholder="Rechercher un indicateur"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <Table
              className="test"
              dataSource={indicators?.features.filter(
                (
                  indicator: Feature //Feature permet d'accéder à l'objet actueldu tableau
                ) =>
                  indicator.properties.nom_indicateur
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
              )}
              columns={columns}
              pagination={false}
              bordered={true}
              size={"middle"}
              rowClassName={(_, index) =>
                index % 2 === 0 ? " table-row-dark " : "table-row-light "
              } // record doit etre utilisé
              rowKey={(indicator: Feature) => indicator.id}
            />

        </Col>
      </Container>
    </>
  );
};
