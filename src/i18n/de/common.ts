import type enCommon from '../en/common';

type TranslationShape<T> = {
  [K in keyof T]: T[K] extends string ? string : TranslationShape<T[K]>;
};

export default {
  hello: 'Hallo {{name}}',
  title: 'Meine App',
  fortnite: {
    name: 'Fortnite',
    password: 'testtt'
  }
} satisfies TranslationShape<typeof enCommon>;