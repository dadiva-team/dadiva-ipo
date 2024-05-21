import { Form } from '../../domain/Form/Form';

export const form: Form = {
  groups: [
    {
      name: 'Perguntas Teste 1',
      questions: [
        {
          id: 'hasTraveled',
          text: 'Ja viajou para fora de Portugal?',
          type: 'boolean',
          options: null,
        },
        {
          id: 'hasTakenMedication',
          text: 'Tomou ou esta a tomar medicação?',
          type: 'boolean',
          options: null,
        },
      ],
    },
    {
      name: 'Perguntas Teste 2',
      questions: [
        {
          id: 'b1',
          text: 'No ultimo mês tomou alguma vacina?',
          type: 'boolean',
          options: null,
        },
        {
          id: 'b2',
          text: 'No ultimo mês doou sangue?',
          type: 'boolean',
          options: null,
        },
      ],
    },
  ],
  rules: [
    {
      conditions: {
        any: [],
      },
      event: {
        type: 'showQuestion',
        params: {
          id: 'hasTraveled',
        },
      },
    },
    {
      conditions: {
        all: [
          {
            fact: 'hasTraveled',
            operator: 'notEqual',
            value: '',
          },
        ],
      },
      event: {
        type: 'showQuestion',
        params: {
          id: 'hasTakenMedication',
        },
      },
    },
    {
      conditions: {
        all: [
          {
            fact: 'hasTraveled',
            operator: 'notEqual',
            value: '',
          },
          {
            fact: 'hasTakenMedication',
            operator: 'notEqual',
            value: '',
          },
        ],
      },
      event: {
        type: 'nextGroup',
      },
    },
    {
      conditions: {
        any: [],
      },
      event: {
        type: 'showQuestion',
        params: {
          id: 'b1',
        },
      },
    },
    {
      conditions: {
        any: [
          {
            fact: 'b1',
            operator: 'notEqual',
            value: '',
          },
        ],
      },
      event: {
        type: 'showQuestion',
        params: {
          id: 'b2',
        },
      },
    },
    {
      conditions: {
        all: [
          {
            fact: 'hasTraveled',
            operator: 'notEqual',
            value: '',
          },
          {
            fact: 'hasTakenMedication',
            operator: 'notEqual',
            value: '',
          },
          {
            fact: 'b1',
            operator: 'notEqual',
            value: '',
          },
          {
            fact: 'b2',
            operator: 'notEqual',
            value: '',
          },
        ],
      },
      event: {
        type: 'showReview',
      },
    },
  ],
};
