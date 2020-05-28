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

  app.get( "/filteredimage", async (req:express.Request, res:express.Response) => {
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
  app.get( "/", async ( req:express.Request, res:express.Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();