import { get } from '../utils/fetch';
import { searchMedicationsUri } from '../utils/WebApiUris';
import { SearchMedicationsOutputModel } from './models/SearchMedicationsOutputModel';

export namespace MedicationsServices {
  export async function searchMedications(query: string): Promise<string[]> {
    const res = await get<SearchMedicationsOutputModel>(searchMedicationsUri + query);
    console.log(res);
    return res.possibleNames;
  }
}
