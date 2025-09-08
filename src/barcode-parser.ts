import { READER_TYPES } from './readers';
import {
    IBarcodeValue,
    BarcodeValue,
    IParserConfiguration,
    IReaderConfiguration,
} from './models';
import { ParsedBarcode } from './models/parsed-barcode';
import { BaseReader } from './readers/base.reader';

export class BarcodeParser {
    readonly #readers: BaseReader[];

    constructor({
        readers,
        readerConfigurations,
        verbose,
    }: IParserConfiguration) {
        this.#readers = [];

        readers.forEach((r) => {
            let readerConfig: IReaderConfiguration | undefined;

            if (readerConfigurations.length) {
                const configs = readerConfigurations.filter(
                    (c) => c !== undefined && r === c.symbology
                );
                readerConfig = configs.pop();
            }

            const readerToUse = READER_TYPES[r];

            if (readerToUse) {
                // can be gs-1reader etc
                this.#readers.push(new readerToUse(readerConfig));
            }
        });

        if (verbose) {
            this.#readers.forEach((reader) =>
                console.log('Reader Initialized: ', reader)
            );
        }
    }

    public parse(barcodeVal: string): IBarcodeValue {
        let result: IBarcodeValue | null = null;

        this.#readers.forEach((reader) => {
            if (reader.validate(barcodeVal)) {
                result = reader.decode(barcodeVal);
            }
        });

        if (!result) {
            result = new BarcodeValue(null, barcodeVal);
            result.errorMessage = 'No Reader Found';
            result.success = false;
        }
        return result;
    }
}
