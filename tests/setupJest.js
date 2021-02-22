console.error = (error) => {
  // We need to make the error visible here to improve debugging.
  // However we can not use console.error(), as that would just loop.
  console.warn(error);

  fail(error);
};

process.on('unhandledRejection', (err) => {
  fail(err);
});
