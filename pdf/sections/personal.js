exports.generate = ({ data }) => {
  if (!data) return [];
  const {
    names = '',
    lastNames = '',
    phone = '',
    email = '',
    web = '',
    address = '',
  } = data;
  let text = '';
  if (phone !== '') text += `${phone} | `;
  if (email !== '') text += `${email} | `;
  if (web !== '') text += `${web} | `;
  if (address !== '') text += `${address} | `;
  text = text.slice(0, -3);
  return ([
    {
      text: `${names} ${lastNames}`,
      style: 'base',
      alignment: 'center',
      bold: true,
      fontSize: 18,
      margin: [0, 0, 0, 10],
    },
    {
      text,
      style: 'base',
      alignment: 'center',
    },
  ]
  );
};
