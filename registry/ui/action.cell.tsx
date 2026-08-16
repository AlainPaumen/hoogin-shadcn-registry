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
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem className="justify-between" onClick={onDetail}>
            Detail
            <EyeIcon className="text-muted-foreground" />
          </DropdownMenuItem>
          <DropdownMenuItem className="justify-between" onClick={onEdit}>
            Edit
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
            Delete
            <Trash2Icon />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
