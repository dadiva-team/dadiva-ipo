import { useEffect, useState } from 'react';
import { Form } from '../../../domain/Form/Form';
import { useNavigate } from 'react-router-dom';
import { handleError, handleRequest } from '../../../services/utils/fetch';
import { FormServices } from '../../../services/from/FormServices';
import { ConditionProperties, RuleProperties, TopLevelCondition } from 'json-rules-engine';
import { useLanguage } from '../LanguageProvider';
import { Uris } from '../../../utils/navigation/Uris';
import BACKOFFICE = Uris.BACKOFFICE;

export function useEditInconsistenciesPage() {
  const { backofficeLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formFetchData, setFormFetchData] = useState<Form>();
  const [inconsistencies, setInconsistencies] = useState<RuleProperties[]>();

  const [addingCondition, setAddingCondition] = useState<number>(null);
  const [editingCondition, setEditingCondition] = useState<{
    groupIdx: number;
    incIdx: number;
    condition: ConditionProperties;
  } | null>(null);
  const [addingInconsistency, setAddingInconsistency] = useState<boolean>(false);
  const [creatingGroup, setCreatingGroup] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  const [reasons, setReasons] = useState<string[]>([]);

  const nav = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const [formError, formRes] = await handleRequest(FormServices.getForm(backofficeLanguage));
      if (formError) {
        handleError(formError, setError, nav);
        return;
      }
      setFormFetchData(formRes);
      const [incError, inconsistenciesRes] = await handleRequest(FormServices.getInconsistencies(backofficeLanguage));

      if (incError) {
        handleError(incError, setError, nav);
        setInconsistencies([]);
        setReasons([]);
        setIsLoading(false);
        return;
      }

      console.log(inconsistenciesRes);
      setInconsistencies(inconsistenciesRes.map(inc => inc.rule));
      setReasons(inconsistenciesRes.map(inc => inc.reason || ''));
      setIsLoading(false);
    };

    if (isLoading) fetch();
  }, [backofficeLanguage, isLoading, nav]);

  function onAddInconsistency() {
    setInconsistencies(old => {
      return [...old, { conditions: { all: [] }, event: { type: 'showInconsistency' } } as RuleProperties];
    });
    setReasons(old => [...old, '']);
  }

  function onAddCondition(index: number) {
    setAddingCondition(index);
  }

  function onDeletingInconsistencyGroup(index: number) {
    setInconsistencies(inconsistencies.filter((_, i) => i !== index));
    setReasons(reasons.filter((_, i) => i !== index));
  }

  function onDeletingInconsistency(groupIdx: number, incIdx: number) {
    setInconsistencies(
      inconsistencies.map((group, i) => {
        if (i === groupIdx) {
          return {
            ...group,
            conditions: {
              ...group.conditions,
              all:
                group.conditions && 'all' in group.conditions
                  ? group.conditions.all.filter((_, j) => j !== incIdx)
                  : [],
            },
          };
        }
        return group;
      })
    );
  }

  function onOpenEditDialog(groupIdx: number, incIdx: number, condition: ConditionProperties) {
    setEditingCondition({ groupIdx, incIdx, condition });
  }

  function onEditCondition(groupIdx: number, incIdx: number, fact: string, value: string) {
    setInconsistencies(
      inconsistencies.map((group, i) => {
        if (i === groupIdx) {
          return {
            ...group,
            conditions: {
              ...group.conditions,
              all:
                group.conditions && 'all' in group.conditions
                  ? group.conditions.all.map((condition, j) =>
                      j === incIdx
                        ? {
                            ...condition,
                            fact,
                            value,
                          }
                        : condition
                    )
                  : [],
            },
          };
        }
        return group;
      })
    );
  }

  function conditionAllIsEmpty(conditions?: TopLevelCondition) {
    if (conditions && 'all' in conditions) return conditions.all.length == 0;
    return false;
  }

  function saveInconsistencies() {
    const hasEmptyGroups = inconsistencies.some(inc => !('all' in inc.conditions) || inc.conditions.all.length === 0);
    const hasEmptyReasons = reasons.some(reason => !reason || reason.trim() === '');

    if (hasEmptyGroups) {
      setError('É necessário adicionar pelo menos uma condição para cada grupo de inconsistências.');
      return;
    }

    if (hasEmptyReasons) {
      setError('É necessário adicionar um razão para cada grupo de inconsistências.');
      return;
    }

    const filteredInconsistencies = inconsistencies.filter(
      inc => 'all' in inc.conditions && inc.conditions.all.length !== 0
    );
    FormServices.saveInconsistencies(filteredInconsistencies, backofficeLanguage, reasons).then(res => {
      if (res) nav(BACKOFFICE);
    });
  }

  function onShowForm() {
    setShowForm(!showForm);
  }

  function onAddReason(index: number, reason: string) {
    setReasons(old => {
      const newReasons = [...old];
      newReasons[index] = reason;
      return newReasons;
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
    onEditCondition,
    onDeletingInconsistencyGroup,
    onDeletingInconsistency,
    conditionAllIsEmpty,
    saveInconsistencies,
    showForm,
    onShowForm,
    onAddReason,
    reasons,
    onOpenEditDialog,
    editingCondition,
    setEditingCondition,
  };
}
