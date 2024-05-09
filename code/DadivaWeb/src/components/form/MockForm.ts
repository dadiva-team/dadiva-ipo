import { Form } from '../../domain/Form/Form';

export const form: Form = {
  groups: [
    {
      name: 'a',
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
          options: ['portugal', 'espanha', 'france', 'italy'],
        },
        {
          id: 'a3',
          text: 'Question A3',
          type: 'boolean',
          options: null,
        },
      ],
    },
    {
      name: 'b',
      questions: [
        {
          id: 'b1',
          text: 'Question B1',
          type: 'boolean',
          options: null,
        },
        {
          id: 'b2',
          text: 'Question B2',
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
      event: {
        type: 'showQuestion',
        params: {
          id: 'a3',
        },
      },
    },
    {
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
            fact: 'a3',
            operator: 'equal',
            value: 'yes',
          },
          {
            fact: 'a3',
            operator: 'equal',
            value: 'no',
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
            operator: 'equal',
            value: 'no',
          },
        ],
      },
      event: {
        type: 'final question',
      },
    },
  ],
};
