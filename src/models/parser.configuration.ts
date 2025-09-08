import { IReaderConfiguration } from './reader.configuration';
import { READER_TYPES } from '../readers';

export interface IParserConfiguration {
    readers: (keyof typeof READER_TYPES)[];
    readerConfigurations: IReaderConfiguration[];
    verbose?: boolean;
}
