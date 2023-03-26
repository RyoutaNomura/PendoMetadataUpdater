
export interface VisitorMetadata {
    visitorId: string;
    values: {
        [key: string]: string
    };
};
export interface AccountMetadata {
    accountId: string;
    values: {
        [key: string]: string
    };
}

export type PendoMetadataKind = 'visitor' | 'account';