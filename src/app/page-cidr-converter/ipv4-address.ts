
function toInt(v: any): number {
    if (!v) {
        return 0;
    }
    if (Number.isInteger(v)) {
        return v;
    }
    const p = parseInt(v);
    return Number.isNaN(p) ? 0 : p;
}

export class IPv4Address {
    public quad: number[] = [0, 0, 0, 0];
    public bits: number | null = null;

    constructor(a: number | number[], b?: number, c?: number, d?: number, bits?: number) {
        if (Array.isArray(a)) {
            for (let i = 0; i < 4; i++) {
                this.quad[i] = toInt(a[i]);
            }
            if (b) {
                this.bits = toInt(b);
            }
        } else {
            this.quad[0] = toInt(a);
            this.quad[1] = toInt(b);
            this.quad[2] = toInt(c);
            this.quad[3] = toInt(d);
        }
        if (bits) {
            this.bits = toInt(bits);
        }
        if (!this.checkValidity()) {
            console.error("Invalid IP Address: " + this.toString());
        }
    }

    static parse(str: string): IPv4Address | null {
        const test = /^\s*(\d+)\.(\d+)\.(\d+)\.(\d+)(?:\/(\d+))?\s*$/;
        const match = test.exec(str);
        if (match === null) {
            return null;
        }

        const q: number[] =  [0, 0, 0, 0];
        for (let i = 0; i < 4; i++) {
            q[i] = toInt(match[i + 1]);
        }
        const bits = match[5] ? toInt(match[5]) : undefined;

        const ip = new IPv4Address(q, bits);

        if (!ip.checkValidity()) {
            return null;
        }

        return ip;
    }

    static toTupples(num: number): number[] {
        const tupples = [0, 0, 0, 0];
        for (let i = 3; i >= 0; i--) {
            tupples[i] = (num & 255);
            num >>= 8;
        }
        return tupples;
    }

    static fromInt(num: number): IPv4Address {
        return new IPv4Address(IPv4Address.toTupples(num));
    }

    public lessThen(other: IPv4Address): boolean {
        return this.toInt() < other.toInt();
    }

    public toString = (): string => {
        return this.quad.join(".") + (this.bits ? "/" + this.bits : "");
    }

    public toInt(): number {
        let output: number = 0;
        for (let i = 0; i < 4; i++) {
            output <<= 8;
            output |= (this.quad[i] & 255);
        }
        return output;
    }

    private checkValidity(): boolean {
        for (let i = 0; i < 4; i++) {
            if (this.quad[i] < 0 || this.quad[i] > 255) {
                return false;
            }
        }
        if (this.bits && (this.bits < 1 || this.bits > 32)) {
            return false;
        }
        return true;
    }
}
