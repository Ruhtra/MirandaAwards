import { CategoryGrid } from "./_components/category-grid"

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
        <p className="text-muted-foreground mt-1">Gerencie as categorias dos jogos</p>
      </div>

      <CategoryGrid />
    </div>
  )
}
