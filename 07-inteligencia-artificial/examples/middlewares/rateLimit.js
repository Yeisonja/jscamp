const { rateLimit } = require("express-rate-limit");

const rateLimitMiddleware = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: "Demasiadas solicitudes. Inténtalo de nuevo más tarde." },
});

module.exports = { rateLimitMiddleware };
