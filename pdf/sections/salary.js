exports.generate = ({ data, text }) => {
  if (!data) return [];
  const {
    from = '',
    to = '',
    range = false,
  } = data;
  let salary = '';
  if (from === '') return [];
  if (range) salary = `$${from} - $${to} líquidos`;
  else salary = `$${from} líquidos`;
  return [
    {
      text: [
        { text: `${text}: `, bold: true },
        { text: salary },
      ],
      style: 'base',
    },
  ];
};
