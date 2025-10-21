const response = (statusCode, data, message, res) => {
    res.status(statusCode).json([
        {
            payload: data,
            message,
            metaData: {
                prev: '',
                next: '',
                current: ''
            }
        }
    ])
}

module.exports = response