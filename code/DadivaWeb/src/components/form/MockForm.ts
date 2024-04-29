import { Form } from '../../domain/Form/Form';

export const form: Form = {
  questions: [
    {
      id: 'a',
      text: 'Question A',
      type: 'boolean',
      options: null,
    },
    {
      id: 'a1',
      text: 'Question A1',
      type: 'boolean',
      options: null,
    },
    {
      id: 'a2',
      text: 'Question A2',
      type: 'boolean',
      options: null,
    },
    {
      id: 'b',
      text: 'Question B',
      type: 'boolean',
      options: null,
    },
    {
      id: 'b1',
      text: 'Question B1',
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
          id: 'a',
          subQuestion: 'a',
        },
      },
    },
    {
      conditions: {
        any: [
          {
            fact: 'a',
            operator: 'equal',
            value: 'yes',
          },
        ],
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
            fact: 'a',
            operator: 'equal',
            value: 'no',
          },
        ],
      },
      event: {
        type: 'nextQuestion',
        params: {
          id: 'b',
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
        any: [
          {
            fact: 'a1',
            operator: 'equal',
            value: 'no',
          },
        ],
      },
      event: {
        type: 'nextQuestion',
        params: {
          id: 'b',
          subQuestion: 'b',
        },
      },
    },
    {
      conditions: {
        any: [
          {
            fact: 'a2',
            operator: 'equal',
            value: 'yes',
          },
        ],
      },
      event: {
        type: 'nextQuestion',
        params: {
          id: 'b',
          subQuestion: 'b',
        },
      },
    },
    {
      conditions: {
        any: [
          {
            fact: 'a2',
            operator: 'equal',
            value: 'no',
          },
        ],
      },
      event: {
        type: 'nextQuestion',
        params: {
          id: 'b',
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
          id: 'b',
          subQuestion: 'b',
        },
      },
    },
    {
      conditions: {
        any: [
          {
            fact: 'b',
            operator: 'equal',
            value: 'yes',
          },
        ],
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
