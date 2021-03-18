var express = require('express')
var router = express.Router()

const config = require('config')
const fs = require('fs')
const cors = require('cors')
const MBTiles = require('@mapbox/mbtiles')
const TimeFormat = require('hh-mm-ss')

// config constants
const defaultZ = config.get('defaultZ')
const mbtilesDir = config.get('mbtilesDir')
const fontsDir = config.get('fontsDir')

// global variables
let mbtilesPool = {}
let tz = config.get('tz')
let busy = false

var app = express()
app.use(cors())


//Get tile functions
const getMBTiles = async (t, z, x, y) => {
  let mbtilesPath = ''
  if (!tz[t]) tz[t] = defaultZ
  if (z < tz[t]) {
    mbtilesPath = `${mbtilesDir}/${t}/0-0-0.mbtiles`
  } else {
    mbtilesPath =
      `${mbtilesDir}/${t}/${tz[t]}-${x >> (z - tz[t])}-${y >> (z - tz[t])}.mbtiles`
  }
  return new Promise((resolve, reject) => {
    if (mbtilesPool[mbtilesPath]) {
      resolve(mbtilesPool[mbtilesPath].mbtiles)
    } else {
      if (fs.existsSync(mbtilesPath)) {
        new MBTiles(`${mbtilesPath}?mode=ro`, (err, mbtiles) => {
          if (err) {
            reject(new Error(`${mbtilesPath} could not open.`))
          } else {
            mbtilesPool[mbtilesPath] = {
              mbtiles: mbtiles, openTime: new Date()
            }
            resolve(mbtilesPool[mbtilesPath].mbtiles)
          }
        })
      } else {
        reject(new Error(`${mbtilesPath} was not found.`))
      }
    }
  })
}

const getTile = async (mbtiles, z, x, y) => {
  return new Promise((resolve, reject) => {
    mbtiles.getTile(z, x, y, (err, tile, headers) => {
      if (err) {
        reject()
      } else {
        resolve({tile: tile, headers: headers})
      }
    })
  })
}




/* GET Tile. */
//router.get('/', 
// async function(req, res, next) {
router.get(`/zxy/:t/:z/:x/:y.pbf`, 
 async function(req, res) {
  busy = true
  const t = req.params.t
  const z = parseInt(req.params.z)
  const x = parseInt(req.params.x)
  const y = parseInt(req.params.y)


if (!req.session.userId) {
  // Redirect unauthenticated requests to home page
   // res.redirect('/')
    res.status(404).send(`Please log in to get: /zxy/${t}/${z}/${x}/${y}.pbf`)
   // busy = false
    } else {
//  let params = {
//    active: { home: true }

  getMBTiles(t, z, x, y).then(mbtiles => {
    getTile(mbtiles, z, x, y).then(r => {
      if (r.tile) {
        res.set('content-type', 'application/vnd.mapbox-vector-tile')
        res.set('content-encoding', 'gzip')
        res.set('last-modified', r.headers['Last-Modified'])
        res.set('etag', r.headers['ETag'])
        res.send(r.tile)
        busy = false
      } else {
        res.status(404).send(`tile not found: /zxy/${t}/${z}/${x}/${y}.pbf`)
        busy = false
      }
    }).catch(e => {
      res.status(404).send(`tile not found: /zxy/${t}/${z}/${x}/${y}.pbf`)
      busy = false
    })
  }).catch(e => {
    res.status(404).send(`mbtiles not found for /zxy/${t}/${z}/${x}/${y}.pbf`)
  })

 };



  }
);



module.exports = router;