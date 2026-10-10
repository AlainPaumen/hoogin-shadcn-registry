import { MoreHorizontalIcon, EyeIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { m } from "@/paraglide/messages.js"

type ActionCellProps = {
  onDetail?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function ActionCell({ onDetail, onEdit, onDelete }: ActionCellProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
        <MoreHorizontalIcon />
        <span className="sr-only">{m.actionCell_openMenu()}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem className="justify-between" onClick={onDetail}>
            {m.actionCell_detail()}
            <EyeIcon className="text-muted-foreground" />
          </DropdownMenuItem>
          <DropdownMenuItem className="justify-between" onClick={onEdit}>
            {m.actionCell_edit()}
            <PencilIcon className="text-muted-foreground" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            className="justify-between"
            onClick={onDelete}
          >
            {m.actionCell_delete()}
            <Trash2Icon />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
