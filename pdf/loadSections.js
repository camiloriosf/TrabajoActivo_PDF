const _ = require('lodash');

exports.load = async ({
  sectionsDoc, sections, id, db,
}) => {
  const items = [];
  sectionsDoc.docs.forEach((item) => {
    const {
      order,
      hidden,
      text,
      data = null,
    } = item.data();
    const newItem = _.find(sections, section => section.id === item.id);
    newItem.order = order;
    newItem.hidden = hidden;
    newItem.text = text;
    newItem.data = data;
    items.push(newItem);
  });
  const sortedItems = _.sortBy(items, ['order']);
  if (sortedItems.length >= sections.length) {
    return sortedItems;
  }
  const batch = db.batch();
  sections.forEach(async (item) => {
    if (!_.find(sortedItems, section => section.id === item.id)) {
      const newItem = item;
      newItem.order = sortedItems.length;
      batch.set(
        db.collection('cvs').doc(id).collection('sections').doc(newItem.id),
        {
          order: newItem.order,
          text: newItem.text,
          hidden: newItem.hidden,
          icon: newItem.icon,
          dragButton: newItem.dragButton,
          hideButton: newItem.hideButton,
        },
        { merge: true },
      );
      sortedItems.push(newItem);
    }
  });
  await batch.commit();
  return sortedItems;
};
