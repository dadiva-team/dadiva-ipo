import { get } from '../utils/fetch';
import { getManualInformationUri, searchMedicationsUri } from '../utils/WebApiUris';
import { SearchMedicationsOutputModel } from './models/SearchMedicationsOutputModel';
import { ManualInformation } from '../../pages/doctor/medications/MedicationInformation';

export namespace MedicationsServices {
  export async function searchMedications(query: string): Promise<string[]> {
    const res = await get<SearchMedicationsOutputModel>(searchMedicationsUri + query);
    console.log(res);
    return res.possibleNames;
  }

  export async function getManualInformation(product: string) {
    console.log('Getting Manual Information :)');
    return await get<{ manualInformations: ManualInformation[] }>(getManualInformationUri(product));
  }
}
