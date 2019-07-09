/*
All these interfaces are intended for use with immutable classes.
*/
export type RoleType = "hw" | "bedroom";

export interface IProgram {
    id: string;
    name: string;
    minHwTemp: number;
    maxHwTemp: number;
    getRules(): ReadonlyArray<IRuleConfig>;
    toMutable(): IProgramM;
}

// interface for the mutable version of Program
export interface IProgramM {
    id: string;
    name: string;
    minHwTemp: number;
    maxHwTemp: number;
    rules: IRuleConfig [];
}

export interface IRuleConfig {
    id: string;
    startTime: ITimeOfDay;
    endTime: ITimeOfDay;

    role?: RoleType;
    temp?: number;
}

export interface ITimeOfDay {
    hour: number;
    minute: number;
    second: number;

    isLaterThan(other: ITimeOfDay): boolean;
    isSameAs(other: ITimeOfDay): boolean;
    isEarlierThan(other: ITimeOfDay): boolean;

    addHours(hours: number): ITimeOfDay;
    addMinutes(minutes: number): ITimeOfDay;
    addSeconds(seconds: number): ITimeOfDay;

    toSeconds(): number;
    toString(): string;

    justBefore(): ITimeOfDay;
}

export interface IDayOfYear {
    year: number;
    month: number;
    day: number;

    isToday(date: Date): boolean;
    isSameAs(dayOfYear: IDayOfYear): boolean;

    getStartAsDate(): Date;
    getEndAsDate(): Date;
}

export interface IDayOfYearM {
    year: number;
    month: number;
    day: number;
}

export interface IControlState {
    heating: boolean;
    hotWater: boolean;
}

export interface IConfiguration {
    getProgramConfig(): ReadonlyArray<IProgram>;
    getNamedConfig(): INamedConfig;
    getDatedConfig(): ReadonlyArray<IDatedConfig>;
    getSensorConfig(): ReadonlyArray<ISensorConfig>;
    toMutable(): IConfigurationM;
}

// interface for the mutable version of Program
export interface IConfigurationM {
    datedConfig: IDatedConfigM[];
    namedConfig: INamedConfigM;
    programConfig: IProgramM [];
    sensorConfig: ISensorConfigM [];
}

export interface INamedConfig {
    weekdayProgramId: string;
    saturdayProgramId: string;
    sundayProgramId: string;
}

// interface for the mutable version of named config
type INamedConfigM = INamedConfig;

export interface IDatedConfig {
    programId: string;
    dayOfYear: IDayOfYear;
}

// interface for the mutable version of dated config
export interface IDatedConfigM {
    programId: string;
    dayOfYear: IDayOfYearM;
}

export interface ISensorConfig {
    id: string;
    description: string;
    role: RoleType;
    reading: number;
    displayColor: string; // as html name or #RRGGBB
    displayOrder: number;
}

// interface for the mutable version of sensor config
export type ISensorConfigM = ISensorConfig;

// the data required for senor configuration and the data required for displaying readings
// is almost identical.  The same interface is used for both
export type ISensorReading = ISensorConfig;

export interface IOverride {
    readonly id: string;
    readonly date: Date;
    readonly rule: IRuleConfig;
}

export interface ILogEntry {
    // the time (and date) of this entry
    date: Date;

    // the control state at this time
    heating: boolean;
    hotWater: boolean;

    // the sensor values at this time
    readings: ReadonlyArray<number>;
}

export interface ILogExtract {

    dayOfYear: IDayOfYear;

    // the records themselves
    sensors: ReadonlyArray<string>;
    entries: ReadonlyArray<ILogEntry>;
}

export interface ILogApiResponse {
    // the date and time the respose was generated
    date: Date;
    log: ILogExtract;
}

export interface IControlStateApiResponse {
    date: Date;
    controlState: IControlState;
    activeProgram: IProgram;
}

export interface IConfigApiResponse {
    date: Date;
    config: IConfiguration;
}

export interface IOverrideApiResponse {
    date: Date;
    overrides: ReadonlyArray<IOverride>;
}

export interface ISensorApiResponse {
    date: Date;
    sensors: ReadonlyArray<ISensorReading>;
}
