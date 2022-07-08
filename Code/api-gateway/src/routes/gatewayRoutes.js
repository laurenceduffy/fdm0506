import { validateToken, authoriseRoutes, adminRoutes, validateAdmin } from "../authUtil";
import { noAuthHeaderResponse } from "../commonResponses";
import authRoutes from "./authRoutes";
import stockRoutes from "./stockRoutes";
import verifyRoutes from "./verifyRoutes";
import brokerRoutes from "./brokerRoutes";
import reportingRoutes from "./reportingRoutes";

const routes = app => {
    app.use('/', async (req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        const route = `${req.method}${req.url}`;
        const isAuthRoute = authoriseRoutes.includes(route);
        const isAdminRoute = adminRoutes.includes(route);

        if(isAuthRoute || isAdminRoute) {
            const { authorization } = req.headers;
            if (!authorization) return noAuthHeaderResponse(res);

            let validToken;

            if(isAdminRoute && isAuthRoute) {
                validToken = await validateToken(authorization, res) || await validateAdmin(authorization, res);
            } else {
                validToken = isAuthRoute ? await validateToken(authorization, res) : await validateAdmin(authorization, res);
            }

            if(validToken) {
                next();
            } else {
                return res.status(401).json({error: `Bearer token invalid`});
            }
        } else {
            next();
        }
    });

    authRoutes(app);
    stockRoutes(app);
    verifyRoutes(app);
    brokerRoutes(app);
    reportingRoutes(app);

    app.all('*', async (req, res) => {
        return res.status(404).json({error: `No route found for ${req.url}`});
    })

    app.use(async (err, req, res, next) => {
        console.error(`CAUGHT ERR: '${err.message}' at route '${req.url}'`);
        return res.status(500).json({error: err.message});
    })
}

export default routes;