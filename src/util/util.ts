import fs from 'fs';
import Jimp = require('jimp');
import https from 'https';
import http from 'http';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string>{
    return new Promise( async resolve => {
        // @ts-ignore
        const photo = await Jimp.read(inputURL);
        const outpath = '/tmp/filtered.'+Math.floor(Math.random() * 2000)+'.jpg';
        await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname+outpath, ()=>{
            resolve(__dirname+outpath);
        });
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
    }
}

const VALID_TYPES = ['image/jpeg', 'image/png', 'image/gif']

export async function validateImage(image_url:string) {
    return await new Promise((resolve) => {
        if(image_url.substr(0,5) === 'https') {
            https.get(image_url, result =>
                resolve(result.statusCode === 200 && VALID_TYPES.includes(result.headers['content-type']))
            ).on('error', resolve).end();
        } else {
            http.get(image_url, result =>
                resolve(result.statusCode === 200 && VALID_TYPES.includes(result.headers['content-type']))
            ).on('error', resolve).end();
        }
    }).catch(err => console.log(err));
}

