import { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Returns a request handler that automatically catches any errors
 * that may occur durring the invokation of the given function. If an
 * error occurs a 500 response is automatically sent. 
 * @param routeFunc the envoked function for the route
 * @returns a requestHandler that calls the given route function and catches errors
 */
export function safeRoute<
    T extends (req: Request, res: Response, ...rest: any[]) => any
>(routeFunc: T): RequestHandler {
    return (request: Request, response: Response, ...rest: any[]): ReturnType<T> | undefined => {
        try {
            return routeFunc(request, response, ...rest);
        } catch (err) {
            //TODO: We can probably improve this logging here. 
            //  Is there a way to give arrow functions a name inline?
            console.error(`Some error occurred: ${err.message}`)
            response.status(500).send(err.message);
            return;
        }
    };
}