const moment = require('moment');
const _ = require('lodash');
require('moment/locale/es');

exports.generate = ({ data, text }) => {
  if (!data) return [];
  const ul = [];
  data.forEach((element) => {
    const {
      career = '',
      university = '',
      description = '',
      studying = false,
    } = element;
    const heading = [];
    let dates = '';
    if (career !== '') heading.push({ text: `${career} - `, bold: true });
    const from = moment(element.from, 'DD-MM-YYYY').isValid()
      ? _.startCase(_.toLower(moment(element.from, 'DD-MM-YYYY').format('MMMM YYYY')))
      : '';
    const to = moment(element.to, 'DD-MM-YYYY').isValid()
      ? _.startCase(_.toLower(moment(element.to, 'DD-MM-YYYY').format('MMMM YYYY')))
      : '';
    if (studying) dates = `${from} - estudiando`;
    else dates = `${from} - ${to}`;
    if (university !== '') heading.push({ text: `${university} (${dates})` });
    else if (dates !== ' - ') heading.push({ text: dates });
    if (heading.length !== 0) ul.push({ text: heading });
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
      headlineLevel: 'education',
    },
    {
      stack: [
        {
          ul,
          style: 'base',
          margin: [20, 0, 0, 0],
        },
      ],
      id: 'education',
      margin: [0, 0, 0, 20],
    },
  ];
};
