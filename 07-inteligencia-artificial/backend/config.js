export const DEFAULTS = {
	LIMIT_PAGINATION: 10,
	LIMIT_OFFSET: 0,
	PORT: 1234,
};

// export const CONFIG = {
// 	MODEL_AI: process.env.MODEL_AI ?? "gpt-4o-mini",
// };
export const CONFIG = {
	MODEL_AI: process.env.MODEL_AI ?? "gemma-4-26b-a4b-it",
};
// es mejor práctica hacerlo de este modo.
