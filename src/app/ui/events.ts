import { IProgram } from 'src/common/interfaces';

export interface INamedProgramEvent {
    name: string, 
    program: IProgram,
    displayName: string,
}

export type IDeleteProgramEvent = string;
export type IRuleClickEvent = string[];