import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';
import fs from 'fs'



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  app.get('/filter-image', async (req, res) => {
    // validate img_url
    const query = req.query
    const imageUrl = query.image_url

    if (!imageUrl) {
      return res.status(400).json({message: 'Cannot found image url'})
    }

    const validURLPattern = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+/
    if (!validURLPattern.test(imageUrl)) {
      return res.status(422).json({message: 'Invalid URL, cannot process'})
    }

    try {
      const output = await filterImageFromURL(imageUrl)
      res.sendFile(output, () => {
          deleteLocalFiles([output])
      })
    } catch (error) {
      console.log('ERROR', error);
      return res.status(400).json({message: 'Filter error'})
    }
  })
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
