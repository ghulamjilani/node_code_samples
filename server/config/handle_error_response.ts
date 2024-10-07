export const handleErrorResponse = (error: any, response: any) => {
  const status = error?.response?.status ?? error?.status ?? 500
  const errors = error.response?.data?.Error?.Details ||
    (error?.response?.data?.Message && [error?.response?.data?.Message]) ||
    error?.messages || [
      {
        Message: 'Something went wrong',
      },
    ]
  response.status(status).json({
    status: false,
    errors,
  })
}
