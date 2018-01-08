const translate = ({ availability }) => {
  switch (availability) {
    case 'commission':
      return 'Comisionista';
    case 'freelance':
      return 'Free Lance';
    case 'fullTime':
      return 'Jornada Completa';
    case 'partTime':
      return 'Part Time';
    case 'shifts':
      return 'Por Turnos';
    case 'trainee':
      return 'Práctica Profesional';
    case 'substitution':
      return 'Reemplazo';
    default:
      return '';
  }
};

exports.generate = ({ data, text }) => {
  if (!data) return [];
  const { availability = '' } = data;
  if (translate({ availability }) === '') return [];
  return [
    {
      text: [
        { text: `${text}: `, bold: true },
        { text: translate({ availability }) },
      ],
      style: 'base',
    },
  ];
};
