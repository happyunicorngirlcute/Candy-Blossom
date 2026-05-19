import AddPlantClient from "./AddPlantClient"

const API = process.env.NEXT_PUBLIC_API_URL

async function fetchPlants() {
    if (!API) {
        return { plants: [], error: 'API URL is not configured.' }
    }

    let res
    let data: any = {}

    try {
        res = await fetch(`${API}/plants`, { cache: 'no-store' })
        data = await res.json().catch(() => ({}))
    } catch (error) {
        return {
            plants: [],
            error: 'Unable to connect to the backend API. Check your API URL and backend server.',
        }
    }

    if (!res.ok) {
        return { plants: [], error: data.error || data.message || 'Unable to load plant database.' }
    }

    const plants = data.data || []
    return { plants, error: null }
}

export default async function AddPlantPage() {
    const { plants, error } = await fetchPlants()

    return <AddPlantClient plants={plants} initialError={error} />
}
