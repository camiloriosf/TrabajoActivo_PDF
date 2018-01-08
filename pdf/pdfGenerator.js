const path = require('path');
const PdfPrinter = require('pdfmake');
const admin = require('firebase-admin');
const config = require('./config');
const serviceAccount = require('./serviceAccount.json');
// sections generators
const loadSections = require('./loadSections').load;
const personal = require('./sections/personal').generate;
const summary = require('./sections/summary').generate;
const skills = require('./sections/skills').generate;
const experience = require('./sections/experience').generate;
const education = require('./sections/education').generate;
const language = require('./sections/language').generate;
const certificates = require('./sections/certificates').generate;
const references = require('./sections/references').generate;
const salary = require('./sections/salary').generate;
const availability = require('./sections/availability').generate;

const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.databaseURL,
}, 'server');

const fonts = {
  Calibri: {
    normal: path.join(__dirname, '/fonts/Calibri.ttf'),
    bold: path.join(__dirname, '/fonts/CalibriBold.ttf'),
  },
};

exports.generatePDF = async ({ req, res }) => {
  try {
    const db = firebase.firestore();
    const { id } = req.params;
    const cv = await db.collection('cvs').doc(id).get();
    if (cv.exists) {
      const {
        name, active, visits, userId,
      } = cv.data();
      if (!active) {
        res.send(`CV con id ${req.params.id} está inactivo`);
        return;
      }
      const user = await db.collection('users').doc(userId).get();
      if (user.exists) {
        const { disabled } = user.data();
        if (disabled) {
          res.send(`No es posible acceder a CV con id: ${req.params.id}`);
          return;
        }
      } else {
        res.send('No fue posible generar el CV, ponte en contacto con nosotros');
        return;
      }
      const baseDoc = await db.collection('cvs').doc('base').get();
      if (baseDoc.exists) {
        const { sections } = baseDoc.data();
        const sectionsDoc = await db.collection('cvs').doc(id).collection('sections').get();
        if (sectionsDoc.empty) {
          res.send(`CV con id ${req.params.id} vacío`);
          return;
        }
        const sortedItems = await loadSections({
          sectionsDoc, sections, id, db,
        });
        const content = [];
        sortedItems.forEach((item) => {
          const {
            data,
            text,
            hidden,
          } = item;
          if (item.id === 'personal' && !hidden) content.push(...personal({ data }));
          if (item.id === 'summary' && !hidden) content.push(...summary({ data, text }));
          if (item.id === 'skills' && !hidden) content.push(...skills({ data, text }));
          if (item.id === 'experience' && !hidden) content.push(...experience({ data, text }));
          if (item.id === 'education' && !hidden) content.push(...education({ data, text }));
          if (item.id === 'language' && !hidden) content.push(...language({ data, text }));
          if (item.id === 'certificates' && !hidden) content.push(...certificates({ data, text }));
          if (item.id === 'references' && !hidden) content.push(...references({ data, text }));
          if (item.id === 'salary' && !hidden) content.push(...salary({ data, text }));
          if (item.id === 'availability' && !hidden) content.push(...availability({ data, text }));
        });
        const printer = new PdfPrinter(fonts);
        const docDefinition = {
          pageSize: 'LETTER',
          pageMargins: [72, 40, 72, 40],
          styles: {
            base: {
              font: 'Calibri',
              fontSize: 11,
              bold: false,
              alignment: 'left',
              lineHeight: 1.25,
              margin: [0, 0, 0, 20],
            },
          },
          pageBreakBefore(currentNode, followingNodesOnPage, nodesOnNextPage) {
            if (currentNode.id === 'titleTable') {
              if (followingNodesOnPage.length > 1) {
                if (followingNodesOnPage[1].pageNumbers.length > 1) return true;
              } else if (nodesOnNextPage.length > 1) {
                if (currentNode.headlineLevel === nodesOnNextPage[0].id) return true;
              }
            }
            return currentNode.stack && currentNode.id && currentNode.pageNumbers.length > 1;
          },
          info: {
            title: name,
            author: 'eCV',
          },
          content,
        };
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        res.setHeader('Content-disposition', `filename=${name}.pdf`);
        pdfDoc.pipe(res);
        // Save view
        db.collection('cvs').doc(id)
          .update({
            visits: visits + 1,
          });
        pdfDoc.end();
        return;
      }
      res.send('Oops, algo malo ocurrió, ponte en contacto con nosotros.');
    } else {
      res.send(`CV con id ${req.params.id} no existe`);
    }
  } catch (error) {
    res.send(`id: ${req.params.id}, error: ${error}`);
  }
};
