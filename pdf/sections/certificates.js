const moment = require('moment');
const _ = require('lodash');
require('moment/locale/es');

exports.generate = ({ data, text }) => {
  if (!data) return [];
  const ul = [];
  data.forEach((element) => {
    const {
      title = '',
      noExpiration = false,
    } = element;
    let dates = '';
    const heading = [];
    const from = moment(element.from, 'DD-MM-YYYY').isValid()
      ? _.startCase(_.toLower(moment(element.from, 'DD-MM-YYYY').format('MMMM YYYY')))
      : '';
    const to = moment(element.to, 'DD-MM-YYYY').isValid()
      ? _.startCase(_.toLower(moment(element.to, 'DD-MM-YYYY').format('MMMM YYYY')))
      : '';
    if (from !== '' || to !== '' || noExpiration) {
      dates = ` (${from} - `;
      if (noExpiration) dates += 'No vence)';
      else dates += `${to})`;
    }
    if (title !== '') heading.push({ text: title, bold: true });
    if (dates !== '') heading.push({ text: dates });
    if (heading.length !== 0) ul.push({ text: heading });
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
      headlineLevel: 'certificates',
    },
    {
      stack: [
        {
          ul,
          style: 'base',
          margin: [20, 0, 0, 0],
        },
      ],
      id: 'certificates',
      margin: [0, 0, 0, 20],
    },
  ];
};
