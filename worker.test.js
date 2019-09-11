const identity = x => x;

const worker = (values) => {
  const _reduce = (mapF, f, initialValue) =>  {
    return {
      get: async () => {
        const elements = await mapF()
        return elements.reduce(f, initialValue);
      }
    }
  }

  const map = (f) => {
    const mapF = async () => values.map(f);

    return {
      reduce: (f, initialValue) => _reduce(mapF, f, initialValue),
    }
  }

  return {
    map,
  };
};

const mapFunction = text => {
  return [
    text.split(/\s+/).filter(identity).length,
    text.startsWith(' '),
    text.endsWith(' '),
  ];
}

const reduceFunction = (acc, [count, startSpace, endSpace]) => {
  if (!acc.endSpace && !startSpace) {
    acc.count -= 1;
  }
  return {
    count: acc.count + count,
    endSpace,
  };
};

test('word count', async () => {
  const { count } = await worker(['this i', 's a pe', 'n.'])
    .map(mapFunction)
    .reduce(reduceFunction, { count: 0, endSpace: true })
    .get();

  expect(count).toBe(4);
});

test('word count 2', async () => {
  const { count } = await worker(['this ', 'is a ', 'pen.'])
    .map(mapFunction)
    .reduce(reduceFunction, { count: 0, endSpace: true })
    .get();

  expect(count).toBe(4);
});
