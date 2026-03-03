import json


def load_json(filepath):
    with open(filepath, "r") as f:
        return json.load(f)


template = 'curl "https://rapport.viltdata.se/umbraco/api/StatisticsApi/GetStatistics?chartType=line&Species%5B0%5D%5BID%5D={species_id}&StartYear=2004&EndYear=2024&StatisticsReportType=kill&AfoDTOS=&Counties%5B0%5D%5Bid%5D={county_id}&HuntAreas=&Krets=&ExcelReportTitle=Avskjutning&ShowIncompleteColumn=false" > {county_id}_{species_id}.json'


def main():
    regions = load_json("public/regions.json")
    species = load_json("public/species.json")

    for region in regions:
        for specie in species:
            print(template.format(
                species_id=specie["id"], county_id=region["id"]))
            
            pass


if __name__ == "__main__":
    main()
