export interface FromCidrConversionResult {
    maskOnly: boolean;
    cidr: string;
    mask: string;
    firstIP: string;
    lastIP: string;
    hosts: number;
}

export interface ToCidrConversionResult {
    startIp: string;
    endIp: string;
    mask: string | null;
    cidr: string;
    hosts: number;
}
