# Location API Documentation

This API provides hierarchical location management with the structure: **Province → City → Town/Village**

## Base URL
```
/api
```

## Main Location Endpoints

### Get Complete Hierarchy
```http
GET /locations/hierarchy
```
Returns all provinces with their cities, towns, and villages.

### Search Locations
```http
GET /locations/search?query={search_term}&type={location_type}
```
- `query`: Search term (required)
- `type`: `all|province|city|town|village` (default: all)

### Get Statistics
```http
GET /locations/statistics
```
Returns count statistics for all location types.

### Get Breadcrumb Path
```http
GET /locations/breadcrumb?id={location_id}&type={location_type}
```
Returns hierarchical path for a location.

## Province API

### List All Provinces
```http
GET /provinces
```

### Get Specific Province
```http
GET /provinces/{id}
```

### Get Province's Cities
```http
GET /provinces/{id}/cities
```

### Get Province Hierarchy
```http
GET /provinces/{id}/hierarchy
```
Returns province with all cities, towns, and villages.

### Create Province
```http
POST /provinces
Content-Type: application/json

{
    "id": 1,
    "title": "Tehran",
    "province_id1": "01",
    "area_code": "021",
    "state": 1
}
```

### Update Province
```http
PUT /provinces/{id}
Content-Type: application/json

{
    "title": "Updated Name",
    "state": 1
}
```

### Delete Province
```http
DELETE /provinces/{id}
```

## City API

### List Cities
```http
GET /cities
GET /cities?province_id={province_id}
```

### Get Specific City
```http
GET /cities/{id}
```

### Get City's Towns
```http
GET /cities/{id}/towns
```

### Get City's Villages
```http
GET /cities/{id}/villages
```

### Get City Hierarchy
```http
GET /cities/{id}/hierarchy
```

### Create City
```http
POST /cities
Content-Type: application/json

{
    "id": 1,
    "title": "Tehran",
    "province_id": 1,
    "phone": "021-12345678",
    "lat": 35.6892,
    "lon": 51.3890,
    "status": 1
}
```

### Update City
```http
PUT /cities/{id}
```

### Delete City
```http
DELETE /cities/{id}
```

## Town API

### List Towns
```http
GET /towns
GET /towns?city_id={city_id}
GET /towns?province_id={province_id}
```

### Get Specific Town
```http
GET /towns/{id}
```

### Create Town
```http
POST /towns
Content-Type: application/json

{
    "id": 1,
    "title": "Town Name",
    "city_id": 1,
    "province_id": 1,
    "lat": 35.6892,
    "lon": 51.3890,
    "state": 1
}
```

### Update Town
```http
PUT /towns/{id}
```

### Delete Town
```http
DELETE /towns/{id}
```

## Village API

### List Villages
```http
GET /villages
GET /villages?city_id={city_id}
GET /villages?province_id={province_id}
```

### Get Specific Village
```http
GET /villages/{id}
```

### Create Village
```http
POST /villages
Content-Type: application/json

{
    "id": 1,
    "title": "Village Name",
    "city_id": 1,
    "province_id": 1,
    "lat": 35.6892,
    "lon": 51.3890,
    "state": 1
}
```

### Update Village
```http
PUT /villages/{id}
```

### Delete Village
```http
DELETE /villages/{id}
```

## Response Format

All API responses follow this structure:

### Success Response
```json
{
    "success": true,
    "data": {...},
    "message": "Operation completed successfully"
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error message",
    "error": "Detailed error information"
}
```

## Usage in Frontend

The `ProvinceCitySelector` component now uses these APIs through the `locationService`:

```typescript
import { locationService } from '@/services/locationService';

// Load provinces
const provinces = await locationService.getProvinces();

// Load cities for a province
const cities = await locationService.getCities(provinceId);

// Load towns and villages for a city
const towns = await locationService.getTowns(cityId);
const villages = await locationService.getVillages(cityId);
```

## Features

1. **Hierarchical Structure**: Properly maintains Province → City → Town/Village relationships
2. **Filtering**: Cities filter by province, towns/villages filter by city
3. **Search**: Global search across all location types
4. **Validation**: Proper validation for required fields and relationships
5. **Error Handling**: Comprehensive error handling with meaningful messages
6. **Performance**: Optimized queries with proper indexing
7. **Real-time Loading**: Loading states in the frontend component
8. **Cascading Reset**: When parent location changes, child locations are reset

The API is now fully integrated with the frontend `ProvinceCitySelector` component, replacing the previous mock data with real database queries.