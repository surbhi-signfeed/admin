
const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./dbconnection');
const fs = require('fs');
const { parse, format, isValid } = require('date-fns');
const bcrypt = require('bcrypt');
const sharp = require('sharp');
const nodemailer = require('nodemailer');
// const mysql = require('mysql2');

const router = express.Router();


// Create uploads directory if not exists
const uploadDir = './public/images';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

router.use('/images', express.static(path.join(__dirname, 'public/images')));
const upload = multer({ storage: storage });




//add events
router.post('/upload-events', upload.array('image', 10), (req, res) => {
  try {
    const { title, description, stdate,eddate,endtime, time, locationdsc, venue, organiser, country, city, lat, log, slug ,seoTitle,seoDesc, seoKeyword, PageName } = req.body;

    // Check if all required fields are present
    if (!title || !description || !locationdsc || !stdate || !req.files) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Parse and validate the date
    const parsedDate = parse(stdate, 'yyyy-MM-dd', new Date());
    if (!isValid(parsedDate)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    const formattedDate = format(parsedDate, 'yyyy-MM-dd');

    
    // Parse and validate the date
    const parsedDate1 = parse(eddate, 'yyyy-MM-dd', new Date());
    if (!isValid(parsedDate1)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    const formattedDate1 = format(parsedDate1, 'yyyy-MM-dd');

    // Parse and validate the time
    const parsedTime = parse(time, 'HH:mm', new Date());
    if (!isValid(parsedTime)) {
      return res.status(400).json({ error: 'Invalid time format' });
    }
    const formattedTime = format(parsedTime, 'HH:mm:ss');

      // Parse and validate the time
      const parsedTime1 = parse(endtime, 'HH:mm', new Date());
      if (!isValid(parsedTime1)) {
        return res.status(400).json({ error: 'Invalid time format' });
      }
      const formattedTime1 = format(parsedTime1, 'HH:mm:ss');

    // Handle uploaded images (files)
    const reqFiles = [];
    const url = req.protocol + '://' + req.get('host');
    for (let i = 0; i < req.files.length; i++) {
      reqFiles.push(url + '/images/' + req.files[i].filename); // Adjusted path to match the static route
    }

    console.log({ reqFiles });

    // Save the data to the database
    const query = 'INSERT INTO events (title,description, endtime,eddate, stdate, time, locationdsc, image, venue, organiser, country, city, lat, log, slug,seoTitle,seoDesc, seoKeyword, PageName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?, ?,?,?)';
    db.query(query, [title, description,formattedTime1, formattedDate1,formattedDate, formattedTime, locationdsc,reqFiles, venue, organiser, country, city, lat, log, slug,seoTitle,seoDesc, seoKeyword, PageName], (err, result) => {
      if (err) {
        console.error('Database insertion error:', err);
        return res.status(500).json({ error: 'Database insertion failed' });
      }
      res.status(201).json({ message: 'Data uploaded successfully' });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// Serve static files from the public/images directory
// Update event endpoint
router.put('/update-event/:id', upload.array('image', 10), async (req, res) => {
  try {
    console.log('Received PUT request');
    console.log('Request URL:', req.originalUrl);
    console.log('Request params:', req.params);
    console.log('Request files:', req.files);
    console.log('Request body:', req.body);

    const { id } = req.params;
    const {
      title,
      description,
      stdate,
      eddate,
      endtime,
      time,
      locationdsc,
      venue,
      organiser,
      country,
      city,
      lat,
      log,
      slug,
      seoTitle,
seoDesc,
seoKeyword,
PageName
    } = req.body;

    // Log the request body
    console.log('Request body:', req.body);

    // Check if all required fields are present
    if (!title || !description || !locationdsc || !stdate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Handle uploaded images (files)
    const images = req.files ? req.files.map(file => {
      const url = req.protocol + '://' + req.get('host') + '/uploads/' + file.filename;
      return url;
    }) : [];

    // Update the data in the database
    const query = `
      UPDATE events SET
        title = ?, description = ?, endtime = ?, eddate = ?, stdate = ?, time = ?, locationdsc = ?, image = ?, venue = ?, organiser = ?, country = ?, city = ?, lat = ?, log = ?, slug = ? ,seoTitle = ?,
seoDesc = ?,
seoKeyword = ?,
PageName = ?
      WHERE id = ?
    `;
    const values = [
      title, description, endtime, eddate, stdate, time, locationdsc, images.join(','), venue, organiser, country, city, lat, log, slug, seoTitle, seoDesc, seoKeyword, PageName, id
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Database update error:', err);
        return res.status(500).json({ error: 'Database update failed' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'No record found with the given ID' });
      }
      res.status(200).json({ message: 'Data updated successfully' });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});




// Get all contacts
router.get('/event-list', async (req, res) => {
  try {
    const query = 'SELECT * FROM events';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


// add rent properties
router.post('/upload-rent', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'feature_image', maxCount: 1 },
  { name: 'qr', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      title, description, size, date, propertyType, price, bedrooms, features, country,
      city, location, approve, lat, log, zip, bathroom, slug, status, area, editor, shortTitle, seoTitle, seoDes, seoKeyword, PageName
    } = req.body;

    const baseURL = 'http://localhost:4000';

    const processImage = async (filePath) => {
      const ext = path.extname(filePath).toLowerCase();

      if (ext === '.webp') {
        // If the file is already a webp image, just return the URL
        return `${baseURL}/images/${path.basename(filePath)}`;
      } else {
        // Otherwise, compress and convert the image to webp format
        let buffer = await sharp(filePath)
          .webp({ quality: 80 })
          .toBuffer();

        while (buffer.length > 200 * 1024) { // 200 KB
          buffer = await sharp(buffer)
            .webp({ quality: 80 })
            .toBuffer();
        }

        const compressedPath = path.join(uploadDir, `${path.basename(filePath, ext)}.webp`);
        fs.writeFileSync(compressedPath, buffer);
        return `${baseURL}/images/${path.basename(compressedPath)}`;
      }
    };

    const images = req.files['images'] ? await Promise.all(req.files['images'].map(async (file) => {
      return await processImage(file.path);
    })) : null;

    const featureImage = req.files['feature_image'] ? await processImage(req.files['feature_image'][0].path) : null;
    const qrImage = req.files['qr'] ? await processImage(req.files['qr'][0].path) : null;

    // Parse and format the date
    let formattedDate;
    try {
      const parsedDate = parse(date, 'dd-MM-yyyy', new Date());
      formattedDate = format(parsedDate, 'yyyy-MM-dd');
    } catch (dateError) {
      return res.status(400).json({ error: 'Invalid date format. Use dd-MM-yyyy.' });
    }

    const query = `
      INSERT INTO rent (
        title, description, images, size, date, propertyType, price, bedrooms, features, country, 
        city, location, approve, lat, log, zip, bathroom, slug, status, area, editor, feature_image, qr, shortTitle, seoTitle, seoDes, seoKeyword, PageName
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      title, description, images ? images.join(',') : null, size, formattedDate, propertyType, price, bedrooms, features, country,
      city, location, approve, lat, log, zip, bathroom, slug, status, area, editor, featureImage, qrImage, shortTitle, seoTitle, seoDes, seoKeyword, PageName
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database insertion failed' });
      }
      res.status(201).json({ message: 'Data uploaded successfully', id: result.insertId });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});








router.put('/update-rent/:id', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'feature_image', maxCount: 1 },
  { name: 'qr', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    const { id } = req.params;
    const {
      title, description, size, date, propertyType, price, bedrooms, features, country,
      city, location, approve, lat, log, zip, bathroom, slug, status, area, editor, shortTitle, seoTitle, seoDes, seoKeyword, PageName
    } = req.body;

    const baseURL = 'http://localhost:4000';

    const processImage = async (filePath) => {
      const ext = path.extname(filePath).toLowerCase();

      if (ext === '.webp') {
        return `${baseURL}/images/${path.basename(filePath)}`;
      } else {
        let buffer = await sharp(filePath)
          .webp({ quality: 80 })
          .toBuffer();

        while (buffer.length > 200 * 1024) {
          buffer = await sharp(buffer)
            .webp({ quality: 80 })
            .toBuffer();
        }

        const compressedPath = path.join(uploadDir, `${path.basename(filePath, ext)}.webp`);
        fs.writeFileSync(compressedPath, buffer);
        return `${baseURL}/images/${path.basename(compressedPath)}`;
      }
    };

    const images = req.files['images'] ? await Promise.all(req.files['images'].map(async (file) => {
      return await processImage(file.path);
    })) : null;

    const featureImage = req.files['feature_image'] ? await processImage(req.files['feature_image'][0].path) : null;
    const qrImage = req.files['qr'] ? await processImage(req.files['qr'][0].path) : null;

    const dateString  = new Date(date);

// Convert to MySQL datetime format
const formattedDate = dateString.toISOString().slice(0, 19).replace('T', ' ');

    // let formattedDate ="2012-02-25";
    // try {
    //   const parsedDate = parse(date, 'dd-MM-yyyy', new Date());
    //   formattedDate = format(parsedDate, 'yyyy-MM-dd');
    // } catch (dateError) {
    //   return res.status(400).json({ error: 'Invalid date format. Use dd-MM-yyyy.' });
    // }

    const query = `
      UPDATE rent SET
        title = ?, description = ?, images = ?, size = ?, date = ?, propertyType = ?, price = ?, bedrooms = ?, features = ?, country = ?, 
        city = ?, location = ?, approve = ?, lat = ?, log = ?, zip = ?, bathroom = ?, slug = ?, status = ?, area = ?, editor = ?, 
        feature_image = ?, qr = ?, shortTitle = ?, seoTitle = ?, seoDes = ?, seoKeyword = ?, PageName = ?
      WHERE id = ?
    `;

    const values = [
      title, description, images ? images.join(',') : null, size, formattedDate, propertyType, price, bedrooms, features, country,
      city, location, approve, lat, log, zip, bathroom, slug, status, area, editor, featureImage, qrImage, shortTitle, seoTitle, seoDes, seoKeyword, PageName, id
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database update failed' });
      }
      res.status(200).json({ message: 'Data updated successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});



// Serve uploaded images
router.use('/images', express.static(uploadDir));
//route for add offplan
// API endpoint to save offplan

router.post('/upload-offplan', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'feature_image', maxCount: 1 },
  { name: 'qr', maxCount: 1 },
  { name: 'aboveBg', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
  { name: 'lowerBg', maxCount: 1 },
  { name: 'plansImg', maxCount: 5 },
  { name: 'floorPlanimg', maxCount: 5 },
]), async (req, res) => {
  try {
    const {
      title, description, sizeStart, sizeEnd, pos, community, date, propertyType, price, country,
      city, exectLocation, approve, lat, log, slug, editor,
      amenitiesTitle, amenitiesDsc, amenitiesAll, locationTitle, locationDsc, locationAll,
      plansTitle, plansDsc, plansAll, qusList, ansList, tm,builder,booking,    handover,
      construction,bcommunity,seoTitle, seoDesc, seoKeyword, PageName
    } = req.body;

    const baseURL = 'http://localhost:4000';

    const processImage = async (filePath) => {
      const buffer = await sharp(filePath)
        .webp({ quality: 80 })
        .toBuffer();

      let compressedBuffer = buffer;
      while (compressedBuffer.length > 200 * 1024) { // 200 KB
        compressedBuffer = await sharp(buffer)
          .webp({ quality: 80 })
          .toBuffer();
      }
      const compressedPath = path.join(uploadDir, `${path.basename(filePath, path.extname(filePath))}.webp`);
      fs.writeFileSync(compressedPath, compressedBuffer);
      return `${baseURL}/images/${path.basename(compressedPath)}`;
    };

    //   const compressedPath = path.join(uploadDir, `${path.basename(filePath, path.extname(filePath))}.webp`);
    //   fs.writeFileSync(compressedPath, compressedBuffer);
    //   return `/images/${path.basename(compressedPath)}`;
    // };

    const images = req.files['images'] ? await Promise.all(req.files['images'].map(async (file) => {
      return await processImage(file.path);
    })) : null;

    const floorPlanimg = req.files['floorPlanimg'] ? await Promise.all(req.files['floorPlanimg'].map(async (file) => {
      return await processImage(file.path);
    })) : null;

    const plansImg = req.files['plansImg'] ? await Promise.all(req.files['plansImg'].map(async (file) => {
      return await processImage(file.path);
    })) : null;

    const featureImage = req.files['feature_image'] ? await processImage(req.files['feature_image'][0].path) : null;
    const aboveBg = req.files['aboveBg'] ? await processImage(req.files['aboveBg'][0].path) : null;
    const lowerBg = req.files['lowerBg'] ? await processImage(req.files['lowerBg'][0].path) : null;
    const qrImage = req.files['qr'] ? await processImage(req.files['qr'][0].path) : null;
    const logo = req.files['logo'] ? await processImage(req.files['logo'][0].path) : null;

    // Parse and format the date
    let formattedDate;
    try {
      const parsedDate = parse(date, 'dd-MM-yyyy', new Date());
      formattedDate = format(parsedDate, 'yyyy-MM-dd');
    } catch (dateError) {
      return res.status(400).json({ error: 'Invalid date format. Use dd-MM-yyyy.' });
    }

    // Ensure floorplan is an array
    // let floorplanArray = Array.isArray(floorplan) ? floorplan : [floorplan];
    // const floorplanString = floorplanArray.join(',');

    const query1 = `
      INSERT INTO offplan (
        title, description, images, floorPlanimg, date, propertyType, price, community, country, aboveBg, logo, lowerBg, 
        city, approve, lat, log, slug, sizeStart, sizeEnd, pos, exectLocation, editor, feature_image, qr,booking,    handover,
      construction,seoTitle, seoDesc, seoKeyword, PageName
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  ?, ?, ?,?, ?, ?, ?, ?, ?, ?)
    `;
    const values1 = [
      title, description, images ? images.join(',') : null, floorPlanimg ? floorPlanimg.join(',') : null, formattedDate, propertyType, price, community, country, aboveBg, logo, lowerBg,
      city, approve, lat, log, slug, sizeStart, sizeEnd, pos, exectLocation, editor, featureImage, qrImage,booking,    handover,
      construction,seoTitle, seoDesc, seoKeyword, PageName
    ];
    console.log('Generated SQL Query:', query1);
    console.log('Values:', values1);
    db.query(query1, values1, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database insertion failed' });
      }

      const offPlanID = result.insertId;

      const query2 = `
        INSERT INTO amenities (
          amenitiesTitle, amenitiesDsc, amenitiesAll, locationTitle, locationDsc, locationAll,
          plansTitle, plansDsc, plansAll, qusList, ansList, offPlanID, plansImg, tm,builder,bcommunity
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values2 = [
        amenitiesTitle, amenitiesDsc, amenitiesAll, locationTitle, locationDsc, locationAll,
        plansTitle, plansDsc, plansAll, qusList, ansList, offPlanID, plansImg ? plansImg.join(',') : null, tm,builder,bcommunity
      ];

      db.query(query2, values2, (err2, result2) => {
        if (err2) {
          console.error(err2);
          return res.status(500).json({ error: 'Database insertion for additional data failed' });
        }
        res.status(201).json({ message: 'Data uploaded successfully', id: offPlanID });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// API endpoint to update offplan
router.put('/update-offplan/:id', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'feature_image', maxCount: 1 },
  { name: 'qr', maxCount: 1 },
  { name: 'aboveBg', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
  { name: 'lowerBg', maxCount: 1 },
  { name: 'plansImg', maxCount: 5 },
  { name: 'floorPlanimg', maxCount: 5 },
]), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, sizeStart, sizeEnd, pos, community, date, propertyType, price, country,
      city, exectLocation, approve, lat, log, slug, editor,
      amenitiesTitle, amenitiesDsc, amenitiesAll, locationTitle, locationDsc, locationAll,
      plansTitle, plansDsc, plansAll, qusList, ansList, tm, builder, booking, handover,
      construction, bcommunity, seoTitle, seoDesc, seoKeyword, PageName
    } = req.body;

    const baseURL = 'http://localhost:4000';

    const processImage = async (filePath) => {
      const buffer = await sharp(filePath)
        .webp({ quality: 80 })
        .toBuffer();

      let compressedBuffer = buffer;
      while (compressedBuffer.length > 200 * 1024) { // 200 KB
        compressedBuffer = await sharp(buffer)
          .webp({ quality: 80 })
          .toBuffer();
      }
      const compressedPath = path.join(uploadDir, `${path.basename(filePath, path.extname(filePath))}.webp`);
      fs.writeFileSync(compressedPath, compressedBuffer);
      return `${baseURL}/images/${path.basename(compressedPath)}`;
    };

    const images = req.files['images'] ? await Promise.all(req.files['images'].map(async (file) => {
      return await processImage(file.path);
    })) : null;

    const floorPlanimg = req.files['floorPlanimg'] ? await Promise.all(req.files['floorPlanimg'].map(async (file) => {
      return await processImage(file.path);
    })) : null;

    const plansImg = req.files['plansImg'] ? await Promise.all(req.files['plansImg'].map(async (file) => {
      return await processImage(file.path);
    })) : null;

    const featureImage = req.files['feature_image'] ? await processImage(req.files['feature_image'][0].path) : null;
    const aboveBg = req.files['aboveBg'] ? await processImage(req.files['aboveBg'][0].path) : null;
    const lowerBg = req.files['lowerBg'] ? await processImage(req.files['lowerBg'][0].path) : null;
    const qrImage = req.files['qr'] ? await processImage(req.files['qr'][0].path) : null;
    const logo = req.files['logo'] ? await processImage(req.files['logo'][0].path) : null;

    // Parse and format the date
    let formattedDate;
    try {
      const parsedDate = parse(date, 'dd-MM-yyyy', new Date());
      formattedDate = format(parsedDate, 'yyyy-MM-dd');
    } catch (dateError) {
      return res.status(400).json({ error: 'Invalid date format. Use dd-MM-yyyy.' });
    }

    const query1 = `
      UPDATE offplan SET 
        title = ?, description = ?, images = ?, floorPlanimg = ?, date = ?, propertyType = ?, price = ?, community = ?, 
        country = ?, aboveBg = ?, logo = ?, lowerBg = ?, city = ?, approve = ?, lat = ?, log = ?, slug = ?, 
        sizeStart = ?, sizeEnd = ?, pos = ?, exectLocation = ?, editor = ?, feature_image = ?, qr = ?, booking = ?, 
        handover = ?, construction = ?, seoTitle = ?, seoDesc = ?, seoKeyword = ?, PageName = ?
      WHERE id = ?
    `;
    const values1 = [
      title, description, images ? images.join(',') : null, floorPlanimg ? floorPlanimg.join(',') : null, formattedDate, propertyType, price, community, country, aboveBg, logo, lowerBg,
      city, approve, lat, log, slug, sizeStart, sizeEnd, pos, exectLocation, editor, featureImage, qrImage, booking, handover,
      construction, seoTitle, seoDesc, seoKeyword, PageName, id
    ];
    console.log('Generated SQL Query:', query1);
    console.log('Values:', values1);
    db.query(query1, values1, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database update failed' });
      }

      const query2 = `
        UPDATE amenities SET 
          amenitiesTitle = ?, amenitiesDsc = ?, amenitiesAll = ?, locationTitle = ?, locationDsc = ?, locationAll = ?, 
          plansTitle = ?, plansDsc = ?, plansAll = ?, qusList = ?, ansList = ?, plansImg = ?, tm = ?, builder = ?, 
          bcommunity = ?
        WHERE offPlanID = ?
      `;
      const values2 = [
        amenitiesTitle, amenitiesDsc, amenitiesAll, locationTitle, locationDsc, locationAll,
        plansTitle, plansDsc, plansAll, qusList, ansList, plansImg ? plansImg.join(',') : null, tm, builder, bcommunity, id
      ];

      db.query(query2, values2, (err2, result2) => {
        if (err2) {
          console.error(err2);
          return res.status(500).json({ error: 'Database update for additional data failed' });
        }
        res.status(200).json({ message: 'Data updated successfully' });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// router.put('/update-offplan/:id', upload.fields([
//   { name: 'images', maxCount: 10 },
//   { name: 'feature_image', maxCount: 1 },
//   { name: 'qr', maxCount: 1 },
//   { name: 'aboveBg', maxCount: 1 },
//   { name: 'logo', maxCount: 1 },
//   { name: 'lowerBg', maxCount: 1 },
//   { name: 'plansImg', maxCount: 5 },
//   { name: 'floorPlanimg', maxCount: 5 },
// ]), async (req, res) => {
//   try {
//     const { id } = req.params;

//     const {
//       title, description, sizeStart, sizeEnd, pos, community, date, propertyType, price, country,
//       city, exectLocation, approve, lat, log, slug, editor,
//       amenitiesTitle, amenitiesDsc, amenitiesAll, locationTitle, locationDsc, locationAll,
//       plansTitle, plansDsc, plansAll, qusList, ansList, tm, builder, booking, handover,
//       construction, bcommunity
//     } = req.body;

//     const baseURL = 'http://localhost:4000';

//     const processImage = async (filePath) => {
//       const buffer = await sharp(filePath)
//         .webp({ quality: 80 })
//         .toBuffer();

//       let compressedBuffer = buffer;
//       while (compressedBuffer.length > 200 * 1024) { // 200 KB
//         compressedBuffer = await sharp(buffer)
//           .webp({ quality: 80 })
//           .toBuffer();
//       }
//       const compressedPath = path.join(uploadDir, `${path.basename(filePath, path.extname(filePath))}.webp`);
//       fs.writeFileSync(compressedPath, compressedBuffer);
//       return `${baseURL}/images/${path.basename(compressedPath)}`;
//     };

//     const images = req.files['images'] ? await Promise.all(req.files['images'].map(async (file) => {
//       return await processImage(file.path);
//     })) : null;

//     const floorPlanimg = req.files['floorPlanimg'] ? await Promise.all(req.files['floorPlanimg'].map(async (file) => {
//       return await processImage(file.path);
//     })) : null;

//     const plansImg = req.files['plansImg'] ? await Promise.all(req.files['plansImg'].map(async (file) => {
//       return await processImage(file.path);
//     })) : null;

//     const featureImage = req.files['feature_image'] ? await processImage(req.files['feature_image'][0].path) : null;
//     const aboveBg = req.files['aboveBg'] ? await processImage(req.files['aboveBg'][0].path) : null;
//     const lowerBg = req.files['lowerBg'] ? await processImage(req.files['lowerBg'][0].path) : null;
//     const qrImage = req.files['qr'] ? await processImage(req.files['qr'][0].path) : null;
//     const logo = req.files['logo'] ? await processImage(req.files['logo'][0].path) : null;

//     // Parse and format the date
//     let formattedDate;
//     try {
//       const parsedDate = parse(date, 'dd-MM-yyyy', new Date());
//       formattedDate = format(parsedDate, 'yyyy-MM-dd');
//     } catch (dateError) {
//       return res.status(400).json({ error: 'Invalid date format. Use dd-MM-yyyy.' });
//     }

//     const query1 = `
//       UPDATE offplan SET
//         title = ?, description = ?, images = ?, floorPlanimg = ?, date = ?, propertyType = ?, price = ?, community = ?, 
//         country = ?, aboveBg = ?, logo = ?, lowerBg = ?, city = ?, approve = ?, lat = ?, log = ?, slug = ?, 
//         sizeStart = ?, sizeEnd = ?, pos = ?, exectLocation = ?, editor = ?, feature_image = ?, qr = ?, 
//         booking = ?, handover = ?, construction = ?
//       WHERE id = ?
//     `;
//     const values1 = [
//       title, description, images ? images.join(',') : null, floorPlanimg ? floorPlanimg.join(',') : null, formattedDate, propertyType, price, community, country, aboveBg, logo, lowerBg,
//       city, approve, lat, log, slug, sizeStart, sizeEnd, pos, exectLocation, editor, featureImage, qrImage, booking, handover, construction, id
//     ];

//     db.query(query1, values1, (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Database update failed' });
//       }

//       const query2 = `
//         UPDATE amenities SET
//           amenitiesTitle = ?, amenitiesDsc = ?, amenitiesAll = ?, locationTitle = ?, locationDsc = ?, locationAll = ?, 
//           plansTitle = ?, plansDsc = ?, plansAll = ?, qusList = ?, ansList = ?, plansImg = ?, tm = ?, builder = ?, bcommunity = ?
//         WHERE offPlanID = ?
//       `;
//       const values2 = [
//         amenitiesTitle, amenitiesDsc, amenitiesAll, locationTitle, locationDsc, locationAll,
//         plansTitle, plansDsc, plansAll, qusList, ansList, plansImg ? plansImg.join(',') : null, tm, builder, bcommunity, id
//       ];

//       db.query(query2, values2, (err2, result2) => {
//         if (err2) {
//           console.error(err2);
//           return res.status(500).json({ error: 'Database update for additional data failed' });
//         }
//         res.status(200).json({ message: 'Data updated successfully' });
//       });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An unexpected error occurred' });
//   }
// });


//route for get rent property data 
router.get('/uploads-rent', (req, res) => {
  try {
    const query = 'SELECT * FROM rent';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database retrieval failed' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});



// API endpoint to get offplan data
router.get('/get-offplan', async (req, res) => {
  try {
    const query = `
      SELECT 
        o.*, 
        a.amenitiesTitle, a.amenitiesDsc, a.amenitiesAll, 
        a.locationTitle, a.locationDsc, a.locationAll,
        a.bcommunity,
        a.plansTitle, a.plansDsc, a.plansAll, 
        a.qusList, a.ansList, a.plansImg, a.tm, a.builder
      FROM 
        offplan o
      LEFT JOIN 
        amenities a ON o.id = a.offPlanID
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).json({ error: 'Database query error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'No data found' });
      }

      res.json(results);
    });
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});
// API endpoint to get offplan data by ID
router.get('/get-offplan/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        o.*, 
        a.amenitiesTitle, a.amenitiesDsc, a.amenitiesAll, 
        a.locationTitle, a.locationDsc, a.locationAll,
        a.bcommunity,
        a.plansTitle, a.plansDsc, a.plansAll, 
        a.qusList, a.ansList, a.plansImg, a.tm, a.builder
      FROM 
        offplan o
      LEFT JOIN 
        amenities a ON o.id = a.offPlanID
      WHERE 
        o.id = ?
    `;

    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).json({ error: 'Database query error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'No data found' });
      }

      res.json(results);
    });
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

//route for get rent property data fro specific id
router.get('/uploads-rent/:id', (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM rent WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database retrieval failed' });
      }
      if (!result || result.length === 0) {
        return res.status(404).json({ error: 'Data not found' });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// DELETE route to delete rent data by ID
router.delete('/delete-rent/:id', (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM rent WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database deletion failed' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Data not found' });
      }
      res.status(200).json({ message: 'Data deleted successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// DELETE route to delete data by ID in offplans

router.delete('/delete-offplan/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Start a transaction to ensure both tables are updated consistently
    db.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).json({ error: 'Database transaction error' });
      }

      // Delete from the amenities table first
      const deleteAmenitiesQuery = 'DELETE FROM amenities WHERE offPlanID = ?';
      db.query(deleteAmenitiesQuery, [id], (err, results) => {
        if (err) {
          console.error('Error deleting from amenities:', err);
          return db.rollback(() => {
            res.status(500).json({ error: 'Database delete error' });
          });
        }

        // Delete from the offplan table
        const deleteOffplanQuery = 'DELETE FROM offplan WHERE id = ?';
        db.query(deleteOffplanQuery, [id], (err, results) => {
          if (err) {
            console.error('Error deleting from offplan:', err);
            return db.rollback(() => {
              res.status(500).json({ error: 'Database delete error' });
            });
          }

          // Commit the transaction
          db.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              return db.rollback(() => {
                res.status(500).json({ error: 'Database commit error' });
              });
            }

            res.json({ message: 'Data deleted successfully' });
          });
        });
      });
    });
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


// DELETE route to delete data by ID in events
router.delete('/delete-events/:id', (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM events WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database deletion failed' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Data not found' });
      }
      res.status(200).json({ message: 'Data deleted successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// DELETE route to delete data by ID blogs
router.delete('/delete-blogs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM blogs WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database deletion failed' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Data not found' });
      }
      res.status(200).json({ message: 'Data deleted successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});




// Image upload endpoint for area guide
router.post('/upload_image', upload.single('file'), (req, res) => {
  if (req.file) {
    const imageUrl = `http://localhost:4000/images/${req.file.filename}`;
    res.json({ link: imageUrl });
  } else {
    res.status(400).json({ error: 'Image upload failed' });
  }
});



// API endpoint to save areaguide
router.post('/save-areaguide', upload.single('featureImage'), (req, res) => {
  const { title, description, editor,shortTitle,seoTitle, seoDesc, seoKeyword, PageName ,slug} = req.body;
  let featureImage = '';

  if (req.file) {
    featureImage = `http://localhost:4000/images/${req.file.filename}`;
  }

  if (!title || !description || !editor) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = 'INSERT INTO areaguide (title, description, editor,shortTitle, featureImage , seoTitle, seoDesc, seoKeyword, PageName,slug) VALUES (?, ?, ?, ?,?,?, ?, ?,?,?)';
  db.query(sql, [title, description, editor,shortTitle, featureImage,seoTitle, seoDesc, seoKeyword, PageName,slug], (err, result) => {
    if (err) {
      console.error('Error saving blog:', err);
      return res.status(500).send(err);
    }
    res.json({ success: true, message: 'Blog saved successfully!', id: result.insertId });
  });
});

// Route to get area guide data
router.get('/get-areaguide', (req, res) => {
  const sql = 'SELECT * FROM areaguide';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching posts:', err);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});


// Image upload endpoint for blogs
router.post('/upload_image', upload.single('file'), (req, res) => {
  if (req.file) {
    const imageUrl = `http://localhost:4000/images/${req.file.filename}`;
    res.json({ link: imageUrl });
  } else {
    res.status(400).json({ error: 'Image upload failed' });
  }
});



// API endpoint to save blog
router.post('/save_blog', upload.single('featureImage'), (req, res) => {
  const { title, content, type,date,slug , seoTitle, seoDes, seoKeyword, PageName} = req.body;
  let featureImage = '';

  if (req.file) {
    featureImage = `http://localhost:4000/images/${req.file.filename}`;
  }

  if (!title || !content || !type || !slug) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = 'INSERT INTO blogs (title, content, type, date, slug, featureImage, seoTitle, seoDes, seoKeyword, PageName) VALUES ( ?, ?, ?, ?, ?, ? ,?, ?, ?, ?)';
  db.query(sql, [title, content, type, date, slug,featureImage, seoTitle, seoDes, seoKeyword, PageName], (err, result) => {
    if (err) {
      console.error('Error saving blog:', err);
      return res.status(500).send(err);
    }
    res.json({ success: true, message: 'Blog saved successfully!', id: result.insertId });
  });
});

// API endpoint to update blog
router.put('/update_blog/:id', upload.single('featureImage'), (req, res) => {
  const { id } = req.params;
  const { title, content, type, date, slug ,  seoTitle, seoDesc,seoKeyword, PageName} = req.body;
  let featureImage = '';

  if (req.file) {
    featureImage = `http://localhost:4000/images/${req.file.filename}`;
  }

  if (!title || !content || !type || !slug) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let sql = 'UPDATE blogs SET title = ?, content = ?, type = ?, date = ?, slug = ? ,seoTitle = ?, seoDesc = ?,seoKeyword = ?, PageName = ?';
  const params = [title, content, type, date, slug, seoTitle, seoDesc,seoKeyword, PageName];

  if (featureImage) {
    sql += ', featureImage = ?';
    params.push(featureImage);
  }

  sql += ' WHERE id = ?';
  params.push(id);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error updating blog:', err);
      return res.status(500).send(err);
    }
    res.json({ success: true, message: 'Blog updated successfully!' });
  });
});

// API endpoint to get blog by ID
router.get('/blog/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM blogs WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching blog:', err);
      return res.status(500).send(err);
    }
    if (result.length === 0) {
      return res.status(404).send({ message: 'Blog not found' });
    }
    res.json(result[0]);
  });
});

// API endpoint to get areaguide by ID
router.get('/areaguide/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM areaguide WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching blog:', err);
      return res.status(500).send(err);
    }
    if (result.length === 0) {
      return res.status(404).send({ message: 'areaguide not found' });
    }
    res.json(result[0]);
  });
});
// API endpoint to update areaguide
// API endpoint to update areaguide
router.put('/update_areaguide/:id', upload.single('featureImage'), (req, res) => {
  const { id } = req.params;
  const { title, editor, description, shortTitle, seoTitle,seoDesc,seoKeyword,PageName} = req.body;
  let featureImage = '';

  if (req.file) {
    featureImage = `http://localhost:4000/images/${req.file.filename}`;
  }

  if (!title || !editor || !description || !shortTitle) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let sql = 'UPDATE areaguide SET title = ?, editor = ?, description = ?, shortTitle = ?, seoTitle = ?,seoDesc = ?,seoKeyword = ?,PageName= ?';
  const params = [title, editor, description, shortTitle, seoTitle,seoDesc,seoKeyword,PageName];

  if (featureImage) {
    sql += ', featureImage = ?';
    params.push(featureImage);
  }

  sql += ' WHERE id = ?';
  params.push(id);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error updating areaguide:', err);
      return res.status(500).send(err);
    }
    res.json({ success: true, message: 'Area guide updated successfully!' });
  });
});

// API endpoint to delete areaguide by ID
router.delete('/areaguide/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'DELETE FROM areaguide WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting areaguide:', err);
      return res.status(500).send(err);
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'areaguide not found' });
    }

    res.json({ message: 'areaguide deleted successfully' });
  });
});


// API endpoint to get events by ID
router.get('/eventsDsc/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM events WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching blog:', err);
      return res.status(500).send(err);
    }
    if (result.length === 0) {
      return res.status(404).send({ message: 'event not found' });
    }
    res.json(result[0]);
  });
});



// Define the route to create a new user
router.post('/users', async (req, res) => {
  const { email, password, usertype, status = 1 } = req.body;

  if (!email || !password || !usertype) {
    return res.status(400).send({ error: 'Email, password, and usertype are required' });
  }

  try {
    // Check if the email already exists
    const checkEmailSql = 'SELECT * FROM adminlogin WHERE email = ?';
    db.query(checkEmailSql, [email], async (err, results) => {
      if (err) {
        console.error('Error checking email:', err);
        return res.status(500).send({ error: 'Database error' });
      }

      if (results.length > 0) {
        return res.status(400).send({ error: 'Email already exists',status:"400" });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // If email does not exist, insert the new user with hashed password
      const insertUserSql = 'INSERT INTO adminlogin (email, password, usertype, status) VALUES (?, ?, ?, ?)';
      db.query(insertUserSql, [email, hashedPassword, usertype, status], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).send({ error: 'Database error' });
        }
        res.status(201).send({ message: 'User created', userId: result.insertId });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// Route to fetch all subadmins data
router.get('/sub-admin', (req, res) => {
  const sql = 'SELECT * FROM adminlogin';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching posts:', err);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});


// Define the login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: 'Email and password are required' });
  }

  try {
    // Check if the email exists
    const checkEmailSql = 'SELECT * FROM adminlogin WHERE email = ?';
    db.query(checkEmailSql, [email], async (err, results) => {
      if (err) {
        console.error('Error checking email:', err);
        return res.status(500).send({ error: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(400).send({ error: 'Invalid email or password' });
      }

      const user = results[0];

      // Compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send({ error: 'Invalid email or password' });
      }

      res.status(200).send({ message: 'Login successful', userId: user.id });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// api for contactus form add
router.post('/contactus', async (req, res) => {
  try {
    const { name, msg, email, phone } = req.body;
    console.log("fyf", req.body)
    // if (!name || !msg || !email || !phone) {
    //   return res.status(400).json({ error: 'All fields are required' });
    // }

    const query = 'INSERT INTO contactus (name, msg, email, phone) VALUES (?, ?, ?, ?)';
    db.query(query, [name, msg, email, phone], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database insertion failed' });
      }
      res.status(201).json({ message: 'Contact added successfully', id: results.insertId });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// Get all contacts
router.get('/contactus', async (req, res) => {
  try {
    const query = 'SELECT * FROM contactus';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


// // Route to add data in career
// router.post('/career', upload.single('image'), (req, res) => {
//   try {
//     const { name, phone, email } = req.body;

//     // Check if all required fields are present
//     if (!name || !phone || !req.file) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     if (req.file) {
//       imagePath = `http://localhost:4000/images/${req.file.filename}`;
//     }
  
//     // Handle uploaded image (file)
//     // Path to the uploaded image

//     // Save the data to the database
//     const query = 'INSERT INTO career (name, phone, email, cv) VALUES (?, ?, ?, ?)';
//     db.query(query, [name, phone, email, imagePath], (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Database insertion failed' });
//       }
//       res.status(201).json({ message: 'Data uploaded successfully' });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An unexpected error occurred' });
//   }
// });

// Get all contacts
router.get('/career', async (req, res) => {
  try {
    const query = 'SELECT * FROM career';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


// Get all event-form
router.get('/event-form', async (req, res) => {
  try {
    const query = 'SELECT * FROM eventform';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});



// Define the route to fetch all entries
router.get('/RBform', (req, res) => {
  const sql = 'SELECT * FROM buyrentform';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send({ error: 'Database error' });
    }
    res.json(results);
  });
});



// Define the route to fetch all entries
router.get('/offplanForm', (req, res) => {
  const sql = 'SELECT * FROM offplanform';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send({ error: 'Database error' });
    }
    res.json(results);
  });
});


// Define the route for Rent/Buy Form
router.post('/sellform', (req, res) => {
  const { phone, date } = req.body;

  if (!phone || !date ) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  const sql = 'INSERT INTO sellform (phone, date) VALUES (?, ?)';
  db.query(sql, [phone, date], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send({ error: 'Database error' });
    }
    res.status(201).send({ message: 'Data created', id: result.insertId });
  });
});

// Define the route to fetch all entries
router.get('/sellform', (req, res) => {
  const sql = 'SELECT * FROM sellform';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send({ error: 'Database error' });
    }
    res.json(results);
  });
});


// button for rent update the approve column
router.put('/update-approve/:id', (req, res) => {
  const id = req.params.id;
  const approve = req.body.approve;

  const query = 'UPDATE rent SET approve = ? WHERE id = ?';
  db.query(query, [approve, id], (err, result) => {
    if (err) {
      console.error('Error updating approve column:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send('Approve column updated successfully');
  });
});

// button for rent update the approve column
router.put('/update-approve-offplan/:id', (req, res) => {
  const id = req.params.id;
  const approve = req.body.approve;

  const query = 'UPDATE offplan SET approve = ? WHERE id = ?';
  db.query(query, [approve, id], (err, result) => {
    if (err) {
      console.error('Error updating approve column:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send('Approve column updated successfully');
  });
});



// Route to fetch the latest 8 records of rent
router.get('/latest-rent', (req, res) => {
  const query = `
    SELECT *
    FROM rent
    ORDER BY date DESC
    LIMIT 8
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.status(200).json(results);
  });
});

// Get all blogs
router.get('/blogs-all', async (req, res) => {
  try {
    const query = 'SELECT * FROM blogs';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


// API to get data from renting table based on rent or buy

router.get('/renting', (req, res) => {
  const { status } = req.body;  

  if (!status || (status.toLowerCase() !== 'rent' && status.toLowerCase() !== 'buy')) {
    return res.status(400).json({ error: 'Invalid status. Must be "rent" or "buy".' });
  }

  const sql = 'SELECT * FROM rent WHERE status = ?';
  db.query(sql, [status.toLowerCase()], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Data not found' });
    }

    res.json(results);
  });
});
// for getting data only rent 
router.get('/renting-rent', (req, res) => {
  const status = 'rent';  // Hardcoded status value

  const sql = 'SELECT * FROM rent WHERE status = ?';
  db.query(sql, [status], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Data not found' });
    }

    res.json(results);
  });
});
// for getting data only buy 
router.get('/buying-buy', (req, res) => {
  const status = 'buy';  // Hardcoded status value

  const sql = 'SELECT * FROM rent WHERE status = ?';
  db.query(sql, [status], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Data not found' });
    }

    res.json(results);
  });
});

// Get all blogs
router.get('/icons-all', async (req, res) => {
  try {
    const query = 'SELECT * FROM icons';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// Define the route for Rent/Buy Form
router.post('/subscribe', (req, res) => {
  const { mail } = req.body;

  if (!mail ) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  const sql = 'INSERT INTO subscribe (mail) VALUES (?)';
  db.query(sql, [mail], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send({ error: 'Database error' });
    }
    res.status(201).send({ message: 'Data created', id: result.insertId });
  });
});

// Get all blogs
router.get('/subscribe', async (req, res) => {
  try {
    const query = 'SELECT * FROM subscribe';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// Nodemailer setup
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "surbhigulhana3@gmail.com",
//     pass: "nrlvddjezcofuxgz",  // replace with your email password
//   }
// });




// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: "surbhigulhana3@gmail.com", // Set this in your .env file
    pass: "hktdxfukzbebbjhe" // Set this in your .env file
  }
});

//api for subscribe 
router.post('/send-email', (req, res) => {
  const { mail } = req.body;

  // Save email to database
  const sql = 'INSERT INTO subscribe (mail) VALUES (?)';
  db.query(sql, [mail], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Error saving to database.');
    }

    // Send email
    const mailOptions = {
      from: mail, // Change this to your email address
      to: "surbhigulhana3@gmail.com",
      subject: 'New Inquiry',
      text: `A new email has been submitted: ${mail}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
        return res.status(500).send('Error sending email.');
      }
      res.status(200).send('Email sent and saved successfully.');
    });
  });
});


//api for contactus  
router.post('/send-contactus', (req, res) => {
  const { name, msg, email, phone } = req.body;

  // Save email to database
  const sql = 'INSERT INTO contactus (name, msg, email, phone) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, msg, email, phone], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Error saving to database.');
    }

    // Send email
    const mailOptions = {
      from: email, // Change this to your email address
      to: "surbhigulhana3@gmail.com",
      subject: 'New Inquiry',
      text: `Name: ${name}\nMessage: ${msg}\nPhone: ${phone}\nEmail: ${email}`

    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
        return res.status(500).send('Error sending email.');
      }
      res.status(200).send('Email sent and saved successfully.');
    });
  });
});


//api for rentfrom  
router.post('/send-rentfrom', (req, res) => {
  const { phone, name, propertyName, propertyType } = req.body;

  if (!phone || !name || !propertyName || !propertyType) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  // Save email to database
  const sql = 'INSERT INTO buyrentform (phone, name, propertyName, propertyType) VALUES (?, ?, ?, ?)';;
  db.query(sql, [phone, name, propertyName, propertyType], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Error saving to database.');
    }

    // Send email
    const mailOptions = {
      from: phone, // Change this to your email address
      to: "surbhigulhana3@gmail.com",
      subject: 'New Inquiry',
      text: `Name: ${name}\nMessage: ${propertyName}\nPhone: ${phone} \nPhone: ${propertyType}`

    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
        return res.status(500).send('Error sending email.');
      }
      res.status(201).send('Email sent and saved successfully.');
    });
  });
});

//api for rentfrom  
router.post('/send-sellform', (req, res) => {
  const { phone, name, msg, propertyType,mail } = req.body;

  if (!phone || !name || !propertyType || !mail) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  // Save email to database
  const sql = 'INSERT INTO sellform ( phone, name, msg, propertyType,mail) VALUES (?, ?, ?, ?, ?)';;
  db.query(sql, [phone, name, msg, propertyType,mail], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Error saving to database.');
    }

    // Send email
    const mailOptions = {
      from: phone, // Change this to your email address
      to: "surbhigulhana3@gmail.com",
      subject: 'New Inquiry',
      text: `Name: ${name}\nMessage: ${msg}\nPhone: ${phone} \nPhone: ${propertyType}`

    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
        return res.status(500).send('Error sending email.');
      }
      res.status(201).send('Email sent and saved successfully.');
    });
  });
});


//api for eventform  
router.post('/event-form', (req, res) => {
  const { name, msg, email, phone,date,time } = req.body;

  if (!name || !msg || !email || !phone) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  // Save email to database


  const sql = 'INSERT INTO eventform (name, msg, email, phone,date,time) VALUES (?, ?, ?,?,?,?)';
  db.query(sql, [name, msg, email, phone,date,time], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Error saving to database.');
    }

    // Send email
    const mailOptions = {
      from: email, // Change this to your email address
      to: "surbhigulhana3@gmail.com",
      subject: 'event-form',
      text: `Name: ${name}\nMessage: ${msg}\nPhone: ${phone} \nEmail: ${email} \nDate: ${date} \nTime: ${time}`

    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
        return res.status(500).send('Error sending email.');
      }
      res.status(201).send('Email sent and saved successfully.');
    });
  });
});

//api for offplan form  
router.post('/offplanForm', (req, res) => {
  const { phone, name, propertyName, email,msg } = req.body;

 
  if (!phone || !name  || !email || !msg) {
    return res.status(400).send({ error: 'All fields are required' });
  }


  // Save email to database


  const sql = 'INSERT INTO offplanform (name, msg, email, phone,propertyName) VALUES (?, ?,?,?,?)';
  db.query(sql, [name, msg, email, phone,propertyName], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Error saving to database.');
    }

    // Send email
    const mailOptions = {
      from: email, // Change this to your email address
      to: "surbhigulhana3@gmail.com",
      subject: 'Offplan-form',
      text: `Name: ${name}\nMessage: ${msg}\nPhone: ${phone} \nEmail: ${email} \propertyName: ${propertyName}`

    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
        return res.status(500).send('Error sending email.');
      }
      res.status(201).send('Email sent and saved successfully.');
    });
  });
});


// Route to add data in career form
router.post('/career', upload.single('image'), async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    // Check if all required fields are present
    if (!name || !phone || !req.file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const imagePath = `http://localhost:4000/images/${req.file.filename}`;

    // Save the data to the database
    const query = 'INSERT INTO career (name, phone, email, cv) VALUES (?, ?, ?, ?)';
    db.query(query, [name, phone, email, imagePath], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database insertion failed' });
      }

      // Send email
      const mailOptions = {
        from: email,
        to: "surbhigulhana3@gmail.com",
        subject: 'Career Application Received',
        text: `Name: ${name}\nPhone: ${phone} \nEmail: ${email} `,
                attachments: [
          {
            filename: req.file.filename,
            path: req.file.path
          }
        ]
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Failed to send email' });
        }
        res.status(201).json({ message: 'Data uploaded and email sent successfully' });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


// Define the route for Rent/Buy Form
router.post('/calculatorFrom', (req, res) => {
  const { name, email, phone, msg, title } = req.body;

  if (!name || !email ) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  const sql = 'INSERT INTO calculatorfrom (name, email, phone, msg, title) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, email, phone, msg, title], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send({ error: 'Database error' });
    }
    res.status(201).send({ message: 'Data created', id: result.insertId });
  });
});

// Get all calculator
router.get('/calculatorFrom', async (req, res) => {
  try {
    const query = 'SELECT * FROM calculatorfrom';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


module.exports = router;
