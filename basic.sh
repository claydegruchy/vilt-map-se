# response
# {"labels":["2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019","2020","2021","2022","2023","2024"],"dataSets":[{"axis":0,"label":"Älg","data":[96563,90814,82370,80974,83554,88015,92132,99492,96134,95076,87093,82996,82120,84767,83059,80354,82827,73232,63024,49959,56674],"info":null}],"title":"Avskjutning älg nationellt 2004-2024 ","customSuffix":null,"incompleteFromYear":20.5,"incompleteToYear":20.5}
#  curl "https://rapport.viltdata.se/umbraco/api/StatisticsApi/GetStatistics?chartType=line&Species%5B0%5D%5BID%5D=1&Species%5B0%5D%5BName%5D=%C3%84lg&StartYear=2004&EndYear=2024&StatisticsReportType=kill&AfoDTOS=&Counties=&PartAfos=&HuntAreas=&Krets=&ExcelReportTitle=Avskjutning&ShowIncompleteColumn=true"

# firing
# moose
# nationally
# 2004-2024
# 
# 
# 
#'chartType':				line
#'Species[0][ID]':			1
#'Species[0][Name]':		Älg
#'StartYear':				2004
#'EndYear':					2024
#'StatisticsReportType':	kill

# https://rapport.viltdata.se/umbraco/api/StatisticsApi/GetStatistics?chartType=line&Species%5B0%5D%5BID%5D=1&Species%5B0%5D%5BName%5D=%C3%84lg&StartYear=2024&EndYear=2024&StatisticsReportType=kill&AfoDTOS=&Counties%5B0%5D%5Bid%5D=25&Counties%5B0%5D%5Bname%5D=Norrbottens+l%C3%A4n&PartAfos=&HuntAreas=&Krets=&ExcelReportTitle=Avskjutning&ShowIncompleteColumn=true


# https://rapport.viltdata.se/umbraco/api/StatisticsApi/GetStatistics?chartType=line&Species%5B0%5D%5BID%5D=73&Species%5B0%5D%5BName%5D=Vigg&StartYear=2024&EndYear=2024&StatisticsReportType=kill&AfoDTOS=&Counties%5B0%5D%5Bid%5D=25&Counties%5B0%5D%5Bname%5D=Norrbottens+l%C3%A4n&PartAfos=&HuntAreas=&Krets=&ExcelReportTitle=Avskjutning&ShowIncompleteColumn=true
# https://rapport.viltdata.se/umbraco/api/StatisticsApi/GetStatistics?chartType=line&Species%5B0%5D%5BID%5D=73&Species%5B0%5D%5BName%5D=Vigg&StartYear=2024&EndYear=2024&StatisticsReportType=kill&AfoDTOS=&Counties%5B0%5D%5Bid%5D=1&Counties%5B0%5D%5Bname%5D=Stockholms+l%C3%A4n&PartAfos=&HuntAreas=&Krets=&ExcelReportTitle=Avskjutning&ShowIncompleteColumn=true

# https://rapport.viltdata.se/umbraco/api/StatisticsApi/GetStatistics?chartType=line&Species[0][ID]=73&Species[0][Name]=Vigg&StartYear=2024&EndYear=2024&StatisticsReportType=kill&AfoDTOS=&Counties[0][id]=25&Counties[0][name]=Norrbottens+län&PartAfos=&HuntAreas=&Krets=&ExcelReportTitle=Avskjutning&ShowIncompleteColumn=true

#https://rapport.viltdata.se/umbraco/api/StatisticsApi/GetStatistics?chartType=line&Species[0][ID]=73&Species[0][Name]=Vigg&StartYear=2024&EndYear=2024&StatisticsReportType=kill&AfoDTOS=&Counties[0][id]=1&Counties[0][name]=Stockholms+län&PartAfos=&HuntAreas=&Krets=&ExcelReportTitle=Avskjutning&ShowIncompleteColumn=true
# chartType':	line
# 'Species[0][ID]':	73
# 'Species[0][Name]':	Vigg
# 'StartYear':	2024
# 'EndYear':	2024
# 'StatisticsReportType':	kill
# 'Counties[0][id]':	1
# 'Counties[0][name]':	Stockholms län

echo 73,25
curl "https://rapport.viltdata.se/umbraco/api/StatisticsApi/GetStatistics?chartType=line&Species%5B0%5D%5BID%5D=73&StartYear=2020&EndYear=2024&StatisticsReportType=kill&AfoDTOS=&Counties%5B0%5D%5Bid%5D=25&HuntAreas=&Krets=&ExcelReportTitle=Avskjutning&ShowIncompleteColumn=false"

echo 1,1
curl "https://rapport.viltdata.se/umbraco/api/StatisticsApi/GetStatistics?chartType=line&Species%5B0%5D%5BID%5D=1&StartYear=2020&EndYear=2024&StatisticsReportType=kill&AfoDTOS=&Counties%5B0%5D%5Bid%5D=1&HuntAreas=&Krets=&ExcelReportTitle=Avskjutning&ShowIncompleteColumn=false"



