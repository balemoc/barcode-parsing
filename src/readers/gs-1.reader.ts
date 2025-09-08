import { BaseReader } from './base.reader';
import { CONTROLCHARS } from '../config';
import { AimCodes, Symbologies } from '../enums';
import {
    IReaderConfiguration,
    IBarcodeValue,
    ApplicationIdentifier,
    BarcodeValue,
    APPLICATION_IDENTIFIERS,
} from '../models';

import { AimParser } from '../utils';
import { BarcodeValueEntry, ParsedBarcode } from '../models/parsed-barcode';

const DELIMITER = ' ';

export class GS1Reader extends BaseReader {
    constructor(readerConfig?: IReaderConfiguration) {
        super(Symbologies.GS1128, null, readerConfig);
    }

    public validate(value: string): boolean {
        const idPrefix = value.indexOf(AimCodes.GS1);

        const valueLength = AimParser.parseAimCode(
            this.symbology,
            value
        ).length;
        return idPrefix === 0 && valueLength > 0;
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
            console.log('Value without ID', valWithoutId);

            result.values = valWithoutId
                .split(DELIMITER)
                .flatMap((val) => this.parseValues(val));

            console.log('Parsed values', result.values);
        } catch (e) {
            result.success = false;
            result.errorMessage =
                e instanceof Error ? e.message : JSON.stringify(e);
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

    protected removeControlCharacters(value: string): string {
        let result = value;
        CONTROLCHARS.forEach((charCode) => {
            result = result.replace(String.fromCharCode(charCode), DELIMITER);
        });
        return result;
    }

    protected findAi(value: string): ApplicationIdentifier {
        let ai: ApplicationIdentifier = null;
        let codeLength = 2;
        while (ai === null && codeLength < 5) {
            const code = value.substr(0, codeLength);
            const ais = this.aiList.filter((x) => x.code === code);
            if (ais.length > 0) {
                ai = ais[0];
            } else {
                codeLength++;
            }
        }
        return ai;
    }

    protected parseValues(input: string) {
        let vals: BarcodeValueEntry[] = [];
        const ai = this.findAi(input);

        if (input.length > ai.totalLength) {
            vals = vals.concat(this.parseValues(input.substr(ai.totalLength)));
        }

        vals.push(this.parseValue(ai, input));

        return vals;
    }

    protected parseValue(ai: ApplicationIdentifier, input: string) {
        let val: string | number | undefined = undefined;

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

    protected get aiList(): ApplicationIdentifier[] {
        return this.configuration?.ai != null
            ? [...APPLICATION_IDENTIFIERS, this.configuration?.ai]
            : APPLICATION_IDENTIFIERS;
    }
}
