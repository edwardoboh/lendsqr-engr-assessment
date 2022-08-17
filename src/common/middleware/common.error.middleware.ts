import { Request, Response, NextFunction } from 'express'
import httpCodes from '../httpCodes';

class CommonErrorMiddleware {
    handleServerError(error: any, req: Request, res: Response, next: NextFunction) {
        const message = error.message
        res.status(httpCodes.SERVER_ERROR).json({
            status: 'failed',
            message
        })
    }

    handleRouteNotFound(req: Request, res: Response, next: NextFunction) {
        res.status(httpCodes.SERVER_ERROR).json({
            status: 'failed',
            message: "Endpoint deos no exist"
        })
    }
}

export default new CommonErrorMiddleware();