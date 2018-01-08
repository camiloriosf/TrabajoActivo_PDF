exports.generate = ({ data, text }) => {
  if (!data) return [];
  const {
    summary = '',
  } = data;
  if (summary === '') return [];

  return ([
    {
      stack: [
        {
          text: summary,
          style: 'base',
        },
      ],
      id: 'summary',
    },
  ]);
};
