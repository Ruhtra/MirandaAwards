// "use client"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import Image from "next/image"
// import type { CategoryWithGamesDTO } from "@/lib/Dto/categoryDTO"

// interface CategoryGamesDialogProps {
//   category: CategoryWithGamesDTO
// }

// export function CategoryGamesDialog({ category }: CategoryGamesDialogProps) {
//   const [open, setOpen] = useState(false)
//   const gamesCount = category._count?.games ?? 0

//   if (gamesCount === 0) {
//     return (
//       <Badge variant="secondary" className="text-xs">
//         0 jogos
//       </Badge>
//     )
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <button className="inline-flex">
//           <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80 transition-colors">
//             {gamesCount} {gamesCount === 1 ? "jogo" : "jogos"}
//           </Badge>
//         </button>
//       </DialogTrigger>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>Jogos da categoria {category.name}</DialogTitle>
//         </DialogHeader>
//         <ScrollArea className="max-h-[60vh]">
//           <div className="grid grid-cols-2 gap-3 pr-4">
//             {category.games?.map((game) => (
//               <div
//                 key={game.id}
//                 className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
//               >
//                 {game.image_url ? (
//                   <Image
//                     src={game.image_url || "/placeholder.svg"}
//                     alt={game.name}
//                     width={48}
//                     height={48}
//                     className="size-12 rounded object-cover flex-shrink-0"
//                   />
//                 ) : (
//                   <div className="size-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
//                     <span className="text-sm font-medium text-muted-foreground">{game.name.charAt(0)}</span>
//                   </div>
//                 )}
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium truncate">{game.name}</p>
//                   <p className="text-xs text-muted-foreground">{/*game.platform*/ 'platform'}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   )
// }
