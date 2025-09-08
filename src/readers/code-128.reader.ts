import { BaseReader } from './base.reader';
import {
    APPLICATION_IDENTIFIERS,
    IBarcodeValue,
    IReaderConfiguration,
    ApplicationIdentifier,
    BarcodeValue,
} from '../models';
import { CONTROLCHARS } from '../config';
import { AimCodes, Symbologies } from '../enums';
import { AimParser } from '../utils';
import { BarcodeValueEntry, ParsedBarcode } from '../models/parsed-barcode';

const DELIMITER = ' ';

export class Code128Reader extends BaseReader {
    constructor(readerConfig?: IReaderConfiguration) {
        super(Symbologies.Code128, null, readerConfig);
    }

    public validate(value: string): boolean {
        const idPrefix = value.indexOf(AimCodes.CODE128);

        const valueLength = AimParser.parseAimCode(
            this.symbology,
            value
        ).length;
        return idPrefix === 0 && valueLength > 0;
    }

    protected removeControlCharacters(value: string): string {
        let result = value;
        CONTROLCHARS.forEach((charCode) => {
            result = result.replace(String.fromCharCode(charCode), DELIMITER);
        });
        return result;
    }

    protected findAi(value: string) {
        let ai: ApplicationIdentifier | null = null;
        let codeLength = 2;
        while (ai === null && codeLength < 5) {
            const code = value.substr(0, codeLength);
            const ais = APPLICATION_IDENTIFIERS.filter((x) => {
                return x.code === code;
            });
            if (ais.length > 0) {
                ai = ais[0];
            } else {
                codeLength++;
            }
        }
        return ai;
    }

    protected parseValue(ai: ApplicationIdentifier, input: string) {
        let val: string | number | null = null;
        if (ai.fractional !== true) {
            val = input.substr(ai.code.length, ai.length);
        } else {
            const scale = Number(input.charAt(ai.code.length));
            const num = input.substr(ai.code.length + 1, ai.length);

            val = Number(num) / Math.pow(10, scale);
        }

        return {
            code: ai.code,
            value: val,
        };
    }

    protected parseValues(input: string) {
        let vals: BarcodeValueEntry[] = [];
        const ai = this.findAi(input);

        if (ai) {
            if (input.length > ai.totalLength) {
                vals = vals.concat(
                    this.parseValues(input.substr(ai.totalLength))
                );
            }

            vals.push(this.parseValue(ai, input));
        }

        return vals;
    }

    public decode(value: string): IBarcodeValue {
        const sterilizedValue = this.removeControlCharacters(value);
        const result = new BarcodeValue(this.symbology, value);
        try {
            this.tryValidate(value);
            const valWithoutId = AimParser.parseAimCode(
                this.symbology,
                sterilizedValue
            );
            result.values = valWithoutId
                .split(DELIMITER)
                .flatMap((val) => this.parseValues(val));
        } catch (ex) {
            result.success = false;
            result.errorMessage =
                ex instanceof Error ? ex.message : JSON.stringify(ex);
        }
        return result;
    }

    public decodeOrThrow(value: string): ParsedBarcode {
        const sterilizedValue = this.removeControlCharacters(value);

        this.tryValidate(value);
        const valWithoutId = AimParser.parseAimCode(
            this.symbology,
            sterilizedValue
        );
        const values = valWithoutId
            .split(DELIMITER)
            .flatMap((val) => this.parseValues(val));
        return new ParsedBarcode(this.symbology, value, values);
    }
}
