import { Form, Group } from '../../../domain/Form/Form';
import { TFunction } from 'i18next';

export interface FormChanges {
  addedGroups: Group[];
  removedGroups: Group[];
  modifiedGroups: { groupName: string; changes: string[] }[];
}

export function compareForms(original: Form, modified: Form, i18n: TFunction) {
  const changes = {
    addedGroups: [] as Group[],
    removedGroups: [] as Group[],
    modifiedGroups: [] as { groupName: string; changes: string[] }[],
  };

  const originalGroupsMap = new Map(original.groups.map(group => [group.name, group]));
  const modifiedGroupsMap = new Map(modified.groups.map(group => [group.name, group]));

  modified.groups.forEach(group => {
    if (!originalGroupsMap.has(group.name)) {
      changes.addedGroups.push(group);
    } else {
      const originalGroup = originalGroupsMap.get(group.name);
      const groupChanges = compareGroup(originalGroup!, group, i18n);
      if (groupChanges.length > 0) {
        changes.modifiedGroups.push({ groupName: group.name, changes: groupChanges });
      }
    }
  });

  original.groups.forEach(group => {
    if (!modifiedGroupsMap.has(group.name)) {
      changes.removedGroups.push(group);
    }
  });

  return changes;
}

function compareGroup(originalGroup: Group, modifiedGroup: Group, i18n: TFunction) {
  const changes: string[] = [];

  const originalQuestionsMap = new Map(originalGroup.questions.map(question => [question.id, question]));
  const modifiedQuestionsMap = new Map(modifiedGroup.questions.map(question => [question.id, question]));

  modifiedGroup.questions.forEach((question, index) => {
    if (!originalQuestionsMap.has(question.id)) {
      changes.push(i18n('Added question: {{question}}', { question: question.text }));
    } else {
      const originalQuestion = originalQuestionsMap.get(question.id);

      if (JSON.stringify(originalQuestion) !== JSON.stringify(question)) {
        changes.push(i18n('Modified question: {{question}}', { question: question.text }));
      }

      const originalIndex = originalGroup.questions.findIndex(q => q.id === question.id);
      if (originalIndex !== index) {
        changes.push(
          i18n('Moved question: {{question}} from position {{from}} to {{to}}', {
            question: question.text,
            from: originalIndex + 1,
            to: index + 1,
          })
        );
      }

      const originalShowCondition = JSON.stringify(originalQuestion?.showCondition ?? {});
      const modifiedShowCondition = JSON.stringify(question?.showCondition ?? {});
      if (originalShowCondition !== modifiedShowCondition) {
        if (!originalQuestion?.showCondition && question.showCondition) {
          changes.push(i18n('Question "{{question}}" is now a subordinate question.', { question: question.text }));
        } else if (originalQuestion?.showCondition && !question.showCondition) {
          changes.push(
            i18n('Question "{{question}}" is no longer a subordinate question.', { question: question.text })
          );
        } else {
          changes.push(i18n('Question "{{question}}" has had its condition changed.', { question: question.text }));
        }
      }
    }
  });

  originalGroup.questions.forEach(question => {
    if (!modifiedQuestionsMap.has(question.id)) {
      changes.push(i18n('Removed question: {{question}}', { question: question.text }));
    }
  });

  return changes;
}

export function translateResponse(response: string) {
  const lowerCaseResponse = response.toLowerCase();
  return lowerCaseResponse === 'yes' || lowerCaseResponse === 'true'
    ? 'Sim'
    : lowerCaseResponse === 'no' || lowerCaseResponse === 'false'
      ? 'Não'
      : response;
}
