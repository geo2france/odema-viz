import { useContext, useEffect, useState } from "react";
import { ProgressBar, DeltaBar, Card, Flex,   Text, BadgeDelta, Badge, Divider, AreaChart,
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell, } from "@tremor/react";

import IndicateurObjectifService from "../../services/ind_objectif.service";

import { Header } from "../../components/Header/Header";

// Pour chaque territoire, on affiche la situation par rapport à l'objectif, avec comparaison p/r a l'année précédente

function DeltaObjectifN(props){
  const value: number = props.value;
  const deltaValue: number = value-1;
  let tooltip: string;
  let color: string;
  if ( value > 1.1 ) {
      tooltip = 'En avance';
      color = 'green'
  }else if ( value < 0.8){
    tooltip =  'En retard';
    color = 'red'
  }else{
    tooltip = 'Conforme' ;
    color = 'orange'
  }
  return (
    <>
    <DeltaBar style={{'width':'5rem'}} value={deltaValue*100} isIncreasePositive={true} className="mt-3" tooltip={tooltip} />
    </>
  )
}

function ProgressToGoal(props){
  const value: number = props.value;
  const is_exceeded: boolean = value > 1;
  return(
    <>
      {/*<Text>{(value*100).toFixed(1)} %</Text> */}
      <ProgressBar style={{'width':'10rem'}}  value={value*100} color="teal" className="mt-3" />
      {is_exceeded ?
      (<Badge deltaType="moderateIncrease" isIncreasePositive={true} size="xs" color='green'>
      {'Objectif dépassé !'} 
      </Badge>
      ):( <></>) }
    </>
  )
}

function MiniAreaChart(props){
  function generateRandomData(yearA, yearB) { //pour dev maquette
      const data = [];
    
      for (let year = yearA; year <= yearB; year++) {
        const randomValue = Math.floor(Math.random() * 101); // Valeur aléatoire entre 0 et 100
        const dataEntry = { 'date': String(year), 'value': randomValue };
        data.push(dataEntry);
      }
    
      return data;
  }
  let color: string;
  let chart_data = generateRandomData(2011,2023);
  if (chart_data[0].value > chart_data[chart_data.length-1].value){
    color = 'green'
  }else{
    color = 'red'
  }
  chart_data[0]['trajectoire'] = 100;
  chart_data[0]['value'] = 100;
  chart_data[chart_data.length-1]['trajectoire'] = 80;

  return (             
    <AreaChart
      className="h-10 mt-4"
      data={chart_data }
      index="date"
      categories={["value"]}
      colors={[color, 'blue']} 
      showXAxis={false}
      showYAxis={false}
      showLegend={false} 
      showGridLines={false} 
      connectNulls={true}/>
  )
}

export default () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = async () => {
          const response = await IndicateurObjectifService.getIndObjectifData();
          console.log(response)
          setData(response);
        };
    
        getData();
      }, []);

    return (
        <>
            <Header />
            <Card className="max-w-5xl mx-auto">

              <text> 
                <p>Objectif : Réduire de <b>30%</b> la production de DMA en <b>2030</b> par rapport à <b>2010</b>.</p>

                <p>L'indicateur retenu pour évaluer cet objectif est la <b>quantité de DMA collectée par le service publique</b>.
                (Limite : ne tient pas compte des déchets collectés hors SPGD)</p>
                
                <Divider/><p> L'année de référence retenu est <b>2011</b> (pas d'enquête Collecte en 2010)</p>
              <p>Le tableau ci-dessous montre l'évolution de l'indicateur, l'écart à la trajectoire, et la complétion de l'objectif</p>
              </text>

              <Flex className="max-w-xl mx-auto">
                <div>
                  <DeltaObjectifN value='0.2'></DeltaObjectifN>
                  <Badge style={{'margin-top':'20px'}} color={'red'}> En retard</Badge>
                </div>

                <div>
                  <DeltaObjectifN value='0.9'></DeltaObjectifN>
                  <Badge style={{'margin-top':'20px'}} color={'orange'}> Sur la trajectoire</Badge>
                </div>

                <div>
                  <DeltaObjectifN value='1.5'></DeltaObjectifN>
                  <Badge style={{'margin-top':'20px'}} color={'green'}> En avance</Badge>
                </div>

              </Flex>
            </Card>
            <Divider/>
            <Card className="max-w-7xl mx-auto" >
              <Table className="mt-5"> 
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Territoire</TableHeaderCell>
                  <TableHeaderCell>Evolution</TableHeaderCell>
                  <TableHeaderCell>Trajectoire</TableHeaderCell>
                  <TableHeaderCell>Objectif 2030</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {data.map((element, index) => (
                <TableRow key={index}>
                    <TableCell> {element.territoire.nom}</TableCell>
                        {element.indicateur_objectif.map((indicateur, indice) => {
                            if (indicateur.annee === 2021) {
                              return (
                                <>
                                <TableCell>
                                  <MiniAreaChart />
                                </TableCell>
                                <TableCell>  
                                    <DeltaObjectifN value={indicateur.ecart_objectif_n} />
                                </TableCell> 
                                <TableCell>
                                  <ProgressToGoal value={indicateur.ecart_objectif_final} />
                                    </TableCell> 
                                </>  
                              )
                            }
                        })
                      }
                  </TableRow>
              ) )}
              </TableBody>
              </Table>
            </Card>
        </>
    )
}

