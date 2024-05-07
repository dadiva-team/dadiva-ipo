import { Form } from '../../domain/Form/Form';

export const form: Form = {
  questions: [
    {
      id: 'a1',
      text: 'Question A1',
      type: 'boolean',
      options: null,
    },
    {
      id: 'a2',
      text: 'Question A2',
      type: 'dropdown',
      options: ['portugal', 'espanha', 'france', 'italy'],
    },
    {
      id: 'a3',
      text: 'Question A3',
      type: 'boolean',
      options: null,
    },
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
  rules: [
    {
      conditions: {
        any: [],
      },
      event: {
        type: 'showQuestion',
        params: {
          id: 'a1',
          subQuestion: 'a',
        },
      },
    },
    {
      conditions: {
        any: [
          {
            fact: 'a1',
            operator: 'equal',
            value: 'yes',
          },
        ],
      },
      event: {
        type: 'showQuestion',
        params: {
          id: 'a2',
          subQuestion: 'a',
        },
      },
    },
    {
      conditions: {
        all: [
          {
            fact: 'a2',
            operator: 'notEqual',
            value: 'no',
          },
          {
            fact: 'a2',
            operator: 'notEqual',
            value: '',
          },
        ],
      },
      event: {
        type: 'showQuestion',
        params: {
          id: 'a3',
          subQuestion: 'a',
        },
      },
    },
    {
      conditions: {
        any: [
          {
            fact: 'a3',
            operator: 'equal',
            value: 'yes',
          },
        ],
      },
      event: {
        type: 'nextQuestion',
        params: {
          id: 'b1',
          subQuestion: 'b',
        },
      },
    },
    {
      conditions: {
        any: [
          {
            fact: 'a1',
            operator: 'equal',
            value: 'no',
          },
          {
            fact: 'a2',
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
        type: 'nextQuestion',
        params: {
          id: 'b1',
          subQuestion: 'b',
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
          subQuestion: 'b',
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
          subQuestion: 'b',
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
