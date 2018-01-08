const moment = require('moment');
const _ = require('lodash');
require('moment/locale/es');

exports.generate = ({ data, text }) => {
  if (!data) return [];
  const items = [];

  data.forEach((element, index, array) => {
    let margin;
    let dates = '';
    if (index === array.length - 1) margin = [0, 0, 0, 20];
    else margin = [0, 0, 0, 10];
    const from = moment(element.from, 'DD-MM-YYYY').isValid()
      ? _.startCase(_.toLower(moment(element.from, 'DD-MM-YYYY').format('MMMM YYYY')))
      : '';
    const to = moment(element.to, 'DD-MM-YYYY').isValid()
      ? _.startCase(_.toLower(moment(element.to, 'DD-MM-YYYY').format('MMMM YYYY')))
      : '';
    if (element.actual) dates = `${from} - a la fecha`;
    else dates = `${from} - ${to}`;
    const responsibilities = [];
    element.responsibilities.forEach((responsibility) => {
      if (responsibility.text !== '') responsibilities.push(responsibility.text);
    });
    const achievements = [];
    element.achievements.forEach((achievement) => {
      if (achievement.text !== '') achievements.push(achievement.text);
    });
    const stack = [];
    if (element.role !== '' || element.company !== '' || dates !== ' - ') {
      stack.push({
        columns: [
          {
            text: [
              { text: `${element.role}, `, bold: true },
              { text: element.company },
            ],
            width: 'auto',
          },
          {
            text: dates,
            alignment: 'right',
            width: '*',
          },
        ],
        style: 'base',
        margin: [0, 0, 0, 0],
      });
    }
    if (responsibilities.length > 0) {
      stack.push({
        text: 'Responsabilidades/Funciones',
        style: 'base',
        margin: [10, 0, 0, 0],
      });
      stack.push({
        ul: responsibilities,
        style: 'base',
        margin: [20, 0, 0, 0],
      });
    }
    if (achievements.length > 0) {
      stack.push({
        text: 'Logros',
        style: 'base',
        margin: [10, 0, 0, 0],
      });
      stack.push({
        ul: achievements,
        style: 'base',
        margin: [20, 0, 0, 0],
      });
    }
    items.push({
      stack,
      id: 'experience',
      margin,
    });
  });
  if (items.length === 0) return [];
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
      headlineLevel: 'experience',
    },
    ...items,
  ];
};
