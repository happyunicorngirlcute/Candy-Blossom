export interface ApiEndpoint {
    method: "GET" | "POST" | "DELETE" | "PUT"
    path: string
    description: string
    auth?: boolean
    body?: string
    response?: string
    pathParams?: string
}

export interface DocSection {
    title: string
    slug: string
    endpoints: ApiEndpoint[]
}

export const sections: DocSection[] = [
    {
        title: "Authentication",
        slug: "authentication",
        endpoints: [
            {
                method: "POST",
                path: "/login",
                description: "Authenticate a user and return a JWT token",
                body: `{
  "email": "user@example.com",
  "password": "password123"
}`,
                response: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`,
            },
            {
                method: "POST",
                path: "/register",
                description: "Register a new user account",
                body: `{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}`,
                response: `{
  "message": "I created your account! Check your inbox to verify it",
  "email": "user@example.com"
}`,
            },
            {
                method: "GET",
                path: "/verify-email",
                description: "Verify a user's email address using a token",
                pathParams: "token=string",
                response: `{
  "message": "I verified your email! You can now log in"
}`,
            },
        ],
    },
    {
        title: "Plants",
        slug: "plants",
        endpoints: [
            {
                method: "GET",
                path: "/plants",
                description: "Retrieve a list of all plants in the database",
                response: `{
  "message": "Here are all the plants I could find for you",
  "data": [
    {
      "id": 1,
      "common_name": "Rose",
      "watering": "Frequent"
    }
  ]
}`,
            },
            {
                method: "GET",
                path: "/plant/name/{name}",
                description: "Retrieve details for a specific plant by its common name",
                response: `{
  "message": "I found the plant you were looking for",
  "data": {
    "id": 1,
    "common_name": "Rose",
    "watering": "Frequent"
  }
}`,
            },
            {
                method: "GET",
                path: "/api/plants/search/{name}",
                description: "Search for plants using the external Perenual API",
                response: `{
  "data": [...]
}`,
            },
            {
                method: "GET",
                path: "/api/plants/details/{id}",
                description: "Get detailed information for a specific plant from the external Perenual API",
                response: `{
  "data": {
    "id": 1,
    "common_name": "Rose",
    "type": "Flower",
    ...
  }
}`,
            },
        ],
    },
    {
        title: "User Collection",
        slug: "user-collection",
        endpoints: [
            {
                method: "GET",
                path: "/user/plants",
                description: "Retrieve the authenticated user's plant collection",
                auth: true,
                response: `{
  "message": "Here are the plants in your collection",
  "data": [...]
}`,
            },
            {
                method: "POST",
                path: "/user/plant",
                description: "Add a plant to the authenticated user's collection",
                auth: true,
                body: `{
  "plant_name": "Rose",
  "city": "Paris"
}`,
                response: `{
  "message": "I added the plant to your collection",
  "data": {
    "plant": "Rose",
    "next_watering_at": "2026-05-20"
  }
}`,
            },
            {
                method: "DELETE",
                path: "/user/plant/{id}",
                description: "Remove a plant from the authenticated user's collection",
                auth: true,
                response: "204 No Content",
            },
        ],
    },
    {
        title: "Weather",
        slug: "weather",
        endpoints: [
            {
                method: "GET",
                path: "/weather/{city}",
                description: "Get current weather information for a specific city",
                response: `{
  "city": "Paris",
  "temperature": 22,
  "condition": "Sunny"
}`,
            },
        ],
    },
]
