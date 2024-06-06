import { useEffect, useState } from 'react';
import { Form } from '../../../domain/Form/Form';
import { useNavigate } from 'react-router-dom';
import { handleError, handleRequest } from '../../../services/utils/fetch';
import { FormServices } from '../../../services/from/FormServices';
import { RuleProperties, TopLevelCondition } from 'json-rules-engine';

export function useEditInconsistenciesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formFetchData, setFormFetchData] = useState<Form>();
  const [inconsistencies, setInconsistencies] = useState<RuleProperties[]>();

  const [addingCondition, setAddingCondition] = useState<number>(null);
  const [addingInconsistency, setAddingInconsistency] = useState<boolean>(false);
  const [creatingGroup, setCreatingGroup] = useState<boolean>(false);

  const nav = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const [formError, formRes] = await handleRequest(FormServices.getForm());
      if (formError) {
        handleError(formError, setError, nav);
        return;
      }
      setFormFetchData(formRes);
      const [incError, inconsistenciesRes] = await handleRequest(FormServices.getInconsistencies());

      if (incError) {
        handleError(incError, setError, nav);
        return;
      }

      console.log(inconsistenciesRes)
      setInconsistencies(inconsistenciesRes);
      setIsLoading(false);
    };

    if (isLoading) fetch();
  }, [isLoading, nav]);

  function onAddInconsistency() {
    setInconsistencies(old => {
      return [...old, { conditions: { all: [] }, event: { type: 'showInconsistency' } } as RuleProperties];
    });
  }

  function onAddCondition(index: number) {
    setAddingCondition(index);
  }

  function onDeletingInconsistency(index: number, inc: RuleProperties) {
    console.log(inc);
    setInconsistencies(inconsistencies.filter((_, i) => i !== index));
  }

  function conditionAllIsEmpty(conditions?: TopLevelCondition) {
    if (conditions && 'all' in conditions) return conditions.all.length == 0;
    return false;
  }

  function saveInconsistencies() {
    const filteredInconsistencies = inconsistencies.filter(
      inc => 'all' in inc.conditions && inc.conditions.all.length !== 0
    );
    FormServices.saveInconsistencies(filteredInconsistencies).then(res => {
      if (res) nav('/');
    });
  }

  return {
    creatingGroup,
    isLoading,
    error,
    formFetchData,
    inconsistencies,
    setInconsistencies,
    addingCondition,
    setAddingCondition,
    addingInconsistency,
    setAddingInconsistency,
    setCreatingGroup,
    setError,
    onAddInconsistency,
    onAddCondition,
    onDeletingInconsistency,
    conditionAllIsEmpty,
    saveInconsistencies,
  };
}
