# azure-onyx3
modified azure-onyx2 to accommodate modules with different level (ZL4-6)
Third trial (login needed for tile download).  
 
## background
I need to add Azure AD authentication to un-vector-tile-toolkit/onyx. 
With this trial, starting from Microsoft Graph turtorial, I added mbtile delivery function by "vtile.js" in routes.  

## install
```console
git clone git@github.com:un-vector-tile-toolkit/azure-onyx3
cd azure-onyx3
npm install
(edit config, store data, etc..)
npm start
```

## URL request to vector tiles
https://xxxx/vtiles-s/zxy/{t}/{z}/{x}/{y}.pbf (single zoom level modules)  
https://xxxx/vtiles-m/zxy/{t}/{z}/{x}/{y}.pbf (multiple zoom level modules)  
https://xxxx/vtiles-open/zxy/{t}/{z}/{x}/{y}.pbf (without AccessToken)

## URL request to raster
https://xxxx/plow/raster/{z}/{x}/{y}.png (raster tile)  
https://xxxx/plow-open/raster/{z}/{x}/{y}.png (raster tile without access token)  
Note: if you use RHEL or CentOS, playwright may not work due to the missing libraries. Please check them and install necessary packages.  

## See also  
https://docs.microsoft.com/en-us/graph/tutorials/node?WT.mc_id=Portal-Microsoft_AAD_RegisteredApps&tutorial-step=3  

