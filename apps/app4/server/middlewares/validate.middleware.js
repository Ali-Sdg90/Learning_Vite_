const validate = (schema) => (req, _res, next) => {
    const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
    });

    if (!result.success) {
        // می‌فرستیم به errorMiddleware که تمیز خروجی بده
        return next(result.error);
    }

    // داده‌ی تمیز و تایید شده
    req.validated = result.data;
    next();
};

module.exports = { validate };
