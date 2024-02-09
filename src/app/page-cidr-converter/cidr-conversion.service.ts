import { Injectable } from "@angular/core";
import { IPv4Address } from "./ipv4-address";
import { FromCidrConversionResult, ToCidrConversionResult } from "./cidr-conversion-result";

const FULL_MASK = 0xFFFFFFFF;

@Injectable({
    providedIn: 'root'
})
export class CidrConversionService {

    convertFromCidr(ip: IPv4Address): FromCidrConversionResult | null {
        if (!ip.bits) {
            return null;
        }

        const intAddress = ip.toInt();
        const intMask = (FULL_MASK << (32 - ip.bits)) & FULL_MASK;
        const invIntMask = (~intMask) & FULL_MASK;
        const maskAddress = IPv4Address.fromInt(intMask);

        const result: FromCidrConversionResult = {
            cidr: ip.toString(),
            mask: maskAddress.toString(),
            firstIP: IPv4Address.fromInt(intAddress & intMask).toString(),
            lastIP: IPv4Address.fromInt(intAddress | invIntMask).toString(),
            hosts: invIntMask + 1,
        };
        return result;
    }

    convertToCidr(startIp: IPv4Address, endIp: IPv4Address): ToCidrConversionResult | null {

        const startNum = startIp.toInt();
        const endNum = endIp.toInt();
        const [intMask, bitCount] = this.findCommonMask(startNum, endNum);
        const invIntMask = (~intMask) & FULL_MASK;
        const maskAddress = IPv4Address.fromInt(intMask);
        const startCidr = new IPv4Address(IPv4Address.toTupples(startNum & intMask), bitCount);

        const result: ToCidrConversionResult = {
            startIp: startIp.toString(),
            endIp: endIp.toString(),
            mask: maskAddress.toString(),
            cidr: startCidr.toString(),
            hosts: invIntMask + 1,
        };
        return result;
    }

    private findCommonMask(a: number, b: number): number[] {
        let mask: number = 0;
        let count: number = 0;
        for (let i = 31; i >= 0; i--, count++) {
            const bit = 1 << i;
            if ((a & bit) != (b & bit)) {
                break;
            }
            mask |= bit;
        }
        return [mask, count];
    }
}
