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
import { useEditTransactionSheetStore } from '@/features/transactions/stores/use-edit-transaction-store';
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction';

type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const { onOpen } = useEditTransactionSheetStore();
  const { ConfirmationDialog, confirm } = useConfirm({
    title: 'Are you sure?',
    message: 'You are about to delete this transaction',
  });

  const deleteMutation = useDeleteTransaction(id);

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
