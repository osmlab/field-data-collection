const wait = timeout => new Promise(resolve => setTimeout(resolve, timeout));

export const timeout = (p, timeout = 30e3) =>
  Promise.race([
    p,
    wait(timeout).then(() => {
      throw new Error(`Timed out after ${timeout} ms`);
    })
  ]);
