\# 🛰️ Urban Growth Detection Using Google Earth Engine



!\[Urban Growth Detection](images/Urban\_Growth\_Detection\_Virudhachalam.png)



\## Overview



Urban growth is a key indicator of economic development and land-use transformation. Monitoring these changes is essential for urban planning, infrastructure development, environmental management, and sustainable decision-making.



This project analyzes urban expansion in \*\*Virudhachalam, Tamil Nadu, India\*\*, over a \*\*10-year period (2015–2025)\*\* using \*\*Google Earth Engine (GEE)\*\* and \*\*Landsat satellite imagery\*\*. By leveraging cloud-based geospatial processing and remote sensing techniques, the project identifies changes in built-up areas and vegetation, providing a clear visualization of urban development over time.



The workflow demonstrates practical GIS and remote sensing skills, including satellite image preprocessing, spectral index analysis, raster processing, change detection, and map generation.



\---



\# 📍 Study Area



!\[Study Area](images/study%20area%20satellite%20image%202015.png)



\*\*Location:\*\* Virudhachalam, Tamil Nadu, India



Virudhachalam is a rapidly developing municipality in the Cuddalore district of Tamil Nadu. Over the last decade, the region has experienced continuous residential, commercial, and infrastructure growth. This makes it an ideal study area for analyzing urban expansion using multi-temporal satellite imagery.



\---



\# 🎯 Project Objectives



\- Detect urban growth between 2015 and 2025.

\- Analyze land-use changes using satellite imagery.

\- Calculate NDVI (Normalized Difference Vegetation Index).

\- Calculate NDBI (Normalized Difference Built-up Index).

\- Identify newly developed built-up areas.

\- Compare historical and recent satellite observations.

\- Generate GIS-ready outputs for visualization and further spatial analysis.



\---



\# 🛠️ Tools \& Technologies



\- Google Earth Engine (GEE)

\- QGIS

\- Git

\- GitHub

\- Landsat 8 Collection 2 Level-2 Surface Reflectance

\- Landsat 9 Collection 2 Level-2 Surface Reflectance



\---



\# 🗂️ Data Sources



\- Google Earth Engine Data Catalog

\- Landsat 8 Surface Reflectance (2015)

\- Landsat 9 Surface Reflectance (2025)



\---



\# 🔄 Methodology



The project follows a structured remote sensing workflow:



\### 1. Study Area Definition

A Region of Interest (ROI) representing Virudhachalam was created within Google Earth Engine.



\### 2. Image Acquisition

Multi-temporal Landsat imagery was collected for:

\- 2015 (Landsat 8)

\- 2025 (Landsat 9)



Images were filtered based on:

\- Study area

\- Date range

\- Low cloud cover



\### 3. Image Pre-processing

The preprocessing workflow included:

\- Cloud masking

\- Surface reflectance scaling

\- Median image compositing

\- ROI clipping



\### 4. Spectral Index Calculation



Two spectral indices were generated:



\*\*NDVI (Normalized Difference Vegetation Index)\*\*



Used to identify vegetation health and distribution.



\*\*NDBI (Normalized Difference Built-up Index)\*\*



Used to identify and extract built-up land.



\### 5. Urban Area Extraction



Threshold-based classification was applied to NDBI values to distinguish built-up land from surrounding land cover.



\### 6. Change Detection



Urban layers from 2015 and 2025 were compared to identify areas of urban expansion over the ten-year period.



\### 7. Map Generation



The final outputs were exported for visualization and reporting using QGIS.



\---



\# 📊 Results



The analysis successfully detected significant urban expansion within the study area between \*\*2015 and 2025\*\*.



\### Key Findings



\- Significant increase in built-up land over the study period.

\- Noticeable reduction in vegetation within expanding urban regions.

\- Successful extraction of urban areas using NDBI.

\- Effective visualization of vegetation changes using NDVI.

\- High-quality GIS-ready raster outputs suitable for further analysis.

\- Demonstrates the effectiveness of Google Earth Engine for large-scale geospatial processing.



\---



\# 📁 Repository Structure



```text

Urban-Growth-Detection/

│── README.md

├── code/

├── data/

├── images/

├── maps/

└── report/

```



\---



\# 🚀 Skills Demonstrated



\- Remote Sensing

\- GIS Analysis

\- Google Earth Engine

\- Satellite Image Processing

\- Raster Analysis

\- Spectral Index Analysis (NDVI \& NDBI)

\- Urban Growth Detection

\- Change Detection

\- Cartography

\- Spatial Data Visualization

\- Git Version Control

\- GitHub Portfolio Management



\---



\# 📌 Future Improvements



\- Integrate Sentinel-2 imagery for higher spatial resolution.

\- Perform supervised machine learning classification.

\- Conduct accuracy assessment using reference datasets.

\- Develop an interactive web GIS dashboard.

\- Automate the workflow for multiple study areas.

\- Expand the analysis to district or state-level urban monitoring.



\---



\# 👨‍💻 Author



\*\*Srinivasan Srini\*\*



Civil Engineer | GIS \& Remote Sensing Enthusiast



This project is part of my GIS portfolio showcasing practical applications of remote sensing, cloud-based geospatial analysis, and satellite image processing using Google Earth Engine and QGIS.



\---



\# 📄 License



This project is licensed under the \*\*MIT License\*\*.

