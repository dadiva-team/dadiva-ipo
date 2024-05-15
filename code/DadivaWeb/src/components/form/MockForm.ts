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
          id: 'traveledWhere',
          text: 'Para onde?',
          type: 'dropdown',
          options: ['alemanha', 'espanha', 'frança', 'italia'],
        },
        {
          id: 'hasTakenMedication',
          text: 'Tomou ou esta a tomar medicação?',
          type: 'boolean',
          options: null,
        },
        {
          id: 'whichMedication',
          text: 'Quais medicamentos?',
          type: 'text',
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
          text: 'Selecione as vacinas que tomou',
          type: 'dropdown',
          options: [
            'Vacina contra tuberculose',
            'Vacina contra a gripe',
            'Vacina contra a covid-19',
            'Vacina contra a hepatite B',
            'Vacina contra a hepatite A',
            'Vacina contra a raiva',
            'Vacina contra a febre amarela',
            'Vacina contra a poliomielite',
            'Vacina contra a difteria',
            'Vacina contra o tétano',
            'Vacina contra a tosse convulsa',
            'Vacina contra o sarampo',
            'Vacina contra a rubéola',
            'Vacina contra a papeira',
            'Vacina contra a varicela',
            'Vacina contra a meningite',
            'Vacina contra a pneumonia',
            'Vacina contra a febre tifoide',
            'Vacina contra a encefalite japonesa',
            'Vacina contra a encefalite das carraças',
            'Vacina contra a encefalite transmitida por carrapatos',
          ],
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
        any: [
          {
            fact: 'hasTraveled',
            operator: 'equal',
            value: 'yes',
          },
        ],
      },
      event: {
        type: 'showQuestion',
        params: {
          id: 'traveledWhere',
        },
      },
    },
    {
      conditions: {
        any: [
          {
            all: [
              {
                fact: 'traveledWhere',
                operator: 'notEqual',
                value: 'no',
              },
              {
                fact: 'traveledWhere',
                operator: 'notEqual',
                value: '',
              },
            ],
          },
          {
            fact: 'hasTraveled',
            operator: 'equal',
            value: 'no',
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
            fact: 'hasTakenMedication',
            operator: 'equal',
            value: 'yes',
          },
        ],
      },
      event: {
        type: 'showQuestion',
        params: {
          id: 'whichMedication',
        },
      },
    },
    /*{
      conditions: {
        any: [
          {
            fact: 'hasTraveled',
            operator: 'equal',
            value: 'no',
          },
          {
            fact: 'traveledWhere',
            operator: 'equal',
            value: 'no',
          },
          {
            fact: 'hasTakenMedication',
            operator: 'equal',
            value: 'no',
          },
          {
            fact: 'whichMedication',
            operator: 'notEqual',
            value: '',
          },
        ],
      },
      event: {
        type: 'nextGroup',
        params: {
          id: 'b1',
        },
      },
    },*/
    {
      conditions: {
        any: [
          {
            all: [
              {
                fact: 'traveledWhere',
                operator: 'notEqual',
                value: '',
              },
              {
                fact: 'whichMedication',
                operator: 'notEqual',
                value: '',
              },
            ],
          },
          {
            all: [
              {
                fact: 'traveledWhere',
                operator: 'notEqual',
                value: '',
              },
              {
                fact: 'hasTakenMedication',
                operator: 'equal',
                value: 'no',
              },
            ],
          },
          {
            all: [
              {
                fact: 'hasTraveled',
                operator: 'equal',
                value: 'no',
              },
              {
                fact: 'hasTakenMedication',
                operator: 'notEqual',
                value: '',
              },
              {
                fact: 'whichMedication',
                operator: 'notEqual',
                value: '',
              },
            ],
          },
          {
            all: [
              {
                fact: 'hasTraveled',
                operator: 'equal',
                value: 'no',
              },
              {
                fact: 'hasTakenMedication',
                operator: 'equal',
                value: 'no',
              },
            ],
          },
        ],
      },
      event: {
        type: 'nextGroup',
        params: {
          id: 'b1',
        },
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
            operator: 'equal',
            value: 'yes',
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
        any: [
          {
            fact: 'b2',
            operator: 'notEqual',
            value: '',
          },
          {
            fact: 'b1',
            operator: 'equal',
            value: 'no',
          },
        ],
      },
      event: {
        type: 'showReview',
      },
    },
  ],
};
