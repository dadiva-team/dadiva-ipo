import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MedicationsServices } from '../../../services/medications/MedicationsServices';
import { handleRequest } from '../../../services/utils/fetch';
import { Divider } from '@mui/material';

export interface Example {
  examples: string;
  criteria: string[];
}

export interface ManualInformation {
  manualEntries: ManualEntry[];
}

export interface ManualEntry {
  groupName: string;
  examples: Example[];
}

export interface MedicationInformationProps {
  productInformation: ManualInformation[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function MedicationInformation() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [productInformation, setProductInformation] = React.useState<ManualEntry[]>([]);

  const { product } = useParams();

  useEffect(() => {
    const fetch = async () => {
      const [err, res] = await handleRequest(MedicationsServices.getManualInformation(product));
      if (err) {
        console.error(err);
        return;
      }

      console.log(res);

      setProductInformation(res.manualEntries);
      setIsLoading(false);
    };
    fetch();
  }, [product]);

  return (
    <>
      {isLoading ? (
        <>Loading</>
      ) : (
        <>
          {productInformation?.map(information => (
            <>
              <h1 key={information.groupName}>{information.groupName}</h1>
              {information.examples.map(example => (
                <>
                  <h2 key={example.examples}>{example.examples}</h2>
                  {example.criteria.map(criteria => (
                    <div dangerouslySetInnerHTML={{ __html: criteria }} key={criteria} />
                  ))}
                </>
              ))}
              <Divider />
            </>
          ))}
        </>
      )}
    </>
  );
}
