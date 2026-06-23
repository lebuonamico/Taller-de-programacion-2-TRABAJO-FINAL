const createHttpError = (message, status = 500, details = undefined) => {
    const error = new Error(message)
    error.status = status
    if (details) error.details = details
    return error
}

export default createHttpError
