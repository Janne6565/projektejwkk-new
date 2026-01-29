import enCommon from '../i18n/en/common';

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'common';
        resources: {
            common: typeof enCommon;
        };
    }
}
