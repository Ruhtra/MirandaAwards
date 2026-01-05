export interface CategoryWithGamesDTO {
    id: string
    name: string
    _count?: {
        games: number
    }
    games?: Array<{
        id: string
        name: string
        image_url: string | null
    }>
}
