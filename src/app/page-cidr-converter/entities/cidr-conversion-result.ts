export interface FromCidrConversionResult {
    cidr: string;
    mask: string;
    firstIP: string;
    lastIP: string;
    hosts: number;
}

export interface ToCidrConversionResult {
    startIp: string;
    endIp: string;
    mask: string;
    cidr: string;
    hosts: number;
}
