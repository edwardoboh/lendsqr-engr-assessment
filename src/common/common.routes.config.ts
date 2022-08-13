import express from 'express';

export abstract class CommonRoutesConfig {
    router: express.Router;
    name: string;

    constructor(router: express.Router, name: string) {
        this.router = router;
        this.name = name;
    }

    getName(): string {
        return this.name;
    }

    abstract configureRoutes(): express.Router;
}