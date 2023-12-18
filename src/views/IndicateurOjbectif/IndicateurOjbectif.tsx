import { useContext, useEffect, useState } from "react";
import { ProgressBar, DeltaBar, Card, Flex,  Title, Text, BadgeDelta, Badge, Divider, AreaChart, ProgressCircle,
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
  let deltaType: string;
  if (props.evolution > 0) {
      deltaType = 'moderateIncrease'
  }else {
    deltaType = 'moderateDecrease'
  }

  return (
    <>
    { props.evolution && false ? <BadgeDelta deltaType={deltaType}>{/*(props.evolution*100).toFixed(0) */}</BadgeDelta> : <></>}
    <DeltaBar style={{'width':'5rem'}} value={deltaValue*100} isIncreasePositive={true} className="mt-3" tooltip={tooltip} />
    </>
  )
}

function ProgressToGoal(props){
  const value: number = props.value;
  const is_exceeded: boolean = value > 1;
  return(
    <>
    <Flex>
      <Text><b>{props.valeur_n} kg/hab</b> &bull; {(value*100).toFixed(0)}%</Text>
      <Text>{props.goal} kg/hab</Text>
    </Flex>
      <ProgressBar style={{'width':'15rem'}} color={value > 0 ? 'teal' : 'rose'} value={value*100} className="mt-3" />
      {is_exceeded ?
      (<Badge size="xs" color='green'>
      {'Objectif dépassé !'} 
      </Badge>
      ):( <></>) }
    </>
  )
}

function MiniAreaChart(props){

  let color: string;
  let chart_data = props.data;
  if (chart_data[0].valeur_n > chart_data[chart_data.length-1].valeur_n){
    color = 'green'
  }else{
    color = 'red'
  }
  chart_data[0]['trajectoire'] = 100;
  chart_data[0]['value'] = 100;
  chart_data[chart_data.length-1]['trajectoire'] = 80;

  const minValue = props.data.reduce((min, objet) => {
    return Math.min(min, objet['valeur_n']);
  }, Infinity);

  const maxValue = props.data.reduce((max, objet) => {
    return Math.max(max, objet['valeur_n']);
  }, -Infinity);

  return (             
    <AreaChart
      className="h-10 mt-4"
      data={chart_data}
      index="date"
      categories={props.categories}
      colors={[color]} 
      showXAxis={false}
      showYAxis={false}
      showLegend={false} 
      showGridLines={false} 
      showTooltip={false}
      connectNulls={true}
      minValue={minValue} maxValue={maxValue}/>
  )
}

function TexteTronque (props) {
  const texteTronque = props.children.length > props.longueurMax ? `${props.children.slice(0, props.longueurMax)}...` : props.children;

  return (
      <>{texteTronque}</>
  );
};

function processData(data){
  console.log(data)
  data.forEach((e) => { /* ATTENTION ICI on perd les données au niveau root ? */
    
    for (let i = 1; i < e.indicateur_objectif.length; i++) {
      const difference = e.indicateur_objectif[i].ecart_objectif_n - e.indicateur_objectif[i - 1].ecart_objectif_n;
      e.indicateur_objectif[i].ecart_objectif_n_evolution = difference;
    }

    e.indicateur_objectif_n = e.indicateur_objectif.find((v) => v.annee === 2021)

  })
  console.info(data)
  return data;
}

function fdataResume(data){
  const goal_ok = data.filter((e) => e.indicateur_objectif_n !== undefined && e.indicateur_objectif_n.ecart_objectif_final > 1).length
  const trajectoire_ok = data.filter((e) => e.indicateur_objectif_n !== undefined && e.indicateur_objectif_n.ecart_objectif_n > 1).length
  const n_territoire =  data.length
  console.log(goal_ok)
  return{'ok':goal_ok, 'trajectoire_ok':trajectoire_ok, 'n_territoire':n_territoire}
}

export default () => {
    const [data, setData] = useState([]);
    const [dataResume, setDataResume] = useState({});

    useEffect(() => {
        const getData = async () => {
          const response = await IndicateurObjectifService.getIndObjectifData();
          console.log(response)
          console.log(processData(response))
          setData(processData(response));
          setDataResume(fdataResume(processData(response)))
        };
    
        getData();
      }, []);

    return (
        <>
            <Header />
            <Card className="max-w-5xl mx-auto">

              <Text> 
                <p>Objectif : Réduire de <b>15%</b> la production de DMA en <b>2030</b> par rapport à <b>2010</b> (<a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043974936">référence).</a></p>

                <p>L'indicateur retenu pour évaluer cet objectif est la <b>quantité de DMA collectée par le service publique</b>.
                (Limite : ne tient pas compte des déchets collectés hors SPGD)</p>
                
                <Divider/><p> L'année de référence retenu est <b>2011</b> (pas d'enquête Collecte en 2010)</p>
              <p>Le tableau ci-dessous montre l'évolution de l'indicateur, l'écart à la trajectoire, et la complétion de l'objectif</p>
              </Text>

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
            <Card className="max-w-5xl mx-auto" >
                <Flex justifyContent="center">
<ProgressCircle value={ (dataResume.trajectoire_ok / dataResume.n_territoire)*100 }>
                  <span className="text-xs text-gray-700 font-medium">Trajectoire</span>
                  </ProgressCircle>
                  <ProgressCircle value={ (dataResume.ok / dataResume.n_territoire)*100 }>
                  <span className="text-xs text-gray-700 font-medium">Objectif</span>
                  </ProgressCircle>
                  <ProgressBar value={50/*data.objectif.annee_objectif - data.objectif.annee_objectif*/} color="teal" className="mt-3" />
                </Flex>
            </Card>
            <Divider/>
            <Card className="max-w-7xl mx-auto" >
            <Title>Réduction de 15% des quantités de DMA produites par habitant en 2030 par rapport à 2010</Title>
              <Table className="mt-5"> 
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Territoire</TableHeaderCell>
                  <TableHeaderCell>Références</TableHeaderCell>
                  <TableHeaderCell>Evolution</TableHeaderCell>
                  <TableHeaderCell>Trajectoire</TableHeaderCell>
                  <TableHeaderCell>Objectif 2030</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {data.filter((element) => element.indicateur_objectif_n !== undefined).map((element, index) => (
                <TableRow key={index}>
                    <TableCell> 
                    <TexteTronque longueurMax={50}>{element.territoire.nom}</TexteTronque>
                    </TableCell>
                    <TableCell> 
                        Référence : <b>{element.objectif.valeur_ref} kg/hab</b> en {element.objectif.annee_ref}.<br/>
                        Objectif : <b>{element.objectif.valeur_objectif} kg/hab</b> en {element.objectif.annee_objectif} 
                    </TableCell>
                    <TableCell>
                      <MiniAreaChart data={element.indicateur_objectif} index='annee' categories={['valeur_n']} />
                    </TableCell>
                    <TableCell>  
                        <DeltaObjectifN value={element.indicateur_objectif_n.ecart_objectif_n} evolution={element.indicateur_objectif_n.ecart_objectif_n_evolution}/>
                    </TableCell> 
                    <TableCell>
                      <ProgressToGoal value={element.indicateur_objectif_n.ecart_objectif_final} valeur_n={element.indicateur_objectif_n.valeur_n} goal={element.objectif.valeur_objectif} />
                    </TableCell> 
                  </TableRow>
              ) )}
              </TableBody>
              </Table>
            </Card>
        </>
    )
}

