import { IRouter, IRouterMatcher, NextFunction, Request, Response } from "express";
import { safeRoute } from "./HOF";

/**
 * Registers a route with the given route matcher. The given function
 * is wrapped by safeRoute to ensure any errors are handled safely
 * @param routerMatcher The routerMatcher to be used for this route
 * @param routePath The route path to match
 * @param routeFunc The function to invoke when the route patch is matched
 */
export function createSafeRoute<
    T extends (req: Request, res: Response, nxt: NextFunction) => Promise<void>
>(routerMatcher: IRouterMatcher<IRouter>, routePath: string, routeFunc: T): void {
    //NOTE: the routeMatcher loses the binding when passed through to another function
    //  This explodes the complexity of creating a HOF like this. The increse in complexity
    //  to create the proper bindings is likely not worth the trivial 
    routerMatcher(routePath, safeRoute(routeFunc));
};