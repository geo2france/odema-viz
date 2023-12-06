import axios from 'axios';

class IndicateurObjectifService{
    async getIndObjectifData():Promise<any>{
    const response = await axios.get('src/images/indicateur_objectifs.json');
        return response.data;
    }
}

export default new IndicateurObjectifService();