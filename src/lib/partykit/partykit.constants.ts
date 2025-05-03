const PARTYKIT_DEPLOYED_HOST = 'logoi-dev-party.v1adko.partykit.dev';

export const PARTYKIT_HOST = import.meta.env.DEV ? 'localhost:1999' : PARTYKIT_DEPLOYED_HOST;

export const WITH_PARTYKIT = import.meta.env.DEV ? import.meta.env.WITH_PARTYKIT : true;
