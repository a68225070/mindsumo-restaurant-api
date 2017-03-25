[![Build Status](https://travis-ci.org/lukeramsden/mindsumo-restaurant-api.svg?branch=master)](https://travis-ci.org/lukeramsden/mindsumo-restaurant-api)
# MindSumo Restaraunt API
Backend of my submission for the [MindSumo CapitalOne Restaurant Recommender challenge](https://www.mindsumo.com/contests/restaurant-api)

## Endpoints
> All endpoints are prefixed with /api/v1/ e.g. /api/v1/search
### /search
> Based upon [Yelp Business Search](https://www.yelp.com/developers/documentation/v3/business_search)
#### POST
#### Parameters: 
- `location`: Required. Specifies the combination of "address, neighborhood, city, state or zip, optional country" to be used when searching for businesses.
- `term`: Optional. Search term (e.g. "food", "restaurants"). If term isn’t included we search everything. The term keyword also accepts business names such as "Starbucks".
- `limit`: Optional. Number of business results to return. By default, it will return 20. Maximum is 50.
- `offset`: Optional. Offset the list of returned business results by this amount.
