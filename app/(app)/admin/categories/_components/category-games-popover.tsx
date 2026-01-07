// "use client"

// import { useState } from "react"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import Image from "next/image"
// import type { CategoryWithGamesDTO } from "@/lib/Dto/categoryDTO"

// interface CategoryGamesPopoverProps {
//   category: CategoryWithGamesDTO
// }

// export function CategoryGamesPopover({ category }: CategoryGamesPopoverProps) {
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
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <button className="inline-flex">
//           <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80 transition-colors">
//             {gamesCount} {gamesCount === 1 ? "jogo" : "jogos"}
//           </Badge>
//         </button>
//       </PopoverTrigger>
//       <PopoverContent className="w-80 p-3" align="start">
//         <div className="space-y-2">
//           <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Jogos Associados</p>
//           <ScrollArea className="h-[200px] pr-3">
//             <div className="space-y-2">
//               {category.games?.slice(0, 10).map((game) => (
//                 <div
//                   key={game.id}
//                   className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/50 transition-colors"
//                 >
//                   {game.image_url ? (
//                     <Image
//                       src={game.image_url || "/placeholder.svg"}
//                       alt={game.name}
//                       width={28}
//                       height={28}
//                       className="size-7 rounded object-cover flex-shrink-0"
//                     />
//                   ) : (
//                     <div className="size-7 rounded bg-muted flex items-center justify-center flex-shrink-0">
//                       <span className="text-xs font-medium text-muted-foreground">{game.name.charAt(0)}</span>
//                     </div>
//                   )}
//                   <span className="text-xs flex-1 truncate">{game.name}</span>
//                 </div>
//               ))}
//               {gamesCount > 10 && (
//                 <p className="text-xs text-muted-foreground text-center pt-1">+{gamesCount - 10} mais jogos</p>
//               )}
//             </div>
//           </ScrollArea>
//         </div>
//       </PopoverContent>
//     </Popover>
//   )
// }
