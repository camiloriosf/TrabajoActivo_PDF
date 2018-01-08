const starsToLevel = ({ stars }) => {
  switch (stars) {
    case 1:
      return 'Usuario';
    case 2:
      return 'Usuario avanzado';
    case 3:
      return 'Medio';
    case 4:
      return 'Profesional';
    case 5:
      return 'Experto';
    default:
      return '';
  }
};

const isEvenStrict = n => (n === parseFloat(n) ? !(n % 2) : undefined);

exports.generate = ({ data, text }) => {
  if (!data) return [];
  let col1 = '';
  let col2 = '';
  data.forEach((element, index) => {
    if (isEvenStrict(index)) {
      if (col1 !== '') col1 += '\n';
      if (element.skill !== '') col1 += element.skill;
      if (element.description !== '') col1 += ` (${element.description})`;
      const level = starsToLevel({ stars: element.stars });
      if (level !== '') col1 += ` - ${level}`;
    } else {
      if (col2 !== '') col2 += '\n';
      if (element.skill !== '') col2 += element.skill;
      if (element.description !== '') col2 += ` (${element.description})`;
      const level = starsToLevel({ stars: element.stars });
      if (level !== '') col2 += ` - ${level}`;
    }
  });
  if (col1 === '' && col2 === '') return [];
  return [
    {
      stack: [
        {
          columns: [
            {
              text: col1,
              margin: [5, 0, 5, 0],
            },
            {
              text: col2,
              margin: [5, 0, 5, 0],
            },
          ],
          style: 'base',
          alignment: 'left',
          margin: [10, 0, 10, 20], // 20
          bold: true,
        },
      ],
      id: 'skills',
    },
  ];
};
