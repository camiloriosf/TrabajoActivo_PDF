exports.generate = ({ data, text }) => {
  if (!data) return [];
  const ul = [];
  data.forEach((element) => {
    const {
      name = '',
      relationship = '',
      email = '',
      mobile = '',
    } = element;
    const heading = [];
    let contactInfo = '';
    if (name !== '') heading.push({ text: name, bold: true });
    if (relationship !== '') heading.push({ text: ` - ${relationship}` });
    if (heading.length !== 0) ul.push({ text: heading });
    if (email !== '') contactInfo += email;
    if (mobile !== '') {
      if (email !== '') contactInfo += `, ${mobile}`;
      else contactInfo += mobile;
    }
    if (contactInfo !== '') {
      ul.push({
        text: contactInfo,
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
      headlineLevel: 'references',
    },
    {
      stack: [
        {
          ul,
          style: 'base',
          margin: [20, 0, 0, 0],
        },
      ],
      id: 'references',
      margin: [0, 0, 0, 20],
    },
  ];
};
