'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useConfirm } from '@/hooks/use-confirm';
import { useDeleteCategory } from '@/features/categories/api/use-delete-category';
import { useEditCategoryStore } from '@/features/categories/hooks/use-edit-category-store';

type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const { onOpen } = useEditCategoryStore();
  const deleteMutation = useDeleteCategory(id);
  const { ConfirmationDialog, confirm } = useConfirm({
    title: 'Are you sure?',
    message: 'You are about to delete this category',
  });

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutateAsync();
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onOpen(id)}>
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>
            <Trash className="size-4 mr-2 text-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
