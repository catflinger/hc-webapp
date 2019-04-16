export class AppContext {
    constructor(
        public readonly programId: string,
        public readonly ruleId: string,
        public readonly busy: boolean = false,
    ) {}
}

