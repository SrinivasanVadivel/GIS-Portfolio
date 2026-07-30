//==============================================================//
//        URBAN GROWTH DETECTION USING GOOGLE EARTH ENGINE
//               Study Area : Virudhachalam
//==============================================================//



//==============================================================//
// STEP 1 : DEFINE THE STUDY AREA
//==============================================================//
var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[79.25479629516694, 11.461029064868008],
          [79.41959121704194, 11.459683153957402],
          [79.39761856079194, 11.556572313179336],
          [79.25479629516694, 11.552535931698833]]]);

// "geometry" is the polygon we drew on the map.
// We are storing it in a variable called "roi"
// ROI = Region Of Interest

var roi = geometry;

// Center the map on the study area
// Zoom level = 12

Map.centerObject(roi,12);

// Display the study area on the map

Map.addLayer(roi,{color:'red'},'Study Area');




//==============================================================//
// STEP 2 : REMOVE CLOUDS FROM SATELLITE IMAGES
//==============================================================//

// Landsat images contain clouds.
// We don't want clouds because they hide the Earth's surface.
// This function removes cloud and cloud shadow pixels.

function maskLandsat(image){

  // Select the Quality Assessment Band

  var qa = image.select('QA_PIXEL');

  // Cloud Shadow Bit

  var cloudShadowBitMask = (1 << 4);

  // Cloud Bit

  var cloudsBitMask = (1 << 3);

  // Keep only pixels without clouds

  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
               .and(
               qa.bitwiseAnd(cloudsBitMask).eq(0)
               );

  // Return the cloud free image

  return image.updateMask(mask);

}




//==============================================================//
// STEP 3 : CREATE 2015 LANDSAT IMAGE
//==============================================================//

var image2015 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')

                  // Select images only inside our study area

                  .filterBounds(roi)

                  // Select only images captured in 2015

                  .filterDate('2015-01-01','2015-12-31')

                  // Keep only images with less than 10% cloud

                  .filter(ee.Filter.lt('CLOUD_COVER',10))

                  // Remove clouds

                  .map(maskLandsat)

                  // Combine all images into one image

                  .median()

                  // Clip image to study area

                  .clip(roi);




//==============================================================//
// STEP 4 : CREATE 2025 LANDSAT IMAGE
//==============================================================//

var image2025 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')

                  .filterBounds(roi)

                  .filterDate('2025-01-01','2025-12-31')

                  .filter(ee.Filter.lt('CLOUD_COVER',10))

                  .map(maskLandsat)

                  .median()

                  .clip(roi);




//==============================================================//
// STEP 5 : CONVERT PIXEL VALUES TO REFLECTANCE
//==============================================================//

// Landsat images are stored as scaled integers.
//
// Example
//
// Before Scaling
// 14567
//
// After Scaling
// 0.20
//
// Reflectance values are easier for analysis.

var image2015_scaled = image2015

                        .multiply(0.0000275)

                        .add(-0.2);


var image2025_scaled = image2025

                        .multiply(0.0000275)

                        .add(-0.2);




//==============================================================//
// STEP 6 : DISPLAY TRUE COLOR IMAGE
//==============================================================//

// Band 4 = Red
// Band 3 = Green
// Band 2 = Blue
//
// Together they create a Natural Color Image.

var vis = {

bands:['SR_B4','SR_B3','SR_B2'],

min:0,

max:0.3,

gamma:1.2

};


// Display 2015 Image

Map.addLayer(

image2015_scaled,

vis,

'Landsat 8 (2015)'

);


// Display 2025 Image

Map.addLayer(

image2025_scaled,

vis,

'Landsat 9 (2025)'

);




//==============================================================//
// STEP 7 : PRINT IMAGE DETAILS
//==============================================================//

print('2015 Image',image2015);

print('2025 Image',image2025);




//==============================================================//
// STEP 8 : CALCULATE NDBI
//==============================================================//

// NDBI = Normalized Difference Built-up Index
//
// Formula
//
// (SWIR - NIR)
// ----------------
// (SWIR + NIR)
//
// Landsat Bands
//
// Band 6 = SWIR
//
// Band 5 = NIR
//
// Buildings reflect more SWIR.
//
// Vegetation reflects more NIR.

var ndbi2015 = image2015_scaled

.normalizedDifference(

['SR_B6','SR_B5']

)

.rename('NDBI 2015');



var ndbi2025 = image2025_scaled

.normalizedDifference(

['SR_B6','SR_B5']

)

.rename('NDBI 2025');

// Check minimum and maximum NDBI values

print(
  'NDBI 2015 Min/Max',
  ndbi2015.reduceRegion({
    reducer: ee.Reducer.minMax(),
    geometry: roi,
    scale: 30,
    maxPixels: 1e13
  })
);

print(
  'NDBI 2025 Min/Max',
  ndbi2025.reduceRegion({
    reducer: ee.Reducer.minMax(),
    geometry: roi,
    scale: 30,
    maxPixels: 1e13
  })
);


//==============================================================//
// STEP 9 : DEFINE NDBI COLORS
//==============================================================//

// Blue  → Low NDBI
//
// White → Medium
//
// Red   → High NDBI

var ndbiVis = {

min:-0.5,

max:0.5,

palette:[

'blue',

'white',

'red'

]

};




//==============================================================//
// STEP 10 : DISPLAY NDBI
//==============================================================//

Map.addLayer(

ndbi2015,

ndbiVis,

'NDBI 2015'

);


Map.addLayer(

ndbi2025,

ndbiVis,

'NDBI 2025'

);




//==============================================================//
// STEP 11 : PRINT NDBI INFORMATION
//==============================================================//

print('NDBI 2015',ndbi2015);

print('NDBI 2025',ndbi2025);

var urban2015 = ndbi2015.gt(0.20);

var urban2025 = ndbi2025.gt(0.20);

var urbanvis = {
  min : 0,
  max : 1,
  palette: ['black','yellow']};

Map.addLayer(urban2015,urbanvis,'Urban 2015');

Map.addLayer(urban2025,urbanvis,'Urban 2025');

print(
  'Urban 2015 Pixel Count',
  urban2015.reduceRegion({
    reducer: ee.Reducer.frequencyHistogram(),
    geometry: roi,
    scale: 30,
    maxPixels: 1e13
  })
);

print(
  'Urban 2025 Pixel Count',
  urban2025.reduceRegion({
    reducer: ee.Reducer.frequencyHistogram(),
    geometry: roi,
    scale: 30,
    maxPixels: 1e13
  })
);

// NDVI MEASUREMENT


var ndvi2015 = image2015_scaled
  .normalizedDifference(['SR_B5', 'SR_B4'])
  .rename('NDVI 2015');

var ndvi2025 = image2025_scaled
  .normalizedDifference(['SR_B5', 'SR_B4'])
  .rename('NDVI 2025');
  
  print(
  'NDVI 2025 Min/Max',
  ndvi2025.reduceRegion({
    reducer: ee.Reducer.minMax(),
    geometry: roi,
    scale: 30,
    maxPixels: 1e13
  })
);
  
var ndvivis = {
  min : -0.2,
  max : 0.85,
  palette : ['blue','white','yellow','lightgreen','darkgreen']
};

Map.addLayer(ndvi2015,ndvivis,'ndvi 2015');
Map.addLayer(ndvi2025,ndvivis,'ndvi 2025');

var ndvichange = ndvi2025.subtract(ndvi2015).rename('NDVI CHANGE');

print(
  'NDVI Change Min/Max',
  ndvichange.reduceRegion({
    reducer: ee.Reducer.minMax(),
    geometry: roi,
    scale: 30,
    maxPixels: 1e13
  })
);

var ndvichangevis = {

  min:-0.5,

  max:0.5,

  palette:[
    'red',
    'white',
    'green'
  ]

};

Map.addLayer(ndvichange,ndvichangevis,'NDVI CHANGE');


var ndbichange = ndbi2025.subtract(ndbi2015).rename('NDBI CHANGE');

print(
  'NDBI Change Min/Max',
  ndbichange.reduceRegion({
    reducer: ee.Reducer.minMax(),
    geometry: roi,
    scale: 30,
    maxPixels: 1e13
  })
);

var ndbichangevis = {
  min : -0.5,
  max : 0.5,
  palette :(['green','white','red'])
};
Map.addLayer (ndbichange,ndbichangevis,'NDBI CHANGE');

var urbangrowth = ndbichange.gt(0.05).and(ndvichange.lt(-0.05));

var urbangrowth1 = ndbichange.gt(0.10)
    .and(ndvichange.lt(-0.10));

var urbangrowth3 = ndbichange.gt(0.15).and(ndvichange.lt(-0.15));


var urbangrowthvis = {
  min : 0,
  max : 1,
  palette : (['black','red'])
};

Map.addLayer(urbangrowth1,urbangrowthvis,'URBAN GROWTH 2015 -2025');

//==============================================================//
// STEP 22 : CALCULATE URBAN GROWTH AREA
//==============================================================//

var urbangrowthArea = ee.Image.pixelArea()

                        .updateMask(urbangrowth1);

var area = urbangrowthArea.reduceRegion({

  reducer: ee.Reducer.sum(),

  geometry: roi,

  scale: 30,

  maxPixels: 1e13

});

print('Urban Growth Area (sq.m)', area);

//==============================================================//
// STEP 23 : CONVERT URBAN GROWTH AREA
//==============================================================//

var areaSqm = ee.Number(area.get('area'));

var areaHectare = areaSqm.divide(10000);

var areaSqkm = areaSqm.divide(1000000);

print('Urban Growth Area (m²)', areaSqm);

print('Urban Growth Area (Hectares)', areaHectare);

print('Urban Growth Area (km²)', areaSqkm);

//==============================================================//
// STEP 24 : CALCULATE TOTAL STUDY AREA
//==============================================================//

var totalArea = roi.area();

var totalAreaSqKm = totalArea.divide(1000000);

print('Total Study Area (km²)', totalAreaSqKm);




// predict hotspot

var hotspot = urbangrowth1.reduceNeighborhood({reducer : ee.Reducer.sum(),kernel : ee.Kernel.square(1)});

print(
  'Hotspot Min/Max',
  hotspot.reduceRegion({
    reducer: ee.Reducer.minMax(),
    geometry: roi,
    scale: 30,
    maxPixels: 1e13
  })
);

var hotspotvis = { min :0,max : 9 , palette :['black','yellow','orange','red'] };

Map.addLayer(hotspot,hotspotvis,'URBAN GROWTH HOTSPOT');

print(urbangrowth1.projection());


print('Hotspot Image', hotspot);


//==============================================================//
// STEP 25 : EXPORT RESULTS
//==============================================================//

// Function to export any image
function exportImage(image, name) {

  Export.image.toDrive({

    image: image,

    description: name,

    folder: 'GEE_Urban_Growth',

    fileNamePrefix: name,

    region: roi,

    scale: 30,

    crs: 'EPSG:4326',

    maxPixels: 1e13

  });

}

//==============================================================//
// EXPORT ALL LAYERS
//==============================================================//

// RGB Images
// RGB Satellite Images
exportImage(
  image2015_scaled.select(['SR_B4','SR_B3','SR_B2']),
  'Satellite_StudyArea_2015'
);

exportImage(
  image2025_scaled.select(['SR_B4','SR_B3','SR_B2']),
  'Satellite_StudyArea_2025'
);

// NDBI
exportImage(ndbi2015, 'NDBI_2015');
exportImage(ndbi2025, 'NDBI_2025');
exportImage(ndbichange, 'NDBI_Change');

// NDVI
exportImage(ndvi2015, 'NDVI_2015');
exportImage(ndvi2025, 'NDVI_2025');
exportImage(ndvichange, 'NDVI_Change');

// Urban Growth
exportImage(urbangrowth1, 'Urban_Growth_2015_2025');

//==============================================================//
// EXPORT STUDY AREA (ROI)
//==============================================================//

Export.table.toDrive({
  collection: ee.FeatureCollection([
    ee.Feature(roi)
  ]),
  description: 'Study_Area_Boundary',
  folder: 'GEE_Urban_Growth',
  fileNamePrefix: 'Study_Area_Boundary',
  fileFormat: 'SHP'
});