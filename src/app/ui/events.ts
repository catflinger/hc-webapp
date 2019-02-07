import { IProgram } from 'src/common/interfaces';

export interface INamedProgramEvent {
    name: string, 
    program: IProgram,
    displayName: string,
}