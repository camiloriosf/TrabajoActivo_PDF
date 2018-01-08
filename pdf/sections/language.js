const starsToLevel = ({ stars }) => {
  switch (stars) {
    case 1:
      return 'Bajo';
    case 2:
      return 'Medio';
    case 3:
      return 'Alto';
    case 4:
      return 'Bilingüe';
    default:
      return '';
  }
};

exports.generate = ({ data, text }) => {
  if (!data) return [];
  const ul = [];
  data.forEach((element) => {
    const {
      language = '',
      description = '',
      stars = 0,
    } = element;
    const heading = [];
    const level = starsToLevel({ stars });
    if (language !== '') heading.push({ text: language, bold: true });
    if (level !== '') heading.push({ text: ` - ${level}` });
    ul.push({ text: heading });
    if (description !== '') {
      ul.push({
        text: description,
        style: 'base',
        listType: 'none',
        margin: [10, 0, 0, 0],
      });
    }
  });
  if (ul.length === 0) return [];
  return [
    {
      table: {
        body: [
          [
            {
              border: [false, true, false, true],
              text,
              alignment: 'center',
              fontSize: 12,
              bold: true,
              margin: [0, 5, 0, 0],
            },
          ],
        ],
        widths: ['*'],
      },
      style: 'base',
      id: 'titleTable',
      headlineLevel: 'language',
    },
    {
      stack: [
        {
          ul,
          style: 'base',
          margin: [20, 0, 0, 0],
        },
      ],
      id: 'language',
      margin: [0, 0, 0, 20],
    },
  ];
};
