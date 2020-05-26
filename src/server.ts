import express from 'express';
import bodyParser from 'body-parser';
import {validateImage, filterImageFromURL, deleteLocalFiles} from './util/util';

const createError  = function(message:string, code: number) {
  return {
    message: message,
    status: 'error',
    code: code
  }
};

(async () => {

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
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  app.get( "/filteredimage", async (req, res) => {
    const { image_url } = req.query;

    if(!image_url || typeof image_url !== 'string') {
      return res.status(422).send(createError('You need to provide the image_url query parameter.', 1))
    }

    const valid = await validateImage(image_url);
    if(!valid) { 
      return res.status(422).send(createError('Invalid image URL.', 2));
    }
    const image = await filterImageFromURL(image_url);
    res.status(200).sendFile(image);
    
    res.on('finish', function() {
      deleteLocalFiles([image]);
    });
    return;
  })
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();