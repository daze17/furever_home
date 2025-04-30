export const removeFalsyFromObject = (input: Record<string, unknown>) => {
  const output: Record<string, unknown> = {};

  Object.keys(input).forEach((key) => {
    if (input[key] !== undefined || input[key] !== null) {
      output[key] = input[key];
    }
  });

  return output;
};
